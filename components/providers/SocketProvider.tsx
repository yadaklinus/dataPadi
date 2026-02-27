"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SocketProviderProps {
    children: React.ReactNode;
    token?: string;
}

// 1. Ensure this points directly to your Express port (3009), not Next.js (3000)
const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3009";

// 2. Create Context so any component can use the socket instance
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, token }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        console.log(`[Socket] Attempting connection to: ${SOCKET_URL}`);

        // 3. Initialize connection
        // FIX: Removed the custom `transports` array. Let Socket.io handle the HTTP -> WS upgrade naturally.
        const socketInstance: Socket = io(SOCKET_URL, {
            auth: {
                token: `Bearer ${token}`
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        setSocket(socketInstance);

        console.log(socketInstance)

        // --- Core Lifecycle Events ---
        socketInstance.on("connect", () => {
            console.log("[Socket] Connected successfully with ID:", socketInstance.id);
        });

        socketInstance.on("connect_error", (err: any) => {
            console.error("[Socket] Connection failed:", err);
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("[Socket] Disconnected. Reason:", reason);
        });

        // --- Custom Business Logic Events ---

        // Event: Wallet Funded
        socketInstance.on("wallet_funded", (data: { amount: number; method: string; reference: string }) => {
            console.log(`Wallet credited with ₦${data.amount} via ${data.method}`);
            toast.success(
                <div>
                    <p className="font-bold text-sm">Wallet Funded!</p>
                    <p className="text-xs">₦{Number(data.amount).toLocaleString()} added via {data.method}</p>
                </div>,
                { duration: 6000 }
            );
            router.refresh();
        });

        // Event: Transaction Update
        socketInstance.on("transaction_update", (data: { status: string; type: string; amount: number; reference: string; metadata?: any }) => {
            const amountStr = `₦${Number(data.amount).toLocaleString()}`;

            if (data.status === "SUCCESS") {
                console.log(`${data.type} purchase of ${amountStr} successful!`);

                let subText = `${data.type} transaction complete.`;
                if (data.type === "ELECTRICITY" && data.metadata?.token) {
                    subText = `Meter Token: ${data.metadata.token}`;
                    console.log("Meter Token:", data.metadata.token);
                } else if (data.metadata?.pin) {
                    subText = `Voucher PIN: ${data.metadata.pin}`;
                }

                toast.success(
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-sm">{data.type} Successful</p>
                        <p className="text-xs">{subText}</p>
                    </div>,
                    { duration: 8000 }
                );
                router.refresh();
            } else if (data.status === "FAILED") {
                console.error(`Transaction ${data.reference} failed.`);
                toast.error(
                    <div className="flex flex-col gap-1">
                        <p className="font-bold text-sm">{data.type} Failed</p>
                        <p className="text-xs">Your transaction was unsuccessful. Any deductions will be refunded.</p>
                    </div>,
                    { duration: 8000 }
                );
                router.refresh();
            }
        });

        // Cleanup on unmount or token change to prevent memory leaks and duplicate listeners
        return () => {
            socketInstance.disconnect();
            setSocket(null);
        };
    }, [token, router]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};