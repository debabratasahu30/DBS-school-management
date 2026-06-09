import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRouter } from '../src/routes/auth';
import { schoolRouter } from '../src/routes/school';
import { userRouter } from '../src/routes/users';
import { studentRouter } from '../src/routes/students';
import { teacherRouter } from '../src/routes/teachers';
import { classRouter } from '../src/routes/classes';
import { subjectRouter } from '../src/routes/subjects';
import { timetableRouter } from '../src/routes/timetable';
import { attendanceRouter } from '../src/routes/attendance';
import { examRouter } from '../src/routes/exams';
import { feeRouter } from '../src/routes/fees';
import { noticeRouter } from '../src/routes/notices';
import { leaveRouter } from '../src/routes/leave';
import { libraryRouter } from '../src/routes/library';
import { dashboardRouter } from '../src/routes/dashboard';
import { uploadRouter } from '../src/routes/upload';
import { transportRouter } from '../src/routes/transport';
import { errorHandler } from '../src/middleware/errorHandler';

dotenv.config();

const app: Application = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'School Management API is running' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/schools', schoolRouter);
app.use('/api/users', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classes', classRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/timetable', timetableRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/exams', examRouter);
app.use('/api/fees', feeRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/library', libraryRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/transport-routes', transportRouter);

// Error handling
app.use(errorHandler);

export default app;
