import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { DiscussionThread } from '@/components/DiscussionThread';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquarePlus } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Forum() {
  const { discussions, loading } = useData();
  const { isTeacher } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(searchParams.get('thread'));

  useEffect(() => {
    setSelectedThreadId(searchParams.get('thread'));
  }, [searchParams]);

  const handleSelectThread = (threadId: string) => {
    setSearchParams({ thread: threadId });
  };

  const thread = discussions.find((d) => d.id === selectedThreadId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-4xl md:text-5xl">Discussion Forum</h1>
            {selectedThreadId && (
              <Button variant="outline" onClick={() => setSearchParams({})}>
                Back to Threads
              </Button>
            )}
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            {isTeacher
              ? 'Engage in discussions, ask questions, and collaborate with your students'
              : 'Engage in discussions, ask questions, and collaborate with your peers'}
          </p>
        </motion.div>

        {selectedThreadId && thread ? (
          <motion.div
            key={selectedThreadId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DiscussionThread thread={thread} />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {discussions.length === 0 ? (
              <Card className="paper-shadow">
                <CardContent className="text-center py-16">
                  <MessageSquarePlus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No discussions yet. Be the first to start one!
                  </p>
                </CardContent>
              </Card>
            ) : (
              discussions.map((discussion, index) => {
                const relatedResource = null; // Could link to resources if needed
                return (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card
                      className="paper-shadow hover:paper-shadow-lifted transition-all duration-300 cursor-pointer"
                      onClick={() => handleSelectThread(discussion.id)}
                    >
                      <CardHeader>
                        <CardTitle className="font-serif">{discussion.title}</CardTitle>
                        <CardDescription>
                          {discussion.posts.length} post
                          {discussion.posts.length !== 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline">View Discussion</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
