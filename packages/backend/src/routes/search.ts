import {Request, Response, Router} from 'express';
import {IResultBase, saveSearchResults} from "../models/Result";
import {parseDate} from "../utils";
import {SearchResponse, SerpApiClient} from '../services/serpapi.js';
import authenticateToken from "../authenticateToken";
import all from '../models/SearchResults.json'

const samples = (all as SearchResponse)

export const searchRouter = Router();
/*
import all from '../models/SearchResults.json'
const samples = (all as SearchResponse)
*/

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

searchRouter.get('/view', authenticateToken, (req: Request, res: Response): void => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'user') {
        res.status(403).send('logged in users only');
        return
    }
    // Search logic here
    res.send(samples.organic_results);
});


searchRouter.get('/search', async (req, res) => {
    try {
        const apiKey = process.env.SERPAPI_API_KEY
        if (apiKey && !serpApi) {
            serpApi = new SerpApiClient(apiKey);
        }

        const q = req.query.q as string;
        const sites = req.query.sites as string || jobSites.join(',');

        if (!q) {
            res.status(400).json({error: 'Missing query parameters'});
            return;
        }

        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const afterDate = twoWeeksAgo.toISOString().split('T')[0];

        const searchTerms = q.split(' OR ').map((term) => term.trim());
        const searchTermQuery = searchTerms.join(' OR ');

        const siteQueries = sites.split(',').map((site) => `site:${site.trim()}`);
        const siteQuery = siteQueries.join(' OR ');

        const fullQuery = `${searchTermQuery} ${siteQuery} after:${afterDate}`;

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
