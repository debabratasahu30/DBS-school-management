import { Server as SocketIOServer } from 'socket.io';

export const setupSocketIO = (io: SocketIOServer) => {
  const notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket) => {
    console.log('Client connected to notifications namespace:', socket.id);

    socket.on('join-school', (schoolId: string) => {
      socket.join(`school:${schoolId}`);
      console.log(`Socket ${socket.id} joined school:${schoolId}`);
    });

    socket.on('join-role', (role: string) => {
      socket.join(`role:${role}`);
      console.log(`Socket ${socket.id} joined role:${role}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from notifications namespace:', socket.id);
    });
  });

  // Export functions to emit events
  io.emitNotification = (schoolId: string, role: string, event: string, data: any) => {
    notificationNamespace.to(`school:${schoolId}`).to(`role:${role}`).emit(event, data);
  };

  return io;
};

declare module 'socket.io' {
  interface Server {
    emitNotification: (schoolId: string, role: string, event: string, data: any) => void;
  }
}
