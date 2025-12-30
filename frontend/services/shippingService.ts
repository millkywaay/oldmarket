import axios from "axios";

export const getShippingCost = async (
  destinationVillageCode: string,
  weightKg: number
) => {
  const res = await axios.get(
    "http://localhost:3000/api/shipping",
    {
      params: {
        destination: destinationVillageCode,
        weight: weightKg,
      },
    }
  );
  return res.data;
};
