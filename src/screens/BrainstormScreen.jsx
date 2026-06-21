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
}) {
  return (
    <div style={{ padding: "30px" }}>
      <h1>{question}</h1>
<h2>
  {phase === "pre"
    ? "📘 รอบก่อนเรียน"
    : "📗 รอบหลังเรียน"}
</h2>
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

{phase === "post" &&
  postResponses.length === students.length && (
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
    </div>
  );
}

export default BrainstormScreen;
