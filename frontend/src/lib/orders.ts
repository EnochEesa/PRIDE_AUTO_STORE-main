import type { User } from "@/context/AuthContext";
import type { CartItem } from "@/context/CartContext";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface OrderTimelineEntry {
  key: OrderStatus;
  label: string;
  description: string;
  completedAt?: string;
}

export interface OrderRecord {
  id: string;
  trackingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  timeline: OrderTimelineEntry[];
}

interface CreateOrderInput {
  items: CartItem[];
  user: User;
  shipping: number;
  discount: number;
  total: number;
}

const STORAGE_KEY = "pride_orders";
const STATUS_FLOW: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Order confirmed",
  processing: "Preparing your order",
  shipped: "Shipped from our warehouse",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  confirmed: "We have received your order and started the verification process.",
  processing: "Your parts are being picked, packed, and quality checked.",
  shipped: "Your order has left our warehouse and is in transit.",
  out_for_delivery: "The carrier has your package and delivery is scheduled soon.",
  delivered: "Your order was delivered successfully.",
};

const HOURS_BETWEEN_STEPS = [0, 4, 24, 48, 72];

const addHours = (date: Date, hours: number): string => {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next.toISOString();
};

const buildTimeline = (status: OrderStatus, placedAt: string): OrderTimelineEntry[] => {
  const placedDate = new Date(placedAt);
  const statusIndex = STATUS_FLOW.indexOf(status);

  return STATUS_FLOW.map((key, index) => ({
    key,
    label: STATUS_LABELS[key],
    description: STATUS_DESCRIPTIONS[key],
    completedAt: index <= statusIndex ? addHours(placedDate, HOURS_BETWEEN_STEPS[index]) : undefined,
  }));
};

const getSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const safeStorage = (): Storage | null =>
  typeof window === "undefined" ? null : window.localStorage;

const readStoredOrders = (): OrderRecord[] => {
  const storage = safeStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredOrders = (orders: OrderRecord[]): void => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const sortOrders = (orders: OrderRecord[]): OrderRecord[] =>
  [...orders].sort(
    (left, right) =>
      new Date(right.placedAt).getTime() - new Date(left.placedAt).getTime()
  );

const buildDemoOrders = (): OrderRecord[] => {
  const deliveredPlacedAt = new Date();
  deliveredPlacedAt.setDate(deliveredPlacedAt.getDate() - 6);

  const shippedPlacedAt = new Date();
  shippedPlacedAt.setDate(shippedPlacedAt.getDate() - 2);

  return [
    {
      id: "PAS-240731",
      trackingCode: "PRIDE-TRACK-731",
      customerName: "Demo Customer",
      customerEmail: "demo@prideauto.in",
      customerPhone: "919944140272",
      status: "shipped",
      placedAt: shippedPlacedAt.toISOString(),
      estimatedDelivery: addHours(shippedPlacedAt, 72),
      items: [
        {
          _id: "2",
          name: "Ceramic Brake Pads Set",
          price: 1299,
          category: "Brake System",
          quantity: 1,
        },
      ],
      subtotal: 1299,
      shipping: 0,
      discount: 130,
      total: 1169,
      timeline: buildTimeline("shipped", shippedPlacedAt.toISOString()),
    },
    {
      id: "PAS-240612",
      trackingCode: "PRIDE-TRACK-612",
      customerName: "Demo Customer",
      customerEmail: "demo@prideauto.in",
      customerPhone: "919944140272",
      status: "delivered",
      placedAt: deliveredPlacedAt.toISOString(),
      estimatedDelivery: addHours(deliveredPlacedAt, 72),
      items: [
        {
          _id: "7",
          name: "Timing Chain Set",
          price: 1850,
          category: "Engine Parts",
          quantity: 1,
        },
        {
          _id: "8",
          name: "Spark Plug Set (4pcs)",
          price: 680,
          category: "Electrical",
          quantity: 1,
        },
      ],
      subtotal: 2530,
      shipping: 0,
      discount: 0,
      total: 2530,
      timeline: buildTimeline("delivered", deliveredPlacedAt.toISOString()),
    },
  ];
};

const matchesContact = (order: OrderRecord, contact?: string): boolean => {
  if (!contact) return true;
  const normalized = contact.trim().toLowerCase();
  if (!normalized) return true;

  return (
    order.customerEmail.toLowerCase() === normalized ||
    order.customerPhone?.toLowerCase() === normalized
  );
};

export const getAllOrders = (): OrderRecord[] => {
  const combined = [...readStoredOrders(), ...buildDemoOrders()];
  const uniqueById = new Map(combined.map((order) => [order.id, order]));
  return sortOrders([...uniqueById.values()]);
};

export const getOrdersForUser = (email?: string | null): OrderRecord[] => {
  if (!email) return [];
  const normalized = email.trim().toLowerCase();
  return getAllOrders().filter(
    (order) => order.customerEmail.trim().toLowerCase() === normalized
  );
};

export const findOrder = (
  reference: string,
  contact?: string
): OrderRecord | null => {
  const normalizedReference = reference.trim().toLowerCase();
  if (!normalizedReference) return null;

  return (
    getAllOrders().find(
      (order) =>
        (order.id.toLowerCase() === normalizedReference ||
          order.trackingCode.toLowerCase() === normalizedReference) &&
        matchesContact(order, contact)
    ) ?? null
  );
};

export const createOrder = ({
  items,
  user,
  shipping,
  discount,
  total,
}: CreateOrderInput): OrderRecord => {
  const placedAt = new Date();
  const subtotal = getSubtotal(items);
  const id = `PAS-${String(placedAt.getFullYear()).slice(-2)}${String(
    placedAt.getMonth() + 1
  ).padStart(2, "0")}${String(placedAt.getDate()).padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
  const trackingCode = `PRIDE-${Math.floor(100000 + Math.random() * 900000)}`;

  const order: OrderRecord = {
    id,
    trackingCode,
    customerName: user.name,
    customerEmail: user.email,
    status: "confirmed",
    placedAt: placedAt.toISOString(),
    estimatedDelivery: addHours(placedAt, 72),
    items: items.map((item) => ({ ...item })),
    subtotal,
    shipping,
    discount,
    total,
    timeline: buildTimeline("confirmed", placedAt.toISOString()),
  };

  const nextOrders = sortOrders([order, ...readStoredOrders()]);
  writeStoredOrders(nextOrders);
  return order;
};

export const getStatusIndex = (status: OrderStatus): number =>
  STATUS_FLOW.indexOf(status);

export const statusFlow = STATUS_FLOW;
