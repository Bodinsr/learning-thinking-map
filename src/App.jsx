import { useState, useEffect } from "react";

import SetupScreen from "./screens/SetupScreen";
import BrainstormScreen from "./screens/BrainstormScreen";
import ManageStudentsScreen
from "./screens/ManageStudentsScreen";
import StudentScreen from "./screens/StudentScreen";
import ResultsScreen from "./screens/ResultsScreen";
import CompareScreen from "./screens/CompareScreen";
function App() {
  const [screen, setScreen] = useState("setup");
const [phase, setPhase] = useState("pre");
  const [question, setQuestion] = useState("");
  const [selectedStudents, setSelectedStudents] =
  useState([]);

const [activeStudents, setActiveStudents] =
  useState([]);
const [initialized, setInitialized] =
  useState(false);
  const [idea, setIdea] = useState("");
 const [students, setStudents] = useState(() => {
  const saved = localStorage.getItem("students");

  return saved
    ? JSON.parse(saved)
    : ["ก้อง", "กาย", "ปัน", "น้ำ", "ใบเฟิร์น"];
});

  const [ideas, setIdeas] = useState([]);
const [responses, setResponses] = useState([]);
const [postResponses, setPostResponses] = useState([]);
const resetActivity = () => {
  setQuestion("");
  setIdeas([]);
  setResponses([]);
  setPostResponses([]);
  setPhase("pre");
  setScreen("setup");
};
useEffect(() => {
  if (!initialized) {
    setSelectedStudents(students);
    setInitialized(true);
  }
}, [students, initialized]);
  useEffect(() => {
  localStorage.setItem(
    "students",
    JSON.stringify(students)
  );
}, [students]);


  const addIdea = () => {
    if (idea.trim() === "") return;

    setIdeas([...ideas, idea.trim()]);
    setIdea("");
  };

  const deleteIdea = (indexToDelete) => {
    setIdeas(
      ideas.filter(
        (_, index) =>
          index !== indexToDelete
      )
    );
  };
if (screen === "students") {
  return (
    <ManageStudentsScreen
      students={students}
      setStudents={setStudents}
      setScreen={setScreen}
    />
  );
}
if (screen === "student") {
  return (
    <StudentScreen
      students={activeStudents}
      ideas={ideas}
      responses={responses}
      setResponses={setResponses}
setScreen={setScreen}
phase={phase}
postResponses={postResponses}
setPostResponses={setPostResponses}
    />
  );
}
if (screen === "compare") {
  return (
    <CompareScreen
      students={activeStudents}
      responses={responses}
      postResponses={postResponses}
      setScreen={setScreen}
resetActivity={resetActivity}
    />
  );
}
if (screen === "results") {
  return (
    <ResultsScreen
  responses={responses}
  setScreen={setScreen}
  setPhase={setPhase}
/>
  );
}
  if (screen === "setup") {
    return (
      <SetupScreen
  question={question}
  setQuestion={setQuestion}
  setScreen={setScreen}
  students={students}
  setStudents={setStudents}
  selectedStudents={selectedStudents}
  setSelectedStudents={setSelectedStudents}
  setActiveStudents={setActiveStudents}
/>
    );
  }

  if (screen === "brainstorm") {
    return (
      <BrainstormScreen
        question={question}
        idea={idea}
        setIdea={setIdea}
        ideas={ideas}
        addIdea={addIdea}
        deleteIdea={deleteIdea}
setScreen={setScreen}
students={activeStudents}
responses={responses}
phase={phase}
postResponses={postResponses}
      />
    );
  }
}

export default App;
