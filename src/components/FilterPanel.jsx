import React from 'react';

export default function FilterPanel({
  cars, allCarsCount, resetFilters, searchQuery, setSearchQuery,
  quickCondition, setQuickCondition, filterBrand, setFilterBrand,
  filterFuel, setFilterFuel, filterGearbox, setFilterGearbox,
  filterLocation, setFilterLocation, filterVat, setFilterVat,
  filterColor, setFilterColor, filterEuroClass, setFilterEuroClass,
  filterBodyType, setFilterBodyType, filterSource, setFilterSource,
  filterAuctionType, setFilterAuctionType,
  filterMinYear, setFilterMinYear, filterMaxYear, setFilterMaxYear,
  filterMinMileage, setFilterMinMileage, filterMaxMileage, setFilterMaxMileage,
  filterMinPower, setFilterMinPower, filterMaxPower, setFilterMaxPower,
  filterMinPrice, setFilterMinPrice, filterMaxPrice, setFilterMaxPrice,
  activeTab, setActiveTab, powerUnit, setPowerUnit
}) {
  // Динамично изчисляване на бройките директно от базата данни
  const countNormal = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Normal' || !c.damage_status).length : 0;
  const countDamaged = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Damaged').length : 0;
  const countTech = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Technical issues').length : 0;

  return (
    <aside className="w-full lg:w-[320px] bg-gray-950 border border-gray-800 rounded-xl p-4 sticky top-[88px] max-h-[85vh] overflow-y-auto flex flex-col justify-between custom-scrollbar text-xs text-gray-300 shadow-xl">
      <div>
        <div className="text-[12px] font-black uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
          <span>🔍</span> Q SEARCH
        </div>

        {/* Работещи бутони AUCTIONS / VEHICLES в брандово синьо */}
        <div className="grid grid-cols-2 gap-1 bg-gray-900 border border-gray-800 p-1 rounded-lg mb-4 text-[11px] font-bold text-center">
          <button type="button" onClick={() => setActiveTab('AUCTIONS')} className={`py-1.5 rounded-md transition-all ${activeTab === 'AUCTIONS' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}>AUCTIONS</button>
          <button type="button" onClick={() => setActiveTab('VEHICLES')} className={`py-1.5 rounded-md transition-all ${activeTab === 'VEHICLES' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}>VEHICLES</button>
        </div>

        <div className="mb-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-[11px] text-white outline-none focus:border-blue-500 font-medium placeholder-gray-600" placeholder="Unit Nº, VIN, make, model..." />
        </div>

        {/* Чекбоксове за бързо състояние */}
        <div className="space-y-2 mb-5 text-[11px] font-bold text-gray-400 border-b border-gray-800 pb-4">
          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Normal' ? '' : 'Normal')} className="w-full flex items-center justify-between py-1 hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-2.5">
              <input type="checkbox" checked={quickCondition === 'Normal'} readOnly className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4" />
              <span>Normal / Vehicles</span>
            </span>
            <span className="font-mono text-gray-500 text-[10px] bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">{countNormal}</span>
          </button>
          
          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Damaged' ? '' : 'Damaged')} className="w-full flex items-center justify-between py-1 hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-2.5">
              <input type="checkbox" checked={quickCondition === 'Damaged'} readOnly className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4" />
              <span>Damaged</span>
            </span>
            <span className="font-mono text-gray-500 text-[10px] bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">{countDamaged}</span>
          </button>

          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Technical issues' ? '' : 'Technical issues')} className="w-full flex items-center justify-between py-1 hover:text-blue-400 transition-colors">
            <span className="flex items-center gap-2.5">
              <input type="checkbox" checked={quickCondition === 'Technical issues'} readOnly className="rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4" />
              <span>Technical issues</span>
            </span>
            <span className="font-mono text-gray-500 text-[10px] bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">{countTech}</span>
          </button>
        </div>
        <div className="space-y-4 text-[11px] font-bold text-gray-300">
          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Make & Model</label>
            <input type="text" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-medium" placeholder="Type Make..." />
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">First registration</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={filterMinYear} onChange={(e) => setFilterMinYear(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="From" />
              <input type="number" value={filterMaxYear} onChange={(e) => setFilterMaxYear(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="To" />
            </div>
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Mileage (km)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={filterMinMileage} onChange={(e) => setFilterMinMileage(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="From" />
              <input type="number" value={filterMaxMileage} onChange={(e) => setFilterMaxMileage(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="To" />
            </div>
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="Min" />
              <input type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder="Max" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block uppercase tracking-wider text-[10px] text-gray-500">Power</label>
              <div className="flex bg-gray-900 border border-gray-800 p-0.5 rounded-md text-[9px] font-black">
                <button type="button" onClick={() => setPowerUnit('KW')} className={`px-2 py-0.5 rounded-md transition-all ${powerUnit === 'KW' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>KW</button>
                <button type="button" onClick={() => setPowerUnit('HP')} className={`px-2 py-0.5 rounded-md transition-all ${powerUnit === 'HP' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500'}`}>HP</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={filterMinPower} onChange={(e) => setFilterMinPower(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder={powerUnit === 'HP' ? "Min HP" : "Min KW"} />
              <input type="number" value={filterMaxPower} onChange={(e) => setFilterMaxPower(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-lg p-2 outline-none focus:border-blue-500 text-center font-medium text-xs text-white" placeholder={powerUnit === 'HP' ? "Max HP" : "Max KW"} />
            </div>
          </div>
          {/* Менюта с изчистена синя линия на NexCarTrade */}
          <div className="space-y-1 pt-2 border-t border-gray-800/60 mt-4">
            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Fuel</span>
              <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Fuels</option>
                <option value="Diesel" className="bg-gray-950 text-white">Diesel</option>
                <option value="Petrol" className="bg-gray-950 text-white">Petrol</option>
                <option value="Hybrid" className="bg-gray-950 text-white">Hybrid</option>
                <option value="Electric" className="bg-gray-950 text-white">Electric</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Gearbox</span>
              <select value={filterGearbox} onChange={(e) => setFilterGearbox(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Transmissions</option>
                <option value="Automatic" className="bg-gray-950 text-white">Automatic</option>
                <option value="Manual" className="bg-gray-950 text-white">Manual</option>
                <option value="Semi-automatic" className="bg-gray-950 text-white">Semi-automatic</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Car Location</span>
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Locations</option>
                <option value="France" className="bg-gray-950 text-white">France</option>
                <option value="Belgium" className="bg-gray-950 text-white">Belgium</option>
                <option value="Germany" className="bg-gray-950 text-white">Germany</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">VAT status</span>
              <select value={filterVat} onChange={(e) => setFilterVat(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Statuses</option>
                <option value="VAT deductible" className="bg-gray-950 text-white">VAT deductible</option>
                <option value="Margin" className="bg-gray-950 text-white">Margin</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Source / Supplier</span>
              <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Suppliers</option>
                <option value="ARVAL" className="bg-gray-950 text-white">ARVAL</option>
                <option value="ALD" className="bg-gray-950 text-white">ALD Automotive</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Color</span>
              <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Colors</option>
                <option value="Black" className="bg-gray-950 text-white">Black</option>
                <option value="White" className="bg-gray-950 text-white">White</option>
                <option value="Grey" className="bg-gray-950 text-white">Grey</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-800/60 py-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Body type</span>
              <select value={filterBodyType} onChange={(e) => setFilterBodyType(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-white pt-1 cursor-pointer appearance-none">
                <option value="" className="bg-gray-950 text-white">All Bodies</option>
                <option value="Saloon" className="bg-gray-950 text-white">Saloon (Седан)</option>
                <option value="Estate Car" className="bg-gray-950 text-white">Estate Car (Комби)</option>
                <option value="SUV/Off-road Vehicle" className="bg-gray-950 text-white">SUV</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Огромният красив корпоративно СИН БУТОН на дъното */}
      <div className="mt-5 pt-3 border-t border-gray-800/60 flex-shrink-0">
        <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all text-center active:scale-98">
          Show {cars.length} Vehicles
        </button>
        <button type="button" onClick={resetFilters} className="w-full text-center text-[10px] text-gray-500 font-bold mt-3 hover:text-blue-500 transition-colors flex items-center justify-center gap-1">
          🔄 Reset filter
        </button>
      </div>
    </aside>
  );
}
