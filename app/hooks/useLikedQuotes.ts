// hooks/useLikedQuotes.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LikedQuote {
    quoteText: string;
    author: string;
    likedAt: string;
}

export const useLikedQuotes = () => {
    const [likedQuotes, setLikedQuotes] = useState<LikedQuote[]>([]);
    const [loading, setLoading] = useState(true);

    // Load liked quotes from storage
    useEffect(() => {
        const loadLikedQuotes = async () => {
            try {
                const storedQuotes = await AsyncStorage.getItem('likedQuotes');
                if (storedQuotes) {
                    setLikedQuotes(JSON.parse(storedQuotes));
                }
            } catch (error) {
                console.error('Error loading liked quotes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLikedQuotes();
    }, []);

    // Save liked quotes to storage
    const saveLikedQuotes = useCallback(async (quotes: LikedQuote[]) => {
        try {
            await AsyncStorage.setItem('likedQuotes', JSON.stringify(quotes));
        } catch (error) {
            console.error('Error saving liked quotes:', error);
        }
    }, []);

    // Add a quote to liked quotes
    const addLikedQuote = useCallback((quoteText: string, author: string) => {
        setLikedQuotes(prev => {
            // Check if quote already exists
            if (prev.some(quote => quote.quoteText === quoteText)) {
                return prev;
            }

            // Add new quote
            const newQuotes = [
                ...prev,
                {
                    quoteText,
                    author,
                    likedAt: new Date().toISOString()
                }
            ];

            // Save to storage
            saveLikedQuotes(newQuotes);
            return newQuotes;
        });
    }, [saveLikedQuotes]);

    // Remove a quote from liked quotes
    const removeLikedQuote = useCallback((quoteText: string) => {
        setLikedQuotes(prev => {
            const newQuotes = prev.filter(quote => quote.quoteText !== quoteText);
            saveLikedQuotes(newQuotes);
            return newQuotes;
        });
    }, [saveLikedQuotes]);

    // Check if a quote is liked
    const isQuoteLiked = useCallback((quoteText: string) => {
        return likedQuotes.some(quote => quote.quoteText === quoteText);
    }, [likedQuotes]);

    return {
        likedQuotes,
        loading,
        addLikedQuote,
        removeLikedQuote,
        isQuoteLiked
    };
};