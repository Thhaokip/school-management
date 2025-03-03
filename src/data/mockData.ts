
import { SchoolProfile, AcademicSession, Student, Accountant } from "@/types";

export const mockSchoolProfile: SchoolProfile = {
  id: "1",
  name: "Oakridge International School",
  address: "123 Education Lane",
  city: "Springfield",
  state: "IL",
  zipCode: "62704",
  phone: "(555) 123-4567",
  email: "info@oakridge.edu",
  website: "www.oakridge.edu",
  established: "1985",
  description: "Oakridge International School is committed to providing quality education with a focus on holistic development of students."
};

export const mockAcademicSessions: AcademicSession[] = [
  {
    id: "1",
    name: "2023-2024",
    startDate: "2023-06-01",
    endDate: "2024-04-30",
    isActive: true
  },
  {
    id: "2",
    name: "2022-2023",
    startDate: "2022-06-01",
    endDate: "2023-04-30",
    isActive: false
  },
  {
    id: "3",
    name: "2021-2022",
    startDate: "2021-06-01",
    endDate: "2022-04-30",
    isActive: false
  }
];

export const mockStudents: Student[] = [
  {
    id: "1",
    studentId: "OAK2023001",
    name: "Emily Johnson",
    class: "10",
    section: "A",
    rollNumber: "1001",
    parentName: "Michael Johnson",
    contactNumber: "(555) 234-5678",
    email: "emily.j@example.com",
    joinDate: "2020-06-15"
  },
  {
    id: "2",
    studentId: "OAK2023002",
    name: "Daniel Smith",
    class: "9",
    section: "B",
    rollNumber: "902",
    parentName: "Sarah Smith",
    contactNumber: "(555) 345-6789",
    joinDate: "2021-05-20"
  },
  {
    id: "3",
    studentId: "OAK2023003",
    name: "Sophia Williams",
    class: "11",
    section: "A",
    rollNumber: "1103",
    parentName: "Robert Williams",
    contactNumber: "(555) 456-7890",
    email: "sophia.w@example.com",
    joinDate: "2019-06-10"
  },
  {
    id: "4",
    studentId: "OAK2023004",
    name: "Ethan Brown",
    class: "8",
    section: "C",
    rollNumber: "804",
    parentName: "Jennifer Brown",
    contactNumber: "(555) 567-8901",
    joinDate: "2022-06-05"
  },
  {
    id: "5",
    studentId: "OAK2023005",
    name: "Olivia Davis",
    class: "12",
    section: "B",
    rollNumber: "1205",
    parentName: "James Davis",
    contactNumber: "(555) 678-9012",
    email: "olivia.d@example.com",
    joinDate: "2018-06-12"
  }
];

export const mockAccountants: Accountant[] = [
  {
    id: "1",
    name: "Alexander Morgan",
    email: "alex.morgan@oakridge.edu",
    phone: "(555) 789-0123",
    address: "456 Finance Street, Springfield, IL",
    joinDate: "2020-03-15",
    isActive: true
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@oakridge.edu",
    phone: "(555) 890-1234",
    joinDate: "2021-07-10",
    isActive: true
  }
];
