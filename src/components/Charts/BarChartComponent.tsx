import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartComponentProps {
  data: Array<any>;
  bars: Array<{
    dataKey: string;
    fill: string;
  }>;
  height?: number;
  title?: string;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  bars,
  height = 400,
  title
}) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Calcula os totais
  const totals = bars.map(bar => ({
    name: bar.dataKey,
    value: data.reduce((sum, item) => sum + (item[bar.dataKey] || 0), 0),
    color: bar.fill
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.name}: <span className="font-semibold">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleLegendMouseEnter = (e: any) => {
    if (e && e.dataKey) {
      setHoveredBar(e.dataKey);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      {title && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-500">
            Visualização detalhada por cidade
          </p>
        </div>
      )}
      
      {/* Totais */}
      <div className="flex justify-center gap-6 mb-8">
        {totals.map((total, index) => (
          <div 
            key={index}
            className="flex-1 max-w-[200px] text-center px-6 py-4 bg-gray-50 rounded-xl border border-gray-100 
                     shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-200
                     transform hover:-translate-y-1"
            onMouseEnter={() => setHoveredBar(total.name)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <p className="text-sm text-gray-600 mb-2">Total de {total.name}</p>
            <p 
              className="text-3xl font-bold transition-all duration-300"
              style={{ 
                color: total.color,
                textShadow: hoveredBar === total.name ? '0 0 20px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {total.value}
            </p>
          </div>
        ))}
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart 
            data={data} 
            margin={{ top: 30, right: 20, bottom: 70, left: 20 }}
            className="transition-all duration-300"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E5E7EB"
              opacity={0.5}
            />
            <XAxis
              dataKey="nome_cidade"
              angle={-45}
              textAnchor="end"
              interval={0}
              tickMargin={25}
              height={60}
              tick={{
                fill: '#4B5563',
                fontSize: 11,
                fontWeight: 500,
                width: 100,
                style: {
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  width: '100px',
                  maxWidth: '150px',
                  lineHeight: '1.2em'
                },
              }}
            />
            <YAxis 
              tick={{
                fill: '#4B5563',
                fontSize: 12,
                fontWeight: 500
              }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                fill: 'rgba(229, 231, 235, 0.3)',
                radius: 4
              }}
            />
            <Legend 
              verticalAlign="top" 
              align="center"
              height={36}
              wrapperStyle={{
                paddingBottom: '20px',
                fontSize: '14px'
              }}
              formatter={(value) => (
                <span className={`text-gray-700 font-medium transition-all duration-300
                  ${hoveredBar === value ? 'text-blue-600' : ''}`}>
                  {value}
                </span>
              )}
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={() => setHoveredBar(null)}
            />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                fill={bar.fill}
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredBar(bar.dataKey)}
                onMouseLeave={() => setHoveredBar(null)}
                label={{
                  position: 'top',
                  fill: '#4B5563',
                  fontSize: 11,
                  fontWeight: '500'
                }}
                style={{
                  filter: hoveredBar === bar.dataKey ? 
                    'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' : 
                    'none',
                  opacity: hoveredBar && hoveredBar !== bar.dataKey ? 0.7 : 1
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 