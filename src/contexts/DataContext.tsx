import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/utils/api-mock';

interface DataContextType {
  resources: any[];
  quizzes: any[];
  discussions: any[];
  loading: boolean;
  refreshResources: () => Promise<void>;
  refreshQuizzes: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  refreshDiscussions: () => Promise<void>;
  createResource: (resource: any) => Promise<any>;
  updateResource: (id: string, updates: any) => Promise<any>;
  deleteResource: (id: string) => Promise<void>;
  submitQuizAttempt: (userId: string, quizId: string, answers: number[]) => Promise<any>;
  createThread: (lessonId: string, title: string) => Promise<any>;
  createPost: (threadId: string, author: string, authorName: string, text: string) => Promise<any>;
  createReply: (threadId: string, postId: string, author: string, authorName: string, text: string) => Promise<any>;
  markComplete: (userId: string, resourceId: string) => Promise<void>;
  markViewed: (userId: string, resourceId: string) => Promise<void>;
  getUserProgress: (userId: string) => { completed: string[]; views: string[] };
  logActivity: (userId: string, type: string, details: any) => Promise<void>;
  conversations: any[];
  createConversation: (currentUser: any, targetUser: any) => Promise<any>;
  sendMessage: (conversationId: string, message: any) => Promise<void>;
  resetProgress: (userId: string) => Promise<void>;
  getUserQuizAttempts: (userId: string) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resourcesData, quizzesData, discussionsData, conversationsData] = await Promise.all([
        api.fetchResources(),
        api.fetchQuizzes(),
        api.fetchDiscussions(),
        api.fetchConversations(),
      ]);
      setResources(resourcesData);
      setQuizzes(quizzesData);
      setDiscussions(discussionsData);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshResources = async () => {
    const data = await api.fetchResources();
    setResources(data);
  };

  const refreshQuizzes = async () => {
    const data = await api.fetchQuizzes();
    setQuizzes(data);
  };

  const refreshDiscussions = async () => {
    const data = await api.fetchDiscussions();
    setDiscussions(data);
  };

  const refreshConversations = async () => {
    const data = await api.fetchConversations();
    setConversations(data);
  };

  const createResource = async (resource: any) => {
    const newResource = await api.createResource(resource);
    await refreshResources();
    return newResource;
  };

  const updateResource = async (id: string, updates: any) => {
    const updated = await api.updateResource(id, updates);
    await refreshResources();
    return updated;
  };

  const deleteResource = async (id: string) => {
    await api.deleteResource(id);
    await refreshResources();
  };

  const submitQuizAttempt = async (userId: string, quizId: string, answers: number[]) => {
    return await api.submitQuizAttempt(userId, quizId, answers);
  };

  const createThread = async (lessonId: string, title: string) => {
    const thread = await api.createThread(lessonId, title);
    await refreshDiscussions();
    return thread;
  };

  const createPost = async (threadId: string, author: string, authorName: string, text: string) => {
    const thread = await api.createPost(threadId, author, authorName, text);
    await refreshDiscussions();
    return thread;
  };

  const createReply = async (threadId: string, postId: string, author: string, authorName: string, text: string) => {
    const thread = await api.createReply(threadId, postId, author, authorName, text);
    await refreshDiscussions();
    return thread;
  };

  const markComplete = async (userId: string, resourceId: string) => {
    await api.markComplete(userId, resourceId);
    await refreshResources();
  };

  const markViewed = async (userId: string, resourceId: string) => {
    await api.markViewed(userId, resourceId);
    await refreshResources();
  };

  const logActivity = async (userId: string, type: string, details: any) => {
    await api.logUserActivity(userId, type, details);
  };

  const createConversation = async (currentUser: any, targetUser: any) => {
    const newConvo = await api.createConversation(currentUser, targetUser);
    await refreshConversations();
    return newConvo;
  };

  const sendMessage = async (conversationId: string, message: any) => {
    await api.sendMessage(conversationId, message);
    await refreshConversations();
  };

  const resetProgress = async (userId: string) => {
    api.resetProgress(userId);
    // We need to refresh data that depends on progress, like resources
    await refreshResources();
  };

  return (
    <DataContext.Provider
      value={{
        resources,
        quizzes,
        discussions,
        loading,
        refreshResources,
        refreshConversations,
        refreshQuizzes,
        refreshDiscussions,
        createResource,
        updateResource,
        deleteResource,
        submitQuizAttempt,
        createThread,
        createPost,
        createReply,
        markComplete,
        markViewed,
        logActivity,
        conversations,
        createConversation,
        sendMessage,
        resetProgress,
        getUserProgress: api.getUserProgress,
        getUserQuizAttempts: api.getUserQuizAttempts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
