import { useEffect, useMemo, useRef, useState } from "react";

function Timer({ initialMinutes = 5, enabled = true, onComplete }) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(enabled);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setRemainingSeconds(initialMinutes * 60);
      setIsRunning(false);
      completedRef.current = false;
      return;
    }

    setRemainingSeconds(initialMinutes * 60);
    setIsRunning(true);
    completedRef.current = false;
  }, [enabled, initialMinutes]);

  useEffect(() => {
    if (!enabled || !isRunning || remainingSeconds <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);

          if (!completedRef.current) {
            completedRef.current = true;
            playNotificationSound();
            onComplete?.();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [enabled, isRunning, remainingSeconds, onComplete]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [remainingSeconds]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "#fff3cd",
        border: "2px solid #ffcc00",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "56px", fontWeight: "700", letterSpacing: "2px" }}>
        {formattedTime}
      </div>

      <div style={{ marginTop: "12px" }}>
        <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
          หยุดชั่วคราว
        </button>
        <button
          onClick={() => setIsRunning(true)}
          disabled={isRunning || remainingSeconds <= 0}
          style={{ marginLeft: "8px" }}
        >
          เริ่มต่อ
        </button>
        <button
          onClick={() => {
            setRemainingSeconds(initialMinutes * 60);
            setIsRunning(true);
            completedRef.current = false;
          }}
          style={{ marginLeft: "8px" }}
        >
          รีเซ็ต
        </button>
      </div>
    </div>
  );
}

function playNotificationSound() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.35);

  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.45);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.45);
}

export default Timer;
