import { Request, Response, Router } from "express";
import ResultModel, {
  getAllResults,
  IResultBase,
  saveSearchResults,
} from "../models/Result.js";
import { levels, parseDate, queryForSearch } from "../utils.js";
import { SerpApiClient } from "../services/serpapi.js";
import {
  authenticateToken,
  optionalAuthenticateToken,
} from "../authenticateToken.js";
import type { Speciality, Level } from "@jobs4palestine/shared";

export const searchRouter = Router();

const jobSites = [
  "jobs.ashbyhq.com",
  "join.com",
  "jobs.lever.co",
  "boards.greenhouse.io",
  "wd5.myworkdayjobs.com",
  "jobs.lever.co",
  "careers.icims.com",
  "jobs.jobvite.com",
  "jobs.smartrecruiters.com",
  "app.breezy.hr",
  "jazzhr.com",
  "taleo.net",
  "oraclecloud.com",
  "recruiting.adp.com",
];

let serpApi: SerpApiClient | undefined;
type SearchQuery = {
  speciality?: Speciality;
  archived?: boolean;
  level?: Level;
};
searchRouter.get(
  "/view",
  optionalAuthenticateToken,
  async (req: Request, res: Response) => {
    const includeArchived = req.user?.role === "admin";

    const speciality = req.query.q as Speciality | undefined;
    const level = req.query.level as Level | undefined;

    const query: SearchQuery = {};
    Object.entries({ speciality, includeArchived, level }).forEach((res) => {
      const key = res[0] as keyof SearchQuery;
      const value = res[1] as SearchQuery[keyof SearchQuery];
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const results = await ResultModel.find(query).lean();
    res.json(results);
  }
);
searchRouter.get("/search", authenticateToken, async (req, res) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "user") {
      res.status(403).send("logged in users only");
      return;
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (apiKey && !serpApi) {
      serpApi = new SerpApiClient(apiKey);
    }

    const q = req.query.q as Speciality | undefined;
    const level = req.query.level as Level | undefined;
    const sites = (req.query.sites as string) || jobSites.join(",");

    if (!q) {
      res.status(400).json({ error: "Missing query parameters" });
      return;
    }
    const fullQuery = queryForSearch({ speciality: q, level, sites });
    const searchResults = await serpApi?.search({ q: fullQuery });
    if (searchResults) {
      const processedResults = searchResults.organic_results
        .map((result) => {
          if (!result.link || !result.title) {
            console.warn("Missing required fields in search result:", result);
            return null;
          }

          const domain = new URL(result.link).origin;
          let documentLevel = level;
          if (!documentLevel) {
            const words = result.title.toLowerCase().split(" ");

            documentLevel = levels.find((level) => {
              return words.includes(level.toLowerCase());
            });
          }

          return {
            speciality: q,
            position: result.position || 0,
            level: documentLevel,
            title: result.title,
            link: result.link,
            redirect_link: result.redirect_link,
            displayed_link: result.displayed_link,
            domain,
            snippet: result.snippet || "",
            date_published_raw: result.date,
            date_published: parseDate(result.date),
            searchTerm: fullQuery,
            archived: false,
            about_this_result: result.about_this_result && {
              source: result.about_this_result.source && {
                description: result.about_this_result.source.description || "",
                source_info_link:
                  result.about_this_result.source.source_info_link || "",
                security: result.about_this_result.source.security || "",
                icon: result.about_this_result.source.icon || "",
              },
              keywords: result.about_this_result.keywords || [],
              languages: result.about_this_result.languages || [],
            },
            about_page_link: result.about_page_link,
            about_page_serpapi_link: result.about_page_serpapi_link,
            cached_page_link: result.cached_page_link,
          } as IResultBase;
        })
        .filter((result) => result !== null); // Filter out any null results
      // Save search results to the database
      const savedResults = await saveSearchResults(processedResults);

      res.status(200).json(savedResults);
    } else {
      res.status(500).json({ error: "could not search" });
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "An error occurred during the search" });
  }
});
