import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api/productsApi";
import "./App.css";

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
      await updateProduct(id, { price: Number(currentPrice) + 100 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div className="app-page">
      <section className="app-hero">
        <h1 className="app-title">Онлайн магазин</h1>
        <p className="app-subtitle">
          Управляйте товарами: добавляйте, обновляйте цену и удаляйте позиции.
        </p>
      </section>

      <section className="app-panel">
        <h2 className="section-title">Добавить товар</h2>
        <form onSubmit={onAdd} className="product-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="app-input input-title"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Категория"
            className="app-input input-category"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            className="app-input input-description"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Цена"
            type="number"
            className="app-input input-number"
          />
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Остаток"
            type="number"
            min="0"
            step="1"
            className="app-input input-number"
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL картинки"
            className="app-input input-image-url"
          />
          <button disabled={!canSubmit} className="btn btn-primary">
            Добавить
          </button>
          <button type="button" onClick={load} className="btn btn-ghost">
            Обновить список
          </button>
        </form>
      </section>

      <section className="products-section">
        <h2>Список товаров</h2>

        {loading && <p>Загрузка...</p>}
        {error && (
          <p className="error-text">
            Ошибка: {error}
            <br />
            Проверьте, что: (1) backend запущен на 3006, (2) CORS настроен, (3) functions в productsApi.js реализованы.
          </p>
        )}

        <ul className="products-list">
          {items.map((p) => (
            <li key={p.id} className="product-card">
              <div className="product-header">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="product-image"
                  />
                ) : null}
                <span>
                  <b className="product-title">{p.title}</b>
                </span>
              </div>

              <div className="product-grid">
                <span className="field-label">Категория:</span>
                <span>{p.category || "Без категории"}</span>

                <span className="field-label">Описание:</span>
                <span>{p.description || "—"}</span>

                <span className="field-label">Цена:</span>
                <span>{p.price} ₽</span>

                <span className="field-label">Остаток:</span>
                <span>{p.stock}</span>

                <span className="field-label">Рейтинг:</span>
                <span>{p.rating ?? "—"}</span>
              </div>

              <button onClick={() => onPricePlus(p.id, p.price)} className="btn btn-primary product-action-main">
                +100 ₽
              </button>
              <button onClick={() => onDelete(p.id)} className="btn btn-ghost product-action-secondary">
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
