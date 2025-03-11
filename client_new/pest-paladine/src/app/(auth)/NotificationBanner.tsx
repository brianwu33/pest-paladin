"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react"; // Icons for improved UI
import { useAuth } from "@clerk/nextjs";

interface Notification {
    title: string;
    message: string;
    link: string;
}

export default function NotificationBanner() {
    const [notification, setNotification] = useState<Notification | null>(null);
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId) return;

        const socket = new WebSocket(`ws://localhost:3001/ws?userID=${userId}`);

        console.log("WebSocket Client Connected");
        socket.onmessage = (event) => {
            console.log("WebSocket Client Received");
            const data = JSON.parse(event.data);
            setNotification(data);

            // Auto-dismiss the banner after 5 seconds
            setTimeout(() => setNotification(null), 30000);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => socket.close();
    }, [userId]);

    if (!notification) return null;

    return (
        <div
            className="fixed top-6 right-6 bg-white text-black p-4 rounded-2xl shadow-xl border border-gray-200 z-50 
            flex items-center gap-4 animate-slide-in w-[350px]"
        >
            {/* Icon */}
            <div className="bg-green-500 text-white p-3 rounded-full">
                <Bell className="h-6 w-6" />
            </div>

            {/* Notification Content */}
            <div className="flex-1">
                <h3 className="font-bold text-lg">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>

                <Link href={notification.link}>
                    <button
                        className="mt-2 inline-block text-green-500 text-sm font-medium hover:underline"
                    >
                        View Detection Data →
                    </button>
                </Link>
            </div>

            {/* Close Button */}
            <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setNotification(null)}
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
