// Adjust the import as necessary
// Import the default export (ResultModel)
const SerpApi = require("google-search-results-nodejs")
const mockingoose = require('mockingoose'); // Use require for CommonJS module handling
import request from 'supertest';
import { app } from '../src/old_index';
import ResultModel from '../src/models/Result';

describe('GET /search', () => {
    let server: any;

    beforeAll(async () => {
        // Create server for testing
        server = app.listen(3001); // Use a different port for testing
    });

    afterAll(async () => {
        // Cleanup
        await mockingoose.disconnect(); // Close MongoDB connection
        await new Promise<void>((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it('should return mocked search results and save to database', async () => {
        // Mock the search API response
        const mockSearchResults = [
            {
                position: 1,
                title: "Mocked Result 1",
                link: "https://example.com",
                domain: "https://example.com",
                snippet: "This is a mocked result",
                searchTerm: "test"
            }
        ];


        // Define types for params and callback
        type SerpApiParams = { q: string; engine: string; num: string; api_key: string };
        type SerpApiCallback = (data: { organic_results: typeof mockSearchResults }) => void;

        // Mock SerpApi search response with type assertions
        jest.spyOn(SerpApi.GoogleSearch.prototype, 'json').mockImplementation((params: unknown, callback: unknown) => {
            const typedParams = params as SerpApiParams;
            const typedCallback = callback as SerpApiCallback;
            typedCallback({ organic_results: mockSearchResults });
        });

        // Mock the save method for ResultModel
        mockingoose(ResultModel).toReturn(mockSearchResults[0], 'save');

        const response = await request(app)
            .get('/search')
            .query({ q: 'test', sites: 'example.com' });

        expect(response.status).toBe(200); // Check if status is 200
        expect(response.body.results).toHaveLength(1); // Expect one mocked result in the response
        expect(response.body.results[0].title).toBe('Mocked Result 1'); // Validate the title
    });
});




