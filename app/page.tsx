import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import type { Product } from "@/lib/types";
import Storefront from "@/components/Storefront";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.featured), desc(productsTable.id));

  const products: Product[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    subtitle: r.subtitle,
    category: r.category as Product["category"],
    price: r.price,
    oldPrice: r.oldPrice,
    description: r.description,
    nameEn: r.nameEn,
    subtitleEn: r.subtitleEn,
    descriptionEn: r.descriptionEn,
    image: r.image,
    badge: r.badge,
    featured: r.featured,
    stock: r.stock,
  }));

  return <Storefront products={products} />;
}
