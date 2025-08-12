// api/api-service.ts
export interface Quote {
    q: string;
    a: string;
}

export class APIService {
    private static instance: APIService;
    private readonly MAX_RANDOM_QUOTE_ATTEMPTS = 10; // Max attempts to get 3 unique random quotes
    private readonly RETRY_DELAY = 1000;

    private static readonly FALLBACK_QUOTES: Quote[] = [
        { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
        { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
        { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
        { q: "The future belongs to those who believe in the beauty of their dreams.", a: "Eleanor Roosevelt" },
        { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    ];

    private constructor() { }

    static getInstance(): APIService {
        if (!this.instance) {
            this.instance = new APIService();
        }
        return this.instance;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchQuotes(type: 'today' | 'random'): Promise<Quote[]> {
        try {
            if (type === 'random') {
                return await this.fetchRandomQuotes();
            } else {
                return await this.fetchTodayQuote();
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            return this.getFallbackQuotes(type); // Return fallback quotes on any error
        }
    }

    private async fetchRandomQuotes(): Promise<Quote[]> {
        const uniqueQuotes = new Set<string>();
        const quotes: Quote[] = [];
        let attempts = 0;

        while (uniqueQuotes.size < 3 && attempts < this.MAX_RANDOM_QUOTE_ATTEMPTS) {
            try {
                const response = await fetch('https://zenquotes.io/api/random', {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        break; // Return what we have on rate limit
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const quote = data[0];
                    if (quote && !uniqueQuotes.has(quote.q)) { // Check if quote exists
                        uniqueQuotes.add(quote.q);
                        quotes.push(quote);
                    }
                }
            } catch (error) {
                console.error('Error fetching random quote:', error);
            }
            attempts++;
            await this.delay(300);
        }
        return this.ensureNumberOfQuotes(quotes, 3); // Ensure we have 3 quotes
    }

    private async fetchTodayQuote(): Promise<Quote[]> {
        const response = await fetch('https://zenquotes.io/api/today');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) && data.length > 0 ? [data[0]] : [];
    }

    private getFallbackQuotes(type: 'today' | 'random'): Quote[] {
        return type === 'today' ? [APIService.FALLBACK_QUOTES[0]] : APIService.FALLBACK_QUOTES.slice(0, 3);
    }

    private ensureNumberOfQuotes(quotes: Quote[], targetCount: number): Quote[] {
        while (quotes.length < targetCount && APIService.FALLBACK_QUOTES.length > quotes.length) {
            quotes.push(APIService.FALLBACK_QUOTES[quotes.length]);
        }
        return quotes;
    }
}

export const apiService = APIService.getInstance();