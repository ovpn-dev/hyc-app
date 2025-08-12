// hooks/useQuotes.ts
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../api/api-service';

export const useQuotes = (type: 'today' | 'random') => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchQuotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to get cached quotes first
            const cachedQuotes = await AsyncStorage.getItem(`quotes_${type}`);
            if (cachedQuotes && type === 'today') {
                const parsed = JSON.parse(cachedQuotes);
                const cacheDate = await AsyncStorage.getItem(`quotes_${type}_date`);

                // Only use cache if it's from today
                if (cacheDate === new Date().toDateString()) {
                    setQuotes(parsed);
                    setLoading(false);
                    return;
                }
            }

            const fetchedQuotes = await apiService.fetchQuotes(type);

            if (fetchedQuotes.length > 0) {
                setQuotes(fetchedQuotes);

                // Cache today's quotes
                if (type === 'today') {
                    await AsyncStorage.setItem(`quotes_${type}`, JSON.stringify(fetchedQuotes));
                    await AsyncStorage.setItem(`quotes_${type}_date`, new Date().toDateString());
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch quotes');

            // Try to use cached quotes as fallback
            const cachedQuotes = await AsyncStorage.getItem(`quotes_${type}`);
            if (cachedQuotes) {
                setQuotes(JSON.parse(cachedQuotes));
            }
        } finally {
            setLoading(false);
        }
    }, [type]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchQuotes();
        setRefreshing(false);
    }, [fetchQuotes]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    return { quotes, loading, error, refreshing, onRefresh, refetch: fetchQuotes };
};