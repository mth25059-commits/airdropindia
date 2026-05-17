export type AirdropRow = {
  id: string;
  slug: string;
  name: string;
  chain: string;
  description: string | null;
  estimated_value_usd: number | null;
  estimated_value_inr: number | null;
  deadline: string | null;
  difficulty: "easy" | "medium" | "hard" | null;
  status: "active" | "upcoming" | "ended";
  logo_url: string | null;
  official_url: string | null;
  steps: AirdropStep[] | null;
  tags: string[] | null;
  ai_generated_guide: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type AirdropStep = {
  title: string;
  body: string;
  image?: string | null;
};

export type SubscriberRow = {
  id: string;
  email: string;
  chains: string[];
  confirmed: boolean;
  confirm_token: string | null;
  unsubscribe_token: string;
  created_at: string;
  confirmed_at: string | null;
};

export type TaxCalculationRow = {
  id: string;
  user_id: string;
  asset_name: string | null;
  buy_price: number;
  sell_price: number;
  quantity: number;
  buy_date: string;
  sell_date: string;
  total_buy: number;
  total_sell: number;
  profit_loss: number;
  taxable_gain: number;
  base_tax: number;
  cess: number;
  total_tax: number;
  tds: number;
  created_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  related_airdrop_id: string | null;
  ai_generated: boolean;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      airdrops: {
        Row: AirdropRow;
        Insert: Partial<AirdropRow> & Pick<AirdropRow, "slug" | "name" | "chain">;
        Update: Partial<AirdropRow>;
      };
      subscribers: {
        Row: SubscriberRow;
        Insert: Partial<SubscriberRow> & Pick<SubscriberRow, "email">;
        Update: Partial<SubscriberRow>;
      };
      tax_calculations: {
        Row: TaxCalculationRow;
        Insert: Omit<TaxCalculationRow, "id" | "created_at">;
        Update: Partial<TaxCalculationRow>;
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Partial<BlogPostRow> & Pick<BlogPostRow, "slug" | "title">;
        Update: Partial<BlogPostRow>;
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Partial<ContactMessageRow> & Pick<ContactMessageRow, "name" | "email" | "message">;
        Update: Partial<ContactMessageRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
