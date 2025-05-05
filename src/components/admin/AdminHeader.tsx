import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type AdminHeaderProps = {
  title: string;
};

export const AdminHeader = ({ title }: AdminHeaderProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <nav className="bg-gradient-to-r from-primary-light to-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">{title}</div>
        <div className="flex items-center gap-6">
          <Link href="/admin/candidates">
            <span className="hover:underline">Ứng viên</span>
          </Link>
          <Link href="/admin/positions">
            <span className="hover:underline">Vị trí</span>
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
  );
};
