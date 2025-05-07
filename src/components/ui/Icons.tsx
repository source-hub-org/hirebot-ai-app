import React from 'react';
import { FiEye, FiRefreshCw } from 'react-icons/fi';

type IconProps = {
  className?: string;
  onClick?: () => void;
};

export const EyeIcon = ({ className, onClick }: IconProps) => (
  <FiEye 
    className={`text-primary hover:text-primary-dark cursor-pointer ${className}`} 
    onClick={onClick}
  />
);

export const RetryIcon = ({ className, onClick }: IconProps) => (
  <FiRefreshCw 
    className={`text-blue-500 hover:text-blue-700 cursor-pointer ${className}`} 
    onClick={onClick}
  />
);
