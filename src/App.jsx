import { useState, useEffect } from "react";

import SetupScreen from "./screens/SetupScreen";
import BrainstormScreen from "./screens/BrainstormScreen";
import ManageStudentsScreen from "./screens/ManageStudentsScreen";
import StudentScreen from "./screens/StudentScreen";
import ResultsScreen from "./screens/ResultsScreen";
import CompareScreen from "./screens/CompareScreen";
import LearningActivityScreen from "./screens/LearningActivityScreen";
import {
  ACTIVITY_STORAGE_KEY,
  LEGACY_ACTIVITY_STORAGE_KEY,
  DEFAULT_STUDENTS,
  clearSavedActivity,
  formatThaiDateTime,
  hasMeaningfulActivity,
  saveActivity,
} from "./utils/activityStorage";
import { LEGACY_TIMER_KEYS, TIMER_KEYS } from "./utils/timerStorage";

const defaultTimerConfig = () => ({ enabled: false, minutes: 5 });

const readTimerConfig = (storageKey, legacyStorageKey) => {
  if (typeof window === "undefined") {
    return defaultTimerConfig();
  }

  const saved = window.localStorage.getItem(storageKey);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        enabled: parsed.enabled ?? false,
        minutes: parsed.minutes ?? 5,
      };
    } catch (error) {
      return defaultTimerConfig();
    }
  }

  const legacySaved = window.localStorage.getItem(legacyStorageKey);

  if (!legacySaved) {
    return defaultTimerConfig();
  }

  try {
    const parsed = JSON.parse(legacySaved);
    return {
      enabled: parsed.enabled ?? false,
      minutes: parsed.minutes ?? 5,
    };
  } catch (error) {
    return defaultTimerConfig();
  }
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
  const [preTimerConfig, setPreTimerConfig] = useState(() =>
    readTimerConfig(TIMER_KEYS.pre, LEGACY_TIMER_KEYS.pre)
  );
  const [postTimerConfig, setPostTimerConfig] = useState(() =>
    readTimerConfig(TIMER_KEYS.post, LEGACY_TIMER_KEYS.post)
  );
  const [learningTimerConfig, setLearningTimerConfig] = useState(() =>
    readTimerConfig(TIMER_KEYS.learning, LEGACY_TIMER_KEYS.learning)
  );

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
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TIMER_KEYS.pre, JSON.stringify(preTimerConfig));
  }, [preTimerConfig]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TIMER_KEYS.post, JSON.stringify(postTimerConfig));
  }, [postTimerConfig]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      TIMER_KEYS.learning,
      JSON.stringify(learningTimerConfig)
    );
  }, [learningTimerConfig]);

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

  if (screen === "learningActivity") {
    return (
      <LearningActivityScreen
        setScreen={setScreen}
        setPhase={setPhase}
        timerConfig={learningTimerConfig}
        onTimerConfigChange={setLearningTimerConfig}
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
        timerConfig={phase === "post" ? postTimerConfig : preTimerConfig}
      />
    );
  }
}

export default App;
