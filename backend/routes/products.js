const express = require("express");
const { randomBytes } = require("crypto");

const router = express.Router();

let products = require("../data/products");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: p1
 *         title:
 *           type: string
 *           example: Видеокарта RTX 5080
 *         category:
 *           type: string
 *           example: GPU
 *         description:
 *           type: string
 *           example: Мощная видеокарта для игр
 *         price:
 *           type: number
 *           example: 59900
 *         stock:
 *           type: integer
 *           example: 30
 *         rating:
 *           type: number
 *           example: 4.5
 *         imageUrl:
 *           type: string
 *           example: https://example.com/image.jpg
 *     ProductCreateInput:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           example: SSD Samsung 980 1TB
 *         category:
 *           type: string
 *           example: SSD
 *         description:
 *           type: string
 *           example: Быстрый NVMe SSD
 *         price:
 *           type: number
 *           example: 8500
 *         stock:
 *           type: integer
 *           example: 25
 *         imageUrl:
 *           type: string
 *           example: https://example.com/ssd.jpg
 *     ProductPatchInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         imageUrl:
 *           type: string
 */

function createId() {
  return randomBytes(4).toString("hex");
}

function findById(id) {
  return products.find((p) => p.id === id) || null;
}


function validateProductInput(input, mode = "create") {
  const errors = {};
  const data = {};

  const has = (key) => Object.prototype.hasOwnProperty.call(input, key);

  // title (обязателен в POST)
  if (mode === "create" || has("title")) {
    const v = input.title;
    if (typeof v !== "string" || v.trim().length < 2) {
      errors.title = "title must be a string (min 2 chars)";
    } else {
      data.title = v.trim();
    }
  }

  if (mode === "create" || has("category")) {
    const v = input.category;
    if (v === undefined || v === null || v === "") {
      if (mode === "create") data.category = "Без категории";
    } else if (typeof v !== "string" || v.trim().length < 2) {
      errors.category = "category must be a string (min 2 chars)";
    } else {
      data.category = v.trim();
    }
  }

  // description (строка, можно пустую, но тип проверяем)
  if (mode === "create" || has("description")) {
    const v = input.description;
    if (v === undefined || v === null) {
      if (mode === "create") data.description = "";
    } else if (typeof v !== "string") {
      errors.description = "description must be a string";
    } else {
      data.description = v.trim();
    }
  }

  // price (число >= 0)
  if (mode === "create" || has("price")) {
    const v = input.price;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) {
      errors.price = "price must be a non-negative number";
    } else {
      data.price = n;
    }
  }

  // stock (целое число >= 0)
  if (mode === "create" || has("stock")) {
    const v = input.stock;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      errors.stock = "stock must be a non-negative integer";
    } else {
      data.stock = n;
    }
  }

  if (has("imageUrl")) {
    const v = input.imageUrl;
    if (v === undefined || v === null) {
    } else if (typeof v !== "string") {
      errors.imageUrl = "imageUrl must be a string";
    } else {
      data.imageUrl = v.trim();
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, data };
}

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
// GET /api/products — список товаров
router.get("/", (req, res) => {
  res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
// GET /api/products/:id — один товар
router.get("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateInput'
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
// POST /api/products — добавить товар (201 / 400)
router.post("/", (req, res) => {
  const result = validateProductInput(req.body, "create");
  if (!result.ok) {
    return res.status(400).json({ error: "Validation error", details: result.errors });
  }

  const newProduct = {
    id: createId(),
    ...result.data,
  };
  if (newProduct.rating === undefined) newProduct.rating = undefined;
  if (newProduct.imageUrl === undefined) newProduct.imageUrl = "";

  products.push(newProduct);
  return res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPatchInput'
 *     responses:
 *       200:
 *         description: Товар обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Невалидные данные или пустое тело запроса
 *       404:
 *         description: Товар не найден
 */
// PATCH /api/products/:id — частичное обновление (200 / 400 / 404)
router.patch("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  // Пустое тело — плохой запрос
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is empty" });
  }

  const result = validateProductInput(req.body, "patch");
  if (!result.ok) {
    return res.status(400).json({ error: "Validation error", details: result.errors });
  }

  Object.assign(product, result.data);
  return res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товар удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Товар не найден
 */
// DELETE /api/products/:id — удалить товар (200 / 404)
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const before = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === before) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({ ok: true });
});

module.exports = router;