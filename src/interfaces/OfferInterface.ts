export interface Offer {
  id: number;
  title: string;
  image: string;
  description: string;
  from_date_time: string; // Format: "YYYY-MM-DD HH:mm:ss"
  to_date_time: string; // Format: "YYYY-MM-DD HH:mm:ss"
  created_at?: string;
  updated_at?: string;
}
