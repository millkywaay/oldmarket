import React, { useState, useEffect } from "react";
import FormField from "../common/FormField";
import Button from "../common/Button";
import * as userService from "../../services/userService";

interface ProfileTabProps {
  user: any;
  checkAuth: () => Promise<void>;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, checkAuth }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await userService.updateProfile(formData);
      await checkAuth(); 
      setIsEditing(false); 
      alert("Profil diperbarui!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Gagal memperbarui profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Informasi Pribadi</h2>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profil
          </Button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nama Lengkap</label>
            <p className="font-medium text-gray-900">{user?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Nomor Telepon</label>
            <p className="font-medium text-gray-900">{user?.phone || "Belum diatur"}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Nama Lengkap"
            name="name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormField
            label="Nomor Telepon"
            name="phone"
            value={formData.phone}
            onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit" isLoading={isLoading}>Simpan</Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileTab;