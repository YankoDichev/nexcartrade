import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth({ onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      // Регистрация на нов дилър
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (data.user) {
        // Записваме данните за фирмата в профила
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ company_name: companyName, vat_number: vatNumber })
          .eq('id', data.user.id);
        
        if (profileError) console.error(profileError.message);
        alert('Регистрацията е успешна! Можете да влезете в профила си.');
        setIsSignUp(false);
      }
    } else {
      // Вход в системата
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        onAuthSuccess();
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-gray-950 border border-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">
        {isSignUp ? 'Регистрация на B2B Дилър' : 'Вход в NexCarTrade'}
      </h2>
      
      {error && <div className="bg-red-500/10 border border-red-505 text-red-400 p-3 rounded-xl text-sm mb-4">{error}</div>}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Имейл адрес</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">Парола</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" />
        </div>

        {isSignUp && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Име на фирмата</label>
              <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">ДДС / ЕИК Номер</label>
              <input type="text" required value={vatNumber} onChange={e => setVatNumber(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl transition-colors text-sm">
          {loading ? 'Зареждане...' : isSignUp ? 'Създай акаунт' : 'Влез в портала'}
        </button>
      </form>

      <div className="text-center mt-6">
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-blue-450 hover:underline">
          {isSignUp ? 'Вече имате дилърски профил? Влезте тук' : 'Нямате акаунт? Регистрирайте фирмата си тук'}
        </button>
      </div>
    </div>
  );
}
