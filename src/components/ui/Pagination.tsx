import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = currentPage - half;
      let end = currentPage + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      } else if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <>
    {totalPages > 1 && (
      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Trước
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-sm rounded ${currentPage === page 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Sau
          </button>
        </div>
      </div>
    )}
    </>
  );
}