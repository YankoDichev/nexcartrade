import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';

function App() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const checkUser = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  };

  useEffect(() => {
    checkUser();

    const fetchCars = async () => {
      const { data, error } = await supabase
        .from('available_cars')
        .select('*');
      
      if (error) {
        console.error('Грешка при извличане на колите:', error.message);
      } else {
        setCars(data);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="border-b border-gray-800 bg-gray-950 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setShowAuth(false)}>
            <span className="text-2xl font-bold tracking-wider text-blue-400">NexCarTrade</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm border border-gray-700">
                  {user.email}
                </span>
                <button onClick={handleLogout} className="text-xs text-red-400 hover:underline">Изход</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(!showAuth)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm">
                {showAuth ? 'Към колите' : 'Вход за Дилъри (B2B)'}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-6">
        {showAuth && !user ? (
          <Auth onAuthSuccess={() => { setShowAuth(false); checkUser(); window.location.reload(); }} />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Налични автомобили</h1>
              <p className="text-gray-400 text-sm">Преглед на лотове, аукциони на живо и опции за директно купуване.</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-gray-950 border border-gray-800 rounded-2xl p-12 text-center">
                <h3 className="text-lg font-bold text-gray-300">Все още няма добавени автомобили</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
                    <div className="p-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                        car.status === 'auction_active' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {car.status === 'auction_active' ? 'Аукцион на живо' : 'Купи веднага'}
                      </span>
                      <h2 className="text-xl font-bold mb-1">{car.brand} {car.model}</h2>
                      <p className="text-gray-400 text-sm mb-4">Година: {car.year}</p>
                    </div>

                    <div className="bg-gray-900/50 p-5 border-t border-gray-800/80">
                      {car.price ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Стартова цена:</span>
                            <span className="text-lg font-bold text-white">{Number(car.price).toLocaleString()} €</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-950/80 border border-dashed border-gray-800 rounded-xl p-4 text-center">
                          <p className="text-xs font-semibold text-amber-500">Цената е скрита</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Регистрирайте се като B2B дилър за достъп.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
