export const createArraySlices = (totalSlices, sliceCount) => {
  return Array.from({ length: totalSlices }).map((_, ind) => [
    ind * sliceCount,
    (ind + 1) * sliceCount,
  ]);
};
