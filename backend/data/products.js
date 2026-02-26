/**
 * Начальные данные (стартовые товары).
 * В практиках 3–4 мы используем in-memory массив (без БД).
 * Студенты могут расширить схему полями: category, description, stock, rating, imageUrl и т.д.
 */
module.exports = [
  {
    id: "p1",
    title: "Процессор Intel i7",
    category: "CPU",
    description: "Процессор",
    price: 17900,
    stock: 20,
    rating: 4.6,
    imageUrl: ""
  },
  {
    id: "p2",
    title: "HDD WD Blue",
    category: "HDD",
    description: "Жесткий диск",
    price: 9900,
    stock: 15,
    rating: 4.3,
    imageUrl: ""
  },
  {
    id: "p3",
    title: "Видеокарта RTX 5080",
    category: "GPU",
    description: "Видеокарта",
    price: 59900,
    stock: 30,
    rating: 4.5,
    imageUrl: ""
  }
];
