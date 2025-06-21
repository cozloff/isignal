import { useEffect } from "react";
import type { Route } from "./+types/home";
import Map from "~/components/Map";
import { useSTTSocket } from "~/hooks/useSTTSocket";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { transcript, sendAudioChunk } = useSTTSocket(
    "ws://localhost:10300/ws/stt"
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(250);

    mediaRecorder.ondataavailable = (e) => {
      e.data.arrayBuffer().then(sendAudioChunk);
    };
  };

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    console.log(transcript);
  }, [transcript]);

  return <Map />;
}
