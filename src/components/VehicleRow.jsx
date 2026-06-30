import React, { useEffect, useState } from 'react';

function CountdownTimer({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(expiryDate) - new Date();
      if (difference <= 0) { setTimeLeft('00h 00m 00s'); return; }
      const hours = Math.floor((difference / (1000 * 60 * 60)));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <div className="text-right">
      <span className="text-gray-400 text-[11px] block uppercase tracking-wider font-semibold">Time left (Closing soon):</span>
      <span className="text-[#e53935] font-mono font-black text-sm">{timeLeft}</span>
    </div>
  );
}

function CountryFlag({ location }) {
  const flags = { 'France': '🇫🇷', 'Belgium': '🇧🇪', 'Germany': '🇩🇪', 'Netherlands': '🇳🇱', 'Italy': '🇮🇹' };
  return <span className="text-lg" title={location}>{flags[location] || '🌐'}</span>;
}

export default function VehicleRow({ cars, loading, setShowAuth }) {
  const groupedLots = cars.reduce((acc, car) => {
    const lotName = car.lot_name || "Individual Vehicles";
    if (!acc[lotName]) {
      acc[lotName] = {
        name: lotName,
        supplier: car.source_supplier || car.supplier_name || "NexCarTrade",
        type: car.lot_type || "Auctions",
        closingDate: car.lot_closing_date || car.closed_at,
        vehicles: []
      };
    }
    acc[lotName].vehicles.push(car);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-1">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (Object.keys(groupedLots).length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-12 text-center shadow-2xs flex-1 text-gray-500">
        <h3 className="text-base font-bold">No vehicles match your search criteria</h3>
      </div>
    );
  }
  return (
    <div className="flex-1 w-full space-y-4">
      {Object.values(groupedLots).map((lot) => (
        <div key={lot.name} className="space-y-3">
          
          {/* Малка и изчистена eCarsTrade индикация за лот */}
          <div className="flex justify-between items-center px-2 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
            <div>SEARCH RESULTS ({lot.vehicles.length} VEHICLES)</div>
            {lot.closingDate && <CountdownTimer expiryDate={lot.closingDate} />}
          </div>

          {/* Самите хоризонтални бели карти с остри ръбове */}
          <div className="space-y-3">
            {lot.vehicles.map((car) => (
              <div key={car.id} className="bg-white border border-gray-200 rounded-xs p-4 flex flex-col md:flex-row gap-5 items-center hover:shadow-md transition-all relative">
                
                {/* Снимка с точен мащаб */}
                <div className="w-full md:w-[160px] h-[100px] bg-gray-100 border border-gray-200 flex-shrink-0 relative rounded-sm overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold">NO IMAGE</div>
                  )}
                </div>

                {/* Централна текстова част */}
                <div className="flex-1 w-full text-left space-y-1">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    {lot.name} • {car.body_type || 'SUV'}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                    {car.title}
                  </h3>
                  
                  {/* Технически детайли в една линия със сив цвят */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-500 font-medium">
                    <span>📅 {car.year}</span>
                    <span>🛣️ {car.mileage ? Number(car.mileage).toLocaleString() : 0} km</span>
                    <span>⛽ {car.fuel_type || 'Diesel'}</span>
                    <span>⚙️ {car.gearbox || 'Automatic'}</span>
                    {car.power && <span>🐎 {car.power} HP</span>}
                  </div>

                  {/* Знаме на държавата и ДДС режим долу */}
                  <div className="pt-2 flex items-center space-x-3 text-[11px] font-bold">
                    <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-sm">
                      <CountryFlag location={car.location} />
                      <span className="text-gray-600 font-medium text-[10px] uppercase">{car.location}</span>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-sm text-[10px] font-black uppercase">
                      {car.vat_status || 'VAT deductible'}
                    </span>
                  </div>
                </div>

                {/* Секция за цени и бутони вдясно */}
                <div className="w-full md:w-[200px] border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 flex flex-col justify-center items-center md:items-end flex-shrink-0">
                  {car.price ? (
                    <div className="w-full text-center md:text-right space-y-1.5">
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Bid</div>
                      <div className="text-xl font-black text-gray-900">{Number(car.price).toLocaleString()} €</div>
                      <button className="w-full bg-[#0052cc] hover:bg-[#0043a4] text-white font-black py-2 rounded-md text-xs uppercase tracking-wider transition-all shadow-2xs">
                        Place Bid
                      </button>
                    </div>
                  ) : (
                    <div className="w-full text-center md:text-right">
                      <button 
                        onClick={() => setShowAuth(true)} 
                        className="w-full bg-[#e53935] hover:bg-[#d32f2f] text-white font-black py-2.5 rounded-md text-xs uppercase tracking-wider transition-all shadow-xs"
                      >
                        Sign in to buy
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
