import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Ruler, 
  Scale, 
  Thermometer, 
  HardDrive, 
  Gauge, 
  Coins, 
  RefreshCw 
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital' | 'speed' | 'currency';

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const CATEGORIES: { id: UnitCategory; label: string; icon: any }[] = [
    { id: 'length', label: 'Length', icon: Ruler },
    { id: 'weight', label: 'Weight / Mass', icon: Scale },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'digital', label: 'Digital Storage', icon: HardDrive },
    { id: 'speed', label: 'Speed', icon: Gauge },
    { id: 'currency', label: 'Currency', icon: Coins },
  ];

  const UNITS: Record<UnitCategory, { [unit: string]: { name: string; rate: number } }> = {
    length: {
      m: { name: 'Meters (m)', rate: 1 },
      km: { name: 'Kilometers (km)', rate: 1000 },
      cm: { name: 'Centimeters (cm)', rate: 0.01 },
      mm: { name: 'Millimeters (mm)', rate: 0.001 },
      mi: { name: 'Miles (mi)', rate: 1609.34 },
      yd: { name: 'Yards (yd)', rate: 0.9144 },
      ft: { name: 'Feet (ft)', rate: 0.3048 },
      in: { name: 'Inches (in)', rate: 0.0254 },
    },
    weight: {
      kg: { name: 'Kilograms (kg)', rate: 1 },
      g: { name: 'Grams (g)', rate: 0.001 },
      mg: { name: 'Milligrams (mg)', rate: 0.000001 },
      lb: { name: 'Pounds (lb)', rate: 0.453592 },
      oz: { name: 'Ounces (oz)', rate: 0.0283495 },
      t: { name: 'Metric Ton (t)', rate: 1000 },
    },
    digital: {
      B: { name: 'Bytes (B)', rate: 1 },
      KB: { name: 'Kilobytes (KB)', rate: 1024 },
      MB: { name: 'Megabytes (MB)', rate: 1024 ** 2 },
      GB: { name: 'Gigabytes (GB)', rate: 1024 ** 3 },
      TB: { name: 'Terabytes (TB)', rate: 1024 ** 4 },
    },
    speed: {
      mps: { name: 'Meters per second (m/s)', rate: 1 },
      kmh: { name: 'Kilometers per hour (km/h)', rate: 0.277778 },
      mph: { name: 'Miles per hour (mph)', rate: 0.44704 },
      knot: { name: 'Knots (kn)', rate: 0.514444 },
    },
    currency: {
      USD: { name: 'US Dollar ($)', rate: 1 },
      EUR: { name: 'Euro (€)', rate: 1.08 },
      GBP: { name: 'British Pound (£)', rate: 1.28 },
      INR: { name: 'Indian Rupee (₹)', rate: 0.012 },
      JPY: { name: 'Japanese Yen (¥)', rate: 0.0065 },
      CAD: { name: 'Canadian Dollar (C$)', rate: 0.74 },
      AUD: { name: 'Australian Dollar (A$)', rate: 0.65 },
    },
    temperature: {
      C: { name: 'Celsius (°C)', rate: 1 },
      F: { name: 'Fahrenheit (°F)', rate: 1 },
      K: { name: 'Kelvin (K)', rate: 1 },
    }
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const keys = Object.keys(UNITS[cat]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const calculateOutput = () => {
    if (isNaN(inputValue)) return 0;

    if (category === 'temperature') {
      let celsius = inputValue;
      if (fromUnit === 'F') celsius = (inputValue - 32) * (5 / 9);
      if (fromUnit === 'K') celsius = inputValue - 273.15;

      if (toUnit === 'C') return Number(celsius.toFixed(2));
      if (toUnit === 'F') return Number((celsius * (9 / 5) + 32).toFixed(2));
      if (toUnit === 'K') return Number((celsius + 273.15).toFixed(2));
      return celsius;
    }

    const rates = UNITS[category];
    const fromRate = rates[fromUnit]?.rate || 1;
    const toRate = rates[toUnit]?.rate || 1;

    // Convert to base then to target
    const baseVal = inputValue * fromRate;
    const result = baseVal / toRate;
    return Number(result.toFixed(4));
  };

  const outputValue = calculateOutput();

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-semibold mb-2 border border-yellow-500/20">
            <ArrowLeftRight className="w-3.5 h-3.5" /> High Precision Converter
          </div>
          <h2 className="text-2xl font-bold text-white">Smart Unit & Currency Converter</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Instant conversion for length, mass, digital storage, temperature, speed, and foreign exchange rates.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                category === cat.id
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conversion Cards Box */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* From Side */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">From</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
            className="w-full text-2xl md:text-3xl font-mono font-bold bg-transparent text-white focus:outline-none"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-yellow-500"
          >
            {Object.keys(UNITS[category]).map((k) => (
              <option key={k} value={k}>
                {UNITS[category][k].name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={swapUnits}
            title="Swap Units"
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 text-yellow-400 flex items-center justify-center transition-transform hover:rotate-180 border border-slate-700 shadow-lg cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* To Side */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-slate-950 border border-yellow-500/30 space-y-3 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
          <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider">Converted Result</label>
          <div className="w-full text-2xl md:text-3xl font-mono font-bold text-yellow-300 truncate">
            {outputValue}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-yellow-500"
          >
            {Object.keys(UNITS[category]).map((k) => (
              <option key={k} value={k}>
                {UNITS[category][k].name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
