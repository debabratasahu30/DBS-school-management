import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.bookIssue.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.leaveApplication.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  // Create School
  const school = await prisma.school.create({
    data: {
      name: 'Greenwood International School',
      code: 'GIS2024',
      address: '123 Education Lane, Academic City',
      phone: '+1-555-0123',
      email: 'info@greenwood.edu',
      website: 'https://greenwood.edu',
      principalName: 'Dr. Sarah Johnson',
      academicYear: '2024-2025',
    },
  });
  console.log('✅ School created');

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // Create Admin User
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@greenwood.edu',
      password: adminPassword,
      role: 'ADMIN',
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1-555-0100',
      schoolId: school.id,
    },
  });
  console.log('✅ Admin user created');

  // Create Accountant User
  const accountantPassword = await hashPassword('accountant123');
  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@greenwood.edu',
      password: accountantPassword,
      role: 'ACCOUNTANT',
      firstName: 'Robert',
      lastName: 'Johnson',
      phone: '+1-555-0200',
      schoolId: school.id,
    },
  });
  console.log('✅ Accountant user created');

  // Create Teachers
  const teachers = [];
  const teacherData = [
    { firstName: 'Emily', lastName: 'Brown', subject: 'Mathematics', qualification: 'M.Sc. Mathematics', experience: 8 },
    { firstName: 'Michael', lastName: 'Davis', subject: 'Physics', qualification: 'M.Sc. Physics', experience: 6 },
    { firstName: 'Sarah', lastName: 'Wilson', subject: 'Chemistry', qualification: 'M.Sc. Chemistry', experience: 7 },
    { firstName: 'James', lastName: 'Taylor', subject: 'English', qualification: 'M.A. English', experience: 10 },
    { firstName: 'Lisa', lastName: 'Anderson', subject: 'Biology', qualification: 'M.Sc. Biology', experience: 5 },
    { firstName: 'Robert', lastName: 'Martinez', subject: 'History', qualification: 'M.A. History', experience: 9 },
    { firstName: 'Jennifer', lastName: 'Garcia', subject: 'Geography', qualification: 'M.A. Geography', experience: 4 },
    { firstName: 'David', lastName: 'Lee', subject: 'Computer Science', qualification: 'B.Tech CS', experience: 3 },
    { firstName: 'Maria', lastName: 'Rodriguez', subject: 'Art', qualification: 'B.F.A', experience: 6 },
    { firstName: 'William', lastName: 'Clark', subject: 'Physical Education', qualification: 'B.P.Ed', experience: 12 },
  ];

  for (let i = 0; i < teacherData.length; i++) {
    const t = teacherData[i];
    const password = await hashPassword('teacher123');
    const user = await prisma.user.create({
      data: {
        email: `${t.firstName.toLowerCase()}.${t.lastName.toLowerCase()}@greenwood.edu`,
        password,
        role: 'TEACHER',
        firstName: t.firstName,
        lastName: t.lastName,
        phone: `+1-555-01${i + 1}`,
        schoolId: school.id,
      },
    });
    const teacher = await prisma.teacher.create({
      data: {
        userId: user.id,
        employeeId: `TCH${String(i + 1).padStart(4, '0')}`,
        qualification: t.qualification,
        specialization: t.subject,
        experience: t.experience,
        joiningDate: new Date('2020-01-15'),
        salary: 50000 + (i * 2000),
        status: 'ACTIVE',
      },
    });
    teachers.push({ user, teacher });
  }
  console.log('✅ 10 Teachers created');

  // Create Classes
  const classes = [];
  const classData = [
    { grade: '9', section: 'A', capacity: 30, teacherIndex: 0 },
    { grade: '9', section: 'B', capacity: 30, teacherIndex: 1 },
    { grade: '10', section: 'A', capacity: 30, teacherIndex: 2 },
  ];

  for (const c of classData) {
    const classRecord = await prisma.class.create({
      data: {
        name: `Grade ${c.grade}-${c.section}`,
        grade: c.grade,
        section: c.section,
        capacity: c.capacity,
        classTeacherId: teachers[c.teacherIndex].teacher.id,
        schoolId: school.id,
        academicYear: '2024-2025',
      },
    });
    classes.push(classRecord);
  }
  console.log('✅ 3 Classes created');

  // Create Subjects for each class
  const subjectNames = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology', 'History', 'Computer Science'];
  const subjects = [];

  for (const classRecord of classes) {
    for (let i = 0; i < subjectNames.length; i++) {
      const subject = await prisma.subject.create({
        data: {
          name: subjectNames[i],
          code: `${classRecord.grade}${classRecord.section}-${subjectNames[i].substring(0, 3).toUpperCase()}`,
          classId: classRecord.id,
          teacherId: teachers[i % teachers.length].teacher.id,
          weeklyHours: 5,
        },
      });
      subjects.push(subject);
    }
  }
  console.log('✅ 21 Subjects created');

  // Create Guardians and Students
  const students = [];
  const guardians = [];
  const firstNames = ['Alex', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack', 'Scarlett', 'Aiden', 'Grace', 'Owen', 'Lily', 'Samuel', 'Aria', 'Ryan', 'Chloe', 'Nathan', 'Penelope', 'Caleb', 'Layla', 'Dylan', 'Mila', 'Luke', 'Zoey', 'Isaac', 'Hazel'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const classIndex = i % classes.length;

    // Create Guardian
    const guardianPassword = await hashPassword('parent123');
    const guardianUser = await prisma.user.create({
      data: {
        email: `guardian${i}@greenwood.edu`,
        password: guardianPassword,
        role: 'PARENT',
        firstName: firstName,
        lastName: lastName,
        phone: `+1-555-02${i}`,
        schoolId: school.id,
      },
    });
    const guardian = await prisma.guardian.create({
      data: {
        userId: guardianUser.id,
        relation: i % 2 === 0 ? 'FATHER' : 'MOTHER',
        occupation: 'Business',
        income: 75000,
        emergencyContact: `+1-555-02${i}`,
      },
    });
    guardians.push(guardian);

    // Create Student
    const studentPassword = await hashPassword('student123');
    const studentUser = await prisma.user.create({
      data: {
        email: `student${i}@greenwood.edu`,
        password: studentPassword,
        role: 'STUDENT',
        firstName: firstName,
        lastName: lastName,
        phone: `+1-555-03${i}`,
        schoolId: school.id,
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        admissionNo: `ADM${String(2024 + i).padStart(6, '0')}`,
        dateOfBirth: new Date(2008 + (i % 4), (i % 12), (i % 28) + 1),
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        address: `${i + 1} Student Street, Education City`,
        classId: classes[classIndex].id,
        guardianId: guardian.id,
        enrollmentDate: new Date('2024-04-01'),
        status: 'ACTIVE',
      },
    });
    students.push(student);
  }
  console.log('✅ 50 Students and 50 Guardians created');

  // Create Timetable
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  const timeSlots = [
    { start: '08:00', end: '08:45' },
    { start: '08:50', end: '09:35' },
    { start: '09:40', end: '10:25' },
    { start: '10:40', end: '11:25' },
    { start: '11:30', end: '12:15' },
    { start: '13:00', end: '13:45' },
    { start: '13:50', end: '14:35' },
  ];

  for (const classRecord of classes) {
    const classSubjects = subjects.filter(s => s.classId === classRecord.id);
    for (const day of daysOfWeek) {
      for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
        const subject = classSubjects[slotIndex % classSubjects.length];
        await prisma.timetable.create({
          data: {
            classId: classRecord.id,
            subjectId: subject.id,
            dayOfWeek: day,
            startTime: timeSlots[slotIndex].start,
            endTime: timeSlots[slotIndex].end,
            roomNumber: `R${classRecord.grade}${classRecord.section}-${slotIndex + 1}`,
          },
        });
      }
    }
  }
  console.log('✅ Timetable created');

  // Create Attendance for 6 months
  const today = new Date();
  for (let i = 0; i < 180; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

    for (const student of students) {
      const status = Math.random() > 0.1 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'LATE');
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status,
          remarks: status === 'ABSENT' ? 'Sick leave' : null,
          markedBy: admin.id,
        },
      });
    }
  }
  console.log('✅ 6 months of attendance records created');

  // Create Exams and Results
  const examTypes = ['MIDTERM', 'FINAL', 'QUIZ'];
  for (const classRecord of classes) {
    const classSubjects = subjects.filter(s => s.classId === classRecord.id);
    for (const subject of classSubjects) {
      for (const examType of examTypes) {
        const exam = await prisma.exam.create({
          data: {
            name: `${examType} - ${subject.name}`,
            type: examType,
            subjectId: subject.id,
            classId: classRecord.id,
            date: new Date('2024-06-15'),
            startTime: '09:00',
            endTime: '11:00',
            totalMarks: 100,
            passingMarks: 40,
          },
        });

        const classStudents = students.filter(s => s.classId === classRecord.id);
        for (const student of classStudents) {
          const marksObtained = Math.floor(Math.random() * 50) + 40;
          const grade = marksObtained >= 90 ? 'A+' : marksObtained >= 80 ? 'A' : marksObtained >= 70 ? 'B' : marksObtained >= 60 ? 'C' : marksObtained >= 50 ? 'D' : 'F';
          await prisma.examResult.create({
            data: {
              examId: exam.id,
              studentId: student.id,
              marksObtained,
              grade,
              remarks: marksObtained >= 40 ? 'Good performance' : 'Needs improvement',
            },
          });
        }
      }
    }
  }
  console.log('✅ Exams and results created');

  // Create Fee Structures and Payments
  const feeTypes = ['Tuition Fee', 'Lab Fee', 'Library Fee', 'Sports Fee', 'Transport Fee'];
  for (const classRecord of classes) {
    for (const feeType of feeTypes) {
      const feeStructure = await prisma.feeStructure.create({
        data: {
          name: feeType,
          classId: classRecord.id,
          schoolId: school.id,
          amount: feeType === 'Tuition Fee' ? 5000 : 500,
          dueDate: new Date('2024-06-30'),
          academicYear: '2024-2025',
          description: `${feeType} for ${classRecord.name}`,
        },
      });

      const classStudents = students.filter(s => s.classId === classRecord.id);
      for (const student of classStudents) {
        const isPaid = Math.random() > 0.3;
        if (isPaid) {
          await prisma.feePayment.create({
            data: {
              studentId: student.id,
              feeStructureId: feeStructure.id,
              amount: feeStructure.amount,
              paymentDate: new Date('2024-05-15'),
              paymentMethod: 'CASH',
              status: 'PAID',
              receivedBy: admin.id,
            },
          });
        }
      }
    }
  }
  console.log('✅ Fee structures and payments created');

  // Create Library Books
  const bookData = [
    { title: 'Introduction to Physics', author: 'John Doe', category: 'Science' },
    { title: 'Advanced Mathematics', author: 'Jane Smith', category: 'Mathematics' },
    { title: 'World History', author: 'Robert Johnson', category: 'History' },
    { title: 'English Literature', author: 'Emily Brown', category: 'Literature' },
    { title: 'Chemistry Basics', author: 'Michael Davis', category: 'Science' },
    { title: 'Computer Programming', author: 'David Lee', category: 'Technology' },
    { title: 'Geography of the World', author: 'Maria Garcia', category: 'Geography' },
    { title: 'Biology Essentials', author: 'Lisa Anderson', category: 'Science' },
  ];

  const libraryBooks = [];
  for (let i = 0; i < bookData.length; i++) {
    const book = await prisma.libraryBook.create({
      data: {
        title: bookData[i].title,
        author: bookData[i].author,
        isbn: `ISBN-${9780000000 + i}`,
        category: bookData[i].category,
        publisher: 'Academic Press',
        publicationYear: 2020,
        totalCopies: 10,
        availableCopies: 8,
        location: `SHELF-${i + 1}`,
      },
    });
    libraryBooks.push(book);
  }
  console.log('✅ Library books created');

  // Create Book Issues
  for (let i = 0; i < 20; i++) {
    const book = libraryBooks[i % libraryBooks.length];
    const student = students[i % students.length];
    const status = Math.random() > 0.5 ? 'ISSUED' : 'RETURNED';
    await prisma.bookIssue.create({
      data: {
        bookId: book.id,
        studentId: student.id,
        issueDate: new Date('2024-05-01'),
        dueDate: new Date('2024-05-15'),
        returnDate: status === 'RETURNED' ? new Date('2024-05-14') : null,
        status,
        fine: status === 'RETURNED' ? 0 : 5,
        issuedBy: admin.id,
      },
    });
  }
  console.log('✅ Book issues created');

  // Create Notices
  const noticeData = [
    { title: 'Summer Vacation Announcement', category: 'GENERAL', content: 'School will be closed for summer vacation from June 15 to July 15.' },
    { title: 'Mid-Term Exam Schedule', category: 'ACADEMIC', content: 'Mid-term examinations will commence from June 20. Please check the detailed schedule.' },
    { title: 'Annual Sports Day', category: 'EVENT', content: 'Annual sports day will be held on July 20. All students are required to participate.' },
    { title: 'Library Hours Change', category: 'URGENT', content: 'Library hours will be changed from next week. New timings: 8 AM to 4 PM.' },
  ];

  for (const notice of noticeData) {
    await prisma.notice.create({
      data: {
        title: notice.title,
        content: notice.content,
        category: notice.category,
        targetAudience: 'STUDENT,TEACHER,PARENT',
        publishedBy: admin.id,
        publishDate: new Date('2024-06-01'),
        expiryDate: new Date('2024-07-01'),
        attachments: '',
      },
    });
  }
  console.log('✅ Notices created');

  // Create Leave Applications
  const leaveTypes = ['SICK', 'PERSONAL', 'FAMILY'];
  for (let i = 0; i < 15; i++) {
    const status = Math.random() > 0.3 ? 'APPROVED' : (Math.random() > 0.5 ? 'PENDING' : 'REJECTED');
    await prisma.leaveApplication.create({
      data: {
        studentId: students[i % students.length].id,
        leaveType: leaveTypes[i % 3],
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-12'),
        reason: 'Personal reasons',
        status,
        appliedBy: guardians[i % guardians.length].userId,
        approvedBy: status === 'APPROVED' ? admin.id : null,
        approvalDate: status === 'APPROVED' ? new Date('2024-06-09') : null,
        rejectionReason: status === 'REJECTED' ? 'Insufficient reason provided' : null,
      },
    });
  }
  console.log('✅ Leave applications created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
