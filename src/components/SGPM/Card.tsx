import React from 'react';
import { CardProps } from '../../models/SGPM/types';

export const Card: React.FC<CardProps> = ({ titulo, valor }) => (
  <div className="relative w-64 h-36 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex flex-col items-center justify-center shadow-lg text-lg text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-blue-100 overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-75"></div>
    <div className="absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
    <h2 className="font-semibold text-blue-800 mb-2 relative z-10">{titulo}</h2>
    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent relative z-10">
      {typeof valor === 'number' ? valor.toLocaleString() : valor}
    </p>
  </div>
); 