import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  const testData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  it('should return first page of data by default', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    expect(result.current.paginatedData).toHaveLength(10);
    expect(result.current.paginatedData[0].id).toBe(1);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
  });

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() => usePagination(testData, 10));
    expect(result.current.totalPages).toBe(3);

    const { result: result2 } = renderHook(() => usePagination(testData, 5));
    expect(result2.current.totalPages).toBe(5);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedData[0].id).toBe(11);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.paginatedData[0].id).toBe(21);
  });

  it('should not go beyond last page', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    act(() => {
      result.current.goToPage(10);
    });

    expect(result.current.currentPage).toBe(3);
  });

  it('should not go below first page', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    act(() => {
      result.current.goToPage(-5);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should correctly report hasNextPage and hasPrevPage', () => {
    const { result } = renderHook(() => usePagination(testData, 10));

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(true);

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPrevPage).toBe(true);
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() => usePagination([], 10));

    expect(result.current.paginatedData).toHaveLength(0);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentPage).toBe(1);
  });

  it('should handle data smaller than page size', () => {
    const smallData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const { result } = renderHook(() => usePagination(smallData, 10));

    expect(result.current.paginatedData).toHaveLength(3);
    expect(result.current.totalPages).toBe(1);
  });
});
