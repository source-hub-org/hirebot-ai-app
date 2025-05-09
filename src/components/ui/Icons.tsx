import React from 'react';
import { FiEye, FiEdit3 } from 'react-icons/fi';

type IconProps = {
  className?: string;
  title?: string;
  onClick?: () => void;
};

export const EyeIcon = ({ className, title, onClick }: IconProps) => (
  <FiEye 
    className={`text-primary hover:text-primary-dark cursor-pointer ${className}`} 
    onClick={onClick}
    title={title}
  />
);

export const RetryIcon = ({ className, title,  onClick }: IconProps) => (
  <FiEdit3 
    className={`text-blue-500 hover:text-blue-700 cursor-pointer ${className}`} 
    onClick={onClick}
    title={title}
  />
);
