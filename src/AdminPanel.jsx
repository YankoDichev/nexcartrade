import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminPanel({ user, onBack }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [dealers, setDealers] = useState([]);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [buyNowPrice, setBuyNowPrice] = useState('');
  const [status, setStatus] = useState('available');
  const [imageUrl, setImageUrl] = useState('');

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
      } else {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    const fetchDealers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'standard_user');
      if (!error) setDealers(data);
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
    const { error } = await supabase.from('cars').insert([
      {
        title,
        brand,
        model,
        year: parseInt(year),
        price: parseFloat(price),
        buy_now_price: buyNowPrice ? parseFloat(buyNowPrice) : null,
        status,
        images: imageUrl ? [imageUrl] : []
      }
    ]);

    if (error) {
      alert('Грешка при добавяне на кола: ' + error.message);
    } else {
      alert('Автомобилът е добавен успешно в NexCarTrade!');
      setTitle(''); setBrand(''); setModel(''); setYear(''); setPrice(''); setBuyNowPrice(''); setImageUrl('');
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
        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4 text-white">Публикуване на автомобил / Лот</h3>
          <form onSubmit={handleAddCar} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-400 mb-1">Заглавие на обявата</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="напр. Audi A6 3.0 TDI" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Марка</label>
                <input type="text" required value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Модел</label>
                <input type="text" required value={model} onChange={e => setModel(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Година</label>
                <input type="number" required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Стартова цена (€)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Buy Now цена (€)</label>
                <input type="number" value={buyNowPrice} onChange={e => setBuyNowPrice(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="Опционално" />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Тип продажба (Статус)</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none">
                <option value="available">Купи веднага</option>
                <option value="auction_active">Аукцион на живо</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Линк към снимка на автомобила (URL)</label>
              <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white outline-none" placeholder="Постави линк от интернет" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl transition-colors">Качи в портала</button>
          </form>
        </div>

        <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4 text-white">Чакащи одобрение B2B дилъри</h3>
          {dealers.length === 0 ? (
            <p className="text-gray-500 text-sm">В момента няма нови фирми за одобряване.</p>
          ) : (
            <div className="space-y-4">
              {dealers.map(dealer => (
                <div key={dealer.id} className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white">{dealer.company_name || 'Няма име на фирма'}</p>
                    <p className="text-xs text-gray-400">ДДС / ЕИК: {dealer.vat_number || 'Липсва'}</p>
                    <p className="text-xs text-gray-500">{dealer.email}</p>
                  </div>
                  <button onClick={() => approveDealer(dealer.id)} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors">Одобри Дилър</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
