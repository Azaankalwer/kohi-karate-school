import { Student } from '../types/student';

export const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    beltRank: "Green",
    email: "john.doe@email.com",
    phone: "555-0123",
    joinDate: "2023-09-15",
    dateOfBirth: "2010-05-15",
    notes: "Shows great potential in kata",
    status: "Active",
    emergencyContact: {
      name: "Jane Doe",
      phone: "555-0124"
    }
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    beltRank: "Brown 1",
    email: "sarah.smith@email.com",
    phone: "555-0125",
    joinDate: "2023-06-20",
    dateOfBirth: "2012-08-20",
    notes: "Excellent sparring technique",
    status: "Active",
    emergencyContact: {
      name: "Mike Smith",
      phone: "555-0126"
    }
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    beltRank: "Black 1",
    email: "michael.j@email.com",
    phone: "555-0126",
    joinDate: "2022-03-10",
    dateOfBirth: "2008-11-30",
    notes: "Assistant instructor for beginner classes",
    status: "Active",
    emergencyContact: {
      name: "Lisa Johnson",
      phone: "555-0127"
    }
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Brown",
    beltRank: "Purple",
    email: "emily.b@email.com",
    phone: "555-0127",
    joinDate: "2023-01-15",
    dateOfBirth: "2011-04-22",
    notes: "Particularly strong in weapons training",
    status: "Active",
    emergencyContact: {
      name: "Robert Brown",
      phone: "555-0128"
    }
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    beltRank: "Orange",
    email: "david.w@email.com",
    phone: "555-0128",
    joinDate: "2023-11-05",
    dateOfBirth: "2013-07-08",
    notes: "Showing rapid progress in basic techniques",
    status: "Active",
    emergencyContact: {
      name: "Mary Wilson",
      phone: "555-0129"
    }
  }
];