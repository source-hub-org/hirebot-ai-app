import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import usePosition from "@/hooks/usePosition";
import CreatePositionModal from "@/components/modals/CreatePositionModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function PositionsList() {
  const { positions, loading, error, pagination, fetchPositions, deletePosition } = usePosition();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Quizo Admin | Quản lý vị trí</title>
        <meta name="description" content="Danh sách vị trí Quizo" />
      </Head>

      {loading && <LoadingSpinner />}

      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Quizo Admin" />

        <div className="container mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Danh sách vị trí</h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-primary-light to-primary text-white px-4 py-2 rounded hover:opacity-90"
              >
                Tạo vị trí mới
              </button>
            </div>

            {/* Table */}
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">STT</th>
                      <th className="py-3 px-4 text-left">Tên vị trí</th>
                      <th className="py-3 px-4 text-left">Cấp độ</th>
                      <th className="py-3 px-4 text-left">Trạng thái</th>
                      <th className="py-3 px-4 text-left">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((position, index) => (
                      <tr key={position._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/admin/positions/${position._id}`} className="text-blue-600 hover:text-blue-800">
                            {position.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">{position.level}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            position.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {position.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => deletePosition(position._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => fetchPositions(page)}
            />
          </div>
        </div>

        {isCreateModalOpen && 
          <CreatePositionModal
            onClose={() => setIsCreateModalOpen(false)}
            refreshPositions={() => fetchPositions()}
          />
        }
      </div>
    </>
  );
}
