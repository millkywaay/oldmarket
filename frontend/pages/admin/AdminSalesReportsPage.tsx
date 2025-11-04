
import React, { useEffect, useState, useCallback } from 'react';
import { SalesDataPoint } from '../../types';
import * as adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SalesChart from '../../components/admin/SalesChart';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import { DEFAULT_CURRENCY } from '../../constants';

const AdminSalesReportsPage: React.FC = () => {
  const { token } = useAuth();
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');

  const fetchSalesData = useCallback(async (from: string, to: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getSalesReports(token, { dateFrom: from, dateTo: to });
      setSalesData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load sales reports.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(today.getDate() - 30));
    const from = thirtyDaysAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];
    setDateFrom(from);
    setDateTo(to);
    fetchSalesData(from, to);
  }, [fetchSalesData]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalesData(dateFrom, dateTo);
  };

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800">Sales Reports</h1>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      <form onSubmit={handleFilterSubmit} className="p-4 bg-white rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <FormField label="Date From:" name="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} containerClassName="w-full"/>
        <FormField label="Date To:" name="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} containerClassName="w-full"/>
        <FormField as="select" label="Chart Type:" name="chartType" value={chartType} onChange={(e) => setChartType(e.target.value as 'bar' | 'line')} containerClassName="w-full">
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </FormField>
        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full md:w-auto">Apply</Button>
      </form>

      {isLoading ? <LoadingSpinner message="Loading sales data..." /> : 
       salesData.length === 0 ? <p className="text-gray-600 text-center py-10 bg-white rounded-lg shadow-sm">No sales data found for the selected period.</p> : (
        <>
          <SalesChart data={salesData} type={chartType} title={`Sales from ${dateFrom} to ${dateTo}`} />
          
          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period/Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue ({DEFAULT_CURRENCY})</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Number of Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.revenue.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.orders}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold">
                    <tr>
                        <td className="px-6 py-4 text-left text-sm text-gray-800 uppercase">Total</td>
                        <td className="px-6 py-4 text-left text-sm text-gray-800">{totalRevenue.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-left text-sm text-gray-800">{totalOrders}</td>
                    </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSalesReportsPage;
