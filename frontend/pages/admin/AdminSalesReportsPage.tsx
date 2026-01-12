import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, ChevronLeft, ChevronRight, Calendar} from 'lucide-react';

const AdminSalesReportsPage: React.FC = () => {
  const { token } = useAuth();
  const [rawData, setRawData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchSalesData = useCallback(async (from: string, to: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getSalesReports(token, { dateFrom: from, dateTo: to });
      const finalData = Array.isArray(response) ? response : (response.items || []);
      setRawData(finalData);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Gagal memuat data penjualan. Pastikan endpoint API sudah benar.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSalesData(dateFrom, dateTo);
  }, [fetchSalesData]);
  const totalRevenue = useMemo(() => rawData.reduce((sum, item) => sum + (Number(item.total) || 0), 0), [rawData]);
  const totalQty = useMemo(() => rawData.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0), [rawData]);

  const totalPages = Math.ceil(rawData.length / itemsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rawData.slice(start, start + itemsPerPage);
  }, [currentPage, rawData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("OLDMARKETJKT - SALES REPORT", 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['No', 'Nama Product', 'Unit Price', 'Unit Sold', 'Sub Total']],
      body: rawData.map((item, index) => [
        index + 1,
        item.productName, 
        `Rp ${Number(item.price).toLocaleString('id-ID')}`,
        item.quantity, 
        `Rp ${Number(item.total).toLocaleString('id-ID')}`
      ]),
      foot: [['', 'TOTAL', '', totalQty, `Rp ${totalRevenue.toLocaleString('id-ID')}`]],
      theme: 'grid',
    });
    doc.save(`Sales_Report.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Reports</h1>
        <Button onClick={handleExportPDF} className="bg-blue-600 text-white flex gap-2">
          <Download size={18} /> PDF
        </Button>
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Dari" name="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <FormField label="Sampai" name="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <Button onClick={() => fetchSalesData(dateFrom, dateTo)} variant="primary" className="h-[42px] mt-4">
          <Calendar size={18} className="mr-2" /> Terapkan
        </Button>
      </div>

      {/* Tabel Utama */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col flex-grow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama Product</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Unit Sold</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Sub Total</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTableData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {item.productName}
                </td>
                <td className="px-6 py-4 text-sm text-right font-medium">
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-sm text-center font-bold text-blue-700">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-green-600">
                  Rp {item.total.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t flex justify-between bg-gray-50 items-center px-8">
          <p className="text-sm text-gray-500 font-medium">Hal {currentPage} / {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 border rounded bg-white disabled:opacity-30"><ChevronLeft size={20}/></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 border rounded bg-white disabled:opacity-30"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* Grand Total*/}
        <div className="bg-gray-900 text-white p-6 grid grid-cols-2">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">Total Unit Terjual</p>
            <p className="text-2xl font-bold">{totalQty} Unit</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs font-bold uppercase">Grand Total Pendapatan</p>
            <p className="text-3xl font-black text-green-400">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesReportsPage;