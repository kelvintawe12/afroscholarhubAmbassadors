import React, { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
interface Column {
  header: string | React.ReactNode;
  accessor: string | ((row: any) => React.ReactNode);
  sortable?: boolean;
}
interface DataTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  rowsPerPage?: number;
  pagination?: boolean;
  showSearch?: boolean;
}
export const DataTable = ({
  columns,
  data,
  keyField,
  rowsPerPage = 10,
  pagination = true,
  showSearch = false
}: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });
  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(row => {
      return columns.some(column => {
        if (typeof column.accessor === 'string') {
          const value = row[column.accessor];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        }
        return false;
      });
    });
  }, [data, columns, searchQuery]);
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const key = sortConfig.key as string;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return pagination ? sortedData.slice(startIndex, startIndex + rowsPerPage) : sortedData;
  }, [sortedData, currentPage, rowsPerPage, pagination]);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSort = (key: string) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };
  const getValue = (row: any, accessor: string | ((row: any) => React.ReactNode)) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  };
  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {showSearch && <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {column.sortable ? <button className="flex items-center" onClick={() => handleSort(column.accessor as string)}>
                      {column.header}
                      {sortConfig.key === column.accessor && <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>}
                    </button> : column.header}
                </th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length === 0 ? <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr> : paginatedData.map(row => <tr key={row[keyField]} className="hover:bg-gray-50">
                  {columns.map((column, index) => <td key={index} className="px-6 py-4">
                      {getValue(row, column.accessor)}
                    </td>)}
                </tr>)}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * rowsPerPage + 1, sortedData.length)}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span>{' '}
                results
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50'}`}>
                <ChevronLeftIcon size={16} className="mr-1" />
                Previous
              </button>
              <button onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50'}`}>
                Next
                <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>}
    </div>;
};