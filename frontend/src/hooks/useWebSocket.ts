import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  onNotification?: (notification: any) => void;
  onBookingUpdate?: (booking: any) => void;
  onMessageNew?: (message: any) => void;
  onPaymentUpdate?: (payment: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const socketRef = useRef<Socket>();
  const {
    onNotification,
    onBookingUpdate,
    onMessageNew,
    onPaymentUpdate,
  } = options;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to WebSocket server
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Notification events
    if (onNotification) {
      socketRef.current.on('notification', onNotification);
    }

    if (onBookingUpdate) {
      socketRef.current.on('booking:update', onBookingUpdate);
    }

    if (onMessageNew) {
      socketRef.current.on('message:new', onMessageNew);
    }

    if (onPaymentUpdate) {
      socketRef.current.on('payment:update', onPaymentUpdate);
    }

    // Heartbeat
    const pingInterval = setInterval(() => {
      socketRef.current?.emit('ping');
    }, 30000); // Every 30 seconds

    socketRef.current.on('pong', (data) => {
      console.log('Pong received:', data);
    });

    // Cleanup
    return () => {
      clearInterval(pingInterval);
      socketRef.current?.disconnect();
    };
  }, [onNotification, onBookingUpdate, onMessageNew, onPaymentUpdate]);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, emit };
}
