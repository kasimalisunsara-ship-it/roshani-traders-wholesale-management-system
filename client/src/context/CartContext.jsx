import React, { createContext, useState, useEffect, useContext } from 'react';
import { ToastContext } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('roshani_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { showSuccess, showError, showInfo } = useContext(ToastContext);

  useEffect(() => {
    localStorage.setItem('roshani_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    const moq = product.MOQ || 1;
    let initialQty = quantity || moq;

    if (initialQty < moq) {
      showError(`Quantity for "${product.name}" must be at least MOQ (${moq} units). Quantity set to ${moq}.`);
      initialQty = moq;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + initialQty;
        updated[existingIndex].quantity = newQty;
        showSuccess(`Updated "${product.name}" quantity to ${newQty} units in Cart`);
        return updated;
      } else {
        showSuccess(`Added "${product.name}" (${initialQty} units) to Cart`);
        return [...prev, { product, quantity: initialQty, moq }];
      }
    });
  };

  const buyNow = (product, quantity) => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          if (newQuantity < item.moq) {
            showError(`Minimum order quantity (MOQ) is ${item.moq} units.`);
            return { ...item, quantity: item.moq };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    showInfo('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCheckoutOpen,
        setIsCheckoutOpen,
        // Backward compatibility aliases
        quoteItems: cartItems,
        addToQuote: addToCart,
        removeFromQuote: removeFromCart,
        clearQuote: clearCart,
        totalEstimatedAmount: cartTotal,
        totalItemsCount: cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
