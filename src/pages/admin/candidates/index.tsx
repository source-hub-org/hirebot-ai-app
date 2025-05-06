import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useCandidates } from "@/hooks/useCandidatesList";
import { useLanguages } from "@/hooks/useLanguage";
import { CreateCandidateModal } from "@/components/modals/CreateCandidateModal";
import { formatDate } from "@/helpers/date";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CandidatesList() {
  const router = useRouter();
  const { candidates, showLoading, pagination, paginate } = useCandidates();
  useLanguages(true, 100);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleCreateSession = () => {
    setShowModal(true);
  };

  const handlePageChange = (pageNumber: number) => {
    paginate(pageNumber);
  };

  return (
    <>
      <Head>
        <title>Quizo Admin | Quản lý ứng viên</title>
        <meta name="description" content="Danh sách ứng viên Quizo" />
      </Head>

      {showLoading && <LoadingSpinner />}

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
                    <th className="py-3 px-4 text-left">Kỹ năng</th>
                    <th className="py-3 px-4 text-left">Cấp độ</th>
                    <th className="py-3 px-4 text-left">Ngày tham gia</th>
                    <th className="py-3 px-4 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr
                      key={candidate._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {(pagination.currentPage - 1) *
                          pagination.itemsPerPage +
                          index +
                          1}
                      </td>
                      <td className="py-3 px-4">{candidate.full_name}</td>
                      <td className="py-3 px-4 max-w-xs truncate" title={candidate.skills?.join(", ")}>
                        {candidate.skills?.join(", ")}
                      </td>
                      <td className="py-3 px-4">{candidate.interview_level}</td>
                      <td className="py-3 px-4">
                        {candidate.createdAt
                          ? formatDate(candidate.createdAt)
                          : ""}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/candidates/${candidate._id}`}>
                          <button className="text-primary hover:underline">
                            Xem chi tiết
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {candidates.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > pagination.itemsPerPage && (
              <div className="flex justify-end mt-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Trước
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-sm rounded ${
                        pagination.currentPage === page
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {showModal ? (
          <CreateCandidateModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
