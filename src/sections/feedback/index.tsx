'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FeedbackContainer, FeedbackWrapper, FilterArea } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { useRouter, useSearchParams } from 'next/navigation';
import { feedBackFilterOptions } from '@/utils/filterOptions';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { paths } from '@/paths';
import { FeedBackTable } from './FeedbackTable';
import { fetchFeedbacks } from '@/lib/api/fetchFeedback';
import { useAuth } from '@/context/AuthContext';
import { MappedFeedbackItem } from '@/types/feedback';
import FeedbackViewModal from './ViewModal';
import { CustomTablePagination } from '@/components/TablePagination';
import { useLoading } from '@/context/LoadingContext';

export function FeedbackComponent(): React.JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showLoader, hideLoader } = useLoading();
    const { user, loading: authLoading } = useAuth();
    
    // State management
    const [filterValue, setFilterValue] = useState('0');
    const [searchTerm, setSearchTerm] = useState('');
    const [feedbackData, setFeedbackData] = useState<MappedFeedbackItem[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<MappedFeedbackItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Loading states
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [cache, setCache] = useState<Record<string, { data: MappedFeedbackItem[], total: number }>>({});

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const fetchFeedbackData = useCallback(async () => {
        if (authLoading || !user || !accessToken) return;

        const cacheKey = `${filterValue}-${searchTerm}-${page}-${rowsPerPage}`;
        
        // Return cached data if available (except for initial load)
        if (cache[cacheKey] && !isInitialLoad) {
            setFeedbackData(cache[cacheKey].data);
            setTotalCount(cache[cacheKey].total);
            return;
        }

        try {
            // Show full loader only for initial load or filter changes
            if (isInitialLoad || page === 0) {
                showLoader();
            } else {
                setIsTableLoading(true);
            }

            const response = await fetchFeedbacks(
                searchTerm,
                filterValue,
                page + 1, // Convert to 1-based for API
                rowsPerPage
            );

            setFeedbackData(response.data);
            setTotalCount(response.total);
            setError(null);

            // Update cache
            setCache(prev => ({
                ...prev,
                [cacheKey]: {
                    data: response.data,
                    total: response.total
                }
            }));
        } catch (error) {
            console.error('Failed to fetch feedback data', error);
            setError('Failed to fetch feedback data');
            setFeedbackData([]);
            setTotalCount(0);
        } finally {
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
            setIsTableLoading(false);
            hideLoader();
        }
    }, [
        searchTerm, 
        filterValue, 
        page, 
        rowsPerPage, 
        router, 
        user, 
        authLoading, 
        accessToken,
        isInitialLoad,
        cache,
        showLoader,
        hideLoader
    ]);

    // Debounced API call effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchFeedbackData();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchFeedbackData]);

    const handleFeedbackUpdated = useCallback(() => {
        // Invalidate cache and refetch
        setCache({});
        fetchFeedbackData();
    }, [fetchFeedbackData]);

    useEffect(() => {
        const urlFilter = searchParams.get('filter');
        if (urlFilter && feedBackFilterOptions.some(opt => opt.value === urlFilter)) {
            setFilterValue(urlFilter);
        } else {
            setFilterValue('0');
        }
    }, [searchParams]);

    const handleFilterChange = useCallback((value: string) => {
        if (!feedBackFilterOptions.some(opt => opt.value === value)) return;

        setFilterValue(value);
        setPage(0);

        const params = new URLSearchParams(searchParams.toString());
        params.set('filter', value);
        router.push(`${paths.feedback}?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    }, []);

    const openModal = useCallback((feedback: MappedFeedbackItem) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    }, []);

    const handlePageChange = useCallback((
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    }, []);

    return (
        <FeedbackContainer>
            <HeadingComponent />

            <FeedbackWrapper>
                <FilterArea>
                    <FilterBy
                        options={feedBackFilterOptions}
                        selectedValue={filterValue}
                        onFilterChange={handleFilterChange}
                        label="Filter By:"
                    />
                    <SearchBox
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                </FilterArea>

                {error && (
                    <div style={{ padding: '16px' }}>
                        <div className="alert alert-danger">{error}</div>
                    </div>
                )}

                <FeedBackTable
                    data={feedbackData}
                    loading={isTableLoading}
                    onViewClick={openModal}
                />

                <CustomTablePagination
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />

                <FeedbackViewModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    feedbackId={selectedFeedback?.id || null}
                    onFeedbackUpdated={handleFeedbackUpdated}
                />
            </FeedbackWrapper>
        </FeedbackContainer>
    );
}