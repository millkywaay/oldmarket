import axios from "axios";

const baseUrl = import.meta.env.VITE_URL_BACKEND;

export const getShippingCost = async (
  destinationVillageCode: string,
  weightKg: number
) => {
  const res = await axios.get(
    `${baseUrl}/api/shipping`,
    {
      params: {
        destination: destinationVillageCode,
        weight: weightKg,
      },
    }
  );
  return res.data;
};
