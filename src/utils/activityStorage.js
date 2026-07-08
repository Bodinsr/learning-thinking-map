export const ACTIVITY_STORAGE_KEY = "learning-thinking-map-activity";
export const LEGACY_ACTIVITY_STORAGE_KEY = "learning-thinking-map-session";
export const DEFAULT_STUDENTS = ["ก้อง", "กาย", "ปัน", "น้ำ", "ใบเฟิร์น"];

export const hasMeaningfulActivity = (activity = {}) => {
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

export const formatThaiDateTime = (value) => {
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

export const saveActivity = (activityData) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ACTIVITY_STORAGE_KEY,
    JSON.stringify(activityData)
  );
  window.localStorage.removeItem(LEGACY_ACTIVITY_STORAGE_KEY);
};

export const clearSavedActivity = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACTIVITY_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_ACTIVITY_STORAGE_KEY);
};
