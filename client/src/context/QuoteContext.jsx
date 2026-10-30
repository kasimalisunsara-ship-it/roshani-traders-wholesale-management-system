import React, { createContext, useState, useEffect, useContext } from 'react';
import { ToastContext } from './ToastContext';

export const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState(() => {
    const saved = localStorage.getItem('roshani_quote_items');
    return saved ? JSON.parse(saved) : [];
  });

  const { showSuccess, showError, showInfo } = useContext(ToastContext);

  useEffect(() => {
    localStorage.setItem('roshani_quote_items', JSON.stringify(quoteItems));
  }, [quoteItems]);

  const addToQuote = (product, quantity) => {
    const moq = product.MOQ || 1;
    let initialQty = quantity || moq;

    // MOQ Enforcement
    if (initialQty < moq) {
      showError(`Quantity for "${product.name}" must be at least MOQ (${moq} units). Quantity adjusted to ${moq}.`);
      initialQty = moq;
    }

    setQuoteItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + initialQty;
        updated[existingIndex].quantity = newQty;
        showSuccess(`Updated "${product.name}" quantity to ${newQty} units in Quote Request`);
        return updated;
      } else {
        showSuccess(`Added "${product.name}" (${initialQty} units) to Quote Request`);
        return [...prev, { product, quantity: initialQty, moq }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setQuoteItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId) {
          if (newQuantity < item.moq) {
            showError(`Quantity cannot be less than MOQ (${item.moq} units)`);
            return { ...item, quantity: item.moq };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromQuote = (productId) => {
    setQuoteItems((prev) => prev.filter((item) => item.product._id !== productId));
    showInfo('Item removed from quotation request');
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const totalEstimatedAmount = quoteItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const totalItemsCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        addToQuote,
        updateQuantity,
        removeFromQuote,
        clearQuote,
        totalEstimatedAmount,
        totalItemsCount,
        setQuoteItems
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
