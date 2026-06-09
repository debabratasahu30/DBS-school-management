import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  exportable?: boolean;
}

export function DataTable<T>({ data, columns, searchable, exportable }: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    columns.some((column) => {
      const value = item[column.key];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const csv = [
      columns.map((c) => c.header).join(','),
      ...filteredData.map((row) => columns.map((c) => row[c.key]).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {(searchable || exportable) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm"
              />
            </div>
          )}
          {exportable && (
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer"
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-700">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300 rounded-lg shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
