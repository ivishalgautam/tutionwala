import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

export const searchParams = {
  budgetRange: parseAsString,
  page: parseAsString,
  limit: parseAsString,
  q: parseAsString,
  rating: parseAsString,
  category: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
