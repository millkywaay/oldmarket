import * as React from "react";
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Button from "../components/common/Button";
import { MapPin, Truck, FileText } from "lucide-react";
import { Address } from "../types";
import * as addressService from "../services/addressService";
import * as shippingService from "../services/shippingService";
import AddressModal from "../components/checkout/AddressModal";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { swalService } from "../services/swalService";

const baseUrl = import.meta.env.VITE_URL_BACKEND;
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth()
  const { getSelectedCartItems, getSelectedSubtotal, fetchCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const subtotal = buyNowItem
    ? buyNowItem.product.price * buyNowItem.qty
    : getSelectedSubtotal();
  const selectedItems = buyNowItem
    ? [
        {
          id: "buy-now",
          product: buyNowItem.product,
          qty: buyNowItem.qty,
        },
      ]
    : getSelectedCartItems();

  const totalWeightKg = selectedItems.reduce((total, item) => {
    return total + item.qty * 1;
  }, 0);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getMyAddresses();
      const list = Array.isArray(data) ? data : data?.data || [];
      setAddresses(list);
      const def = list.find((a: Address) => a.is_default) || list[0];
      if (def) setSelectedAddress(def);
    } catch (err) {
      console.error("Gagal load alamat", err);
    }
  };

  useEffect(() => {
    if (!selectedAddress?.village_code) return;
    if (totalWeightKg <= 0) return;
    handleShippingCheck(selectedAddress.village_code);
  }, [selectedAddress, totalWeightKg]);

  const handleShippingCheck = async (villageCode: string) => {
    try {
      const res = await shippingService.getShippingCost(
        villageCode,
        totalWeightKg
      );

      if (res?.is_success && res?.data?.couriers) {
        const allowed = ["SiCepat", "JNE"];
        const filtered = res.data.couriers.filter(
          (c: any) =>
            allowed.includes(c.courier_code) &&
            !c.courier_code.toLowerCase().includes("cargo")
        );

        setShippingOptions(filtered);
        if (filtered.length > 0) {
          setSelectedCourier(filtered[0]);
        }
      }
    } catch (err) {
      console.error("Gagal ambil ongkir", err);
    }
  };

const handlePlaceOrder = async () => {
    if (!user){
      return swalService.error("Gagal membuat pesanan", "Silahkan login terlebih dahulu!");
    };
    if (!selectedAddress || !selectedCourier) {
      return swalService.error("Gagal membuat pesanan", "Silahkan pilih alamat dan kurir terlebih dahulu!");
    };
    const isConfirmed = await swalService.confirm("Konfirmasi Pesanan", "Apakah Anda yakin ingin membuat pesanan?");
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      const orderData = {
        userId: user.id, 
        orderType: buyNowItem ? "BUY_NOW" : "CART", 
        cartItems: selectedItems.map(item => ({
          product_id: item.product.id,
          qty: item.qty,
        })),
        subtotal: subtotal,
        shippingFee: selectedCourier.price,
        addressId: selectedAddress.id,
        notes: orderNote,
        courierName: selectedCourier.courier_name,
        courierService: selectedCourier.courier_code
      };
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Gagal membuat pesanan");
      const newOrderId = result.data?.id || result.id;

      if (newOrderId) {
        await fetchCart(); 
        await swalService.success("Berhasil", "Pesanan berhasil dibuat!");
        navigate(`/order-confirmation/${newOrderId}`);
      } else {
        console.error("Struktur Respon Server:", result);
        throw new Error("Gagal mendapatkan ID pesanan baru dari server.");
      }
      } catch (err: any) {
        swalService.error("Gagal membuat pesanan", err.message || "Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>

          {/* SECTION ALAMAT */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold text-gray-700 uppercase text-xs tracking-wider">
                <MapPin size={16} className="text-red-500" /> Alamat Pengiriman
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Ubah Alamat
              </button>
            </div>
            {selectedAddress ? (
              <div className="text-sm border-l-4 border-red-500 pl-4 py-1">
                <p className="font-bold">
                  {selectedAddress.recipient_name}{" "}
                  <span className="text-gray-400 font-normal">
                    | {selectedAddress.phone}
                  </span>
                </p>
                <p className="text-gray-600 mt-1">
                  {selectedAddress.street}, {selectedAddress.city}
                </p>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed rounded-xl text-center text-gray-400 text-sm">
                Belum ada alamat. Silakan tambah alamat di profil.
              </div>
            )}
          </div>

          {/* SECTION PRODUK */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 font-bold text-[10px] text-gray-400 uppercase tracking-widest">
              Daftar Produk
            </div>
            <div className="p-4 space-y-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img
                    src={item.product?.image_url || ""}
                    className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm line-clamp-1">
                        {item.product?.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Variasi: {item.product?.size || "Default"}
                      </p>
                      <p className="text-xs mt-1">
                        Rp {Number(item.product?.price || 0).toLocaleString()} x{" "}
                        {item.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        Rp{" "}
                        {(
                          (Number(item.product?.price) || 0) * (item.qty || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-50/50 border-t flex items-center gap-3">
              <FileText size={18} className="text-blue-500" />
              <input
                type="text"
                placeholder="Tambah catatan untuk pesanan ini..."
                className="bg-transparent w-full text-sm outline-none placeholder:text-blue-300"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
            </div>
          </div>

          {/* SECTION KURIR */}
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <div className="flex items-center gap-2 font-bold text-gray-700 mb-4 text-[10px] uppercase tracking-widest">
              <Truck size={16} className="text-blue-500" /> Pilih Pengiriman
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {shippingOptions.length > 0 ? (
                shippingOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedCourier(opt)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedCourier?.courier_code === opt.courier_code
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      {opt.courier_name}
                    </p>

                    <p className="font-bold text-blue-700 text-lg">
                      Rp {opt.price.toLocaleString()}
                    </p>

                    <p className="text-[10px] text-gray-500">
                      Estimasi: {opt.estimation ?? "-"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic col-span-3 text-center py-4 bg-gray-50 rounded-xl">
                  {selectedAddress
                    ? "Mencari kurir..."
                    : "Pilih alamat untuk melihat ongkir"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SUMMARY) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border shadow-lg sticky top-4">
            <h3 className="font-bold text-lg mb-6 border-b pb-4">
              Ringkasan Tagihan
            </h3>
            <div className="space-y-4 pb-6 border-b border-dashed">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total Harga Produk</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Biaya Ongkos Kirim</span>
                <span>Rp {(selectedCourier?.price || 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 mb-8">
              <span className="font-bold text-gray-800 text-lg">
                Total Pembayaran
              </span>
              <span className="text-2xl font-black text-red-600 tracking-tighter">
                Rp {(subtotal + (selectedCourier?.price || 0)).toLocaleString()}
              </span>
            </div>
            <Button
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95"
              onClick={handlePlaceOrder}
              isLoading={isLoading}
            >
              LANJUT PEMBAYARAN
            </Button>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addresses={addresses}
        onSelect={(addr) => {
          setSelectedAddress(addr);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default CheckoutPage;
