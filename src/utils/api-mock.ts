/**
 * Mock API for FlipSpace
 * Simulates async operations with local data
 */

import usersData from '@/data/users.json';
import resourcesData from '@/data/resources.json';
import quizzesData from '@/data/quizzes.json';
import discussionsData from '@/data/discussions.json';
import conversationsData from '@/data/conversations.json';
import { storage } from './storage';

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    await delay();
    const user = usersData.find(
      u => u.username === username && u.password === password
    );
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPassword } = user;
    storage.setUser(userWithoutPassword);
    return userWithoutPassword;
  },

  logout: async () => {
    await delay(100);
    storage.clearUser();
  },

  getCurrentUser: () => {
    return storage.getUser();
  },

  findUser: (username: string) => {
    const user = usersData.find(u => u.username === username);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  // Resources
  fetchResources: async () => {
    await delay();
    const storedResources = storage.getResources();
    return storedResources || resourcesData;
  },

  createResource: async (resource: any) => {
    await delay();
    const resources = storage.getResources() || resourcesData;
    const newResource = {
      ...resource,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      completions: 0,
    };
    const updated = [...resources, newResource];
    storage.setResources(updated);
    return newResource;
  },

  updateResource: async (id: string, updates: any) => {
    await delay();
    const resources = storage.getResources() || resourcesData;
    const updated = resources.map((r: any) => 
      r.id === id ? { ...r, ...updates } : r
    );
    storage.setResources(updated);
    return updated.find((r: any) => r.id === id);
  },

  deleteResource: async (id: string) => {
    await delay();
    const resources = storage.getResources() || resourcesData;
    const updated = resources.filter((r: any) => r.id !== id);
    storage.setResources(updated);
  },

  // Quizzes
  fetchQuizzes: async () => {
    await delay();
    const storedQuizzes = storage.getQuizzes();
    return storedQuizzes || quizzesData;
  },

  submitQuizAttempt: async (userId: string, quizId: string, answers: number[]) => {
    await delay();
    const quizzes = storage.getQuizzes() || quizzesData;
    const quiz = quizzes.find((q: any) => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');

    let score = 0;
    const results = quiz.questions.map((q: any, index: number) => {
      const isCorrect = answers[index] === q.answer;
      if (isCorrect) score++;
      return {
        questionId: q.id,
        correct: isCorrect,
        userAnswer: answers[index],
        correctAnswer: q.answer,
        explanation: q.explain,
      };
    });

    storage.saveQuizAttempt(userId, quizId, score, quiz.questions.length);

    return {
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      results,
    };
  },

  // Discussions
  fetchDiscussions: async () => {
    await delay();
    const storedDiscussions = storage.getDiscussions();
    return storedDiscussions || discussionsData;
  },

  createThread: async (lessonId: string, title: string) => {
    await delay();
    const discussions = storage.getDiscussions() || discussionsData;
    const newThread = {
      id: `t${Date.now()}`,
      lessonId,
      title,
      posts: [],
    };
    const updated = [...discussions, newThread];
    storage.setDiscussions(updated);
    return newThread;
  },

  createPost: async (threadId: string, author: string, authorName: string, text: string) => {
    await delay();
    const discussions = storage.getDiscussions() || discussionsData;
    const updated = discussions.map((thread: any) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          posts: [
            ...thread.posts,
            {
              id: `p${Date.now()}`,
              author,
              authorName,
              text,
              createdAt: new Date().toISOString(),
              replies: [],
            },
          ],
        };
      }
      return thread;
    });
    storage.setDiscussions(updated);
    return updated.find((t: any) => t.id === threadId);
  },

  createReply: async (threadId: string, postId: string, author: string, authorName: string, text: string) => {
    await delay();
    const discussions = storage.getDiscussions() || discussionsData;
    const updated = discussions.map((thread: any) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          posts: thread.posts.map((post: any) => {
            if (post.id === postId) {
              return {
                ...post,
                replies: [
                  ...post.replies,
                  {
                    id: `r${Date.now()}`,
                    author,
                    authorName,
                    text,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return post;
          }),
        };
      }
      return thread;
    });
    storage.setDiscussions(updated);
    return updated.find((t: any) => t.id === threadId);
  },

  // Conversations
  fetchConversations: async () => {
    await delay();
    const storedConversations = storage.getConversations();
    return storedConversations || conversationsData;
  },

  sendMessage: async (conversationId: string, message: any) => {
    await delay();
    const conversations = storage.getConversations() || conversationsData;
    const updated = conversations.map((convo: any) => {
      if (convo.id === conversationId) {
        convo.messages.push(message);
        convo.lastMessage = message.text;
      }
      return convo;
    });
    storage.setConversations(updated);
  },

  createConversation: async (currentUser: any, targetUser: any) => {
    await delay();
    const conversations = storage.getConversations() || conversationsData;
    const newConversation = {
      id: `convo-${Date.now()}`,
      participant: { id: targetUser.id, name: targetUser.name, role: targetUser.role },
      // In a real app, you'd have a participants array including the current user
      messages: [],
      lastMessage: `Conversation with ${targetUser.name} started.`,
    };
    const updated = [...conversations, newConversation];
    storage.setConversations(updated);
    return newConversation;
  },

  // Progress
  markComplete: async (userId: string, resourceId: string) => {
    await delay(100);
    storage.markResourceComplete(userId, resourceId);
    
    // Update resource completion count
    const resources = storage.getResources() || resourcesData;
    const updated = resources.map((r: any) => 
      r.id === resourceId ? { ...r, completions: (r.completions || 0) + 1 } : r
    );
    storage.setResources(updated);
  },

  markViewed: async (userId: string, resourceId: string) => {
    await delay(100);
    storage.markResourceViewed(userId, resourceId);
    
    // Update resource view count
    const resources = storage.getResources() || resourcesData;
    const updated = resources.map((r: any) => 
      r.id === resourceId ? { ...r, views: (r.views || 0) + 1 } : r
    );
    storage.setResources(updated);
  },

  getUserProgress: (userId: string) => {
    const progress = storage.getProgress();
    return progress[userId] || { completed: [], views: [] };
  },

  getUserQuizAttempts: (userId: string) => {
    const attempts = storage.getQuizAttempts();
    return attempts[userId] || {};
  },

  // Activity
  logUserActivity: async (userId: string, type: string, details: any) => {
    await delay(50);
    storage.logUserActivity(userId, type, details);
  },

  // Social
  toggleFollow: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    if (!social[currentUserId]) {
      social[currentUserId] = { following: [] };
    }
    const followingIndex = social[currentUserId].following.indexOf(targetUserId);
    if (followingIndex > -1) {
      social[currentUserId].following.splice(followingIndex, 1);
    } else {
      social[currentUserId].following.push(targetUserId);
    }
    storage.setSocial(social);
  },

  isFollowing: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    return social[currentUserId]?.following.includes(targetUserId) || false;
  },

  toggleFavorite: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    if (!social[currentUserId]) {
      social[currentUserId] = { following: [], blocked: [], favorites: [] };
    }
    if (!social[currentUserId].favorites) {
      social[currentUserId].favorites = [];
    }
    const favoriteIndex = social[currentUserId].favorites.indexOf(targetUserId);
    if (favoriteIndex > -1) {
      social[currentUserId].favorites.splice(favoriteIndex, 1);
    } else {
      social[currentUserId].favorites.push(targetUserId);
    }
    storage.setSocial(social);
  },

  isFavorited: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    return social[currentUserId]?.favorites?.includes(targetUserId) || false;
  },

  toggleBlock: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    if (!social[currentUserId]) {
      social[currentUserId] = { following: [], blocked: [] };
    }
    if (!social[currentUserId].blocked) {
      social[currentUserId].blocked = [];
    }
    const blockedIndex = social[currentUserId].blocked.indexOf(targetUserId);
    if (blockedIndex > -1) {
      social[currentUserId].blocked.splice(blockedIndex, 1);
    } else {
      social[currentUserId].blocked.push(targetUserId);
    }
    storage.setSocial(social);
  },

  isBlocked: (currentUserId: string, targetUserId: string) => {
    const social = storage.getSocial();
    return social[currentUserId]?.blocked?.includes(targetUserId) || false;
  },

  // Student Actions
  resetProgress: async (userId: string) => { await delay(50); storage.resetUserProgress(userId); },
};
