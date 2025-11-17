import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV } from '../exportData';

describe('exportToCSV', () => {
  let alertMock;
  let createElementSpy;
  let appendChildSpy;
  let removeChildSpy;
  let clickSpy;

  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    clickSpy = vi.fn();
    const mockLink = {
      setAttribute: vi.fn(),
      style: {},
      click: clickSpy,
    };

    createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should alert when data is empty', () => {
    exportToCSV([]);
    expect(alertMock).toHaveBeenCalledWith('Nu există date de exportat');
  });

  it('should alert when data is null', () => {
    exportToCSV(null);
    expect(alertMock).toHaveBeenCalledWith('Nu există date de exportat');
  });

  it('should create CSV with correct headers', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ];

    exportToCSV(data, 'test.csv');

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('should handle custom columns', () => {
    const data = [
      { name: 'John', age: 30, city: 'NYC' },
      { name: 'Jane', age: 25, city: 'LA' }
    ];

    exportToCSV(data, 'test.csv', ['name', 'city']);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should escape special characters in CSV', () => {
    const data = [
      { name: 'John, Doe', description: 'Test "quote"' }
    ];

    exportToCSV(data, 'test.csv');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should use default filename if not provided', () => {
    const data = [{ name: 'John' }];

    exportToCSV(data);

    expect(clickSpy).toHaveBeenCalled();
  });
});
