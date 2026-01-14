import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Product, Brand } from "../../types";
import * as productService from "../../services/productService";
import * as adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import { DEFAULT_CURRENCY } from "../../constants";
import { Edit, Trash, Plus } from "lucide-react";
import { ProductImage } from "@/types/product";
import { swalService } from "../../services/swalService";

const AdminProductManagementPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } else if (
        brandsResponse &&
        typeof brandsResponse === "object" &&
        "brands" in brandsResponse
      ) {
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

const handleDelete = async (id: string) => {
  if (!token) {
    swalService.error('Akses Ditolak', 'Sesi Anda telah habis, silakan login kembali.');
    return;
  }
  const isConfirmed = await swalService.confirm(
    'Hapus Produk?', 
    'Produk akan dihapus permanen dari database.'
  );
  if (isConfirmed) {
    try {
      await adminService.deleteProduct(token, id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      swalService.success('Berhasil!', 'Produk telah berhasil dihapus.');
    } catch (err: any) {
      swalService.error('Gagal!', err.message || 'Tidak dapat menghapus produk.');
    }
  }
};

  if (isLoading) return <LoadingSpinner message="Memuat data produk..." />;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-full">
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
        <Button
          onClick={() => navigate("/admin/products/new")}
          variant="primary"
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
        >
          Tambah Produk
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                {/* Kolom Size Baru */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((p: Product) => {
                const displayImage =
                  (p.images as ProductImage[])?.find((img) => img.is_thumbnail)
                    ?.image_url ||
                  (p.images as ProductImage[])?.[0]?.image_url ||
                  "https://via.placeholder.com/150?text=No+Image";
                const brandName =
                  brands.find((b) => b.id.toString() === p.brand_id?.toString())
                    ?.name || "-";

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={displayImage}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border bg-white flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150";
                          }}
                        />
                        <span className="font-medium text-gray-900 truncate max-w-[150px]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {brandName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {DEFAULT_CURRENCY} {p.price.toLocaleString("id-ID")}
                    </td>
                    {/* Data Size Baru */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono uppercase">
                        {p.size || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          Number(p.stock_quantity) > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-block"
                        title="Edit Produk"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg inline-block"
                        title="Hapus Produk"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-500">
            Belum ada produk yang tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductManagementPage;