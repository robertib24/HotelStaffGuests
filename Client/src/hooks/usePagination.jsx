import { useState, useMemo } from 'react';

export function usePagination(data, itemsPerPage = 10) {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    return {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
    };
}