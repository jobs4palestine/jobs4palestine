import {Request, Response, Router} from 'express';
import {getAllResults, IResultBase, saveSearchResults, getResultsBySpeciality} from "../models/Result";
import {parseDate, queryForSpecialty} from "../utils";
import {SerpApiClient} from '../services/serpapi.js';
import authenticateToken from "../authenticateToken";
import type { Speciality} from "@monorepo/shared";

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
    "recruiting.adp.com"
];

let serpApi : SerpApiClient | undefined

searchRouter.get('/view', authenticateToken, async (req: Request, res: Response) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'user') {
        res.status(403).send('logged in users only');
        return;
    }

    const speciality = req.query.q as Speciality | undefined;
    let results;
    if (speciality) {
        results = await getResultsBySpeciality(speciality);
    } else {
        results = await getAllResults();
    }
    res.json(results);
});



searchRouter.get('/search', authenticateToken, async (req, res) => {
    try {

        if (req.user?.role !== 'admin' && req.user?.role !== 'user') {
            res.status(403).send('logged in users only');
            return;
        }

        const apiKey = process.env.SERPAPI_API_KEY
        if (apiKey && !serpApi) {
            serpApi = new SerpApiClient(apiKey);
        }

        const q = req.query.q as Speciality | undefined;
        const sites = req.query.sites as string || jobSites.join(',');

        if (!q) {
            res.status(400).json({error: 'Missing query parameters'});
            return;
        }
       const fullQuery = queryForSpecialty(q, sites)
        const searchResults = await serpApi?.search({q: fullQuery});
        if (searchResults) {
            const processedResults = searchResults.organic_results
                .map(result => {
                    if (!result.link || !result.title) {
                        console.warn('Missing required fields in search result:', result);
                        return null;
                    }

                    const domain = new URL(result.link).origin;
                    return {
                        speciality: q,
                        position: result.position || 0,
                        title: result.title,
                        link: result.link,
                        redirect_link: result.redirect_link,
                        displayed_link: result.displayed_link,
                        domain,
                        snippet: result.snippet || '',
                        date_published_raw: result.date,
                        date_published: parseDate(result.date),
                        searchTerm: fullQuery,
                        archived: false,
                        about_this_result: result.about_this_result,
                        about_page_link: result.about_page_link,
                        cached_page_link: result.cached_page_link
                    } as IResultBase;
                })
                .filter((result): result is IResultBase => result !== null);

            // Save search results to the database
            const savedResults = await saveSearchResults(processedResults);

            res.status(200).json({results: savedResults});
        } else {
            res.status(500).json({error: 'could not search'});

        }
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({error: 'An error occurred during the search'});
    }
});
