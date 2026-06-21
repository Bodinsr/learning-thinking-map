function ResultsScreen({
  responses,
  setScreen,
  setPhase,
}) {
  const counts = {};

  responses.forEach((response) => {
    counts[response.idea] =
      (counts[response.idea] || 0) + 1;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1>ผลสำรวจความคิด</h1>

      {Object.entries(counts).map(
        ([idea, count]) => (
          <div
            key={idea}
            style={{
              marginBottom: "15px",
              fontSize: "28px",
            }}
          >
            {idea} : {count} คน
          </div>
        )
      )}

      <br />

      <button
        onClick={() =>
          setScreen("brainstorm")
        }
      >
        กลับ
      </button>
<button
  onClick={() => {
    setPhase("post");
    setScreen("brainstorm");
  }}
  style={{
    marginLeft: "10px",
  }}
>
  เริ่มรอบหลังเรียน
</button>
    </div>
  );
}

export default ResultsScreen;
