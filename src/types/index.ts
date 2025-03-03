
export interface SchoolProfile {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  established?: string;
  description?: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName: string;
  contactNumber: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  joinDate?: string;
  image?: string;
}

export interface Accountant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  joinDate: string;
  isActive: boolean;
}
