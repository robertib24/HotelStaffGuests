import { createContext, useContext, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const stompClientRef = useRef(null);
    const { user } = useAuth();
    const { showToast } = useToast();

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
                });

                stompClient.subscribe('/topic/notifications', (message) => {
                    const notification = JSON.parse(message.body);
                    
                    if (notification.type === 'NEW_GUEST_REGISTRATION') {
                        showToast(
                            `🎉 ${notification.guestName} s-a înregistrat din aplicația mobilă!`,
                            'info'
                        );
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
    }, [user, showToast]);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}