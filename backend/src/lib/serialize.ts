/* eslint-disable @typescript-eslint/no-explicit-any */

export function serializeProduct(product: any) {
  return {
    ...product,
    id: product.id.toString(),
    brand_id: product.brand_id?.toString?.() ?? null,
    price: Number(product.price),
    brand: product.brand
      ? { ...product.brand, id: product.brand.id.toString() }
      : null,
    images: product.images?.map((img: any) => ({
      ...img,
      id: img.id.toString(),
      product_id: img.product_id.toString(),
    })),
  };
}
export function serializeData(data: any): any {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}