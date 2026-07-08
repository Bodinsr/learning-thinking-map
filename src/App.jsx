import { useState, useEffect } from "react";

import SetupScreen from "./screens/SetupScreen";
import BrainstormScreen from "./screens/BrainstormScreen";
import ManageStudentsScreen from "./screens/ManageStudentsScreen";
import StudentScreen from "./screens/StudentScreen";
import ResultsScreen from "./screens/ResultsScreen";
import CompareScreen from "./screens/CompareScreen";

const ACTIVITY_STORAGE_KEY = "learning-thinking-map-activity";
const LEGACY_ACTIVITY_STORAGE_KEY = "learning-thinking-map-session";
const DEFAULT_STUDENTS = ["ก้อง", "กาย", "ปัน", "น้ำ", "ใบเฟิร์น"];

const hasMeaningfulActivity = (activity = {}) => {
  const studentsList = activity.students ?? DEFAULT_STUDENTS;
  const hasCustomStudents = studentsList.some(
    (student, index) => student !== DEFAULT_STUDENTS[index]
  );

  return (
    (activity.question ?? "").trim() !== "" ||
    (activity.selectedStudents ?? []).length > 0 ||
    (activity.activeStudents ?? []).length > 0 ||
    (activity.ideas ?? []).length > 0 ||
    (activity.responses ?? []).length > 0 ||
    (activity.postResponses ?? []).length > 0 ||
    (activity.phase ?? "pre") !== "pre" ||
    (activity.screen ?? "setup") !== "setup" ||
    hasCustomStudents
  );
};

const formatThaiDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

function App() {
  const [screen, setScreen] = useState("setup");
  const [phase, setPhase] = useState("pre");
  const [question, setQuestion] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [idea, setIdea] = useState("");
  const [students, setStudents] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_STUDENTS;
    }

    const savedStudents = window.localStorage.getItem("students");

    return savedStudents ? JSON.parse(savedStudents) : DEFAULT_STUDENTS;
  });
  const [ideas, setIdeas] = useState([]);
  const [responses, setResponses] = useState([]);
  const [postResponses, setPostResponses] = useState([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [savedActivityPreview, setSavedActivityPreview] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedActivity =
      window.localStorage.getItem(ACTIVITY_STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_ACTIVITY_STORAGE_KEY);

    setHasCheckedStorage(true);

    if (!storedActivity) {
      return;
    }

    try {
      const parsedActivity = JSON.parse(storedActivity);

      if (hasMeaningfulActivity(parsedActivity)) {
        setSavedActivityPreview(parsedActivity);
        setShowRestoreDialog(true);
      } else {
        clearSavedActivity();
      }
    } catch (error) {
      clearSavedActivity();
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      setSelectedStudents(students);
      setInitialized(true);
    }
  }, [students, initialized]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (!hasCheckedStorage || showRestoreDialog || !initialized) {
      return;
    }

    const activityData = {
      question,
      students,
      selectedStudents,
      activeStudents,
      ideas,
      responses,
      postResponses,
      phase,
      screen,
      savedAt: new Date().toISOString(),
    };

    if (!hasMeaningfulActivity(activityData)) {
      clearSavedActivity();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveActivity(activityData);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    hasCheckedStorage,
    showRestoreDialog,
    initialized,
    question,
    students,
    selectedStudents,
    activeStudents,
    ideas,
    responses,
    postResponses,
    phase,
    screen,
  ]);

  const clearSavedActivity = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_ACTIVITY_STORAGE_KEY);
  };

  const saveActivity = (activityData) => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ACTIVITY_STORAGE_KEY,
      JSON.stringify(activityData)
    );
    window.localStorage.removeItem(LEGACY_ACTIVITY_STORAGE_KEY);
  };

  const resetActivity = () => {
    setQuestion("");
    setIdeas([]);
    setResponses([]);
    setPostResponses([]);
    setPhase("pre");
    setScreen("setup");
    setActiveStudents([]);
    setSelectedStudents([]);
    setIdea("");
    setInitialized(false);
    setSavedActivityPreview(null);
    clearSavedActivity();
  };

  const restoreActivity = () => {
    if (typeof window === "undefined") {
      return;
    }

    const storedActivity =
      window.localStorage.getItem(ACTIVITY_STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_ACTIVITY_STORAGE_KEY);

    if (!storedActivity) {
      setShowRestoreDialog(false);
      return;
    }

    try {
      const parsedActivity = JSON.parse(storedActivity);

      setQuestion(parsedActivity.question ?? "");
      setStudents(parsedActivity.students ?? DEFAULT_STUDENTS);
      setSelectedStudents(parsedActivity.selectedStudents ?? []);
      setActiveStudents(parsedActivity.activeStudents ?? []);
      setIdeas(parsedActivity.ideas ?? []);
      setResponses(parsedActivity.responses ?? []);
      setPostResponses(parsedActivity.postResponses ?? []);
      setPhase(parsedActivity.phase ?? "pre");
      setScreen(parsedActivity.screen ?? "setup");
      setIdea("");
      setInitialized(true);
      setSavedActivityPreview(null);
    } catch (error) {
      console.error("Failed to restore activity", error);
    }

    setShowRestoreDialog(false);
  };

  const startNewActivity = () => {
    setShowRestoreDialog(false);
    clearSavedActivity();
    setSavedActivityPreview(null);
    setQuestion("");
    setIdeas([]);
    setResponses([]);
    setPostResponses([]);
    setPhase("pre");
    setScreen("setup");
    setActiveStudents([]);
    setSelectedStudents([]);
    setIdea("");
    setInitialized(false);
  };

  const addIdea = () => {
    if (idea.trim() === "") return;

    setIdeas([...ideas, idea.trim()]);
    setIdea("");
  };

  const deleteIdea = (indexToDelete) => {
    setIdeas(ideas.filter((_, index) => index !== indexToDelete));
  };

  if (showRestoreDialog) {
    const previewActivity = savedActivityPreview ?? {};
    const previewPhase = previewActivity.phase === "post" ? "รอบหลังเรียน" : "รอบก่อนเรียน";
    const submittedCount =
      previewActivity.phase === "post"
        ? previewActivity.postResponses?.length ?? 0
        : previewActivity.responses?.length ?? 0;
    const totalStudents =
      previewActivity.activeStudents?.length > 0
        ? previewActivity.activeStudents.length
        : previewActivity.selectedStudents?.length > 0
          ? previewActivity.selectedStudents.length
          : previewActivity.students?.length ?? 0;

    return (
      <div style={{ padding: "30px", maxWidth: "520px", margin: "0 auto" }}>
        <h1>Learning Thinking Map</h1>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ marginTop: 0 }}>พบกิจกรรมล่าสุด</h2>
          <p>
            <strong>คำถามสำคัญ</strong>
            <br />
            {previewActivity.question?.trim() || "—"}
          </p>
          <p>
            <strong>นักเรียนตอบแล้ว</strong> {submittedCount} / {totalStudents} คน
          </p>
          <p>
            <strong>สถานะ</strong>
            <br />
            {previewPhase}
          </p>
          <p>
            <strong>บันทึกเมื่อ</strong>
            <br />
            {formatThaiDateTime(previewActivity.savedAt)}
          </p>
        </div>

        <button onClick={restoreActivity}>กู้คืนกิจกรรม</button>
        <button onClick={startNewActivity} style={{ marginLeft: "10px" }}>
          เริ่มกิจกรรมใหม่
        </button>
      </div>
    );
  }

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
