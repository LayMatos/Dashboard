import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Computer, User, Shield, X, Menu, Car } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg z-20 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-10 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-72 transform transition-transform duration-300 ease-in-out bg-gradient-to-b from-blue-900 to-blue-800 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            <h3 className="text-xl font-bold text-white">Dashboard</h3>
            <button
              onClick={closeSidebar}
              className="p-1 text-gray-300 hover:text-white hover:bg-blue-700 rounded-full transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/coneq"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/coneq'
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  onClick={closeSidebar}
                >
                  <Computer size={20} />
                  <span className="font-medium">CONEQ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sgpm"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === '/sgpm'
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  onClick={closeSidebar}
                >
                  <User size={20} />
                  <span className="font-medium">SGPM</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-blue-700">
            <p className="text-xs text-gray-400 text-center">
              © 2024 Dashboard
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 