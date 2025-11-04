
import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product } from '../types';
import * as cartService from '../services/cartService'; // Assuming service methods
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  selectedProductIds: string[];
  isLoading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  removeSelectedItems: () => Promise<void>;
  getSelectedSubtotal: () => number;
  totalItemCount: number;
  selectedItemCount: number;
  fetchCart: () => Promise<void>;
  toggleProductSelection: (productId: string) => void;
  toggleSelectAll: () => void;
  areAllSelected: boolean;
  getSelectedCartItems: () => CartItem[];
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token || !user) {
      setCartItems([]);
      setSelectedProductIds([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const cart = await cartService.getCart(token);
      setCartItems(cart.items);
      // Select all items by default when cart is fetched
      setSelectedProductIds(cart.items.map(item => item.product_id));
    } catch (err: any)      {
      setError(err.message || 'Failed to fetch cart');
      setCartItems([]);
      setSelectedProductIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: Product, quantity: number) => {
    if (!token) {
      setError("Please login to add items to cart.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // await cartService.addToCart(token, product.id, quantity);
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product_id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity, product }
              : item
          );
        }
        return [...prevItems, { id: product.id, product_id: product.id, quantity, product }];
      });
      // Also add the new item to the selected list
      setSelectedProductIds(prev => [...new Set([...prev, product.id])]);
      // await fetchCart();
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // await cartService.updateItem(token, productId, quantity);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0)
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update cart item');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // await cartService.removeItem(token, productId);
      setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      // Also remove from selection
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // await cartService.clearCart(token);
      setCartItems([]);
      setSelectedProductIds([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeSelectedItems = async () => {
    if(!token) return;
    try {
        // This would be a single API call in a real backend
        setCartItems(prev => prev.filter(item => !selectedProductIds.includes(item.product_id)));
        setSelectedProductIds([]);
    } catch(err: any) {
        setError(err.message || 'Failed to remove purchased items');
    }
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev =>
        prev.includes(productId)
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
    );
  };

  const areAllSelected = useMemo(() => cartItems.length > 0 && selectedProductIds.length === cartItems.length, [cartItems, selectedProductIds]);

  const toggleSelectAll = () => {
    if (areAllSelected) {
        setSelectedProductIds([]);
    } else {
        setSelectedProductIds(cartItems.map(item => item.product_id));
    }
  };

  const getSelectedCartItems = () => {
    return cartItems.filter(item => selectedProductIds.includes(item.product_id));
  };
  
  const getSelectedSubtotal = () => {
    return cartItems
      .filter(item => selectedProductIds.includes(item.product_id))
      .reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + price * item.quantity;
      }, 0);
  };

  const totalItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const selectedItemCount = useMemo(() => {
    return cartItems
      .filter(item => selectedProductIds.includes(item.product_id))
      .reduce((count, item) => count + item.quantity, 0);
  }, [cartItems, selectedProductIds]);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedProductIds,
        isLoading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        removeSelectedItems,
        getSelectedSubtotal,
        totalItemCount,
        selectedItemCount,
        fetchCart,
        toggleProductSelection,
        toggleSelectAll,
        areAllSelected,
        getSelectedCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
