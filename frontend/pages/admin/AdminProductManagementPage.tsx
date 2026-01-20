import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Product, Brand } from "../../types";
import * as productService from "../../services/productService";
import * as adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import { DEFAULT_CURRENCY } from "../../constants";
import { Edit, Trash, Plus, Search, Filter, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"; 
import { ProductImage } from "@/types/product";
import { swalService } from "../../services/swalService";

const AdminProductManagementPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsData, brandsResponse] = await Promise.all([
        productService.getAllProducts(),
        productService.getBrands(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      let brandsList: Brand[] = [];
      if (Array.isArray(brandsResponse)) {
        brandsList = brandsResponse;
      } else if (brandsResponse && typeof brandsResponse === "object" && "brands" in brandsResponse) {
        brandsList = (brandsResponse as any).brands;
      }
      setBrands(brandsList);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; 
    }
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === "" || p.brand_id?.toString() === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const valA = Number(a[sortConfig.key as keyof Product]) || 0;
        const valB = Number(b[sortConfig.key as keyof Product]) || 0;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, selectedBrand, sortConfig]);

  const handleDelete = async (id: string) => {
    if (!token) {
      swalService.error('Akses Ditolak', 'Sesi Anda telah habis, silakan login kembali.');
      return;
    }
    const isConfirmed = await swalService.confirm('Hapus Produk?', 'Produk akan dihapus permanen.');
    if (isConfirmed) {
      try {
        await adminService.deleteProduct(token, id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        swalService.success('Berhasil!', 'Produk telah dihapus.');
      } catch (err: any) {
        swalService.error('Gagal!', err.message || 'Tidak dapat menghapus produk.');
      }
    }
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key || !sortConfig.direction) return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="ml-1 text-blue-600" /> 
      : <ChevronDown size={14} className="ml-1 text-blue-600" />;
  };

  if (isLoading) return <LoadingSpinner message="Memuat data produk..." />;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
        <Button onClick={() => navigate("/admin/products/new")} variant="primary" leftIcon={<Plus size={18} />}>
          Tambah Produk
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Semua Brand</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brand</th>
                
                {/* Header Harga*/}
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center">Harga {getSortIcon('price')}</div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Size</th>

                {/* Header Stok*/}
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort('stock_quantity')}
                >
                  <div className="flex items-center">Stok {getSortIcon('stock_quantity')}</div>
                </th>

                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {processedProducts.map((p: Product) => {
                const displayImage = (p.images as ProductImage[])?.find((img) => img.is_thumbnail)?.image_url || (p.images as ProductImage[])?.[0]?.image_url || "https://via.placeholder.com/150";
                const brandName = brands.find((b) => b.id.toString() === p.brand_id?.toString())?.name || "-";

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img src={displayImage} alt={p.name} className="w-10 h-10 rounded-lg object-cover border" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{brandName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {DEFAULT_CURRENCY} {p.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{p.size || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${Number(p.stock_quantity) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductManagementPage;