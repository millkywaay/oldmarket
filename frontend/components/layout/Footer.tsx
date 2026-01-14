import * as React from 'react';
import { Phone, Instagram, Mail } from 'lucide-react'; 
import { LOGO_TEXT } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6 tracking-tighter">{LOGO_TEXT}</h3>
            <p className="text-gray-400 leading-relaxed">
              Transformasi digital untuk pengalaman belanja jaket bulu angsa premium yang lebih cerdas dan terintegrasi.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Navigasi</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/home" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Koleksi Produk</a></li>
              <li><a href="/top-selling" className="hover:text-white transition-colors">Produk Terlaris</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Bantuan</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat dan Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Hubungi Kami</h4>
            <div className="flex flex-col space-y-4">
              <a href="https://wa.me/6281399100200" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-green-600 transition-colors">
                  <Phone size={18} />
                </div>
                <span>+6281399100200</span>
              </a>
              <a href="https://instagram.com/.id" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-pink-600 transition-colors">
                  <Instagram size={18} />
                </div>
                <span>@oldmarketjkt</span>
              </a>
              <a href="mailto:info@oldmarketjkt.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-2 bg-gray-900 rounded-full group-hover:bg-red-600 transition-colors">
                  <Mail size={18} />
                </div>
                <span>oldmarketjkt@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} {LOGO_TEXT}. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;