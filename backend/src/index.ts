import express, {Request, Response, Application} from 'express';

const cors = require('cors')
const SerpApi = require("google-search-results-nodejs")
import {parse} from 'url';
// Import mongoose
import mongoose from 'mongoose';

import {IResultBase, saveSearchResults, SerpapiSearchResult} from './models/Result';
import {parseDate} from "./utils";


// Your routes here

require('dotenv').config({
    path: process.env.NODE_ENV === 'production'
        ? '.env'
        : '.env.local'
});


const search = new SerpApi.GoogleSearch()


// Connect to MongoDB
if (process.env.MONGODB_URI == undefined) {
    console.log("MISSING MONGODB_URI");
    process.exit(1);
}

const mongoURL = process.env.MONGODB_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};


const app: Application = express();

const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors());
app.get('/hello', async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({text: 'hello hello'})
});
// Define the search route
app.get('/search', (req: Request, res: Response): void => {
    try {
        const q = req.query.q as string;
        const sites = req.query.sites as string;

        if (!q || !sites) {
            res.status(400).json({ error: 'Missing query parameters' });
            return;
        }

        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const afterDate = twoWeeksAgo.toISOString().split('T')[0];

        const searchTerms = q.split(' OR ').map((term) => term.trim());
        const searchTermQuery = searchTerms.join(' OR ');

        const siteQueries = sites.split(',').map((site) => `site:${site.trim()}`);
        const siteQuery = siteQueries.join(' OR ');

        const fullQuery = `${searchTermQuery} ${siteQuery} after:${afterDate}`;

        // SerpApi parameters
        const params = {
            q: fullQuery,
            engine: 'google',
            num: '200',
            api_key: process.env.SERPAPI_API_KEY as string,
        };

        const search = new SerpApi.GoogleSearch();

        // Use callback pattern as expected by SerpApi
        search.json(params, async (data: any) => {
            try {
                const results: SerpapiSearchResult[] = data.organic_results || [];
                const searchResults = results.map((result: SerpapiSearchResult) => {
                    if (!result.link || !result.title) {
                        console.warn('Missing required fields in search result:', result);
                        return null;
                    }

                    const domain = new URL(result.link).origin;
                    const processedResult: IResultBase = {
                        position: result.position || 0,
                        title: result.title,
                        link: result.link,
                        redirect_link: result.redirect_link,
                        displayed_link: result.displayed_link,
                        domain,
                        snippet: result.snippet || '',
                        date_published_raw: result.date,
                        date_published: parseDate(result.date),
                        searchTerm: params.q,
                        archived: false,
                        about_this_result: result.about_this_result,
                        about_page_link: result.about_page_link,
                        about_page_serpapi_link: result.about_page_serpapi_link,
                        cached_page_link: result.cached_page_link
                    };

                    return processedResult;
                }).filter((result): result is IResultBase => result !== null);

                // Save search results to the database
                try {
                    const savedResults = await saveSearchResults(searchResults);
                    res.status(200).json({ results: savedResults });
                } catch (error) {
                    console.error('Error saving search results:', error);
                    res.status(500).json({ error: 'Error saving search results' });
                }

            } catch (error) {
                console.error('Error processing search results:', error);
                res.status(500).json({ error: 'Error processing search results' });
            }
        });

    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'An error occurred during the search' });
    }
});



// Example usage with proper error handling

export {app} ;


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
