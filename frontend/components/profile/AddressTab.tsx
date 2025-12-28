import React, { useState } from 'react';
import { Plus, Home, Briefcase, Edit2 } from 'lucide-react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import * as addressService from '../../services/addressService';
import { Address } from '../../types';

interface AddressTabProps {
  addresses: Address[];
  fetchAddresses: () => Promise<void>;
}

const AddressTab: React.FC<AddressTabProps> = ({ addresses, fetchAddresses }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    recipient_name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postal_code: '',
    is_default: false,
  });

  const resetForm = () => {
    setFormData({ 
        label: '', 
        recipient_name: '', 
        phone: '', 
        street: '', 
        city: '', 
        province: '', 
        postal_code: '', 
        is_default: false 
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditClick = (addr: Address) => {
    setFormData({ ...addr });
    setEditingId(addr.id);
    setIsAdding(true);
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
      alert(editingId ? "Gagal memperbarui alamat" : "Gagal menambah alamat");
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
          <FormField label="Nomor Telepon" name="phone" value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required />
          <FormField label="Alamat Lengkap" name="street" value={formData.street} onChange={(e: any) => setFormData({...formData, street: e.target.value})} required />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField label="Kota" name="city" value={formData.city} onChange={(e: any) => setFormData({...formData, city: e.target.value})} required />
            <FormField label="Provinsi" name="province" value={formData.province} onChange={(e: any) => setFormData({...formData, province: e.target.value})} required />
            <FormField label="Kode Pos" name="postal_code" value={formData.postal_code} onChange={(e: any) => setFormData({...formData, postal_code: e.target.value})} required />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" isLoading={isLoading}>{editingId ? 'Simpan Perubahan' : 'Simpan Alamat'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {addresses.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              <p className="text-gray-400">Belum ada alamat tersimpan.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div 
                key={addr.id} 
                onClick={() => handleCardClick(addr)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                  addr.is_default 
                    ? 'border-black bg-gray-50 ring-1 ring-black' 
                    : 'border-gray-100 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-2">
                    {addr.label.toLowerCase() === 'rumah' ? <Home size={16}/> : <Briefcase size={16}/>}
                    <span className="font-bold uppercase text-sm tracking-wider">{addr.label}</span>
                    {addr.is_default && (
                      <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        UTAMA
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleEditClick(addr);
                    }} 
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                
                <p className="font-semibold text-gray-900">{addr.recipient_name} <span className="text-gray-400 font-normal">| {addr.phone}</span></p>
                <p className="text-sm text-gray-600 mt-1">{addr.street}, {addr.city}, {addr.province}, {addr.postal_code}</p>
                
                {!addr.is_default && (
                  <p className="text-[10px] text-gray-400 mt-3 italic font-medium">
                    Klik kartu untuk pilih sebagai alamat utama
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressTab;