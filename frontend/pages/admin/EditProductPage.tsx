import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";
import { useEffect, useState } from "react";
import * as productService from "../../services/productService";
import * as adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import { Brand } from "../../types";
import { swalService } from "../../services/swalService";

const baseUrl = import.meta.env.VITE_URL_BACKEND;
export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products/${id}`);
        const productData = await res.json();
        const brandsData = await productService.getBrands();

        setProduct(productData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Gagal memuat data edit:", err);
      }
    };
    fetchProductData();
  }, [id]);
  const handleSubmit = async (data: any) => {
    if (!token || !id) return;
    const confirmUpdate = await swalService.confirm(
      "Simpan perubahan?",
      "Data produk akan diperbarui"
    );
    if (!confirmUpdate) return;
    setSubmitting(true);
    try {
      await adminService.editProduct(token, id, data);
      swalService.toast("Produk berhasil diperbarui!", "success");
      navigate("/admin/products");
    } catch (err:any) {
      swalService.error("Gagal diperbarui", err.message || "Terjadi kesalahan pada database.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product || brands.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <ProductForm
          initialData={product}
          brands={brands}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
}
