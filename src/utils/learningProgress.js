export const LEARNING_STORAGE_KEY = "objectionsLearningProgress";

/* ============================================================
   סדר הנושאים בלומדה
============================================================ */

export const TOPIC_ORDER = ["projector", "floor", "computer", "chair"];

/* ============================================================
   ברירת מחדל
============================================================ */

export const DEFAULT_LEARNING_PROGRESS = {
  // הדמות שנבחרה בפתיחה:
  // "girl" / "boy"
  character: null,

  // האם כבר ראו את פתיח הדמות בכיתה
  introSeen: false,

  // נושאים שהושלמו לגמרי
  completedTopics: [],

  // התקדמות פנימית בתוך כל נושא
  //
  // לדוגמה:
  //
  // {
  //   projector: {
  //     currentPage: 2,
  //     openedItems: [0, 1]
  //   }
  // }
  topicProgress: {},
};

/* ============================================================
   Normalize

   מוודא שגם אם משהו חסר ב-sessionStorage
   תמיד נקבל אובייקט תקין.
============================================================ */

function normalizeProgress(progress = {}) {
  return {
    ...DEFAULT_LEARNING_PROGRESS,
    ...progress,

    completedTopics: Array.isArray(progress.completedTopics)
      ? progress.completedTopics.filter((id) => TOPIC_ORDER.includes(id))
      : [],

    topicProgress:
      progress.topicProgress && typeof progress.topicProgress === "object"
        ? progress.topicProgress
        : {},
  };
}

/* ============================================================
   Get progress
============================================================ */

export function getLearningProgress() {
  try {
    const saved = sessionStorage.getItem(LEARNING_STORAGE_KEY);

    if (!saved) {
      return {
        ...DEFAULT_LEARNING_PROGRESS,
      };
    }

    const parsed = JSON.parse(saved);

    return normalizeProgress(parsed);
  } catch (error) {
    console.error("Could not read learning progress:", error);

    return {
      ...DEFAULT_LEARNING_PROGRESS,
    };
  }
}

/* ============================================================
   Save progress
============================================================ */

export function saveLearningProgress(progress) {
  const normalized = normalizeProgress(progress);

  sessionStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(normalized));

  return normalized;
}

/* ============================================================
   Update progress
============================================================ */

export function updateLearningProgress(updater) {
  const currentProgress = getLearningProgress();

  const nextProgress =
    typeof updater === "function"
      ? updater(currentProgress)
      : {
          ...currentProgress,
          ...updater,
        };

  return saveLearningProgress(nextProgress);
}

/* ============================================================
   Start / Resume

   חשוב:
   הפונקציה הזאת לא מאפסת התקדמות קיימת.
============================================================ */

export function startOrResumeLearning(character) {
  const currentProgress = getLearningProgress();

  return saveLearningProgress({
    ...currentProgress,
    character,
  });
}

/* ============================================================
   Current topic

   מחזיר את הנושא הראשון שעדיין לא הושלם.
============================================================ */

export function getCurrentTopicId(progress) {
  return (
    TOPIC_ORDER.find(
      (topicId) => !progress.completedTopics.includes(topicId)
    ) ?? null
  );
}

/* ============================================================
   Complete topic
============================================================ */

export function completeTopic(topicId) {
  if (!TOPIC_ORDER.includes(topicId)) {
    return getLearningProgress();
  }

  return updateLearningProgress((progress) => {
    // כבר הושלם — לא מוסיפים שוב
    if (progress.completedTopics.includes(topicId)) {
      return progress;
    }

    return {
      ...progress,

      completedTopics: [...progress.completedTopics, topicId],
    };
  });
}

/* ============================================================
   Topic internal progress

   שימוש עתידי:
   updateTopicProgress("projector", {
      currentPage: 2
   });
============================================================ */

export function updateTopicProgress(topicId, topicUpdate) {
  return updateLearningProgress((progress) => {
    const oldTopicProgress = progress.topicProgress?.[topicId] ?? {};

    return {
      ...progress,

      topicProgress: {
        ...progress.topicProgress,

        [topicId]: {
          ...oldTopicProgress,
          ...topicUpdate,
        },
      },
    };
  });
}
