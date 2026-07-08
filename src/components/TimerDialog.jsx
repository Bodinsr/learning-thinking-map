import { useEffect, useState } from "react";

function TimerDialog({ isOpen, onClose, onConfirm, defaultMinutes = 5 }) {
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [useTimer, setUseTimer] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setMinutes(defaultMinutes);
      setUseTimer(true);
    }
  }, [defaultMinutes, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
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
          maxWidth: "420px",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>ตั้งค่าตัวจับเวลา</h2>

        <label style={{ display: "block", marginBottom: "10px" }}>
          <span>เวลา (นาที)</span>
          <input
            type="number"
            min="1"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value) || 1)}
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "10px",
            }}
            disabled={!useTimer}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <input
            type="checkbox"
            checked={!useTimer}
            onChange={(e) => setUseTimer(!e.target.checked)}
          />
          ไม่ใช้ตัวจับเวลา
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose}>ยกเลิก</button>
          <button
            onClick={() => {
              onConfirm({ enabled: useTimer, minutes: useTimer ? minutes : 0 });
            }}
          >
            เริ่มกิจกรรม
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerDialog;
