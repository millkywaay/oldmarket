import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Order } from "../types";
import * as orderService from "../services/orderService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import { DEFAULT_CURRENCY } from "../constants";
import { CheckCircle2, ShoppingBag } from "lucide-react";

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirmReceived = async () => {
    if (!order || !token) return;

    try {
      await orderService.markOrderCompleted(token, order.id);
      const updatedOrder = await orderService.getOrderById(token, order.id);
      setOrder(updatedOrder);
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      alert("Gagal mengonfirmasi pesanan diterima.");
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    try {
      const res = await fetch("https://oldmarket.vercel.app/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();

      if (window && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: (result: any) => {
            console.log("Success", result);
            navigate("/profile");
          },
          onPending: (result: any) => {
            console.log("Pending", result);
            navigate("/profile");
          },
          onError: (result: any) => {
            console.error("Error", result);
            alert("Pembayaran gagal!");
          },
          onClose: () => {
            alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
          },
        });
      } else {
        alert(
          "Sistem pembayaran (Snap.js) belum termuat. Silakan refresh halaman."
        );
      }
    } catch (err) {
      console.error("Gagal memproses pembayaran:", err);
    }
  };
  useEffect(() => {
    if (!orderId || !token || !user) {
      setError("Data konfirmasi pesanan atau akun tidak ditemukan.");
      setIsLoading(false);
      return;
    }
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await orderService.getOrderById(token, orderId);
        setOrder(fetchedOrder);
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, user]);

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Sedang memuat konfirmasi pesanan Anda..." />
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-10 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        {error}
      </div>
    );
  if (!order)
    return (
      <div className="text-center text-gray-600 py-10 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        Detail pesanan tidak ditemukan.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-4xl mx-auto border">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Terima Kasih Atas Pesanan Anda!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Pesanan Anda telah berhasil ditempatkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Pesan:</span>{" "}
                <strong>
                  {new Date(order.created_at).toLocaleDateString()}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alamat Pengiriman:</span>{" "}
                <strong className="text-right">{order.shipping_address}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode Pembayaran:</span>{" "}
                <strong>{order.payment_method}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status Pesanan:</span>{" "}
                <strong className="capitalize">{order.order_status}</strong>
              </div>
              <div className="flex justify-between text-lg border-t pt-3 mt-3">
                <span className="font-semibold">Total Pembayaran:</span>{" "}
                <strong className="font-bold">
                  {DEFAULT_CURRENCY}{" "}
                  {order.total_amount.toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </div>
          <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ShoppingBag size={20} /> Barang Dipesan
            </h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-16 h-20 object-cover rounded-md bg-gray-200"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">
                      {item.product?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {DEFAULT_CURRENCY}{" "}
                    {(item.price_at_purchase * item.quantity).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-8 text-center">
          Anda akan segera menerima konfirmasi melalui email. Jika ada
          pertanyaan, silakan hubungi dukungan pelanggan kami.
        </p>

        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <Button
            onClick={() => navigate("/products")}
            variant="outline"
            size="lg"
          >
            Lanjut Belanja
          </Button>
          {order.order_status === "PENDING_PAYMENT" && (
            <Button onClick={handlePayment} variant="primary" size="lg">
              Bayar Sekarang
            </Button>
          )}
          {order.order_status === "SHIPPED" && (
            <Button onClick={handleConfirmReceived} variant="primary" size="lg">
              Pesanan Diterima
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
