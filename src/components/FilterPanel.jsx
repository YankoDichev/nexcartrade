import React, { useState } from 'react';

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
  filterMinPrice, setFilterMinPrice, filterMaxPrice, setFilterMaxPrice
}) {
  const [activeTab, setActiveTab] = useState('AUCTIONS');
  const [powerUnit, setPowerUnit] = useState('HP');

  const countNormal = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Normal' || !c.damage_status).length : 0;
  const countDamaged = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Damaged').length : 0;
  const countTech = allCarsCount ? allCarsCount.filter(c => c.damage_status === 'Technical issues').length : 0;

  return (
    <aside className="w-full lg:w-[280px] bg-transparent text-gray-800 p-2 sticky top-[88px] max-h-[85vh] overflow-y-auto flex flex-col justify-between custom-scrollbar text-xs">
      <div>
        <div className="text-[13px] font-black uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
          <span>🔍</span> Q SEARCH
        </div>

        <div className="grid grid-cols-2 gap-0.5 bg-gray-200 p-0.5 rounded-sm mb-4 text-[11px] font-bold text-center">
          <button type="button" onClick={() => setActiveTab('AUCTIONS')} className={`py-1.5 rounded-xs transition-all ${activeTab === 'AUCTIONS' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'}`}>AUCTIONS</button>
          <button type="button" onClick={() => setActiveTab('VEHICLES')} className={`py-1.5 rounded-xs transition-all ${activeTab === 'VEHICLES' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-500'}`}>VEHICLES</button>
        </div>

        <div className="mb-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-350 rounded-xs p-2 text-[11px] text-gray-900 outline-none focus:border-gray-500 font-medium placeholder-gray-400 shadow-3xs" placeholder="Unit Nº, VIN, make, model..." />
        </div>

        <div className="space-y-1 mb-5 text-[11px] font-bold text-gray-700">
          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Normal' ? '' : 'Normal')} className="w-full flex items-center justify-between py-1.5 hover:text-blue-600 transition-colors">
            <span className="flex items-center gap-2">
              <input type="checkbox" checked={quickCondition === 'Normal'} readOnly className="rounded-xs border-gray-400 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
              <span>Normal / Vehicles</span>
            </span>
            <span className="font-mono text-gray-400 text-[10px]">{countNormal}</span>
          </button>
          
          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Damaged' ? '' : 'Damaged')} className="w-full flex items-center justify-between py-1.5 hover:text-blue-600 transition-colors">
            <span className="flex items-center gap-2">
              <input type="checkbox" checked={quickCondition === 'Damaged'} readOnly className="rounded-xs border-gray-400 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
              <span>Damaged</span>
            </span>
            <span className="font-mono text-gray-400 text-[10px]">{countDamaged}</span>
          </button>

          <button type="button" onClick={() => setQuickCondition(quickCondition === 'Technical issues' ? '' : 'Technical issues')} className="w-full flex items-center justify-between py-1.5 hover:text-blue-600 transition-colors">
            <span className="flex items-center gap-2">
              <input type="checkbox" checked={quickCondition === 'Technical issues'} readOnly className="rounded-xs border-gray-400 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
              <span>Technical issues</span>
            </span>
            <span className="font-mono text-gray-400 text-[10px]">{countTech}</span>
          </button>
        </div>

        <div className="space-y-4 text-[11px] font-bold text-gray-900 border-t border-gray-200/60 pt-4">
          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Make & Model</label>
            <input type="text" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xs p-2 text-xs text-gray-900 outline-none focus:border-gray-500 font-medium" placeholder="Type Make..." />
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">First registration</label>
            <div className="grid grid-cols-2 gap-1.5">
              <input type="number" value={filterMinYear} onChange={(e) => setFilterMinYear(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="From" />
              <input type="number" value={filterMaxYear} onChange={(e) => setFilterMaxYear(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="To" />
            </div>
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Mileage (km)</label>
            <div className="grid grid-cols-2 gap-1.5">
              <input type="number" value={filterMinMileage} onChange={(e) => setFilterMinMileage(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="From" />
              <input type="number" value={filterMaxMileage} onChange={(e) => setFilterMaxMileage(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="To" />
            </div>
          </div>

          <div>
            <label className="block mb-1 uppercase tracking-wider text-[10px] text-gray-500">Price Range</label>
            <div className="grid grid-cols-2 gap-1.5">
              <input type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="Min" />
              <input type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder="Max" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block uppercase tracking-wider text-[10px] text-gray-500">Power</label>
              <div className="flex bg-gray-200 p-0.5 rounded-xs text-[9px] font-black">
                <button type="button" onClick={() => setPowerUnit('KW')} className={`px-1.5 py-0.5 rounded-2xs transition-all ${powerUnit === 'KW' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-400'}`}>KW</button>
                <button type="button" onClick={() => setPowerUnit('HP')} className={`px-1.5 py-0.5 rounded-2xs transition-all ${powerUnit === 'HP' ? 'bg-white text-gray-900 shadow-3xs' : 'text-gray-400'}`}>HP</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <input type="number" value={filterMinPower} onChange={(e) => setFilterMinPower(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-gray-500 text-center font-medium text-xs" placeholder={powerUnit === 'HP' ? "Min HP" : "Min KW"} />
              <input type="number" value={filterMaxPower} onChange={(e) => setFilterMaxPower(e.target.value)} className="bg-white border border-gray-300 rounded-xs p-1.5 outline-none focus:border-blue-500 text-center font-medium text-xs" placeholder={powerUnit === 'HP' ? "Max HP" : "Max KW"} />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Fuel</span>
              <select value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Fuels</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Gearbox</span>
              <select value={filterGearbox} onChange={(e) => setFilterGearbox(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-automatic">Semi-automatic</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Car Location</span>
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Locations</option>
                <option value="France">France</option>
                <option value="Belgium">Belgium</option>
                <option value="Germany">Germany</option>
                <option value="Netherlands">Netherlands</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">VAT status</span>
              <select value={filterVat} onChange={(e) => setFilterVat(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Statuses</option>
                <option value="VAT deductible">VAT deductible</option>
                <option value="Margin">Margin</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Source</span>
              <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Suppliers</option>
                <option value="ARVAL">ARVAL</option>
                <option value="ALD">ALD Automotive</option>
                <option value="Athlon">Athlon</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Color</span>
              <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Colors</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Grey">Grey</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Body type</span>
              <select value={filterBodyType} onChange={(e) => setFilterBodyType(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Bodies</option>
                <option value="Saloon">Saloon</option>
                <option value="Estate Car">Estate Car</option>
                <option value="SUV/Off-road Vehicle">SUV</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Emission class</span>
              <select value={filterEuroClass} onChange={(e) => setFilterEuroClass(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Classes</option>
                <option value="Euro6d">Euro 6d</option>
                <option value="Euro6">Euro 6</option>
              </select>
            </div>

            <div className="flex flex-col border-b border-gray-300 py-2.5">
              <span className="text-gray-400 text-[10px] uppercase tracking-wider">Auction type</span>
              <select value={filterAuctionType} onChange={(e) => setFilterAuctionType(e.target.value)} className="bg-transparent outline-none text-xs font-bold text-gray-800 pt-0.5 cursor-pointer appearance-none">
                <option value="">All Auctions</option>
                <option value="Auctions">Auctions</option>
                <option value="Fixed Prices">Fixed Prices</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-2 flex flex-col items-center">
        <button type="button" className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white font-black py-2.5 rounded-xs text-[11px] uppercase tracking-wider shadow-sm transition-all text-center">
          Show {cars.length} Vehicles
        </button>
        <button type="button" onClick={resetFilters} className="text-center text-[10px] text-gray-400 font-bold mt-2.5 hover:text-gray-600 transition-colors flex items-center gap-1">
          🔄 Reset filter
        </button>
      </div>
    </aside>
  );
}
