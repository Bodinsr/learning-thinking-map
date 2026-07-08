import { useEffect, useState } from "react";

import Timer from "../components/Timer";
import TimerDialog from "../components/TimerDialog";

function LearningActivityScreen({ setScreen, setPhase, timerConfig, onTimerConfigChange }) {
  const [showDialog, setShowDialog] = useState(true);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [activeTimerConfig, setActiveTimerConfig] = useState(timerConfig);

  useEffect(() => {
    setActiveTimerConfig(timerConfig);
  }, [timerConfig]);

  const handleConfirm = (nextConfig) => {
    setActiveTimerConfig(nextConfig);
    onTimerConfigChange(nextConfig);
    setShowDialog(false);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>กิจกรรมการเรียนรู้</h1>
      <p style={{ marginBottom: "20px" }}>
        ใช้ช่วงเวลานี้เพื่อจัดกิจกรรมก่อนเข้าสู่การระดมความคิดหลังเรียน
      </p>

      {activeTimerConfig?.enabled && (
        <Timer
          initialMinutes={activeTimerConfig.minutes}
          enabled={activeTimerConfig.enabled}
          onComplete={() => setShowTimeoutModal(true)}
        />
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => setShowDialog(true)}>ตั้งค่าตัวจับเวลา</button>
        <button
          onClick={() => {
            setPhase("post");
            setScreen("brainstorm");
          }}
        >
          ไปสู่การระดมความคิดหลังเรียน
        </button>
        <button onClick={() => setScreen("brainstorm")}>ข้ามไปเลย</button>
      </div>

      <TimerDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirm}
        defaultMinutes={activeTimerConfig?.minutes ?? 5}
      />

      {showTimeoutModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "360px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "12px" }}>หมดเวลากิจกรรมการเรียนรู้</h2>
            <button onClick={() => setShowTimeoutModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningActivityScreen;
