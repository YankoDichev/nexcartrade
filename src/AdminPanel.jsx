import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminPanel({ user, onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [dealers, setDealers] = useState([]);
  const [lots, setLots] = useState([]); // Списък с наличните лотове от базата данни

  // СТЕЙТОВЕ ЗА ФОРМАТА ЗА КАЧВАНЕ НА КОЛА
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [buyNowPrice, setBuyNowPrice] = useState('');
  const [status, setStatus] = useState('available');
  const [imageUrl, setImageUrl] = useState('');
  
  // НОВИТЕ СТЕЙТОВЕ ПО МОДЕЛА НА ECARSTRADE
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [gearbox, setGearbox] = useState('Automatic');
  const [location, setLocation] = useState('Belgium');
  const [vatStatus, setVatStatus] = useState('VAT deductible');
  const [color, setColor] = useState('Black');
  const [euroClass, setEuroClass] = useState('Euro 6');
  const [bodyType, setBodyType] = useState('Sedan');
  const [power, setPower] = useState('');
  const [co2, setCo2] = useState('');
  const [damageStatus, setDamageStatus] = useState('Normal');
  const [selectedLotId, setSelectedLotId] = useState('');

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && (data.role === 'super_admin' || data.role === 'admin')) {
        setIsAdmin(true);
        fetchDealers();
        fetchLots();
      } else {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    const fetchDealers = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'standard_user');
      if (data) setDealers(data);
    };

    const fetchLots = async () => {
      const { data } = await supabase.from('lots').select('*');
      if (data) setLots(data);
    };

    checkAdminRole();
  }, [user]);
  const approveDealer = async (dealerId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'dealer_b2b' })
      .eq('id', dealerId);

    if (error) {
      alert('Грешка при одобряване: ' + error.message);
    } else {
      alert('Дилърът е одобрен успешно! Вече ще вижда цените.');
      setDealers(dealers.filter(d => d.id !== dealerId));
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    
    // Подготвяме данните за вмъкване, съвпадащи на 100% с новата структура на eCarsTrade
    const { error } = await supabase.from('cars').insert([
      {
        title,
        brand,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        buy_now_price: buyNowPrice ? parseFloat(buyNowPrice) : null,
        status,
        images: imageUrl ? [imageUrl] : [],
        // НОВИТЕ ДОБАВЕНИ ПОЛЕТА ОТ ЗАДАЧА А:
        mileage: mileage ? parseInt(mileage) : 0,
        fuel_type: fuelType,
        gearbox: gearbox,
        location: location,
        vat_status: vatStatus,
        color: color,
        emission_class: euroClass,
        body_type: bodyType,
        power: power ? parseInt(power) : null,
        co2_emissions: co2 ? parseInt(co2) : null,
        damage_status: damageStatus,
        lot_id: selectedLotId ? selectedLotId : null
      }
    ]);

    if (error) {
      alert('Грешка при добавяне на кола: ' + error.message);
    } else {
      alert('Автомобилът е добавен успешно в NexCarTrade с всички спецификации!');
      
      // Напълно изчистване на формата след успешно качване
      setTitle(''); setBrand(''); setModel(''); setYear(''); setPrice(''); setBuyNowPrice('');
      setImageUrl(''); setMileage(''); setPower(''); setCo2(''); setSelectedLotId('');
    }
  };

  if (checking) return <div className="text-center p-12 text-gray-400">Проверка на администраторски права...</div>;
  if (!isAdmin) return <div className="text-center p-12 text-red-400 font-bold">Нямате достъп до тази страница!</div>;
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-3xl font-extrabold text-blue-400">Панел за управление (NexCarTrade)</h2>
        <button onClick={onBack} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm">Назад към каталога</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Форма за качване на нови автомобили с разширени полета */}
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4 text-white">Публикуване на автомобил / Лот</h3>
          <form onSubmit={handleAddCar} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-400 mb-1">Заглавие на обявата</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="напр. Audi A6 3.0 TDI" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Марка</label>
                <input type="text" required value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Модел</label>
                <input type="text" required value={model} onChange={e => setModel(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Година</label>
                <input type="number" required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Пробег (mileage км)</label>
                <input type="number" required value={mileage} onChange={e => setMileage(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Мощност (к.с.)</label>
                <input type="number" value={power} onChange={e => setPower(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Стартова цена (€)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Buy Now цена (€)</label>
                <input type="number" value={buyNowPrice} onChange={e => setBuyNowPrice(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="Опционално" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">CO2 Емисии (g)</label>
                <input type="number" value={co2} onChange={e => setCo2(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">⛽ Гориво (Fuel)</label>
                <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">⚙️ Скоростна кутия</label>
                <select value={gearbox} onChange={e => setGearbox(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">🌐 Локация (Location)</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Belgium">Belgium</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Italy">Italy</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">% ДДС Статус (VAT)</label>
                <select value={vatStatus} onChange={e => setVatStatus(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="VAT deductible">VAT deductible (С право на ДДС)</option>
                  <option value="Margin">Margin (Марж - без ДДС)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">💧 Цвят</label>
                <select value={color} onChange={e => setColor(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Black">Black</option><option value="White">White</option><option value="Grey">Grey</option>
                  <option value="Silver">Silver</option><option value="Blue">Blue</option><option value="Red">Red</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">☁️ Емисии Евро</label>
                <select value={euroClass} onChange={e => setEuroClass(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Euro 6">Euro 6</option>
                  <option value="Euro 5">Euro 5</option>
                  <option value="Euro 4">Euro 4</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">🚘 Тип Каросерия</label>
                <select value={bodyType} onChange={e => setBodyType(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Sedan">Sedan</option>
                  <option value="Station Wagon">Avant / Kombi</option>
                  <option value="SUV">SUV / Offroad</option>
                  <option value="Van">Van / Minibus</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">💥 Състояние (Condition)</label>
                <select value={damageStatus} onChange={e => setDamageStatus(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="Normal">Здрав автомобил (Normal)</option>
                  <option value="Damaged">Повреден / Ударен (Damaged)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Тип продажба (Статус)</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="available">Купи веднага (Fixed Price)</option>
                  <option value="auction_active">Аукцион на живо</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">📦 Избор на Лот / Аукционен канал</label>
                <select value={selectedLotId} onChange={e => setSelectedLotId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                  <option value="">Индивидуална обява (Без лот)</option>
                  {lots.map(lot => (
                    <option key={lot.id} value={lot.id}>{lot.name} ({lot.supplier_name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Линк към снимка на автомобила (URL)</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="Постави линк към изображение" />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl transition-colors shadow-lg uppercase tracking-wider text-xs">Качи в портала NexCarTrade</button>
          </form>
        </div>

        {/* Списък с дилъри, чакащи одобрение на фирмата */}
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 max-h-[600px] overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold mb-4 text-white">Чакащи одобрение B2B дилъри</h3>
          {dealers.length === 0 ? (
            <p className="text-gray-500 text-sm">В момента няма нови фирми за одобряване.</p>
          ) : (
            <div className="space-y-4">
              {dealers.map(dealer => (
                <div key={dealer.id} className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center shadow">
                  <div>
                    <p className="font-bold text-white text-sm">{dealer.company_name || 'Няма име на фирма'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ДДС / ЕИК: {dealer.vat_number || 'Липсва'}</p>
                    <p className="text-[11px] text-gray-500 font-mono">{dealer.email}</p>
                  </div>
                  <button onClick={() => approveDealer(dealer.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow">Одобри Дилър</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
