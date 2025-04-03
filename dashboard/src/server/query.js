import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function updateQuery(id, data) {
  return await http().put(`${endpoints.queries.getAll}/${id}`, data);
}

export async function deleteQuery({ id }) {
  return await http().delete(`${endpoints.queries.getAll}/${id}`);
}

export async function fetchQueries(params) {
  return await http().get(`${endpoints.queries.getAll}?${params}`);
}
