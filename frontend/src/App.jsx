import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api/productsApi";

/**
 * Практика 4 (заготовка).
 * Важно: это НЕ готовое решение. В файле api/productsApi.js стоят TODO.
 * Цель: подключить React к вашему Express API и выполнить базовый CRUD.
 */
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Форма добавления товара
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const canSubmit = useMemo(() => {
    return title.trim() !== "" && price !== "" && stock !== "";
  }, [title, price, stock]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    try {
      await createProduct({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl.trim(),
      });
      setTitle("");
      setCategory("");
      setDescription("");
      setPrice("");
      setStock("");
      setImageUrl("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Онлайн магазин</h1>
      <section style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Добавить товар</h2>
        <form onSubmit={onAdd} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            style={{ padding: 10, minWidth: 220 }}
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Категория"
            style={{ padding: 10, minWidth: 160 }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            style={{ padding: 10, minWidth: 260 }}
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
            type="number"
            style={{ padding: 10, width: 140 }}
          />
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Остаток"
            type="number"
            min="0"
            step="1"
            style={{ padding: 10, width: 140 }}
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL картинки"
            style={{ padding: 10, minWidth: 260 }}
          />
          <button disabled={!canSubmit} style={{ padding: "10px 14px" }}>
            Добавить
          </button>
          <button type="button" onClick={load} style={{ padding: "10px 14px" }}>
            Обновить список
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Список товаров</h2>

        {loading && <p>Загрузка...</p>}
        {error && (
          <p style={{ color: "crimson" }}>
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3006, (2) CORS настроен, (3) functions в productsApi.js реализованы.
          </p>
        )}

        <ul style={{ paddingLeft: 18 }}>
          {items.map((p) => (
            <li
              key={p.id}
              style={{ marginBottom: 12, border: "1px solid #e5e5e5", borderRadius: 10, padding: 10 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                  />
                ) : null}
                <span>
                  <b>{p.title}</b>
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 4, columnGap: 10 }}>
                <span style={{ color: "#666" }}>Категория:</span>
                <span>{p.category || "Без категории"}</span>

                <span style={{ color: "#666" }}>Описание:</span>
                <span>{p.description || "—"}</span>

                <span style={{ color: "#666" }}>Цена:</span>
                <span>{p.price} ₽</span>

                <span style={{ color: "#666" }}>Остаток:</span>
                <span>{p.stock}</span>

                <span style={{ color: "#666" }}>Рейтинг:</span>
                <span>{p.rating ?? "—"}</span>
              </div>

              <button onClick={() => onPricePlus(p.id, p.price)} style={{ marginTop: 10 }}>
                +10 ₽
              </button>
              <button onClick={() => onDelete(p.id)} style={{ marginLeft: 8 }}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
