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
    imageUrl: "https://c.dns-shop.ru/thumb/st4/fit/500/500/4a4ac9e661e4eef341cb6b3478758c29/6d83e8e3521df6106b20f5e3e8c3b0c50865a9f18010a100539c748836f059b4.jpg.webp"
  },
  {
    id: "p2",
    title: "HDD WD Blue",
    category: "HDD",
    description: "Жесткий диск",
    price: 9900,
    stock: 15,
    rating: 4.3,
    imageUrl: "https://c.dns-shop.ru/thumb/st1/fit/500/500/988d4fa67be3d70e21933c33b9b7b744/48a2f09bb55214f18bb9fdf02529c0d8130f80b7a87c5394b860965bfdddaa32.jpg.webp"
  },
  {
    id: "p3",
    title: "Видеокарта RTX 5080",
    category: "GPU",
    description: "Видеокарта",
    price: 59900,
    stock: 30,
    rating: 4.5,
    imageUrl: "https://c.dns-shop.ru/thumb/st1/fit/500/500/f8589612a6f5f8aa5d7477ddea04265b/daa98ea4de1f23fe2b2798de36f677ee4ddb8c1c9a8f62c7b058623614531765.jpg.webp"
  }
];
