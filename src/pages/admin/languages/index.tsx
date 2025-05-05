import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useLanguages } from "@/hooks/useLanguage";
import CreateLanguageModal from "@/components/modals/CreateLanguageModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";

export default function LanguagesList() {
  const { languages, isLoading, error, pagination, paginate, deleteLanguage } = useLanguages();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Languages | Admin</title>
        <meta name="description" content="Languages management" />
      </Head>

      {isLoading && <LoadingSpinner />}

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gradient-to-r from-primary-light to-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">HireBot Admin</div>
            <div className="flex items-center gap-6">
              <Link href="/admin/candidates">
                <span className="hover:underline">Ứng viên</span>
              </Link>
              <Link href="/admin/languages">
                <span className="hover:underline">Ngôn ngữ</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ngôn ngữ lập trình</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Thêm ngôn ngữ
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">
                    Tên
                  </th>
                  <th className="py-3 px-4 text-left">
                    Slug
                  </th>
                  <th className="py-3 px-4 text-left">
                    Xuất hiện đầu tiên
                  </th>
                  <th className="py-3 px-4 text-left">
                    Xếp hạng phổ biến
                  </th>
                  <th className="py-3 px-4 text-left">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody >
                {languages?.map((language) => (
                  <tr className="border-b hover:bg-gray-50" key={language._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {language.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {language.slug}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {language.first_appeared}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {language.popularity_rank}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteLanguage(language._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={paginate}
              />
            )}
          
          </div>
          {isCreateModalOpen &&
            <CreateLanguageModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
            />
          }
        </div>
      </div>
    </>
  );
}
