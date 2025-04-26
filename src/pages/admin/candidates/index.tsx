import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useCandidates } from '@/hooks/useCandidatesList';
import { CreateCandidateModal } from '@/components/modals/CreateCandidateModal';

export default function CandidatesList() {
  const router = useRouter();
  const {
    candidates,
    showLoading,
    error,
    fetchCandidates,
    pagination,
    paginate
  } = useCandidates();
  
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleCreateSession = () => {
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Quizo Admin | Quản lý ứng viên</title>
        <meta name="description" content="Danh sách ứng viên Quizo" />
      </Head>
      
      {showLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary bg-white p-2"></div>
        </div>
      )}
      
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
              <button 
                onClick={handleCreateSession}
                className="bg-gradient-to-r from-primary-light to-primary text-white px-4 py-2 rounded hover:opacity-90"
              >
                Tạo phiên thi mới
              </button>
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
                  {candidates.map((candidate, index) => (
                    <tr key={candidate._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{candidate.full_name}</td>
                      <td className="py-3 px-4">{candidate.interview_level}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={candidate.status as 'pending' | 'interviewed' | 'hired' | 'rejected'} />
                      </td>
                      <td className="py-3 px-4">{candidate.date}</td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/candidates/${candidate._id}`}>
                          <button className="text-primary hover:underline">Xem chi tiết</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  
                  {candidates.length === 0 && (
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
            {pagination.total > pagination.itemsPerPage ?
              <div className="flex justify-center mt-6">
                <nav>
                  <ul className="flex">
                    <li>
                      <button 
                        onClick={() => paginate(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1 border rounded-l hover:bg-blue-500 disabled:opacity-50"
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(number => (
                      <li key={number}>
                        <button 
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 border-t border-b hover:bg-blue-500 ${
                            pagination.currentPage === number ? 'bg-primary text-white' : ''
                          }`}
                        >
                          {number}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button 
                        onClick={() => paginate(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1 border rounded-r hover:bg-blue-500 disabled:opacity-50"
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
             : ""}
          </div>
        </div>
        {showModal ? 
          <CreateCandidateModal 
            isOpen={showModal} 
            onClose={() => setShowModal(false)}
          />
        : ""}
      </div>
    </>
  );
}