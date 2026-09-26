import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { Specifications } from "@/components/product/Specifications";
import { RelatedProducts } from "@/components/product/RelatedProducts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — TIMEORA`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-6">
          <ProductInfo product={product} />
        </div>
      </div>

      <div className="max-w-[900px]">
        <Specifications product={product} />
        <RelatedProducts product={product} />
      </div>
    </div>
  );
}
