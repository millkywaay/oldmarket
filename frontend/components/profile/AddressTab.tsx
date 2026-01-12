import * as React from "react";
import  { useEffect, useState } from 'react';
import { Trash2, Plus, Home, Briefcase, Edit2 } from 'lucide-react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import * as addressService from '../../services/addressService';
import * as regionService from '../../services/regionService';
import { Address } from '../../types';

interface AddressTabProps {
  addresses: Address[];
  fetchAddresses: () => Promise<void>;
}

const AddressTab: React.FC<AddressTabProps> = ({ addresses, fetchAddresses }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    street: '',
    province: '',
    province_code: '',
    city: '',
    city_code: '',
    district: '',
    district_code: '',
    village: '',
    village_code: '',
    postal_code: '',
    is_default: false,
  });

  const resetForm = () => {
    setFormData({ 
      label: '', recipient_name: '', phone: '', street: '',
      province: '', province_code: '',
      city: '', city_code: '',
      district: '', district_code: '',
      village: '', village_code: '',
      postal_code: '', is_default: false,
    });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setIsAdding(false);
    setEditingId(null);
  };

  useEffect(() => {
    if (isAdding) loadProvinces();
  }, [isAdding]);

  const loadProvinces = async () => {
    try {
      const res = await regionService.getProvinces();
      setProvinces(Array.isArray(res) ? res : (res?.data || []));
    } catch (error) {
      console.error("Gagal memuat provinsi", error);
    }
  };

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    
    setFormData(prev => ({ 
      ...prev, 
      province: name, province_code: code, 
      city: '', city_code: '', district: '', district_code: '', village: '', village_code: '' 
    }));
    
    if (code) {
      try {
        const res = await regionService.getRegencies(code);
        const data = Array.isArray(res) ? res : (res?.data || []);
        setRegencies(data);
      } catch (error) {
        setRegencies([]);
      }
    }
  };

  const handleRegencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ 
      ...prev, 
      city: name, city_code: code, 
      district: '', district_code: '', village: '', village_code: '' 
    }));

    if (code) {
      try {
        const res = await regionService.getDistricts(code);
        const data = Array.isArray(res) ? res : (res?.data || []);
        setDistricts(data);
      } catch (error) {
        setDistricts([]);
      }
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setFormData(prev => ({ 
      ...prev, 
      district: name, district_code: code, village: '', village_code: '' 
    }));

    if (code) {
      try {
        const res = await regionService.getVillages(code);
        const data = Array.isArray(res) ? res : (res?.data || []);
        setVillages(data);
      } catch (error) {
        setVillages([]);
      }
    }
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData(prev => ({ ...prev, village: name, village_code: code }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus alamat ini?")) {
      try {
        await addressService.deleteAddress(id);
        fetchAddresses();
      } catch (error) {
        alert("Gagal menghapus alamat");
      }
    }
  };

  const handleEditClick = async (addr: Address) => {
    setIsLoading(true);
    try {
      setFormData({
        label: addr.label || '',
        recipient_name: addr.recipient_name || '',
        phone: addr.phone || '',
        street: addr.street || '',
        province: addr.province || '',
        province_code: addr.province_code || '',
        city: addr.city || '',
        city_code: addr.city_code || '',
        district: addr.district || '',
        district_code: addr.district_code || '',
        village: addr.village || '',
        village_code: addr.village_code || '',
        postal_code: addr.postal_code || '',
        is_default: addr.is_default || false,
      });

      const [regData, distData, villData] = await Promise.all([
        addr.province_code ? regionService.getRegencies(addr.province_code) : [],
        addr.city_code ? regionService.getDistricts(addr.city_code) : [],
        addr.district_code ? regionService.getVillages(addr.district_code) : []
      ]);

      setRegencies(Array.isArray(regData) ? regData : (regData?.data || []));
      setDistricts(Array.isArray(distData) ? distData : (distData?.data || []));
      setVillages(Array.isArray(villData) ? villData : (villData?.data || []));

      setEditingId(addr.id);
      setIsAdding(true);
    } catch (error) {
      alert("Gagal memuat detail wilayah");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCardClick = async (addr: Address) => {
    if (addr.is_default || isLoading) return;
    setIsLoading(true);
    try {
      await addressService.updateAddress(addr.id, { is_default: true });
      await fetchAddresses();
    } catch (error) {
      alert("Gagal mengubah alamat utama");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData);
      } else {
        await addressService.addAddress(formData);
      }
      await fetchAddresses();
      resetForm();
    } catch (error) {
      alert("Gagal menyimpan alamat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Alamat Saya</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} leftIcon={<Plus size={18} />}>
            Tambah Alamat
          </Button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-black space-y-4 shadow-sm">
          <h3 className="font-bold text-lg">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Label Alamat" name="label" value={formData.label} onChange={(e: any) => setFormData({...formData, label: e.target.value})} required />
            <FormField label="Nama Penerima" name="recipient_name" value={formData.recipient_name} onChange={(e: any) => setFormData({...formData, recipient_name: e.target.value})} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nomor Telepon" name="phone" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required />
            <FormField label="Kode Pos" name="postal_code" value={formData.postal_code} onChange={(e: any) => setFormData({...formData, postal_code: e.target.value})} required />
          </div>

          <FormField label="Alamat Lengkap" name="street" value={formData.street} onChange={(e: any) => setFormData({...formData, street: e.target.value})} required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Provinsi</label>
              <select 
                className="border p-2 rounded-lg bg-white outline-none"
                value={formData.province_code}
                onChange={handleProvinceChange}
                required
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((p: any) => <option key={p.code} value={p.code}>{p.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Kota/Kabupaten</label>
              <select 
                className="border p-2 rounded-lg bg-white disabled:bg-gray-100 outline-none"
                disabled={!formData.province_code}
                value={formData.city_code}
                onChange={handleRegencyChange}
                required
              >
                <option value="">Pilih Kota/Kabupaten</option>
                { regencies.map((r: any) => <option key={r.code} value={r.code}>{r.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Kecamatan</label>
              <select 
                className="border p-2 rounded-lg bg-white disabled:bg-gray-100 outline-none"
                disabled={!formData.city_code}
                value={formData.district_code}
                onChange={handleDistrictChange}
                required
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((d: any) => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Kelurahan/Desa</label>
              <select 
                className="border p-2 rounded-lg bg-white disabled:bg-gray-100 outline-none"
                disabled={!formData.district_code}
                value={formData.village_code}
                onChange={handleVillageChange}
                required
              >
                <option value="">Pilih Kelurahan/Desa</option>
                {villages.map((v: any) => <option key={v.code} value={v.code}>{v.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" isLoading={isLoading}>{editingId ? 'Simpan Perubahan' : 'Simpan Alamat'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              onClick={() => handleCardClick(addr)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                addr.is_default ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-100 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-2">
                  {(addr.label || '').toLowerCase() === 'rumah' ? <Home size={16}/> : <Briefcase size={16}/>}
                  <span className="font-bold uppercase text-sm tracking-wider">{addr.label}</span>
                  {addr.is_default && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">UTAMA</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEditClick(addr); }} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }} className="p-1.5 hover:bg-red-100 rounded-lg text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-gray-900">{addr.recipient_name} <span className="text-gray-400 font-normal">| {addr.phone}</span></p>
              <p className="text-sm text-gray-600 mt-1">{addr.street}, {addr.village}, {addr.district}, {addr.city}, {addr.province}, {addr.postal_code}</p>
              {!addr.is_default && (
                <p className="text-[10px] text-gray-400 mt-3 italic font-medium">Klik kartu untuk pilih sebagai alamat utama</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressTab;