import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function createBoard(data) {
  return http().post(`${endpoints.boards.getAll}`, data);
}

export async function updateBoard(data) {
  return http().put(`${endpoints.boards.getAll}/${data.id}`, data);
}

export async function deleteBoard(data) {
  return http().delete(`${endpoints.boards.getAll}/${data.id}`);
}

export async function fetchBoards(params) {
  return await http().get(`${endpoints.boards.getAll}?${params}`);
}
