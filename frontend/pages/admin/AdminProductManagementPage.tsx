
import React, { useEffect, useState, useCallback } from 'react';
import { Product, Brand } from '../../types';
import * as adminService from '../../services/adminService';
import * as productService from '../../services/productService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import { DEFAULT_CURRENCY } from '../../constants';
import { Edit, Trash, Plus, X } from 'lucide-react';

interface ProductFormProps {
  initialProduct?: Product | null;
  brands: Brand[];
  onSubmit: (productData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, brands, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price || 0,
    stock_quantity: initialProduct?.stock_quantity || 0,
    image_url: initialProduct?.image_url || '',
    brand_id: initialProduct?.brand_id || (brands.length > 0 ? brands[0].id : ''),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['price', 'stock_quantity'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{initialProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <Button variant="ghost" size="sm" onClick={onCancel} className="!rounded-full !p-2"><X/></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
              <FormField as="textarea" label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Price (IDR)" name="price" type="number" value={formData.price.toString()} onChange={handleChange} required min="0" step="1000"/>
                <FormField label="Stock Quantity" name="stock_quantity" type="number" value={formData.stock_quantity.toString()} onChange={handleChange} required min="0"/>
              </div>
              <FormField label="Image URL" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              <FormField as="select" label="Brand" name="brand_id" value={formData.brand_id} onChange={handleChange} required>
                {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
              </FormField>
              <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="primary" isLoading={isSubmitting}>{initialProduct ? 'Save Changes' : 'Add Product'}</Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
              </div>
            </form>
        </div>
    </div>
  );
};


const AdminProductManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductsAndBrands = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [productsResponse, brandsData] = await Promise.all([
        productService.getAllProducts({ limit: 100 }),
        productService.getBrands()
      ]);
      setProducts(productsResponse.items);
      setBrands(brandsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProductsAndBrands();
  }, [fetchProductsAndBrands]);

  const handleFormSubmit = async (productData: any) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await adminService.editProduct(token, editingProduct.id, productData);
      } else {
        await adminService.addProduct(token, productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      await fetchProductsAndBrands();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminService.deleteProduct(token, productId);
        fetchProductsAndBrands();
      } catch (err: any) {
        setError(err.message || 'Failed to delete product.');
      }
    }
  };

  const handleEditProduct = (product: Product) => { setEditingProduct(product); setShowForm(true); };
  const handleAddNewProduct = () => { setEditingProduct(null); setShowForm(true); };
  
  if (isLoading && products.length === 0) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-100 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Button onClick={handleAddNewProduct} variant="primary" leftIcon={<Plus size={16}/>}>
          Add Product
        </Button>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      {showForm && (
        <ProductForm 
          initialProduct={editingProduct}
          brands={brands}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          isSubmitting={isSubmitting}
        />
      )}

      {isLoading && products.length > 0 && <LoadingSpinner message="Updating product list..." />}
      
      {!isLoading && products.length === 0 && !showForm && (
        <p className="text-gray-600 text-center py-10">No products found. Click "Add Product" to get started.</p>
      )}

      {!isLoading && products.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                            <img src={product.image_url || `https://picsum.photos/seed/${product.id}/50/50`} alt={product.name} className="w-12 h-12 object-cover rounded-md"/>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {brands.find(b => b.id === product.brand_id)?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{DEFAULT_CURRENCY} {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)} className="!rounded-md !p-2" title="Edit Product"><Edit size={16}/></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:bg-red-50 !rounded-md !p-2" title="Delete Product"><Trash size={16}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagementPage;