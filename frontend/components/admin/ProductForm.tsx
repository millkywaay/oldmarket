import * as React from "react";
import { useState } from "react";
import { Brand, Size } from "../../types";
import Button from "../common/Button";
import FormField from "../common/FormField";
import ProductImageUploader from "./ProductImageUploader";

interface ProductFormProps {
  initialData?: any;
  brands: Brand[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({
  initialData,
  brands,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [images, setImages] = useState<any[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((img: any) => ({
          url: img.image_url,
          isCover: img.is_thumbnail,
        }))
      : initialData?.image_url
      ? [{ url: initialData.image_url, isCover: true }]
      : []
  );
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock_quantity: initialData?.stock_quantity || 0,
    brand_id: initialData?.brand_id || (brands.length > 0 ? brands[0].id : ""),
    size: initialData?.size || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "stock_quantity"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmitLocal = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...form,
      images: images.map((img: any) => ({
        image_url: img.url,
        is_thumbnail: img.isCover,
      })),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmitLocal} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormField
          as="select"
          label="Brand"
          name="brand_id"
          value={form.brand_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </FormField>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <ProductImageUploader images={images} setImages={setImages} />
      </div>

      <FormField
        as="textarea"
        label="Description"
        name="description"
        rows={4}
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="Price (Rp)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <FormField
          as="select"
          label="Size (Ukuran)"
          name="size"
          value={form.size}
          onChange={handleChange}
          required
        >
          <option value="">Select Size</option>
          {Object.values(Size).map((s) => (
            <option key={s as string} value={s as string}>
              {s as string}
            </option>
          ))}
        </FormField>
        <FormField
          label="Stock"
          name="stock_quantity"
          type="number"
          value={form.stock_quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialData ? "Update Product" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
