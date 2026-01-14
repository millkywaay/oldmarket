import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";
import { useState, useEffect } from "react";
import * as productService from "../../services/productService";
import * as adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import { swalService } from "../../services/swalService";

export default function AddProductPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [brands, setBrands] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService.getBrands().then(setBrands);
  }, []);

  const handleSubmit = async (data: any) => {
    if (!token) {
      swalService.error("Akses Ditolak", "Silakan login kembali.");
      return;
    };
    setSubmitting(true);
    try {
      await adminService.addProduct(token, data);
      await swalService.success("Berhasil!", "Produk baru telah ditambahkan.");
      navigate("/admin/products");
    } catch (err: any) {
      swalService.error("Gagal Simpan", err.message || "Terjadi kesalahan pada database.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <ProductForm
          brands={brands}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
