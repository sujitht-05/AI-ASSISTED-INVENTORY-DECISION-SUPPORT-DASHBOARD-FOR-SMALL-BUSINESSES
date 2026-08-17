/**
 * AI-Assisted Inventory Decision Support Dashboard
 * Data Layer & Initial Mock Dataset for Small Businesses
 */

const INITIAL_INVENTORY_DATA = [
  {
    id: "SKU-1001",
    name: "AeroSound Pro Wireless Headphones",
    category: "Audio",
    stock: 14,
    minStock: 25,
    reorderPoint: 35,
    maxStock: 100,
    cost: 72.00,
    price: 149.99,
    monthlySales: 95,
    leadTime: 12,
    supplier: "SoundTech Distro Inc.",
    supplierId: "SUP-01",
    lastRestocked: "2026-07-15"
  },
  {
    id: "SKU-1002",
    name: "Lumina Smart Ergonomic Desk Lamp",
    category: "Smart Home",
    stock: 8,
    minStock: 15,
    reorderPoint: 20,
    maxStock: 80,
    cost: 28.50,
    price: 64.99,
    monthlySales: 60,
    leadTime: 10,
    supplier: "BrightLife Electronics",
    supplierId: "SUP-02",
    lastRestocked: "2026-07-10"
  },
  {
    id: "SKU-1003",
    name: "UltraCharge 100W GaN Wall Adapter",
    category: "Charging",
    stock: 110,
    minStock: 30,
    reorderPoint: 45,
    maxStock: 120,
    cost: 16.00,
    price: 39.99,
    monthlySales: 130,
    leadTime: 7,
    supplier: "VoltMax Components",
    supplierId: "SUP-03",
    lastRestocked: "2026-08-01"
  },
  {
    id: "SKU-1004",
    name: "PulseFit Smart Activity Tracker V2",
    category: "Wearables",
    stock: 5,
    minStock: 20,
    reorderPoint: 30,
    maxStock: 90,
    cost: 38.00,
    price: 89.99,
    monthlySales: 75,
    leadTime: 14,
    supplier: "Apex Micro Devices",
    supplierId: "SUP-04",
    lastRestocked: "2026-06-28"
  },
  {
    id: "SKU-1005",
    name: "OmniDesk Mechanical Keyboard RGB",
    category: "Workplace",
    stock: 42,
    minStock: 20,
    reorderPoint: 30,
    maxStock: 80,
    cost: 45.00,
    price: 109.99,
    monthlySales: 55,
    leadTime: 14,
    supplier: "KeyCraft Peripherals",
    supplierId: "SUP-05",
    lastRestocked: "2026-07-22"
  },
  {
    id: "SKU-1006",
    name: "StreamMic Pro Cardioid USB Condenser",
    category: "Audio",
    stock: 165,
    minStock: 25,
    reorderPoint: 40,
    maxStock: 100,
    cost: 52.00,
    price: 119.99,
    monthlySales: 22,
    leadTime: 15,
    supplier: "SoundTech Distro Inc.",
    supplierId: "SUP-01",
    lastRestocked: "2026-05-10"
  },
  {
    id: "SKU-1007",
    name: "SmartHub Pro Zigbee Bridge Gateway",
    category: "Smart Home",
    stock: 18,
    minStock: 12,
    reorderPoint: 22,
    maxStock: 60,
    cost: 24.00,
    price: 54.99,
    monthlySales: 40,
    leadTime: 9,
    supplier: "BrightLife Electronics",
    supplierId: "SUP-02",
    lastRestocked: "2026-07-18"
  },
  {
    id: "SKU-1008",
    name: "MagFlex Magnetic Folding Wireless Pad",
    category: "Charging",
    stock: 74,
    minStock: 25,
    reorderPoint: 40,
    maxStock: 110,
    cost: 14.50,
    price: 34.99,
    monthlySales: 88,
    leadTime: 8,
    supplier: "VoltMax Components",
    supplierId: "SUP-03",
    lastRestocked: "2026-07-30"
  },
  {
    id: "SKU-1009",
    name: "ErgoVertical Precision Wireless Mouse",
    category: "Workplace",
    stock: 2,
    minStock: 15,
    reorderPoint: 25,
    maxStock: 75,
    cost: 21.00,
    price: 49.99,
    monthlySales: 68,
    leadTime: 11,
    supplier: "KeyCraft Peripherals",
    supplierId: "SUP-05",
    lastRestocked: "2026-06-15"
  },
  {
    id: "SKU-1010",
    name: "ClarityView 4K Portable Monitor 15.6\"",
    category: "Workplace",
    stock: 9,
    minStock: 10,
    reorderPoint: 18,
    maxStock: 45,
    cost: 135.00,
    price: 269.99,
    monthlySales: 32,
    leadTime: 16,
    supplier: "Apex Micro Devices",
    supplierId: "SUP-04",
    lastRestocked: "2026-07-02"
  },
  {
    id: "SKU-1011",
    name: "AeroPods Lite Bluetooth Earbuds",
    category: "Audio",
    stock: 88,
    minStock: 35,
    reorderPoint: 55,
    maxStock: 150,
    cost: 18.00,
    price: 44.99,
    monthlySales: 115,
    leadTime: 10,
    supplier: "SoundTech Distro Inc.",
    supplierId: "SUP-01",
    lastRestocked: "2026-07-28"
  },
  {
    id: "SKU-1012",
    name: "NeuraRing Sleep & Recovery Tracker",
    category: "Wearables",
    stock: 140,
    minStock: 15,
    reorderPoint: 25,
    maxStock: 60,
    cost: 110.00,
    price: 249.99,
    monthlySales: 12,
    leadTime: 20,
    supplier: "Apex Micro Devices",
    supplierId: "SUP-04",
    lastRestocked: "2026-04-12"
  },
  {
    id: "SKU-1013",
    name: "PowerTank 24000mAh Laptop Power Bank",
    category: "Charging",
    stock: 27,
    minStock: 20,
    reorderPoint: 35,
    maxStock: 90,
    cost: 36.00,
    price: 79.99,
    monthlySales: 64,
    leadTime: 9,
    supplier: "VoltMax Components",
    supplierId: "SUP-03",
    lastRestocked: "2026-07-14"
  },
  {
    id: "SKU-1014",
    name: "EcoBreeze Smart Desk Air Purifier",
    category: "Smart Home",
    stock: 3,
    minStock: 10,
    reorderPoint: 15,
    maxStock: 50,
    cost: 42.00,
    price: 99.99,
    monthlySales: 38,
    leadTime: 13,
    supplier: "BrightLife Electronics",
    supplierId: "SUP-02",
    lastRestocked: "2026-06-20"
  },
  {
    id: "SKU-1015",
    name: "CableNeat 5-in-1 Desk Organizer Dock",
    category: "Workplace",
    stock: 210,
    minStock: 30,
    reorderPoint: 50,
    maxStock: 120,
    cost: 7.50,
    price: 22.99,
    monthlySales: 18,
    leadTime: 7,
    supplier: "KeyCraft Peripherals",
    supplierId: "SUP-05",
    lastRestocked: "2026-03-01"
  }
];

const INITIAL_SUPPLIERS = [
  {
    id: "SUP-01",
    name: "SoundTech Distro Inc.",
    contact: "orders@soundtech.com",
    avgLeadTime: 12,
    reliabilityScore: 94,
    priceTrend: "stable",
    activeSKUs: 3
  },
  {
    id: "SUP-02",
    name: "BrightLife Electronics",
    contact: "sales@brightlife.io",
    avgLeadTime: 11,
    reliabilityScore: 88,
    priceTrend: "increasing (+3%)",
    activeSKUs: 3
  },
  {
    id: "SUP-03",
    name: "VoltMax Components",
    contact: "supply@voltmax.cn",
    avgLeadTime: 8,
    reliabilityScore: 98,
    priceTrend: "decreasing (-2%)",
    activeSKUs: 3
  },
  {
    id: "SUP-04",
    name: "Apex Micro Devices",
    contact: "b2b@apexmicro.com",
    avgLeadTime: 17,
    reliabilityScore: 79,
    priceTrend: "volatile",
    activeSKUs: 3
  },
  {
    id: "SUP-05",
    name: "KeyCraft Peripherals",
    contact: "fulfillment@keycraft.org",
    avgLeadTime: 11,
    reliabilityScore: 91,
    priceTrend: "stable",
    activeSKUs: 3
  }
];

// Data Repository Store
class InventoryStore {
  constructor() {
    this.storageKey = "ai_inventory_items_v1";
    this.supplierKey = "ai_inventory_suppliers_v1";
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      this.saveItems(INITIAL_INVENTORY_DATA);
    }
    if (!localStorage.getItem(this.supplierKey)) {
      localStorage.setItem(this.supplierKey, JSON.stringify(INITIAL_SUPPLIERS));
    }
  }

  getItems() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_INVENTORY_DATA;
    } catch (e) {
      console.error("Error reading localStorage:", e);
      return INITIAL_INVENTORY_DATA;
    }
  }

  saveItems(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }

  getSuppliers() {
    try {
      const data = localStorage.getItem(this.supplierKey);
      return data ? JSON.parse(data) : INITIAL_SUPPLIERS;
    } catch (e) {
      return INITIAL_SUPPLIERS;
    }
  }

  addItem(newItem) {
    const items = this.getItems();
    // Auto-generate ID if missing
    if (!newItem.id) {
      const maxIdNum = items.reduce((max, i) => {
        const num = parseInt(i.id.replace(/\D/g, '')) || 1000;
        return num > max ? num : max;
      }, 1000);
      newItem.id = `SKU-${maxIdNum + 1}`;
    }
    newItem.lastRestocked = new Date().toISOString().split('T')[0];
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  updateItem(id, updatedFields) {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedFields };
      this.saveItems(items);
      return items[index];
    }
    return null;
  }

  deleteItem(id) {
    let items = this.getItems();
    items = items.filter(i => i.id !== id);
    this.saveItems(items);
  }

  resetToDefaults() {
    localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_INVENTORY_DATA));
    localStorage.setItem(this.supplierKey, JSON.stringify(INITIAL_SUPPLIERS));
    return INITIAL_INVENTORY_DATA;
  }
}

// Global store instance
const store = new InventoryStore();
