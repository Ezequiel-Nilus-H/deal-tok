import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      // Check if product already exists
      const existing = state.items.find(item => item.id === action.product.id);
      if (existing) {
        // Increase quantity if already in cart
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Add new product with quantity 1
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0),
      };
    }
    case 'CLEAR_CART': {
      return initialState;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = product => dispatch({ type: 'ADD_TO_CART', product });
  const removeFromCart = id => dispatch({ type: 'REMOVE_FROM_CART', id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ cart: state.items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 