export interface DoctorDetails {
  id: number;
  name: string;
  degree: string;
  specialist: string | null;
  image?: string | null;
}

export interface DoctorVisitingDays {
  doctor_id: string;
  day?: string;
  start_time?: string;
  end_time?: string;
}

export interface Doctor {
  doctorDetails: DoctorDetails;
  visitingDays: DoctorVisitingDays;
  created_at: string;
  updated_at: string;
}
