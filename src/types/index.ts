export type Role = "super_admin" | "owner";

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  radius: string;
}

export interface Socials {
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  website?: string;
}

export interface Restaurant {
  id: string;
  slug: string;
  custom_domain: string | null;
  name: string;
  description: string;
  meta_title: string;
  meta_description: string;
  logo_url: string | null;
  favicon_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  theme: Theme;
  socials: Socials;
  address: string;
  schedule: string;
  created_at: string;
  updated_at: string;
}

export type SectionType =
  | "hero"
  | "categories"
  | "offers"
  | "recommended"
  | "gallery"
  | "text"
  | "contact"
  | "custom"
  | "daily_menu";

export interface DailyMenuCourse {
  name: string;
  required: boolean;
  options: string[];
}

export interface Section {
  id: string;
  restaurant_id: string;
  type: SectionType;
  title: string;
  subtitle: string;
  content: Record<string, any>;
  visible: boolean;
  sort_order: number;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
  visible: boolean;
}

export interface Product {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  offer_price: number | null;
  is_offer: boolean;
  is_recommended: boolean;
  available: boolean;
  image_url: string | null;
  gallery_images: string[];
  ingredients: string[];
  allergens: string[];
  sort_order: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  restaurant_id: string | null;
}
