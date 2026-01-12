import axios from "axios";

export const getShippingCost = async (
  destinationVillageCode: string,
  weightKg: number
) => {
  const res = await axios.get(
    "https://oldmarket.vercel.app/api/shipping",
    {
      params: {
        destination: destinationVillageCode,
        weight: weightKg,
      },
    }
  );
  return res.data;
};
