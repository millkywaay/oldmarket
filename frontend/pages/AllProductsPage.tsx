import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Product, Brand, Size } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Filter, X } from 'lucide-react';

const AllProductsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000000); // Digunakan untuk filter harga
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Digunakan untuk mobile responsive

  const location = useLocation();
  const searchQuery = useMemo(() => new URLSearchParams(location.search).get('q'), [location.search]);
  
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsData, brandsData] = await Promise.all([
          productService.getAllProducts(),
          productService.getBrands()
        ]);
        setAllProducts(productsData);
        setBrands(brandsData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data dari database.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.description?.toLowerCase().includes(lowercasedQuery)
        );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand_id.toString()));
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.size && selectedSizes.includes(p.size));
    }

    filtered = filtered.filter(p => p.price <= priceRange);
    
    switch (sortBy) {
        case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
    }

    return filtered;
  }, [allProducts, selectedBrands, priceRange, selectedSizes, sortBy, searchQuery]);

  const SidebarFilters = () => (
     <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Filter className="w-5 h-5 text-gray-500" />
        </div>

        {/* Filter Brand */}
        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Brands</h4>
            {brands.map(brand => (
              <label key={brand.id} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id.toString())}
                  onChange={() => {
                    const id = brand.id.toString();
                    setSelectedBrands(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-3 text-sm">{brand.name}</span>
              </label>
            ))}
        </div>

        {/* Filter Harga  */}
        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Max Price</h4>
            <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Rp 0</span>
                <span className="font-bold text-black">Rp {priceRange.toLocaleString('id-ID')}</span>
            </div>
        </div>
        
        {/* Filter Size */}
        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(Size).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    selectedSizes.includes(size) 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
        </div>
        
        <Button variant="primary" className="w-full mt-4 lg:hidden" onClick={() => setIsFiltersOpen(false)}>
          Tampilkan Produk
        </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8 items-start">
            <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-24">
              <SidebarFilters />
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <div className="lg:hidden mb-4">
                  <Button variant="outline" onClick={() => setIsFiltersOpen(true)} leftIcon={<Filter size={16}/>}>
                    Filters
                  </Button>
                  
                  {isFiltersOpen && (
                    <>
                      <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsFiltersOpen(false)}></div>
                      <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl overflow-y-auto">
                        <div className="p-4 flex justify-end">
                          <button onClick={() => setIsFiltersOpen(false)}><X size={24}/></button>
                        </div>
                        <SidebarFilters />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-gray-600 text-sm">Menampilkan {filteredAndSortedProducts.length} produk</p>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm font-medium">
                        <option value="newest">Terbaru</option>
                        <option value="price_asc">Harga: Rendah ke Tinggi</option>
                        <option value="price_desc">Harga: Tinggi ke Rendah</option>
                    </select>
                </div>

                {isLoading ? (
                    <LoadingSpinner message="Mengambil produk..." />
                ) : error ? (
                    <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg">{error}</div>
                ) : filteredAndSortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-16">
                        <h3 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h3>
                        <p>Coba sesuaikan filter atau kata pencarian Anda.</p>
                    </div>
                )}
            </main>
        </div>
    </div>
  );
};

export default AllProductsPage;