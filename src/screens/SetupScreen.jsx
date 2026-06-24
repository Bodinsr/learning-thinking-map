function SetupScreen({
  question,
  setQuestion,
  setScreen,
  students,
  selectedStudents,
  setSelectedStudents,
  setActiveStudents,
}) {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Learning Thinking Map</h1>

      <h2>คำถามสำคัญ</h2>

      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="พิมพ์คำถามสำคัญ"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "18px",
        }}
      />

     <h2 style={{ marginTop: "30px" }}>
  นักเรียน ({students.length} คน)
</h2>
<button
  onClick={() => setScreen("students")}
  style={{
    marginBottom: "20px",
    padding: "10px 16px",
  }}
>
  จัดการรายชื่อ
</button>
      <div>
{students.map((student) => (
  <div key={student}>
    <label>
      <input
        type="checkbox"
        checked={selectedStudents.includes(student)}
        onChange={() => {
          if (selectedStudents.includes(student)) {
            setSelectedStudents(
              selectedStudents.filter(
                (s) => s !== student
              )
            );
          } else {
            setSelectedStudents([
              ...selectedStudents,
              student,
            ]);
          }
        }}
      />
      {student}
    </label>
  </div>
))}

<button
  onClick={() => {
    setActiveStudents(selectedStudents);
    setScreen("brainstorm");
  }}
>
  เริ่มกิจกรรม
</button>
      </div>
    </div>
  );
}

export default SetupScreen;
