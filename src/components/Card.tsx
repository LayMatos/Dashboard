import React from 'react';
import { CardProps } from '../types/sgpm';

const Card: React.FC<CardProps> = ({ titulo, valor }) => (
  <div className="bg-white rounded-lg shadow-md p-4 m-2">
    <h3 className="text-lg font-semibold text-gray-700">{titulo}</h3>
    <p className="text-2xl font-bold text-blue-600">{valor}</p>
  </div>
);

export default Card; 