
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

export default function Messages() {
  const { user, isTeacher } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { conversations, sendMessage, createConversation, loading } = useData();
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle opening a new conversation from profile page
    const newConvoUser = location.state?.newConversationUser;
    if (newConvoUser && user) {
      const startNewConversation = async () => {
        const existingConvo = conversations.find(c => c.participant.id === newConvoUser.id);
        if (existingConvo) {
          setSelectedConversation(existingConvo);
        } else {
          const newConvo = await createConversation(user, newConvoUser);
          setSelectedConversation(newConvo);
        }
      };
      startNewConversation();
      // Clear state from location
      navigate(location.pathname, { replace: true });
    } else if (conversations.length > 0 && window.innerWidth >= 768) {
      // Find the most recent conversation to display
      const sortedConversations = [...conversations].sort((a, b) => new Date(b.messages[b.messages.length - 1]?.timestamp || 0).getTime() - new Date(a.messages[a.messages.length - 1]?.timestamp || 0).getTime());
      if (!selectedConversation) {
        setSelectedConversation(sortedConversations[0]);
      }
    }
  }, [location.state, navigate, conversations, selectedConversation, user, createConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text: newMessage,
      timestamp: new Date(),
    };

    sendMessage(selectedConversation.id, message);
    // Optimistically update UI
    const updatedConvo = { ...selectedConversation, messages: [...selectedConversation.messages, message], lastMessage: newMessage };
    setSelectedConversation(updatedConvo);
    setNewMessage('');
  };

  const sortedConversations = [...conversations].sort((a, b) => new Date(b.messages[b.messages.length - 1]?.timestamp || 0).getTime() - new Date(a.messages[a.messages.length - 1]?.timestamp || 0).getTime());

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl">Messages</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            {isTeacher
              ? 'Interact with your students and offer more scaffolding'
              : 'Communicate with your teachers and peers directly.'}
          </p>
        </motion.div>

        <Card className="paper-shadow w-full h-[70vh] flex overflow-hidden relative">
          {/* Conversation List - always visible on md+, conditionally on mobile */}
          <div className={cn("w-full md:w-1/3 border-r border-border flex-col", selectedConversation && "hidden md:flex")}>
              <div className="p-4 border-b border-border">
                <h2 className="font-serif text-lg">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sortedConversations.map(convo => (
                  <div
                    key={convo.id}
                    className={cn(
                      "p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedConversation?.id === convo.id && "bg-primary/10"
                    )}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <Avatar>
                      <AvatarFallback className={cn(selectedConversation?.id === convo.id && "bg-primary text-primary-foreground")}>
                        {getInitials(convo.participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate">{convo.participant.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* Message View - slides in on mobile */}
          <AnimatePresence>
            {selectedConversation && (
              <motion.div
                key={selectedConversation.id}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 left-0 w-full h-full bg-background md:static md:w-2/3 flex flex-col"
              >
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar>
                    <AvatarFallback>{getInitials(selectedConversation.participant.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.participant.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{selectedConversation.participant.role}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
                  {selectedConversation.messages.map((msg: any) => (
                    <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.id ? "justify-end" : "justify-start")}>
                      {msg.senderId !== user?.id && <Avatar className="h-8 w-8"><AvatarFallback>{getInitials(msg.senderName)}</AvatarFallback></Avatar>}
                      <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", msg.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-card paper-shadow")}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sender === user?.name ? "text-primary-foreground/70" : "text-muted-foreground")}>{format(msg.timestamp, 'p')}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-border bg-background">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." autoComplete="off" />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedConversation && (
            <div className="hidden md:flex w-2/3 items-center justify-center bg-muted/20">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
