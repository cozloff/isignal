import { useEffect, useRef, useState } from "react";

export function useSTTSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => {
      setTranscript(event.data);
    };
    socket.onerror = (error) => console.error("WebSocket error", error);
    socket.onclose = () => console.log("WebSocket closed");

    return () => socket.close();
  }, [url]);

  const sendAudioChunk = (chunk: ArrayBuffer) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(chunk);
    }
  };

  return { transcript, sendAudioChunk };
}
