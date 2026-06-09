import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Get dashboard stats
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const schoolId = req.schoolId;
    const userId = req.userId;
    const role = req.role;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats: any = {};

    if (role === 'ADMIN') {
      // Admin sees everything - total counts
      const [
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAttendance,
        todayAttendance,
        totalFees,
        pendingFees,
        totalNotices,
        pendingLeaves,
        totalLeaves,
        totalBooks,
        overdueBooks,
        totalExams,
      ] = await Promise.all([
        prisma.student.count({ where: { user: { schoolId } } }),
        prisma.teacher.count({ where: { user: { schoolId } } }),
        prisma.class.count({ where: { schoolId } }),
        prisma.attendance.count({ where: { status: 'PRESENT' } }),
        prisma.attendance.count({ where: { date: today, status: 'PRESENT' } }),
        prisma.feePayment.count({}),
        prisma.feePayment.count({ where: { status: { in: ['PENDING', 'OVERDUE'] } } }),
        prisma.notice.count({}),
        prisma.leaveApplication.count({ where: { status: 'PENDING' } }),
        prisma.leaveApplication.count({}),
        prisma.bookIssue.count({}),
        prisma.bookIssue.count({ where: { status: 'OVERDUE' } }),
        prisma.exam.count({}),
      ]);

      stats = {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalAttendance,
        todayAttendance,
        totalFees,
        pendingFees,
        totalNotices,
        pendingLeaves,
        totalLeaves,
        totalBooks,
        overdueBooks,
        totalExams,
      };
    } else if (role === 'TEACHER') {
      // Teacher sees their classes, students, salary, exams - total counts
      const teacher = await prisma.teacher.findUnique({
        where: { userId },
        include: {
          classes: true,
          subjects: { include: { class: true } },
        },
      });

      if (!teacher) {
        return res.status(404).json({ success: false, error: 'Teacher not found' });
      }

      const classIds = teacher.classes.map(c => c.id);
      const subjectIds = teacher.subjects.map(s => s.id);

      const [
        myClasses,
        myStudents,
        mySubjects,
        totalExams,
        upcomingExams,
        completedExams,
        mySalary,
        totalAttendance,
        todayAttendance,
      ] = await Promise.all([
        prisma.class.count({ where: { id: { in: classIds } } }),
        prisma.student.count({ where: { classId: { in: classIds } } }),
        prisma.subject.count({ where: { id: { in: subjectIds } } }),
        prisma.exam.count({
          where: {
            subjectId: { in: subjectIds },
          },
        }),
        prisma.exam.count({
          where: {
            subjectId: { in: subjectIds },
            date: { gte: today },
          },
        }),
        prisma.exam.count({
          where: {
            subjectId: { in: subjectIds },
            date: { lt: today },
          },
        }),
        prisma.teacher.findUnique({
          where: { userId },
          select: { salary: true },
        }),
        prisma.attendance.count({
          where: {
            student: { classId: { in: classIds } },
            status: 'PRESENT',
          },
        }),
        prisma.attendance.count({
          where: {
            student: { classId: { in: classIds } },
            date: today,
            status: 'PRESENT',
          },
        }),
      ]);

      stats = {
        myClasses,
        myStudents,
        mySubjects,
        totalExams,
        upcomingExams,
        completedExams,
        mySalary: mySalary?.salary || 0,
        totalAttendance,
        todayAttendance,
        qualification: teacher.qualification,
        experience: teacher.experience,
      };
    } else if (role === 'STUDENT') {
      // Student sees their personal details, attendance, grades - total counts
      const student = await prisma.student.findUnique({
        where: { userId },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          class: true,
          guardian: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } },
        },
      });

      if (!student) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      const [
        totalAttendance,
        myAttendance,
        totalExamResults,
        myExamResults,
        totalFeePayments,
        pendingFees,
        totalBookIssues,
        myBookIssues,
        totalLeaveApplications,
        pendingLeaves,
      ] = await Promise.all([
        prisma.attendance.count({
          where: {
            studentId: student.id,
          },
        }),
        prisma.attendance.count({
          where: {
            studentId: student.id,
            status: 'PRESENT',
          },
        }),
        prisma.examResult.count({
          where: { studentId: student.id },
        }),
        prisma.examResult.count({
          where: { studentId: student.id },
        }),
        prisma.feePayment.count({
          where: {
            studentId: student.id,
          },
        }),
        prisma.feePayment.count({
          where: {
            studentId: student.id,
            status: { in: ['PENDING', 'OVERDUE'] },
          },
        }),
        prisma.bookIssue.count({
          where: {
            studentId: student.id,
          },
        }),
        prisma.bookIssue.count({
          where: {
            studentId: student.id,
            status: 'ISSUED',
          },
        }),
        prisma.leaveApplication.count({
          where: {
            studentId: student.id,
          },
        }),
        prisma.leaveApplication.count({
          where: {
            studentId: student.id,
            status: 'PENDING',
          },
        }),
      ]);

      stats = {
        personalInfo: {
          name: `${student.user.firstName} ${student.user.lastName}`,
          email: student.user.email,
          phone: student.user.phone,
          admissionNo: student.admissionNo,
          class: student.class.name,
          guardian: `${student.guardian.user.firstName} ${student.guardian.user.lastName}`,
        },
        totalAttendance,
        myAttendance,
        totalExamResults,
        myExamResults,
        totalFeePayments,
        pendingFees,
        totalBookIssues,
        myBookIssues,
        totalLeaveApplications,
        pendingLeaves,
      };
    } else if (role === 'PARENT') {
      // Parent sees their child's details - total counts
      const guardian = await prisma.guardian.findUnique({
        where: { userId },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      });

      if (!guardian) {
        return res.status(404).json({ success: false, error: 'Guardian not found' });
      }

      const children = await prisma.student.findMany({
        where: { guardianId: guardian.id },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          class: true,
        },
      });

      const childIds = children.map(c => c.id);

      const [
        totalChildren,
        totalAttendance,
        childrenAttendance,
        totalExamResults,
        childrenExamResults,
        totalFeePayments,
        childrenPendingFees,
        totalLeaveApplications,
        pendingLeaves,
      ] = await Promise.all([
        prisma.student.count({ where: { guardianId: guardian.id } }),
        prisma.attendance.count({
          where: {
            studentId: { in: childIds },
          },
        }),
        prisma.attendance.count({
          where: {
            studentId: { in: childIds },
            date: today,
            status: 'PRESENT',
          },
        }),
        prisma.examResult.count({
          where: { studentId: { in: childIds } },
        }),
        prisma.examResult.count({
          where: { studentId: { in: childIds } },
        }),
        prisma.feePayment.count({
          where: {
            studentId: { in: childIds },
          },
        }),
        prisma.feePayment.count({
          where: {
            studentId: { in: childIds },
            status: { in: ['PENDING', 'OVERDUE'] },
          },
        }),
        prisma.leaveApplication.count({
          where: {
            studentId: { in: childIds },
          },
        }),
        prisma.leaveApplication.count({
          where: {
            studentId: { in: childIds },
            status: 'PENDING',
          },
        }),
      ]);

      stats = {
        totalChildren,
        children: children.map(c => ({
          name: `${c.user.firstName} ${c.user.lastName}`,
          class: c.class.name,
          email: c.user.email,
        })),
        totalAttendance,
        childrenAttendance,
        totalExamResults,
        childrenExamResults,
        totalFeePayments,
        childrenPendingFees,
        totalLeaveApplications,
        pendingLeaves,
      };
    } else if (role === 'ACCOUNTANT') {
      // Accountant sees fee-related stats
      const [
        totalFeePayments,
        paidFees,
        pendingFees,
        overdueFees,
        totalStudents,
        totalClasses,
      ] = await Promise.all([
        prisma.feePayment.count({}),
        prisma.feePayment.count({ where: { status: 'PAID' } }),
        prisma.feePayment.count({ where: { status: 'PENDING' } }),
        prisma.feePayment.count({ where: { status: 'OVERDUE' } }),
        prisma.student.count({ where: { user: { schoolId } } }),
        prisma.class.count({ where: { schoolId } }),
      ]);

      stats = {
        totalFeePayments,
        paidFees,
        pendingFees,
        overdueFees,
        totalStudents,
        totalClasses,
      };
    }

    res.json({ success: true, data: stats, role });
  } catch (error) {
    next(error);
  }
});

// Get analytics data
router.get('/analytics', async (req: AuthRequest, res, next) => {
  try {
    const schoolId = req.schoolId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Attendance trends
    const attendanceTrends = await prisma.attendance.groupBy({
      by: ['date', 'status'],
      where: { date: { gte: thirtyDaysAgo } },
      _count: true,
      orderBy: { date: 'asc' },
    });

    // Fee collection trends
    const feeTrends = await prisma.feePayment.groupBy({
      by: ['paymentDate', 'status'],
      where: { paymentDate: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
      orderBy: { paymentDate: 'asc' },
    });

    // Class-wise student distribution
    const classDistribution = await prisma.class.findMany({
      where: { schoolId },
      include: { _count: { select: { students: true } } },
    });

    // Exam performance
    const examPerformance = await prisma.examResult.findMany({
      include: { exam: { include: { subject: true } } },
      take: 100,
    });

    const analytics = {
      attendanceTrends,
      feeTrends,
      classDistribution,
      examPerformance,
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
});

export { router as dashboardRouter };
