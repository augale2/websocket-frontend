// hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

// Define the structure of a document event (adjust as needed)
export interface DocumentEvent {
  document_id: string;
  event_type: "created" | "updated" | "deleted";
  title: string;
  content: string;
  timestamp: number;
}

export function useWebSocket(url: string) {
  // State to store the events (you might want to merge new events into a larger global state)
  const [messages, setMessages] = useState<DocumentEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create the WebSocket connection (example: ws://localhost:8080/ws)
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // For a global room, there's no need for a subscription message.
    };

    ws.onmessage = (event) => {
      try {
        // Parse the incoming message and update state.
        const data = JSON.parse(event.data) as DocumentEvent;
        console.log("Received event:", data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [url]);

  return { messages, ws: wsRef.current };
}
