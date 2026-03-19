const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiFetch = async (url: string, options: any = {}) => {
  console.log('making api call on the url ', url)
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }
  console.log('data from api', data)
  return data;
};