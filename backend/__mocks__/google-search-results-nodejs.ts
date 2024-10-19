// __mocks__/google-search-results-nodejs.ts
const mockSearchResults = {
    organic_results: [
        {
            position: 1,
            title: "Mocked Result 1",
            link: "https://example.com",
            snippet: "This is a mocked result",
            date: "2024-10-01"
        }
    ]
};

class GoogleSearch {
    json(params: any, callback: Function) {
        // Simulate an asynchronous API response
        process.nextTick(() => {
            callback(mockSearchResults); // Pass the mocked results to the callback
        });
    }
}

module.exports = {
    GoogleSearch
};
