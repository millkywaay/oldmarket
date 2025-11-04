
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Product, Brand } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Filter, Star, ChevronDown, X } from 'lucide-react';

const AllProductsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and Sorting State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Mock data for filters
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = useMemo(() => new URLSearchParams(location.search).get('q'), [location.search]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialSort = params.get('sortBy');
    if (initialSort) {
        setSortBy(initialSort);
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsData, brandsData] = await Promise.all([
          productService.getAllProducts({ limit: 500 }), // Fetch all for client-side filtering
          productService.getBrands()
        ]);
        setAllProducts(productsData.items);
        setBrands(brandsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [location.search]);

  const handleBrandFilter = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };
  
  const handleSizeFilter = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply search query filter first
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.brand?.name.toLowerCase().includes(lowercasedQuery)
        );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand_id));
    }

    filtered = filtered.filter(p => p.price <= priceRange);
    
    // Size filtering is mocked as products don't have sizes
    if (selectedSizes.length > 0) {
      // This is placeholder logic. A real implementation would check product variants.
    }
    
    switch (sortBy) {
        case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id.localeCompare(a.id)); // Mocking newest by ID
            break;
        default:
            break;
    }

    return filtered;
  }, [allProducts, selectedBrands, priceRange, selectedSizes, sortBy, searchQuery]);

  const handleClearSearch = () => {
    navigate('/products');
  };

  const SidebarFilters = () => (
     <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <Filter className="w-5 h-5 text-gray-500" />
        </div>

        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Brands</h4>
            {brands.map(brand => (
              <label key={brand.id} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandFilter(brand.id)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-3 text-sm">{brand.name}</span>
              </label>
            ))}
        </div>

        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Price</h4>
            <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>IDR 50k</span>
                <span>IDR {priceRange.toLocaleString('id-ID')}</span>
            </div>
        </div>
        
        <div className="mb-6 border-t pt-4">
            <h4 className="font-medium mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeFilter(size)}
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
        
        <Button variant="primary" className="w-full !rounded-lg mt-4" onClick={() => setIsFiltersOpen(false)}>Apply Filters</Button>
    </div>
  );

  return (
    <>
      <header className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-black">All Products</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Find your perfect jersey from our curated collection, with advanced filters to narrow down your search.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8 items-start">
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-24">
              <SidebarFilters />
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Filter Button and Drawer */}
                <div className="lg:hidden mb-4">
                  <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)} leftIcon={<Filter size={16}/>}>
                    Filters
                  </Button>
                  {isFiltersOpen && (
                    <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsFiltersOpen(false)}></div>
                  )}
                  <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
                      <SidebarFilters />
                  </div>
                </div>

                {searchQuery && (
                  <div className="mb-6 bg-gray-100 p-4 rounded-lg flex justify-between items-center text-sm">
                      <p className="text-gray-800">
                        Showing results for: <strong className="font-semibold text-black">"{searchQuery}"</strong>
                      </p>
                      <Button variant="ghost" size="sm" onClick={handleClearSearch} leftIcon={<X size={14}/>}>
                        Clear
                      </Button>
                  </div>
                )}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-gray-600 text-sm">Showing {filteredAndSortedProducts.length} products</p>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sort-by" className="text-sm text-gray-600">Sort by:</label>
                        <select 
                            id="sort-by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-black font-medium focus:ring-black focus:border-black"
                        >
                          <option value="newest">Newest</option>
                          <option value="price_asc">Price: Low to High</option>
                          <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSpinner message="Fetching products..." />
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : filteredAndSortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-16">
                        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                        <p>Your search for "{searchQuery}" did not match any products.</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </>
  );
};

export default AllProductsPage;
