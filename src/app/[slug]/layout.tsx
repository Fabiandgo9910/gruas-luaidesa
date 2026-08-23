import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRestaurantBySlugOrDomain } from "@/lib/data";
import { hexToRgbChannels } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const restaurant = await getRestaurantBySlugOrDomain(params.slug);
  if (!restaurant) return {};

  return {
    title: restaurant.meta_title || restaurant.name,
    description: restaurant.meta_description || restaurant.description,
    icons: restaurant.favicon_url
      ? { icon: restaurant.favicon_url, apple: restaurant.favicon_url }
      : undefined,
    openGraph: {
      title: restaurant.meta_title || restaurant.name,
      description: restaurant.meta_description || restaurant.description,
      images: restaurant.cover_url ? [restaurant.cover_url] : undefined,
    },
  };
}

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const restaurant = await getRestaurantBySlugOrDomain(params.slug);
  if (!restaurant) notFound();

  const t = restaurant.theme;

  return (
    <div
      style={
        {
          "--color-primary": hexToRgbChannels(t.primaryColor),
          "--color-secondary": hexToRgbChannels(t.secondaryColor),
          "--color-bg": hexToRgbChannels(t.backgroundColor),
          "--color-text": hexToRgbChannels(t.textColor),
          "--font-theme": t.font,
          "--radius-theme": t.radius,
        } as React.CSSProperties
      }
      className="min-h-screen bg-bg text-text font-theme"
    >
      {children}
    </div>
  );
}
