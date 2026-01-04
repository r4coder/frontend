const API_URL = "http://localhost:4000/api";

export async function fetchItems() {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
}

export async function createItem(data: {
  name: string;
  sku: string;
  unit: string;
}) {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function createMovement(data: {
  item_id: number;
  quantity: number;
  movement_type: string;
}) {
  const res = await fetch(`${API_URL}/movements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchMovements(itemId: number) {
  const res = await fetch(`${API_URL}/items/${itemId}/movements`);
  return res.json();
}
