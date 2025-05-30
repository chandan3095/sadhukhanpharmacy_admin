export interface Doctor {
  id: number;
  name: string;
  degree: string;
  specialist: string | null;
  mobile: string | null;
  created_at: string;
  updated_at: string;
  visitingDays?: string[];
  fromTime?: string;
  toTime?: string;
  image?: string | null;
}
