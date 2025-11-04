import React from 'react';
import { LOGO_TEXT } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center md:justify-start">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">{LOGO_TEXT}</h3>
            <p className="text-gray-400 max-w-xs">
              Your trusted destination for premium football jerseys and sports apparel.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
