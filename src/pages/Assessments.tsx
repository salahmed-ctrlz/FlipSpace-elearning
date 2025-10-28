import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { QuizPlayer } from '@/components/QuizPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileCheck, Trophy } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Assessments() {
  const { quizzes, loading, getUserQuizAttempts } = useData();
  const { user } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  const quiz = quizzes.find((q) => q.id === selectedQuiz);
  const attempts = user ? getUserQuizAttempts(user.id) : {};

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
            <h1 className="font-serif text-4xl md:text-5xl">Assessments</h1>
            {selectedQuiz && (
              <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
                Back to List
              </Button>
            )}
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            Test your knowledge and track your progress
          </p>
        </motion.div>

        {selectedQuiz && quiz ? (
          <motion.div
            key={selectedQuiz}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizPlayer
              quiz={quiz}
              onComplete={() => {
                // Refresh attempts
              }}
            />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {quizzes.length === 0 ? (
              <Card className="paper-shadow">
                <CardContent className="text-center py-16">
                  <FileCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No assessments available at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              quizzes.map((quizItem, index) => {
                const quizAttempts = attempts[quizItem.id] || [];
                const bestScore = quizAttempts.length > 0
                  ? Math.max(...quizAttempts.map((a: any) => a.percentage))
                  : null;

                return (
                  <motion.div
                    key={quizItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="paper-shadow hover:paper-shadow-lifted transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="font-serif text-xl mb-2">
                              {quizItem.title}
                            </CardTitle>
                            <CardDescription>
                              {quizItem.questions.length} question
                              {quizItem.questions.length !== 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                          {bestScore !== null && (
                            <Badge
                              className={
                                bestScore >= 70
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-yellow-600 hover:bg-yellow-700'
                              }
                            >
                              <Trophy className="h-3 w-3 mr-1" />
                              Best: {bestScore}%
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Button onClick={() => setSelectedQuiz(quizItem.id)}>
                            {quizAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                          </Button>
                          {quizAttempts.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {quizAttempts.length} attempt
                              {quizAttempts.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
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
