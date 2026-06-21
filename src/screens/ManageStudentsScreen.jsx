import { useState } from "react";

function ManageStudentsScreen({
  students,
  setStudents,
  setScreen,
}) {
  const [newStudent, setNewStudent] =
    useState("");

  const addStudent = () => {
    if (!newStudent.trim()) return;

    setStudents([
      ...students,
      newStudent.trim(),
    ]);

    setNewStudent("");
  };

  const removeStudent = (index) => {
    setStudents(
      students.filter(
        (_, i) => i !== index
      )
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>จัดการรายชื่อ</h1>

      {students.map((student, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
          }}
        >
          {student}

          <button
            onClick={() =>
              removeStudent(index)
            }
            style={{
              marginLeft: "10px",
            }}
          >
            ลบ
          </button>
        </div>
      ))}

      <hr />

      <input
        value={newStudent}
        onChange={(e) =>
          setNewStudent(
            e.target.value
          )
        }
        placeholder="ชื่อนักเรียน"
      />

      <button
        onClick={addStudent}
        style={{
          marginLeft: "10px",
        }}
      >
        เพิ่ม
      </button>

      <br />
      <br />

      <button
        onClick={() =>
          setScreen("setup")
        }
      >
        กลับ
      </button>
    </div>
  );
}

export default ManageStudentsScreen;
