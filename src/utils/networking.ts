export const fetchSegment = async (url: string) => {
  const response = await fetch(url);

  return response.arrayBuffer();
};
