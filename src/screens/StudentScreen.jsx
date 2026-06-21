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

  const [selectedIdea, setSelectedIdea] =
    useState("");

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
  if (!selectedIdea) return;

  if (phase === "pre") {
    const newResponses = [
      ...responses,
      {
        student: selectedStudent,
        idea: selectedIdea,
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
        idea: selectedIdea,
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
  setSelectedIdea("");
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
            onClick={() =>
              setSelectedIdea(idea)
            }
            style={{
              padding: "20px",
              fontSize: "24px",
              border:
                selectedIdea === idea
                  ? "4px solid green"
                  : "1px solid gray",
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
