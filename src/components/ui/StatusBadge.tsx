import React from "react";

type Status = "pending" | "interviewed" | "hired" | "rejected";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  interviewed: "bg-blue-100 text-blue-800",
  hired: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Chờ phỏng vấn",
  interviewed: "Đã phỏng vấn",
  hired: "Đã tuyển",
  rejected: "Từ chối",
};

export const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}
  >
    {statusLabels[status]}
  </span>
);
