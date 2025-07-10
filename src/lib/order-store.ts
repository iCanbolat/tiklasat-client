import { create } from "zustand";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface OrdersStore {
  orders: Order[];
  filteredOrders: Order[];
  searchTerm: string;
  statusFilter: string;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  removeOrder: (orderId: string) => void;
}

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ORD-2024-001",
    customer: {
      id: "cust_001",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 123-4567",
    },
    items: [
      {
        id: "item_001",
        name: "Wireless Headphones",
        quantity: 1,
        price: 199.99,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "item_002",
        name: "Phone Case",
        quantity: 2,
        price: 24.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 249.97,
    tax: 20.0,
    shipping: 9.99,
    total: 279.96,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "stripe",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Customer requested expedited shipping",
  },
  {
    id: "ord_002",
    orderNumber: "ORD-2024-002",
    customer: {
      id: "cust_002",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 987-6543",
    },
    items: [
      {
        id: "item_003",
        name: "Laptop Stand",
        quantity: 1,
        price: 89.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 89.99,
    tax: 7.2,
    shipping: 0.0,
    total: 97.19,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_003",
    orderNumber: "ORD-2024-003",
    customer: {
      id: "cust_003",
      name: "Mike Davis",
      email: "mike.davis@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 456-7890",
    },
    items: [
      {
        id: "item_004",
        name: "Gaming Mouse",
        quantity: 1,
        price: 79.99,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "item_005",
        name: "Mouse Pad",
        quantity: 1,
        price: 19.99,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "item_006",
        name: "USB Cable",
        quantity: 3,
        price: 12.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 138.95,
    tax: 11.12,
    shipping: 5.99,
    total: 156.06,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "stripe",
    shippingAddress: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_004",
    orderNumber: "ORD-2024-004",
    customer: {
      id: "cust_004",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 321-0987",
    },
    items: [
      {
        id: "item_007",
        name: "Bluetooth Speaker",
        quantity: 1,
        price: 149.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 149.99,
    tax: 12.0,
    shipping: 7.99,
    total: 169.98,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    shippingAddress: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_005",
    orderNumber: "ORD-2024-005",
    customer: {
      id: "cust_005",
      name: "David Brown",
      email: "david.brown@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 654-3210",
    },
    items: [
      {
        id: "item_008",
        name: "Tablet Case",
        quantity: 1,
        price: 39.99,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "item_009",
        name: "Screen Protector",
        quantity: 2,
        price: 14.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 69.97,
    tax: 5.6,
    shipping: 4.99,
    total: 80.56,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "stripe",
    shippingAddress: {
      street: "654 Maple Dr",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Customer requested cancellation due to change of mind",
  },
  {
    id: "ord_006",
    orderNumber: "ORD-2024-006",
    customer: {
      id: "cust_006",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      phone: "+1 (555) 789-0123",
    },
    items: [
      {
        id: "item_010",
        name: "Wireless Charger",
        quantity: 2,
        price: 49.99,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "item_011",
        name: "Power Bank",
        quantity: 1,
        price: 79.99,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    subtotal: 179.97,
    tax: 14.4,
    shipping: 8.99,
    total: 203.36,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingAddress: {
      street: "987 Cedar Ln",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "USA",
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: sampleOrders,
  filteredOrders: sampleOrders,
  searchTerm: "",
  statusFilter: "all",

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    const { orders, statusFilter } = get();
    let filtered = orders;

    if (term) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(term.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(term.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(term.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    set({ filteredOrders: filtered });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
    const { orders, searchTerm } = get();
    let filtered = orders;

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    set({ filteredOrders: filtered });
  },

  updateOrderStatus: (orderId: string, status: Order["status"]) => {
    const { orders } = get();
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    );
    set({ orders: updatedOrders });

    const { searchTerm, statusFilter } = get();
    get().setSearchTerm(searchTerm);
    get().setStatusFilter(statusFilter);
  },

  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const { orders } = get();
    const updatedOrders = [newOrder, ...orders];
    set({ orders: updatedOrders, filteredOrders: updatedOrders });
  },

  removeOrder: (orderId: string) => {
    const { orders } = get();
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    set({ orders: updatedOrders });

    const { searchTerm, statusFilter } = get();
    get().setSearchTerm(searchTerm);
    get().setStatusFilter(statusFilter);
  },
}));
