'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

export function FeedbackComponent(): React.JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const [filterValue, setFilterValue] = useState('0');
    const [searchTerm, setSearchTerm] = useState('');
    const [feedbackData, setFeedbackData] = useState<MappedFeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState<MappedFeedbackItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const fetchFeedbackData = useCallback(async () => {
        if (authLoading || !user || !accessToken) return;
        console.log('Access token from feedback page:', accessToken);
        setLoading(true);
        try {
            const response = await fetchFeedbacks(
                searchTerm,
                filterValue,
                page + 1, // Convert to 1-based for API
                rowsPerPage
            );

            setFeedbackData(response.data);
            setTotalCount(response.total);
        } catch (error) {
            console.error('Failed to fetch feedback data', error);
            setFeedbackData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterValue, page, rowsPerPage, router, user, authLoading]);

    useEffect(() => {
        fetchFeedbackData();
    }, [fetchFeedbackData]);

    const handleFeedbackUpdated = useCallback(() => {
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

    const handleFilterChange = (value: string) => {
        if (!feedBackFilterOptions.some(opt => opt.value === value)) return;

        setFilterValue(value);
        setPage(0);

        const params = new URLSearchParams(searchParams.toString());
        params.set('filter', value);
        router.push(`${paths.feedback}?${params.toString()}`, { scroll: false });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const openModal = (feedback: MappedFeedbackItem) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

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

                <FeedBackTable
                    data={feedbackData}
                    loading={loading}
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