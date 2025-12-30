import React from 'react';
import { Address } from '../../types';
import { Home, Briefcase, X } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  onSelect: (addr: Address) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, addresses, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Pilih Alamat Pengiriman</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Belum ada alamat.</p>
          ) : (
            addresses.map((addr) => (
              <div 
                key={addr.id}
                onClick={() => onSelect(addr)}
                className="p-4 border rounded-xl cursor-pointer hover:border-black transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  {addr.label?.toLowerCase() === 'rumah' ? <Home size={14}/> : <Briefcase size={14}/>}
                  <span className="font-bold text-xs uppercase">{addr.label}</span>
                  {addr.is_default && <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded">UTAMA</span>}
                </div>
                <p className="font-semibold text-sm">{addr.recipient_name}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{addr.street}, {addr.city}, {addr.province}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressModal;