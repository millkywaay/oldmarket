
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SalesDataPoint } from '../../types';

interface SalesChartProps {
  data: SalesDataPoint[]; // Example: { date: 'Jan', revenue: 4000, orders: 20 }
  type?: 'bar' | 'line';
  title?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, type = 'bar', title = "Sales Overview" }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No sales data available to display.</div>;
  }

  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis yAxisId="left" orientation="left" stroke="#1D4ED8" label={{ value: 'Revenue (IDR)', angle: -90, position: 'insideLeft', fill:"#1D4ED8" }}/>
          <YAxis yAxisId="right" orientation="right" stroke="#10B981" label={{ value: 'Orders', angle: -90, position: 'insideRight', fill:"#10B981" }}/>
          <Tooltip formatter={(value: number, name: string) => {
            if (name === 'revenue') return [`${value.toLocaleString('id-ID')} IDR`, 'Revenue'];
            if (name === 'orders') return [value, 'Orders'];
            return [value, name];
          }}/>
          <Legend />
          {type === 'bar' ? (
            <>
              <Bar yAxisId="left" dataKey="revenue" fill="#1D4ED8" name="Revenue" />
              <Bar yAxisId="right" dataKey="orders" fill="#10B981" name="Orders" />
            </>
          ) : (
            <>
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#1D4ED8" activeDot={{ r: 8 }} name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10B981" name="Orders" />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
