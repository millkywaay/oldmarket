import { prisma } from "@/lib/prisma";

export const getShippingCost = async (
  addressId: number,
  totalWeight: number
) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || !address.village_code) {
    throw new Error("Alamat tujuan atau Village Code tidak ditemukan.");
  }

  const ORIGIN_VILLAGE_CODE = process.env.STORE_VILLAGE_CODE || "3172051003";
  const destinationCode = address.village_code;
  const response = await fetch(
    `https://use.api.co.id/expedition/shipping-cost?origin_village_code=${ORIGIN_VILLAGE_CODE}&destination_village_code=${destinationCode}&weight=${totalWeight}`,
    {
      headers: {
        "x-api-co-id": process.env.API_CO_ID_KEY as string,
      },
    }
  );

  const result = await response.json();

  if (!result.is_success) {
    throw new Error(result.message || "Gagal mendapatkan estimasi ongkir");
  }

  return result.data;
};
