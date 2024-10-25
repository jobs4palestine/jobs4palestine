// __mocks__/google-search-results-nodejs.ts
interface SearchResult {
    position: number;
    title: string;
    link: string;
    snippet: string;
    date: string;
}

interface MockResults {
    organic_results: SearchResult[];
}

const mockSearchResults: MockResults = {
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

export class GoogleSearch {
    json(params: any, callback: Function): void {
        // Simulate an asynchronous API response
        process.nextTick(() => {
            callback(mockSearchResults);
        });
    }
}

export default {
    GoogleSearch
};
