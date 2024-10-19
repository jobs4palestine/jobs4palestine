import express, {Request, Response} from 'express';

const cors = require('cors')
const SerpApi = require("google-search-results-nodejs")
import {parse} from 'url';
// Import mongoose
import mongoose, {model} from 'mongoose';
import {IResult, IResultBase, saveSearchResults, SerpapiSearchResult} from './models/Result';
import {parseDate} from "./utils";

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


const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors());
app.get('/hello', async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({text: 'hello hello'})
});
// Define the search route
app.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query.q as string;
        const sites = req.query.sites as string;

        if (!q || !sites) {
            res.status(400).json({error: 'Missing query parameters'});
            return;
        }

        // Prepare the search query
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const afterDate = twoWeeksAgo.toISOString().split('T')[0];

        const siteQueries = sites.split(',').map((site) => `site:${site.trim()}`);
        const siteQuery = siteQueries.join(' OR ');

        const fullQuery = `${q} ${siteQuery} after:${afterDate}`;

        // SerpApi parameters
        const params = {
            q: fullQuery,
            engine: 'google',
            num: '200',
            api_key: process.env.SERPAPI_API_KEY as string,
        };
        const search = new SerpApi.GoogleSearch()

        search.json(params, async (data: any) => {
            const results: SerpapiSearchResult[] = data.organic_results || [];
            const searchResults = results.map((result: SerpapiSearchResult) => {
                if (!result.link || !result.title) {
                    console.warn('Missing required fields in search result:', result);
                    return null;
                }

                try {
                    const parsedUrl = parse(result.link);
                    const domain = parsedUrl.protocol && parsedUrl.host
                        ? `${parsedUrl.protocol}//${parsedUrl.host}`
                        : new URL(result.link).origin;

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
                } catch (error) {
                    console.error('Error processing search result:', error);
                    return null;
                }
            })
                .filter((result): result is IResultBase => result !== null);

            try {
                const savedResults = await saveSearchResults(searchResults);
                return savedResults;
            } catch (error) {
                console.error('Error saving search results:', error);
                throw error;
            }
        });



    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({error: 'An error occurred during the search'});
    }
});


// Example usage with proper error handling



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
