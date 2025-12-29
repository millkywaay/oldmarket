import api from "./api";

export async function getProvinces() {
  try {
    const res = await api.get("/regions/provinces");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    throw error;
  }
}

export async function getRegencies(provinceCode: string) {
  try {
    const res = await api.get(`/regions/regencies/${provinceCode}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch regencies for province ${provinceCode}:`, error);
    throw error;
  }
}

export async function getDistricts(regencyCode: string) {
  try {
    const res = await api.get(`/regions/districts/${regencyCode}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch districts for regency ${regencyCode}:`, error);
    throw error;
  }
}

export async function getVillages(districtCode: string) {
  try {
    const res = await api.get(`/regions/villages/${districtCode}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch villages for district ${districtCode}:`, error);
    throw error;
  }
}