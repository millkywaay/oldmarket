import api from "./api";

export type UpdateProfilePayload = {
  name: string;
  phone?: string;
};

export const updateProfile = async (
  profileData: UpdateProfilePayload
) => {
  const response = await api.patch("/user/profile", profileData);
  return response.data;
};
