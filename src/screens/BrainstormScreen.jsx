import { useEffect, useState } from "react";

import Timer from "../components/Timer";

function BrainstormScreen({
  question,
  idea,
  setIdea,
  ideas,
  addIdea,
  deleteIdea,
  setScreen,
  students,
  responses,
  phase,
  postResponses,
  timerConfig,
}) {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const handleTimerComplete = () => {
    setShowTimeoutModal(true);
  };

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            lineHeight: "1.5",
            wordBreak: "break-word",
          }}
        >
          {question}
        </h1>
      </div>

      {timerConfig?.enabled && (
        <Timer
          initialMinutes={timerConfig.minutes}
          enabled={timerConfig.enabled}
          onComplete={handleTimerComplete}
        />
      )}

      <h2>{phase === "pre" ? "📘 รอบก่อนเรียน" : "📗 รอบหลังเรียน"}</h2>
      <h3>
        ตอบแล้ว {responses.length} / {students.length} คน
      </h3>
      {responses.length === students.length && (
        <button
          onClick={() => setScreen("results")}
          style={{
            padding: "12px 20px",
            marginBottom: "20px",
          }}
        >
          📊 แสดงผลสำรวจความคิด
        </button>
      )}

      {phase === "post" && postResponses.length === students.length && (
        <button
          onClick={() => setScreen("compare")}
          style={{
            marginLeft: "10px",
          }}
        >
          🔄 เปรียบเทียบก่อน-หลัง
        </button>
      )}
      <h2>แนวคิดของห้องเรา</h2>

      <input
        type="text"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addIdea();
          }
        }}
        placeholder="เพิ่มแนวคิด"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "18px",
        }}
      />

      <button
        onClick={addIdea}
        style={{
          marginTop: "10px",
          padding: "12px 20px",
        }}
      >
        เพิ่มแนวคิด
      </button>
      <button
        onClick={() => setScreen("student")}
        style={{
          marginLeft: "10px",
          padding: "12px 20px",
        }}
      >
        เปิดหน้านักเรียน
      </button>
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {ideas.map((item, index) => (
          <div
            key={index}
            style={{
              border: "3px solid #333",
              borderRadius: "16px",
              padding: "30px",
              minWidth: "180px",
              textAlign: "center",
              fontSize: "28px",
              position: "relative",
            }}
          >
            <button
              onClick={() => deleteIdea(index)}
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {item}
          </div>
        ))}
      </div>

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
            <h2 style={{ marginBottom: "12px" }}>หมดเวลาระดมความคิด</h2>
            <button onClick={() => setShowTimeoutModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrainstormScreen;
