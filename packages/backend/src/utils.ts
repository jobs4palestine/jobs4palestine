import {Speciality} from "@jobs4palestine/shared";



export function parseDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;

    // If it's already a valid date string, parse it directly
    const parsedDate = new Date(dateStr);
    if (parsedDate.toString() !== 'Invalid Date') {
        return parsedDate;
    }

    // Convert to lowercase for consistent matching
    const lowerDateStr = dateStr.toLowerCase().trim();

    // Handle specific keywords
    switch (lowerDateStr) {
        case 'today':
            return new Date();
        case 'yesterday':
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday;
        case 'last week':
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return lastWeek;
    }

    // Regular expressions for different time formats
    const patterns = [
        {
            regex: /(\d+)\s*hours?\s*ago/i,
            handler: (matches: RegExpMatchArray) => {
                const hours = parseInt(matches[1]);
                const date = new Date();
                date.setHours(date.getHours() - hours);
                return date;
            }
        },
        {
            regex: /(\d+)\s*days?\s*ago/i,
            handler: (matches: RegExpMatchArray) => {
                const days = parseInt(matches[1]);
                const date = new Date();
                date.setDate(date.getDate() - days);
                return date;
            }
        },
        {
            regex: /(\d+)\s*weeks?\s*ago/i,
            handler: (matches: RegExpMatchArray) => {
                const weeks = parseInt(matches[1]);
                const date = new Date();
                date.setDate(date.getDate() - (weeks * 7));
                return date;
            }
        },
        {
            regex: /(\d+)\s*months?\s*ago/i,
            handler: (matches: RegExpMatchArray) => {
                const months = parseInt(matches[1]);
                const date = new Date();
                date.setMonth(date.getMonth() - months);
                return date;
            }
        },
        // Handle "an hour ago", "a day ago", etc.
        {
            regex: /an?\s+(hour|day|week|month)\s+ago/i,
            handler: (matches: RegExpMatchArray) => {
                const unit = matches[1].toLowerCase();
                const date = new Date();
                switch (unit) {
                    case 'hour':
                        date.setHours(date.getHours() - 1);
                        break;
                    case 'day':
                        date.setDate(date.getDate() - 1);
                        break;
                    case 'week':
                        date.setDate(date.getDate() - 7);
                        break;
                    case 'month':
                        date.setMonth(date.getMonth() - 1);
                        break;
                }
                return date;
            }
        }
    ];

    // Try each pattern
    for (const pattern of patterns) {
        const matches = lowerDateStr.match(pattern.regex);
        if (matches) {
            return pattern.handler(matches);
        }
    }

    return undefined;
}

export const queryForSpecialty = (speciality: Speciality, sites: string) : string  => {
    const searchTerms = speciality === "QA (Quality Assurance)"
        ? ["QA", "Quality Assurance"]
        : [speciality];
// Calculate date for two weeks ago
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const afterDate = twoWeeksAgo.toISOString().split('T')[0];

// Expand each search term to include both "developer" and "engineer"
    const expandedSearchTerms = searchTerms.flatMap(term => [
        `${term} developer`,
        `${term} engineer`
    ]);

// Join the expanded terms with OR for a broad match
    const searchTermQuery = expandedSearchTerms.join(' OR ');

// Format the sites query
    const siteQueries = sites.split(',').map((site) => `site:${site.trim()}`);
    const siteQuery = siteQueries.join(' OR ');

// Construct the final query
    return `remote (${searchTermQuery}) ${siteQuery} after:${afterDate}`;

}
