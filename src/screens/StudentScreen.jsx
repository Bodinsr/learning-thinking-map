import { useState } from "react";

function StudentScreen({
  students,
  ideas,
  responses,
  setResponses,
  setScreen,
  phase,
  postResponses,
setPostResponses,
}) {
  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [selectedIdeas, setSelectedIdeas] =
  useState([]);

  const currentResponses =
  phase === "pre"
    ? responses
    : postResponses;

const availableStudents =
  students.filter(
    (student) =>
      !currentResponses.some(
        (r) => r.student === student
      )
  );

  const submitAnswer = () => {
  if (!selectedStudent) return;
  if (selectedIdeas.length === 0) return;

  if (phase === "pre") {
    const newResponses = [
      ...responses,
      {
  student: selectedStudent,
  ideas: selectedIdeas,
},
    ];

    setResponses(newResponses);

    alert("ส่งคำตอบเรียบร้อย");

    if (newResponses.length === students.length) {
      setScreen("brainstorm");
      return;
    }
  }

  if (phase === "post") {
    const newPostResponses = [
      ...postResponses,
      {
  student: selectedStudent,
  ideas: selectedIdeas,
},
    ];

    setPostResponses(newPostResponses);

    alert("ส่งคำตอบหลังเรียนเรียบร้อย");

    if (
      newPostResponses.length ===
      students.length
    ) {
      setScreen("brainstorm");
      return;
    }
  }

  setSelectedStudent(null);
setSelectedIdeas([]);
};

  if (!selectedStudent) {
    return (
      <div style={{ padding: 30 }}>
        <h1>เลือกชื่อของตนเอง</h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {availableStudents.map(
            (student) => (
              <button
                key={student}
                onClick={() =>
                  setSelectedStudent(
                    student
                  )
                }
                style={{
                  padding: "20px 30px",
                  fontSize: "24px",
                }}
              >
                {student}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>{selectedStudent}</h1>

      <h2>เลือกแนวคิด</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        {ideas.map((idea) => (
          <button
  key={idea}
  onClick={() => {
    if (selectedIdeas.includes(idea)) {
      setSelectedIdeas(
        selectedIdeas.filter(
          (item) => item !== idea
        )
      );
    } else {
      setSelectedIdeas([
        ...selectedIdeas,
        idea,
      ]);
    }
  }}
  style={{
    padding: "20px",
    fontSize: "24px",
    backgroundColor: selectedIdeas.includes(idea)
      ? "#4CAF50"
      : "white",
    color: selectedIdeas.includes(idea)
      ? "white"
      : "black",
    border: selectedIdeas.includes(idea)
      ? "3px solid #2E7D32"
      : "1px solid gray",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "0.2s",
  }}
>
            {idea}
          </button>
        ))}
      </div>

      <br />

      <button
        onClick={submitAnswer}
        style={{
          padding: "20px 40px",
          fontSize: "24px",
        }}
      >
        ส่งคำตอบ
      </button>
    </div>
  );
}

export default StudentScreen;
