import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function fetchUsers(params) {
  return await http().get(`${endpoints.users.getAll}?${params}`);
}

export async function deleteUser(data) {
  return http().delete(`${endpoints.users.getAll}/${data.id}`);
}

export async function updateUser(data, userId) {
  return await http().put(`${endpoints.users.getAll}/${userId}`, data);
}

export async function updateUserStatus(customerId, status) {
  return await http().put(`${endpoints.users.getAll}/status/${customerId}`, {
    is_active: status,
  });
}

export async function fetchTutor(tutorId) {
  const { record } = await http().get(`${endpoints.users.getAll}/${tutorId}`);
  return record;
}
