export interface Order {
  id: string;
  item: string;
  total: string;
  status: "processing" | "shipped" | "delivered";
  days_since_delivery: number | null;
}

const orders: Record<string, Order> = {
  B2087: { id: "B2087", item: "Arc desk lamp", total: "$89.00", status: "delivered", days_since_delivery: 40 },
  B2091: { id: "B2091", item: "Glass kettle", total: "$54.00", status: "delivered", days_since_delivery: 152 },
  B2093: { id: "B2093", item: "Ionic hair dryer", total: "$65.00", status: "delivered", days_since_delivery: 310 },
  B2102: { id: "B2102", item: "Linen throw", total: "$72.00", status: "delivered", days_since_delivery: 12 },
  B2110: { id: "B2110", item: "Ceramic vase", total: "$38.00", status: "delivered", days_since_delivery: 2 },
  B2114: { id: "B2114", item: "Oak side table", total: "$149.00", status: "shipped", days_since_delivery: null },
  B2118: { id: "B2118", item: "Wool rug", total: "$210.00", status: "delivered", days_since_delivery: 45 },
  B2121: { id: "B2121", item: "Pendant lamp", total: "$120.00", status: "delivered", days_since_delivery: 9 },
  B2125: { id: "B2125", item: "Bath towels, set of 4", total: "$46.00", status: "processing", days_since_delivery: null },
  B2130: { id: "B2130", item: "Electric kettle", total: "$59.00", status: "delivered", days_since_delivery: 900 },
  B2133: { id: "B2133", item: "Cotton sheets", total: "$95.00", status: "delivered", days_since_delivery: 20 },
  B2136: { id: "B2136", item: "Floor lamp", total: "$135.00", status: "delivered", days_since_delivery: 1 },
};

export function lookupOrder(id: string): Order {
  const order = orders[id];
  if (!order) throw new Error(`Order ${id} not found`);
  return order;
}
