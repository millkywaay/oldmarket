import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { CartItem, Product } from "../types";
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartItems: CartItem[];
  selectedProductIds: string[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (
    productId: string | number,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  removeSelectedItems: () => Promise<void>;
  getSelectedSubtotal: () => number;
  totalItemCount: number;
  selectedItemCount: number;
  fetchCart: () => Promise<void>;
  toggleProductSelection: (productId: string | number) => void;
  toggleSelectAll: () => void;
  areAllSelected: boolean;
  getSelectedCartItems: () => CartItem[];
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<
    (string | number)[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token || !user) {
      setCartItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await cartService.getCart();
      setCartItems(data.items);
      setSelectedProductIds(data.items.map((item: any) => item.product_id));
    } catch (err: any) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!token) return;
    try {
      await cartService.addToCart(product.id, quantity);
      await fetchCart();
    } catch (err: any) {
      setError("Gagal menambah ke keranjang");
    }
  };

  const updateCartItemQuantity = async (
    productId: number,
    newQuantity: number
  ) => {
    try {
      await cartService.updateItem(productId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error("Gagal update quantity", err);
    }
  };
  const removeFromCart = async (productId: string | number) => {
    if (!token) return;
    try {
      await cartService.removeItem(productId);
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
      setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
    } catch (err) {
      setError("Gagal menghapus item");
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      setSelectedProductIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeSelectedItems = async () => {
    for (const id of selectedProductIds) {
      await cartService.removeItem(id);
    }
    await fetchCart();
  };

  const toggleProductSelection = (productId: string | number) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const areAllSelected = useMemo(
    () =>
      cartItems.length > 0 && selectedProductIds.length === cartItems.length,
    [cartItems, selectedProductIds]
  );

  const toggleSelectAll = () => {
    setSelectedProductIds(
      areAllSelected ? [] : cartItems.map((item) => item.product_id)
    );
  };

  const getSelectedCartItems = () =>
    cartItems.filter((item) => selectedProductIds.includes(item.product_id));
  const getSelectedSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (!selectedProductIds.includes(item.product_id)) return total;
      if (!item.product) return total;

      const price = Number(item.product.price) || 0;
      const qty = (item as any).quantity ?? (item as any).qty ?? 0;

      return total + price * qty;
    }, 0);
  };

  const totalItemCount = cartItems.length;
  const selectedItemCount = useMemo(() => {
    return cartItems
      .filter((item) => selectedProductIds.includes(item.product_id))
      .reduce((count, item) => count + item.qty, 0);
  }, [cartItems, selectedProductIds]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedProductIds: selectedProductIds as string[],
        isLoading,
        error,
        addToCart,
        updateCartItemQuantity: updateCartItemQuantity as any,
        removeFromCart: removeFromCart as any,
        clearCart,
        removeSelectedItems,
        getSelectedSubtotal,
        totalItemCount,
        selectedItemCount,
        fetchCart,
        toggleProductSelection: toggleProductSelection as any,
        toggleSelectAll,
        areAllSelected,
        getSelectedCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
