import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteSubCategory(data) {
  return await http().delete(`${endpoints.subCategories.getAll}/${data.id}`);
}

export async function fetchSubCategories(params) {
  return await http().get(`${endpoints.subCategories.getAll}?${params}`);
}

export async function updateSubCategory(data) {
  return await http().put(`${endpoints.subCategories.getAll}/${data.id}`, data);
}

export async function createSubCategory(data) {
  return await http().post(endpoints.subCategories.getAll, data);
}
