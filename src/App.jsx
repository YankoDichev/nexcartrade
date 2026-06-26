import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import AdminPanel from './AdminPanel';

// Компонент за жив таймер (Countdown) за всеки лот
function CountdownTimer({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(expiryDate) - new Date();
      if (difference <= 0) {
        setTimeLeft('Изтекъл търг');
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      let output = '';
      if (days > 0) output += `${days}д `;
      output += `${hours.toString().padStart(2, '0')}ч ${minutes.toString().padStart(2, '0')}м ${seconds.toString().padStart(2, '0')}с`;
      setTimeLeft(output);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <span className="text-amber-400 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 text-xs">
      Оставащо време: {timeLeft}
    </span>
  );
}
function App() {
  const [cars, setCars] = useState([]);
  const [allCarsCount, setAllCarsCount] = useState([]); // Пази всички коли за броячите
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('standard_user');
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // СТРАТЕГИЧЕСКИ СТЕЙТОВЕ ЗА ФИЛТРИТЕ С ДВОЙНИ СЕКЦИИ (ОТ - ДО)
  const [activeTab, setActiveTab] = useState('AUCTIONS'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [quickCondition, setQuickCondition] = useState(''); 
  const [filterBrand, setFilterBrand] = useState('');
  const [filterFuel, setFilterFuel] = useState('');
  const [filterGearbox, setFilterGearbox] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterVat, setFilterVat] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterEuroClass, setFilterEuroClass] = useState('');
  const [filterBodyType, setFilterBodyType] = useState('');

  // ДВОЙНИ СЕКЦИИ ЗА ОБХВАТ (RANGE SELECTORS)
  const [filterMinYear, setFilterMinYear] = useState('');
  const [filterMaxYear, setFilterMaxYear] = useState('');
  const [filterMinMileage, setFilterMinMileage] = useState('');
  const [filterMaxMileage, setFilterMaxMileage] = useState('');
  const [filterMinPower, setFilterMinPower] = useState('');
  const [filterMaxPower, setFilterMaxPower] = useState('');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');

  const checkUserAndRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (!error && profile) {
        setUserRole(profile.role);
      }
    } else {
      setUserRole('standard_user');
    }
  };
  const fetchCars = async () => {
    setLoading(true);
    
    // 1. Извличаме абсолютно всички налични коли за реалните броячи в реално време
    const { data: fullData } = await supabase.from('available_cars').select('*');
    if (fullData) setAllCarsCount(fullData);

    // 2. Изграждаме филтрираната заявка
    let query = supabase.from('available_cars').select('*');

    if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);
    if (quickCondition) query = query.eq('damage_status', quickCondition);
    if (filterBrand) query = query.ilike('brand', `%${filterBrand}%`);
    if (filterFuel) query = query.eq('fuel_type', filterFuel);
    if (filterGearbox) query = query.eq('gearbox', filterGearbox);
    if (filterLocation) query = query.eq('location', filterLocation);
    if (filterVat) query = query.eq('vat_status', filterVat);
    if (filterColor) query = query.ilike('color', filterColor);
    if (filterEuroClass) query = query.eq('emission_class', filterEuroClass);
    if (filterBodyType) query = query.eq('body_type', filterBodyType);

    // Прилагане на филтриращите диапазони От - До
    if (filterMinYear) query = query.gte('year', parseInt(filterMinYear));
    if (filterMaxYear) query = query.lte('year', parseInt(filterMaxYear));
    if (filterMinMileage) query = query.gte('mileage', parseInt(filterMinMileage));
    if (filterMaxMileage) query = query.lte('mileage', parseInt(filterMaxMileage));
    if (filterMinPower) query = query.gte('power', parseInt(filterMinPower));
    if (filterMaxPower) query = query.lte('power', parseInt(filterMaxPower));
    if (filterMinPrice) query = query.gte('price', parseFloat(filterMinPrice));
    if (filterMaxPrice) query = query.lte('price', parseFloat(filterMaxPrice));

    const { data, error } = await query;
    if (!error && data) setCars(data);
    setLoading(false);
  };

  useEffect(() => { checkUserAndRole(); }, []);
  
  // Автоматично задействане на филтрите при всяка промяна
  useEffect(() => { 
    fetchCars(); 
  }, [showAdmin, searchQuery, quickCondition, filterBrand, filterFuel, filterGearbox, filterLocation, filterVat, filterColor, filterEuroClass, filterBodyType, filterMinYear, filterMaxYear, filterMinMileage, filterMaxMileage, filterMinPower, filterMaxPower, filterMinPrice, filterMaxPrice]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserRole('standard_user'); setShowAdmin(false); window.location.reload();
  };

  const resetFilters = () => {
    setSearchQuery(''); setQuickCondition(''); setFilterBrand(''); setFilterFuel(''); 
    setFilterGearbox(''); setFilterLocation(''); setFilterVat(''); setFilterColor(''); 
    setFilterEuroClass(''); setFilterBodyType(''); setFilterMinYear(''); setFilterMaxYear(''); 
    setFilterMinMileage(''); setFilterMaxMileage(''); setFilterMinPower(''); setFilterMaxPower('');
    setFilterMinPrice(''); setFilterMaxPrice('');
  };

  // Изчисляване на динамичните броячи за сивите бутони Normal и Damaged
  const countNormal = allCarsCount.filter(c => c.damage_status === 'Normal' || !c.damage_status).length;
  const countDamaged = allCarsCount.filter(c => c.damage_status === 'Damaged').length;

  // Групиране на колите по лотове
  const groupedLots = cars.reduce((acc, car) => {
    const lotName = car.lot_name || "Индивидуални обяви";
    if (!acc[lotName]) {
      acc[lotName] = {
        name: lotName,
        supplier: car.supplier_name || "NexCarTrade",
        type: car.lot_type || (car.status === 'auction_active' ? 'Blind Auction' : 'Fixed Price'),
        closingDate: car.lot_closing_date || car.closed_at,
        vehicles: []
      };
    }
    acc[lotName].vehicles.push(car);
    return acc;
  }, {});
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500">
      {/* Навигационна лента */}
      <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setShowAuth(false); setShowAdmin(false); }}>
            <span className="text-2xl font-black tracking-wider text-blue-500 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">NexCarTrade</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {(userRole === 'super_admin' || userRole === 'admin') && (
                  <button onClick={() => setShowAdmin(!showAdmin)} className="text-xs uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                    {showAdmin ? 'Към колите' : 'Admin Панел'}
                  </button>
                )}
                <span className="bg-gray-900 px-4 py-2 rounded-xl text-xs border border-gray-800 text-gray-400 font-mono">{user.email}</span>
                <button onClick={handleLogout} className="text-xs text-red-400 font-bold hover:text-red-300 transition-colors">Изход</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(!showAuth)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-lg text-xs uppercase tracking-wider">
                {showAuth ? 'Към колите' : 'Вход за Дилъри (B2B)'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Работна площ */}
      <main className="max-w-[1600px] mx-auto p-6">
        {showAdmin && user ? (
          <AdminPanel user={user} onBack={() => setShowAdmin(false)} />
        ) : showAuth && !user ? (
          <Auth onAuthSuccess={() => { setShowAuth(false); checkUserAndRole(); fetchCars(); }} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start mt-4">
            
            {/* СИН КРАСИВ ФИЛТЪР ПО МОДЕЛА НА ECARSTRADE */}
            <aside className="w-full lg:w-[350px] bg-white text-gray-800 border border-gray-200 rounded-2xl p-4 sticky top-[88px] shadow-xl max-h-[82vh] overflow-y-auto flex flex-col justify-between custom-scrollbar">
              <div>
                {/* Табове Auctions / Vehicles */}
                <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-xl mb-4 text-xs font-bold text-center">
                  <button onClick={() => setActiveTab('AUCTIONS')} className={`py-2 rounded-lg transition-all ${activeTab === 'AUCTIONS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>AUCTIONS</button>
                  <button onClick={() => setActiveTab('VEHICLES')} className={`py-2 rounded-lg transition-all ${activeTab === 'VEHICLES' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>VEHICLES</button>
                </div>

                {/* Глобално поле за VIN / Търсене */}
                <div className="mb-4">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 outline-none focus:border-blue-500 placeholder-gray-400" placeholder="Unit Nº, VIN, make, model..." />
                </div>

                {/* Бързи сиви бутони с реални работещи броячи от базата */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                  <button onClick={() => setQuickCondition(quickCondition === 'Normal' ? '' : 'Normal')} className={`p-2.5 rounded-xl border flex justify-between items-center transition-all ${quickCondition === 'Normal' ? 'bg-blue-50 border-blue-500 text-blue-600 font-black shadow-xs' : 'bg-gray-50 border-gray-200'}`}>
                    <span>🚗 Normal</span>
                    <span className="text-[10px] text-gray-400 font-mono bg-white px-1.5 py-0.5 rounded-md border border-gray-100 shadow-2xs">{countNormal}</span>
                  </button>
                  <button onClick={() => setQuickCondition(quickCondition === 'Damaged' ? '' : 'Damaged')} className={`p-2.5 rounded-xl border flex justify-between items-center transition-all ${quickCondition === 'Damaged' ? 'bg-blue-50 border-blue-500 text-blue-600 font-black shadow-xs' : 'bg-gray-50 border-gray-200'}`}>
                    <span>💥 Damaged</span>
                    <span className="text-[10px] text-gray-400 font-mono bg-white px-1.5 py-0.5 rounded-md border border-gray-100 shadow-2xs">{countDamaged}</span>
                  </button>
                </div>
                {/* ОГРОМЕН СПИСЪК С ДВОЙНИ КУТИИ (ОТ - ДО) И ПАДАЩИ МЕНЮТА */}
                <div className="space-y-3.5 text-xs font-semibold text-gray-700 mt-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-900 mb-1">Make & Model</label>
                    <input type="text" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-900 outline-none focus:border-blue-500" placeholder="Type Make..." />
                  </div>

                  {/* 1. First Registration (ОТ - ДО) */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-900 mb-1">📅 First registration (Година)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={filterMinYear} onChange={(e) => setFilterMinYear(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="From" />
                      <input type="number" value={filterMaxYear} onChange={(e) => setFilterMaxYear(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="To" />
                    </div>
                  </div>

                  {/* 2. Mileage (ОТ - ДО) */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-900 mb-1">🛣️ Mileage (Пробег км)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={filterMinMileage} onChange={(e) => setFilterMinMileage(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="From" />
                      <input type="number" value={filterMaxMileage} onChange={(e) => setFilterMaxMileage(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="To" />
                    </div>
                  </div>

                  {/* 3. Price (ОТ - ДО) */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-900 mb-1">💶 Price Range (€)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="Min" />
                      <input type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="Max" />
                    </div>
                  </div>

                  {/* 4. Power (ОТ - ДО) */}
                  <div>
                    <label className="block text-[11px] font-black text-gray-900 mb-1">⚡ Power (Мощност к.с.)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={filterMinPower} onChange={(e) => setFilterMinPower(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="From" />
                      <input type="number" value={filterMaxPower} onChange={(e) => setFilterMaxPower(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 text-center" placeholder="To" />
                    </div>
                  </div>

                  {/* Опции и Характеристики */}
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>⛽ Fuel</span>
                    <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Diesel">Diesel</option><option value="Petrol">Petrol</option><option value="Hybrid">Hybrid</option><option value="Electric">Electric</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>⚙️ Gearbox</span>
                    <select value={filterGearbox} onChange={(e) => setFilterGearbox(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Automatic">Automatic</option><option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>🌐 Car location</span>
                    <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Belgium">Belgium</option><option value="Germany">Germany</option><option value="France">France</option><option value="Netherlands">Netherlands</option><option value="Italy">Italy</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>💧 Color (Цветове)</span>
                    <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Black">Black</option><option value="White">White</option><option value="Grey">Grey</option><option value="Silver">Silver</option><option value="Blue">Blue</option><option value="Red">Red</option><option value="Green">Green</option><option value="Brown">Brown</option><option value="Beige">Beige</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>☁️ Emission class</span>
                    <select value={filterEuroClass} onChange={(e) => setFilterEuroClass(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Euro 6">Euro 6</option><option value="Euro 5">Euro 5</option><option value="Euro 4">Euro 4</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>🚘 Body type</span>
                    <select value={filterBodyType} onChange={(e) => setFilterBodyType(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="Sedan">Sedan</option><option value="Station Wagon">Avant / Kombi</option><option value="SUV">SUV / Offroad</option><option value="Hatchback">Hatchback</option><option value="Van">Van / Minibus</option>
                    </select>
                  </div>

                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-2.5 justify-between">
                    <span>% VAT status</span>
                    <select value={filterVat} onChange={(e) => setFilterVat(e.target.value)} className="bg-transparent outline-none text-xs text-gray-500 font-medium max-w-[150px]">
                      <option value="">All</option><option value="VAT deductible">VAT deductible</option><option value="Margin">Margin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ГОЛЕМИЯТ СИН БУТОН НАЙ-ДОЛУ */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex-shrink-0">
                <button onClick={fetchCars} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all text-center">
                  Show {cars.length} Vehicles
                </button>
                <button onClick={resetFilters} className="w-full text-center text-[11px] text-gray-400 font-bold mt-3 hover:text-blue-500 transition-colors">🔄 Reset filter</button>
              </div>
            </aside>
            {/* ДЯСНА СЕКЦИЯ: ХОРИЗОНТАЛНИ ОБЯВИ И ЛОТОВЕ */}
            <section className="flex-1 w-full space-y-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : Object.keys(groupedLots).length === 0 ? (
                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-12 text-center shadow-lg">
                  <h3 className="text-base font-bold text-gray-400">Няма намерени автомобили по тези критерии</h3>
                  <p className="text-xs text-gray-600 mt-1">Променете филтрите в белия панел вляво.</p>
                </div>
              ) : (
                Object.values(groupedLots).map((lot) => (
                  <div key={lot.name} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    
                    {/* Хедър на лота */}
                    <div className="bg-gray-900/60 p-4 px-5 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-sm font-black uppercase text-white tracking-wide">{lot.name}</h2>
                        <p className="text-[11px] text-gray-500 mt-0.5">Доставчик: <span className="text-gray-400 font-medium">{lot.supplier}</span> • Тип: <span className="text-blue-400 font-medium">{lot.type}</span></p>
                      </div>
                      {lot.closingDate && <CountdownTimer expiryDate={lot.closingDate} />}
                    </div>

                    {/* Списък с коли на редове */}
                    <div className="divide-y divide-gray-800/60">
                      {lot.vehicles.map((car) => (
                        <div key={car.id} className="p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-center hover:bg-gray-900/20 transition-colors">
                          
                          <div className="w-full md:w-[180px] h-[110px] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex-shrink-0 relative">
                            {car.images && car.images.length > 0 ? (
                              <img src={car.images} alt={car.title} className="w-full h-full object-cover object-center" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-650 font-bold">Няма снимка</div>
                            )}
                            {car.damage_status === 'Damaged' && (
                              <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">Удряна</span>
                            )}
                          </div>

                          <div className="flex-1 w-full text-center md:text-left">
                            <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">{car.title}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-2.5 text-xs text-gray-400">
                              <span>📅 {car.year} г.</span>
                              <span>🛣️ {car.mileage ? Number(car.mileage).toLocaleString() : 0} км</span>
                              <span>⛽ {car.fuel_type || 'N/A'}</span>
                              <span>⚙️ {car.gearbox || 'N/A'}</span>
                              <span>📍 {car.location || 'Bulgaria'}</span>
                            </div>
                            <div className="mt-3 flex justify-center md:justify-start gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-900 border border-gray-800 px-2 py-0.5 rounded text-gray-400">{car.vat_status || 'VAT'}</span>
                            </div>
                          </div>

                          <div className="w-full md:w-[220px] text-right border-t md:border-t-0 border-gray-800 pt-4 md:pt-0 flex flex-col justify-center items-center md:items-end flex-shrink-0">
                            {car.price ? (
                              <div className="space-y-1.5 w-full text-center md:text-right">
                                <div className="flex justify-between md:justify-end items-center gap-3">
                                  <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Текуща цена:</span>
                                  <span className="text-base font-black text-white">{Number(car.price).toLocaleString()} €</span>
                                </div>
                                {car.buy_now_price && (
                                  <div className="flex justify-between md:justify-end items-center gap-3">
                                    <span className="text-[11px] text-blue-500 uppercase tracking-wider font-semibold">Купи веднага:</span>
                                    <span className="text-base font-black text-blue-400">{Number(car.buy_now_price).toLocaleString()} €</span>
                                  </div>
                                )}
                                <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wide transition-all shadow-md">
                                  Наддай / Детайли
                                </button>
                              </div>
                            ) : (
                              <div className="bg-gray-900/80 border border-dashed border-gray-800 rounded-xl p-3 w-full text-center max-w-[200px]">
                                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Цената е скрита</p>
                                <button onClick={() => setShowAuth(true)} className="mt-2 text-[10px] font-extrabold uppercase bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors w-full tracking-wide">Вход за цени</button>
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                ))
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
