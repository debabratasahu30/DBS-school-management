import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { authRouter } from './routes/auth';
import { schoolRouter } from './routes/school';
import { userRouter } from './routes/users';
import { studentRouter } from './routes/students';
import { teacherRouter } from './routes/teachers';
import { classRouter } from './routes/classes';
import { subjectRouter } from './routes/subjects';
import { timetableRouter } from './routes/timetable';
import { attendanceRouter } from './routes/attendance';
import { examRouter } from './routes/exams';
import { feeRouter } from './routes/fees';
import { noticeRouter } from './routes/notices';
import { leaveRouter } from './routes/leave';
import { libraryRouter } from './routes/library';
import { dashboardRouter } from './routes/dashboard';
import { uploadRouter } from './routes/upload';
import { transportRouter } from './routes/transport';
import { errorHandler } from './middleware/errorHandler';
import { setupSocketIO } from './socket';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

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
app.get('/health', (req, res) => {
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

// Create HTTP server and setup Socket.io
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
});

setupSocketIO(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);
  console.log(`🌍 CORS origin: ${CORS_ORIGIN}`);
});

export { io };
