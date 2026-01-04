import { useEffect, useState } from "react";
import {
  fetchItems,
  createItem,
  createMovement,
  fetchMovements
} from "./api";

type Item = {
  id: number;
  name: string;
  sku: string;
  unit: string;
  stock: number;
};

type Movement = {
  id: number;
  quantity: number;
  movement_type: string;
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const data = await fetchItems();
    setItems(data);
  }

  async function handleCreateItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    await createItem({
      name: (form.name as any).value,
      sku: (form.sku as any).value,
      unit: (form.unit as any).value
    });

    form.reset();
    loadItems();
  }

  async function handleMovement(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const res = await createMovement({
      item_id: Number((form.item_id as any).value),
      quantity: Number((form.quantity as any).value),
      movement_type: (form.movement_type as any).value
    });

    if (res.error) {
      alert(res.error);
    }

    loadItems();
  }

  async function viewMovements(item: Item) {
    setSelectedItem(item);
    const data = await fetchMovements(item.id);
    setMovements(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Management</h2>

      <h3>Create Item</h3>
      <form onSubmit={handleCreateItem}>
        <input name="name" placeholder="Name" required />
        <input name="sku" placeholder="SKU" required />
        <input name="unit" placeholder="Unit (pcs/kg/litre)" required />
        <button type="submit">Add Item</button>
      </form>

      <h3>Items</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} ({item.unit}) — Stock: {item.stock}
            <button onClick={() => viewMovements(item)}>View</button>
          </li>
        ))}
      </ul>

      <h3>Inventory Movement</h3>
      <form onSubmit={handleMovement}>
        <input name="item_id" placeholder="Item ID" required />
        <input name="quantity" placeholder="Quantity" required />
        <select name="movement_type">
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {selectedItem && (
        <>
          <h3>Movement History – {selectedItem.name}</h3>
          <ul>
            {movements.map(m => (
              <li key={m.id}>
                {m.movement_type} — {m.quantity}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
