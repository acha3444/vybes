export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "unpaid"

export type BusinessCategory = "restaurant" | "barber" | "beauty"

export type ProspectStatus =
  | "a_contacter"
  | "demo_envoyee"
  | "interesse"
  | "signe"
  | "perdu"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Prospect {
  id: string
  user_id: string
  google_place_id: string | null
  name: string
  category: BusinessCategory
  address: string | null
  city: string | null
  phone: string | null
  rating: number | null
  user_ratings_total: number
  status: ProspectStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DemoContent {
  business_name: string
  tagline: string
  about: string
  primary_color: string
  phone: string
  address: string
  opening_hours: string[]
  hero_image_url: string
  gallery_images: string[]
  services_or_menu: Array<{
    name: string
    price: string
    desc: string
    category?: string
    duration?: string
    badge?: string
  }>
  instagram_handle?: string
  rating?: number | null
  reviews_count?: number | null
}

export interface Demo {
  id: string
  prospect_id: string
  user_id: string
  slug: string
  template_type: BusinessCategory
  content: DemoContent
  views_count: number
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
  prospect?: Prospect
}

export interface DemoView {
  id: number
  demo_id: string
  ip_hash: string
  user_agent: string | null
  viewed_at: string
}
