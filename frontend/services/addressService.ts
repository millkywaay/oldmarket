import api from "./api";

export const getMyAddresses = async () => {
  const response = await api.get("/user/addresses");
  return response.data;
};

export const addAddress = async (addressData: any) => {
  const response = await api.post("/user/addresses", addressData);
  return response.data;
};
export const updateAddress = async (id: number, addressData: any) => {
  const response = await api.patch("/user/addresses", { id, ...addressData });
  return response.data;
};
