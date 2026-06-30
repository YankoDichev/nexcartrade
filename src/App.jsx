import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import AdminPanel from './AdminPanel';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import VehicleRow from './components/VehicleRow';

function App() {
  const [cars, setCars] = useState([]);
  const [allCarsCount, setAllCarsCount] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('standard_user');
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Табове и мерни единици eCarsTrade
  const [activeTab, setActiveTab] = useState('AUCTIONS'); 
  const [powerUnit, setPowerUnit] = useState('HP');

  // Стейтове за филтрация в реално време
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
  const [filterSource, setFilterSource] = useState('');
  const [filterAuctionType, setFilterAuctionType] = useState('');

  // ДИАПАЗОНИ СЕКЦИИ ОТ - ДО (КОИТО БЯХА ИЗПУСНАТИ)
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

    // 2. Изграждаме филтрираната заявка към базата данни
    let query = supabase.from('available_cars').select('*');

    // Автоматично филтриране на колите спрямо бутоните AUCTIONS или VEHICLES (eCarsTrade логика)
    if (activeTab === 'AUCTIONS') {
      query = query.eq('status', 'auction_active');
    } else if (activeTab === 'VEHICLES') {
      query = query.eq('status', 'available');
    }

    // Прилагане на текстово търсене и характеристики
    if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);
    if (quickCondition) query = query.eq('damage_status', quickCondition);
    if (filterBrand) query = query.ilike('brand', `%${filterBrand}%`);
    if (filterFuel) query = query.eq('fuel_type', filterFuel);
    if (filterGearbox) query = query.eq('gearbox', filterGearbox);
    if (filterLocation) query = query.eq('location', filterLocation);
    if (filterVat) query = query.eq('vat_status', filterVat);
    if (filterColor) query = query.eq('color', filterColor);
    if (filterEuroClass) query = query.eq('emission_class', filterEuroClass);
    if (filterBodyType) query = query.eq('body_type', filterBodyType);
    if (filterSource) query = query.eq('source_supplier', filterSource);
    if (filterAuctionType) query = query.eq('auction_type', filterAuctionType);

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
  
  useEffect(() => { 
    fetchCars(); 
  }, [showAdmin, searchQuery, quickCondition, filterBrand, filterFuel, filterGearbox, filterLocation, filterVat, filterColor, filterEuroClass, filterBodyType, filterSource, filterAuctionType, filterMinYear, filterMaxYear, filterMinMileage, filterMaxMileage, filterMinPower, filterMaxPower, filterMinPrice, filterMaxPrice, activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserRole('standard_user'); setShowAdmin(false); window.location.reload();
  };

  const resetFilters = () => {
    setSearchQuery(''); setQuickCondition(''); setFilterBrand(''); setFilterFuel(''); 
    setFilterGearbox(''); setFilterLocation(''); setFilterVat(''); setFilterColor(''); 
    setFilterEuroClass(''); setFilterBodyType(''); setFilterSource(''); setFilterAuctionType('');
    setFilterMinYear(''); setFilterMaxYear(''); setFilterMinMileage(''); setFilterMaxMileage(''); 
    setFilterMinPower(''); setFilterMaxPower(''); setFilterMinPrice(''); setFilterMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6] text-gray-900 font-sans antialiased">
      {/* Навигационна лента */}
      <Navbar 
        user={user} userRole={userRole} 
        showAdmin={showAdmin} setShowAdmin={setShowAdmin} 
        showAuth={showAuth} setShowAuth={setShowAuth} 
        handleLogout={handleLogout} 
      />

      <main className="max-w-[1600px] mx-auto p-4 mt-2">
        {showAdmin && user ? (
          <AdminPanel user={user} onBack={() => setShowAdmin(false)} />
        ) : showAuth && !user ? (
          <Auth onAuthSuccess={() => { setShowAuth(false); checkUserAndRole(); fetchCars(); }} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            
            {/* Филтър панел */}
                        <FilterPanel 
              cars={cars} allCarsCount={allCarsCount} resetFilters={resetFilters}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              quickCondition={quickCondition} setQuickCondition={setQuickCondition}
              filterBrand={filterBrand} setFilterBrand={setFilterBrand}
              filterFuel={filterFuel} setFilterFuel={setFilterFuel}
              filterGearbox={filterGearbox} setFilterGearbox={setFilterGearbox}
              filterLocation={filterLocation} setFilterLocation={setFilterLocation}
              filterVat={filterVat} setFilterVat={setFilterVat}
              filterColor={filterColor} setFilterColor={setFilterColor}
              filterEuroClass={filterEuroClass} setFilterEuroClass={setFilterEuroClass}
              filterBodyType={filterBodyType} setFilterBodyType={setFilterBodyType}
              filterSource={filterSource} setFilterSource={setFilterSource}
              filterAuctionType={filterAuctionType} setFilterAuctionType={setFilterAuctionType}
              filterMinYear={filterMinYear} filterMaxYear={filterMaxYear}
              filterMinMileage={filterMinMileage} filterMaxMileage={filterMaxMileage}
              filterMinPower={filterMinPower} filterMaxPower={filterMaxPower}
              filterMinPrice={filterMinPrice} filterMaxPrice={filterMaxPrice}
              // ЕТО ТЕЗИ 4 РЕДА СЕ ДОБАВЯТ ЗА РАБОТАТА НА БУТОНИТЕ:
              activeTab={activeTab} setActiveTab={setActiveTab}
              powerUnit={powerUnit} setPowerUnit={setPowerUnit}
            />

            {/* Списък с хоризонтални коли */}
            <VehicleRow cars={cars} loading={loading} setShowAuth={setShowAuth} />

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
