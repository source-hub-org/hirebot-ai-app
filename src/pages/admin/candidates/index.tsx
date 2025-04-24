import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Mock data
const mockCandidates = [
  { id: 1, name: 'Nguyễn Văn A', language: 'JavaScript', level: 'Senior', status: 'PASS', date: '2023-10-15' },
  { id: 2, name: 'Trần Thị B', language: 'Python', level: 'Middle', status: 'FAIL', date: '2023-10-14' },
  { id: 3, name: 'Lê Văn C', language: 'Java', level: 'Junior', status: 'PASS', date: '2023-10-13' },
  { id: 4, name: 'Phạm Thị D', language: 'C#', level: 'Senior', status: 'PASS', date: '2023-10-12' },
  { id: 5, name: 'Hoàng Văn E', language: 'JavaScript', level: 'Middle', status: 'FAIL', date: '2023-10-11' },
  { id: 6, name: 'Đỗ Thị F', language: 'Python', level: 'Junior', status: 'PASS', date: '2023-10-10' },
  { id: 7, name: 'Vũ Văn G', language: 'Java', level: 'Senior', status: 'FAIL', date: '2023-10-09' },
  { id: 8, name: 'Ngô Thị H', language: 'C#', level: 'Middle', status: 'PASS', date: '2023-10-08' },
  { id: 9, name: 'Đặng Văn I', language: 'JavaScript', level: 'Junior', status: 'PASS', date: '2023-10-07' },
  { id: 10, name: 'Bùi Thị K', language: 'Python', level: 'Senior', status: 'FAIL', date: '2023-10-06' },
];

export default function CandidatesList() {
  const router = useRouter();
  const [candidates, setCandidates] = useState(mockCandidates);
  const [filteredCandidates, setFilteredCandidates] = useState(mockCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    language: '',
    level: '',
    status: '',
  });
  
  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);
  
  // Apply filters
  useEffect(() => {
    let result = [...candidates];
    
    if (filters.language) {
      result = result.filter(candidate => candidate.language === filters.language);
    }
    
    if (filters.level) {
      result = result.filter(candidate => candidate.level === filters.level);
    }
    
    if (filters.status) {
      result = result.filter(candidate => candidate.status === filters.status);
    }
    
    setFilteredCandidates(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, candidates]);
  
  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-primary-light to-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Quizo Admin</div>
          <div className="flex items-center gap-6">
            <Link href="/admin/candidates">
              <span className="hover:underline">Ứng viên</span>
            </Link>
            <Link href="/admin/questions">
              <span className="hover:underline">Câu hỏi</span>
            </Link>
            <Link href="/admin/sessions/new">
              <span className="hover:underline">Tạo phiên thi</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-white text-primary px-3 py-1 rounded hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Danh sách ứng viên</h1>
            <Link href="/admin/sessions/new">
              <button className="bg-gradient-to-r from-primary-light to-primary text-white px-4 py-2 rounded hover:opacity-90">
                Tạo phiên thi mới
              </button>
            </Link>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
              <select 
                name="language" 
                className="w-full p-2 border rounded"
                value={filters.language}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C#">C#</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cấp độ</label>
              <select 
                name="level" 
                className="w-full p-2 border rounded"
                value={filters.level}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select 
                name="status" 
                className="w-full p-2 border rounded"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">STT</th>
                  <th className="py-3 px-4 text-left">Họ tên</th>
                  <th className="py-3 px-4 text-left">Ngôn ngữ</th>
                  <th className="py-3 px-4 text-left">Cấp độ</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Ngày thi</th>
                  <th className="py-3 px-4 text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((candidate, index) => (
                  <tr key={candidate.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{indexOfFirstItem + index + 1}</td>
                    <td className="py-3 px-4">{candidate.name}</td>
                    <td className="py-3 px-4">{candidate.language}</td>
                    <td className="py-3 px-4">{candidate.level}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                        candidate.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{candidate.date}</td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/candidates/${candidate.id}`}>
                        <button className="text-primary hover:underline">Xem chi tiết</button>
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex">
                  <li>
                    <button 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-l hover:bg-gray-100 disabled:opacity-50"
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <li key={number}>
                      <button 
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 border-t border-b hover:bg-gray-100 ${
                          currentPage === number ? 'bg-primary text-white' : ''
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-r hover:bg-gray-100 disabled:opacity-50"
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}