/**
 * Local storage utilities for FlipSpace
 * Handles persistence of user data, resources, and progress
 */

const STORAGE_KEYS = {
  AUTH_USER: 'flipspace_auth_user',
  RESOURCES: 'flipspace_resources',
  QUIZZES: 'flipspace_quizzes',
  DISCUSSIONS: 'flipspace_discussions',
  PROGRESS: 'flipspace_progress',
  CONVERSATIONS: 'flipspace_conversations',
  QUIZ_ATTEMPTS: 'flipspace_quiz_attempts',
  SOCIAL: 'flipspace_social',
} as const;

export const storage = {
  // Auth
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  // Resources
  getResources: () => {
    const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return data ? JSON.parse(data) : null;
  },
  setResources: (resources: any[]) => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  // Quizzes
  getQuizzes: () => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return data ? JSON.parse(data) : null;
  },
  setQuizzes: (quizzes: any[]) => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  },

  // Discussions
  getDiscussions: () => {
    const data = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
    return data ? JSON.parse(data) : null;
  },
  setDiscussions: (discussions: any[]) => {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));
  },

  // Conversations
  getConversations: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : null;
  },
  setConversations: (conversations: any[]) => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },

  // Progress tracking
  getProgress: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : {};
  },
  setProgress: (progress: any) => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },
  markResourceComplete: (userId: string, resourceId: string) => {
    const progress = storage.getProgress();
    if (!progress[userId]) progress[userId] = { completed: [], views: [] };
    if (!progress[userId].completed.includes(resourceId)) {
      progress[userId].completed.push(resourceId);
    }
    storage.setProgress(progress);
  },
  markResourceViewed: (userId: string, resourceId: string) => {
    const progress = storage.getProgress();
    if (!progress[userId]) progress[userId] = { completed: [], views: [] };
    if (!progress[userId].views.includes(resourceId)) {
      progress[userId].views.push(resourceId);
    }
    storage.setProgress(progress);
  },

  // Quiz attempts
  getQuizAttempts: () => {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
    return data ? JSON.parse(data) : {};
  },
  saveQuizAttempt: (userId: string, quizId: string, score: number, total: number) => {
    const attempts = storage.getQuizAttempts();
    if (!attempts[userId]) attempts[userId] = {};
    if (!attempts[userId][quizId]) attempts[userId][quizId] = [];
    attempts[userId][quizId].push({
      score,
      total,
      percentage: Math.round((score / total) * 100),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(attempts));
  },

  // Activity Logging
  logUserActivity: (userId: string, type: string, details: any) => {
    const key = `user-activity-${userId}`;
    const activities = localStorage.getItem(key);
    const parsedActivities = activities ? JSON.parse(activities) : [];
    parsedActivities.push({
      id: `act_${Date.now()}`,
      type,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(parsedActivities));
  },

  // Social
  getSocial: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SOCIAL);
    return data ? JSON.parse(data) : {};
  },
  setSocial: (social: any) => {
    localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(social));
  },

  // Reset Progress
  resetUserProgress: (userId: string) => {
    const progress = storage.getProgress();
    if (progress[userId]) {
      progress[userId] = { completed: [], views: [] };
    }
    storage.setProgress(progress);
  },
};
