"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  count: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QTY"; payload: { id: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i._id === action.payload._id);
      const items = existing
        ? state.items.map((i) =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...action.payload, quantity: 1 }];
      return { ...state, items, ...calcTotals(items) };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i._id !== action.payload);
      return { ...state, items, ...calcTotals(items) };
    }
    case "UPDATE_QTY": {
      const items =
        action.payload.qty <= 0
          ? state.items.filter((i) => i._id !== action.payload.id)
          : state.items.map((i) =>
              i._id === action.payload.id
                ? { ...i, quantity: action.payload.qty }
                : i
            );
      return { ...state, items, ...calcTotals(items) };
    }
    case "CLEAR_CART":
      return { items: [], total: 0, count: 0 };
    case "LOAD_CART":
      return { items: action.payload, ...calcTotals(action.payload) };
    default:
      return state;
  }
}

function calcTotals(items: CartItem[]) {
  return {
    total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    count: items.reduce((s, i) => s + i.quantity, 0),
  };
}

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    count: 0,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pride_cart");
      if (saved) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("pride_cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQty: (id, qty) =>
          dispatch({ type: "UPDATE_QTY", payload: { id, qty } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
