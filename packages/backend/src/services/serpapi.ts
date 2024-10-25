import axios from 'axios';

export interface SearchParams {
    q: string;
    engine?: string;
    num?: string;
}

export interface SearchResult {
    position?: number;
    title: string;
    link: string;
    snippet?: string;
    date?: string;
    displayed_link?: string;
    redirect_link?: string;
    about_this_result?: any;
    about_page_link?: string;
    cached_page_link?: string;
}

export interface SearchResponse {
    organic_results: SearchResult[];
}

export class SerpApiClient {
    private readonly baseUrl = 'https://serpapi.com/search';
    private readonly apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('SerpAPI key is required');
        }
        this.apiKey = apiKey;
    }

    async search(params: SearchParams): Promise<SearchResponse> {
        try {
            const response = await axios.get<SearchResponse>(this.baseUrl, {
                params: {
                    ...params,
                    api_key: this.apiKey,
                    engine: params.engine || 'google',
                    num: params.num || '200'
                }
            });

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`SerpAPI request failed: ${error.message}`);
            }
            throw error;
        }
    }
}
