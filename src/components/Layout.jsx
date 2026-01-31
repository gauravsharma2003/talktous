import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-dvh w-full bg-[#e8d5c4] overflow-hidden relative">
      <Outlet />
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] z-50">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center transition-colors ${location.pathname === '/' ? 'text-black' : 'text-gray-400'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
               <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className={`text-[10px] mt-1 ${location.pathname === '/' ? 'font-bold' : 'font-medium'}`}>Newsfeed</span>
          </button>
          
          <button 
            onClick={() => navigate('/quick-access')}
            className={`flex flex-col items-center transition-colors ${location.pathname === '/quick-access' ? 'text-black' : 'text-gray-400'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/quick-access' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path d="M9 10h6m-3-3v6" />
            </svg>
            <span className={`text-[10px] mt-1 ${location.pathname === '/quick-access' ? 'font-bold' : 'font-medium'}`}>Quick Access</span>
          </button>
          
          <div className="flex flex-col items-center text-gray-400 opacity-50 cursor-not-allowed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <span className="text-[10px] mt-1 font-medium">Store</span>
          </div>
        </div>
      </div>
    </div>
  );
}
