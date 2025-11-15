import { createContext, useContext, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useNotifications } from './NotificationContext';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const stompClientRef = useRef(null);
    const { user } = useAuth();
    const { showToast } = useToast();
    const { addNotification } = useNotifications(); 

    useEffect(() => {
        if (!user) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket Connected');

                stompClient.subscribe('/topic/reservations', (message) => {
                    const reservation = JSON.parse(message.body);
                    
                    showToast(
                        `Rezervare nouă: ${reservation.guestName} - Camera ${reservation.roomNumber}`,
                        'success'
                    );
                    
                    addNotification({
                        type: 'reservation',
                        title: 'Rezervare Nouă',
                        message: `${reservation.guestName} - Camera ${reservation.roomNumber}`,
                        severity: 'success'
                    });
                });

                stompClient.subscribe('/topic/notifications', (message) => {
                    const notification = JSON.parse(message.body);

                    if (notification.type === 'NEW_GUEST_REGISTRATION') {
                        showToast(
                            `🎉 ${notification.guestName} s-a înregistrat din aplicația mobilă!`,
                            'info'
                        );

                        addNotification({
                            type: 'NEW_GUEST_REGISTRATION',
                            title: notification.title || 'Oaspete Nou',
                            message: notification.message || `${notification.guestName} s-a înregistrat`,
                            severity: 'info'
                        });
                    } else if (notification.type === 'RESERVATION_CANCELLED') {
                        showToast(
                            `🚫 ${notification.message}`,
                            'warning'
                        );

                        addNotification({
                            type: 'RESERVATION_CANCELLED',
                            title: notification.title || 'Rezervare Anulată',
                            message: notification.message,
                            severity: 'warning'
                        });
                    } else if (notification.type === 'NEW_REVIEW') {
                        showToast(
                            `⭐ ${notification.message}`,
                            'info'
                        );

                        addNotification({
                            type: 'NEW_REVIEW',
                            title: notification.title || 'Recenzie Nouă',
                            message: notification.message,
                            severity: 'info'
                        });
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [user, showToast, addNotification]);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}