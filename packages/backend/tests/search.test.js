// Adjust the import as necessary
// Import the default export (ResultModel)
const SerpApi = require("google-search-results-nodejs");
import request from 'supertest';
import { app } from '../src/old_index.js'; // Adjust the import as necessary
const mockingoose = require('mockingoose'); // Use require for CommonJS module handling
import ResultModel from '../src/models/Result'; // Import the default export (ResultModel)
describe('GET /search', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
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
        // Mock SerpApi search response with type assertions
        jest.spyOn(SerpApi.GoogleSearch.prototype, 'json').mockImplementation((params, callback) => {
            const typedParams = params;
            const typedCallback = callback;
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
