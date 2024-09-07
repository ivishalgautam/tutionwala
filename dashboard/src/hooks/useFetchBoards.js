import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchBoards = async () => {
  const { data } = await http().get(endpoints.boards.getAll);
  return data?.map(({ id: value, name: label }) => ({ value, label }));
};

export function useFetchBoards() {
  return useQuery(["boards"], () => fetchBoards());
}
