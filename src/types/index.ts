
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

export interface Class {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FeeHead {
  id: string;
  name: string;
  description?: string;
  amount: number;
  isOneTime: boolean; // true for one-time, false for monthly
  isActive: boolean;
  createdAt: string;
  classIds?: string[]; // Classes this fee applies to
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeHeadId: string;
  amount: number;
  paidDate: string;
  academicSessionId: string;
  month?: string; // Applicable for monthly payments
  receiptNumber: string;
  paymentMethod: string;
  accountantId: string; // Added field to track which accountant processed the payment
  status: 'paid' | 'pending' | 'overdue';
}
