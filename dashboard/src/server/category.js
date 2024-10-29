import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteCategory(data) {
  return await http().delete(`${endpoints.categories.getAll}/${data.id}`);
}

export async function fetchCategories(params) {
  return await http().get(`${endpoints.categories.getAll}?${params}`);
}
export async function updateCategory(data) {
  return http().put(`${endpoints.categories.getAll}/${data.id}`, data);
}

export async function createCategory(data) {
  return http().post(endpoints.categories.getAll, data);
}

export async function searchCategory(q) {
  const { data } = await http().get(`${endpoints.subCategories.getAll}?q=${q}`);
  const filteredData = data?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  return filteredData;
}
