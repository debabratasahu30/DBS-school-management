export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  ACCOUNTANT = 'ACCOUNTANT',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL'
}

export enum ExamType {
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT'
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  principalName: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  admissionNo: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  address: string;
  classId: string;
  guardianId: string;
  enrollmentDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Guardian {
  id: string;
  userId: string;
  relation: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  occupation?: string;
  income?: number;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  qualification: string;
  specialization?: string;
  experience: number;
  joiningDate: Date;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  capacity: number;
  classTeacherId?: string;
  schoolId: string;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  classId: string;
  teacherId: string;
  weeklyHours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Timetable {
  id: string;
  classId: string;
  subjectId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  subjectId: string;
  classId: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeeStructure {
  id: string;
  name: string;
  classId: string;
  amount: number;
  dueDate: Date;
  academicYear: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE';
  transactionId?: string;
  status: FeeStatus;
  receivedBy: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'ACADEMIC' | 'EVENT' | 'URGENT';
  targetAudience: UserRole[];
  publishedBy: string;
  publishDate: Date;
  expiryDate?: Date;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  leaveType: 'SICK' | 'PERSONAL' | 'FAMILY' | 'OTHER';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  appliedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher?: string;
  publicationYear?: number;
  totalCopies: number;
  availableCopies: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  fine?: number;
  issuedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: number;
  pendingFees: number;
  totalNotices: number;
  pendingLeaves: number;
  overdueBooks: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  schoolId: string;
}
