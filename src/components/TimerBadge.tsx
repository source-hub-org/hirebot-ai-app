import React from "react";

interface TimerBadgeProps {
  time: string;
}

export default function TimerBadge({ time }: TimerBadgeProps) {
  return (
    <div className="timer-badge">
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span className="font-bold">{time}</span>
    </div>
  );
}
