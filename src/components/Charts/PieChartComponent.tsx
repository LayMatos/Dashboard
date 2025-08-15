import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartComponentProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
  width?: number;
  height?: number;
  title?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
  name
}: any) => {
  // Só mostra o label se o valor for maior que zero
  if (value === 0) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g className="recharts-layer">
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-medium select-none"
        style={{ 
          fontSize: '14px', 
          fontWeight: 'bold',
          textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease'
        }}
      >
        {value}
      </text>
    </g>
  );
};

const renderLegendText = (value: string, entry: any) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4" 
        style={{ backgroundColor: entry.color }}
      ></div>
      <span className="text-gray-700 text-sm">
        {value}
      </span>
    </div>
  );
};

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  colors,
  width = 250,
  height = 300,
  title
}) => {
  const allData = data;
  const allColors = colors;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}
      <div className="relative" style={{ width, height, marginTop: '20px' }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 40, right: 40, bottom: 60, left: 0 }}>
            <Pie
              data={allData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={0}
              outerRadius={85}
              fill="#8884d8"
              paddingAngle={3}
              labelLine={false}
              label={renderCustomizedLabel}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              minAngle={0}
            >
              {allData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={allColors[index]}
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                  style={{
                    filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.2))',
                    opacity: entry.value === 0 ? 0.3 : 1
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} unidades`, 'Quantidade']}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '12px',
                transition: 'all 0.2s ease'
              }}
              itemStyle={{
                color: '#374151',
                fontSize: '14px',
                fontWeight: 500,
                padding: '4px 0'
              }}
              cursor={{ fill: 'transparent' }}
              wrapperStyle={{
                outline: 'none'
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px'
              }}
              formatter={renderLegendText}
              iconType="plainline"
              iconSize={0}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-gray-500">
        Total: {allData.reduce((sum, item) => sum + item.value, 0)} unidades
      </div>
    </div>
  );
}; 