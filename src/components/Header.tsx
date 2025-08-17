import React from 'react';
import Sidebar from './Sidebar';

const Header: React.FC = () => {
  return (
    <header className="h-22 bg-blue-800 p-6 flex justify-between items-center">
      <Sidebar />
      <div className="flex items-center justify-center w-full">
        <img src="/images/Logo_PMMT.png" alt="Logo PMMT" className="h-20 w-auto" />
      </div>
    </header>
  );
};

export default Header; 