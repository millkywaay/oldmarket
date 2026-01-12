import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Product } from "../types";
import * as productService from "../services/productService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import ProductCard from "../components/common/ProductCard";
import { DEFAULT_CURRENCY } from "../constants";
import {
  Minus,
  Plus,
  ShoppingCart,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [isBuyNowLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!productId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(productId);
        setProduct(data);
        if (data.brand_id) {
          const related = await productService.getProductsByBrand(
            data.brand_id.toString()
          );
          setRelatedProducts(
            related.filter((p) => p.id.toString() !== productId).slice(0, 4)
          );
        }
      } catch (err: any) {
        console.error("Gagal mengambil data database:", err);
        setError("Produk tidak ditemukan atau terjadi kesalahan server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [productId]);

const handleBuyNow = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  if (!product) return;

  navigate("/checkout", {
    state: {
      buyNowItem: {
        product,
        qty: quantity,
      },
    },
  });
};

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setActiveImageIndex(
        (prev) => (prev - 1 + product.images!.length) % product.images!.length
      );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Memuat detail produk..." />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-10 font-bold">{error}</div>
    );
  if (!product)
    return (
      <div className="text-center text-gray-600 py-10">
        Produk tidak ditemukan.
      </div>
    );

  const allImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_url)
      : [
          product.image_url ||
            `https://via.placeholder.com/600x750?text=${product.name}`,
        ];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm mb-6 text-gray-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-black">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border group">
              <img
                src={allImages[activeImageIndex]}
                alt={`${product.name} ${activeImageIndex + 1}`}
                className="w-full h-full object-contain p-2 transition-opacity duration-300"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setActiveImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded border-2 cursor-pointer overflow-hidden transition-all ${
                    activeImageIndex === index
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {product.brand?.name || "Original"}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-black mt-3">
                {product.name}
              </h1>

              <div className="flex items-center mt-3 text-sm">
                <span className="text-gray-500">
                  Size:{" "}
                  <span className="text-black font-semibold">
                    {product.size || "N/A"}
                  </span>
                </span>
                <span className="mx-3 text-gray-300">|</span>
                <span className="text-gray-500">
                  Stok:{" "}
                  <span className="text-black font-semibold">
                    {product.stock_quantity}
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-3xl font-black text-blue-600">
                {DEFAULT_CURRENCY} {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-800">Deskripsi Produk</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {product.stock_quantity > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold text-gray-700">
                    Jumlah:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-10 text-center text-sm font-bold border-x border-gray-300"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stock_quantity, quantity + 1)
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-30"
                      disabled={quantity >= product.stock_quantity}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    variant="primary"
                    className="flex-1 h-12 rounded-sm font-bold"
                    leftIcon={<ShoppingCart size={20} />}
                    onClick={async () => {
                      await addToCart(product, quantity);
                      alert("Berhasil masuk keranjang!");
                    }}
                    isLoading={isCartLoading}
                  >
                    Masukkan Keranjang
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-sm border-blue-600 text-blue-600 font-bold"
                    onClick={handleBuyNow}
                    isLoading={isBuyNowLoading}
                  >
                    Beli Sekarang
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-100 rounded text-center">
                <p className="font-bold text-red-600">Habis Terjual</p>
              </div>
            )}

            <div className="pt-6 border-t flex items-center gap-4 text-xs text-gray-500 uppercase tracking-tighter">
              <div className="flex items-center gap-1">
                <ShieldCheck size={16} className="text-green-600" /> 100%
                Original
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck size={16} className="text-green-600" /> Free Return
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">
              PRODUK TERKAIT
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
