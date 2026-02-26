import { api } from "./apiClient";

/**
 * TODO (Практика 4):
 * Реализуйте функции работы с API.
 * Подсказка: используйте api.get/post/patch/delete и возвращайте data.
 */

export async function getProducts() {
  const { data } = await api.get("/products");
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data;
}

export async function updateProduct(id, patch) {
  const { data } = await api.patch(`/products/${id}`, patch);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
