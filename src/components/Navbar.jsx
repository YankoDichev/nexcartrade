import React from 'react';

export default function Navbar({ user, userRole, showAdmin, setShowAdmin, showAuth, setShowAuth, handleLogout }) {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        {/* Лого NexCarTrade */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setShowAuth(false); setShowAdmin(false); }}>
          <span className="text-2xl font-black tracking-wider text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            NexCarTrade
          </span>
        </div>

        {/* Десен Дилърски Панел за сигурност */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {(userRole === 'super_admin' || userRole === 'admin') && (
                <button 
                  onClick={() => setShowAdmin(!showAdmin)} 
                  className="text-xs uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                >
                  {showAdmin ? 'Към колите' : 'Admin Панел'}
                </button>
              )}
              <span className="bg-gray-900 px-4 py-2 rounded-xl text-xs border border-gray-800 text-gray-400 font-mono">
                {user.email}
              </span>
              <button 
                onClick={handleLogout} 
                className="text-xs text-red-400 font-bold hover:text-red-300 transition-colors"
              >
                Изход
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuth(!showAuth)} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg text-xs uppercase tracking-wider"
            >
              {showAuth ? 'Към колите' : 'Вход за Дилъри (B2B)'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
