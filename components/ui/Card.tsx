import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-50 ${className} ${onClick ? 'cursor-pointer active:bg-gray-50 transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;