export interface DoctorDetails {
  id: number;
  name: string;
  degree: string;
  specialist: string;
  image?: string | null;
}

export interface DoctorVisitingDays {
  doctor_name?: string;
  id: string;
  day?: string;
  start_time?: string;
  end_time?: string;
}

// export interface DoctorList {
//   id: number;
//   doctor_id: number;
//   day: string;
//   start_time: string;
//   end_time: string;
//   is_active: number;
//   created_at: string;
//   updated_at: string;
//   doctor: DoctorDetails;
// }
