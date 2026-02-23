import React from 'react';

interface MobileWrapperProps {
  children: React.ReactNode;
}

const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-md bg-background h-[100dvh] flex flex-col relative shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default MobileWrapper;