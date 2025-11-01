import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { QuizPlayer } from '@/components/QuizPlayer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileCheck, Trophy, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Assessments() {
  const { quizzes, loading, getUserQuizAttempts, resources, addQuiz } = useData();
  const { user, isTeacher } = useAuth();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  // State for new quiz form
  const createNewQuestion = () => ({ id: `q-${Date.now()}-${Math.random()}`, text: '', options: ['', '', '', ''], answer: 0, explain: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.' });

  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizLessonId, setNewQuizLessonId] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState([
    createNewQuestion(),
  ]);

  const quiz = quizzes.find((q) => q.id === selectedQuiz);
  const attempts = user ? getUserQuizAttempts(user.id) : {};

  const handleAddQuestion = () => {
    setNewQuizQuestions([...newQuizQuestions, createNewQuestion()]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (newQuizQuestions.length > 1) {
      const updatedQuestions = [...newQuizQuestions];
      updatedQuestions.splice(index, 1);
      setNewQuizQuestions(updatedQuestions);
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...newQuizQuestions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewQuizQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...newQuizQuestions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setNewQuizQuestions(updatedQuestions);
  };

  const handleCreateQuiz = () => {
    if (!newQuizTitle || !newQuizLessonId || newQuizQuestions.some(q => !q.text || q.options.some(opt => !opt))) {
      toast({ title: 'Incomplete Form', description: 'Please fill out all fields.', variant: 'destructive' });
      return;
    }

    addQuiz({ title: newQuizTitle, lessonId: newQuizLessonId, questions: newQuizQuestions });
    toast({ title: 'Success!', description: `Assessment "${newQuizTitle}" has been created.` });

    // Reset form and close dialog
    setNewQuizTitle('');
    setNewQuizLessonId('');
    setNewQuizQuestions([createNewQuestion()]);
    setCreateOpen(false);
  };


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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="font-serif text-4xl md:text-5xl flex-1">Assessments</h1>
            {selectedQuiz && (
              <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
                Back to List
              </Button>
            )}
            {isTeacher && !selectedQuiz && (
              <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Create New Assessment</DialogTitle>
                    <DialogDescription>
                      Design a new quiz for your students. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quiz-title">Assessment Title</Label>
                        <Input id="quiz-title" value={newQuizTitle} onChange={(e) => setNewQuizTitle(e.target.value)} placeholder="e.g., L1 Grammar: Tenses Quiz" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quiz-lesson">Associated Lesson</Label>
                        <Select value={newQuizLessonId} onValueChange={setNewQuizLessonId}>
                          <SelectTrigger id="quiz-lesson">
                            <SelectValue placeholder="Select a lesson" />
                          </SelectTrigger>
                          <SelectContent>
                            {resources.map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <hr className="border-border/50" />

                    {newQuizQuestions.map((q, qIndex) => (
                      <div key={q.id} className="space-y-4 p-4 border rounded-lg bg-background/50 relative">
                        <div className="flex justify-between items-center">
                          <Label className="text-base">Question {qIndex + 1}</Label>
                          {newQuizQuestions.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveQuestion(qIndex)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`q-text-${qIndex}`}>Question Text</Label>
                          <Textarea id={`q-text-${qIndex}`} value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} placeholder="e.g., Which sentence is in the Present Perfect tense?" />
                        </div>
                        <div className="space-y-3">
                          <Label>Options (select the correct answer)</Label>
                          <RadioGroup value={q.answer.toString()} onValueChange={(val) => handleQuestionChange(qIndex, 'answer', parseInt(val))}>
                            {q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-opt${oIndex}`} />
                                <Input
                                  id={`q${qIndex}-opt-text-${oIndex}`}
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                  placeholder={`Option ${oIndex + 1}`}
                                />
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`q-explain-${qIndex}`}>Explanation</Label>
                          <Textarea
                            id={`q-explain-${qIndex}`}
                            value={q.explain}
                            onChange={(e) => handleQuestionChange(qIndex, 'explain', e.target.value)}
                            placeholder="Explain why the correct answer is right."
                            className="h-24"
                          />
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" onClick={handleAddQuestion} className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Another Question
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateQuiz}>Save Assessment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            {isTeacher
              ? 'Create assessments and track your students progress'
              : 'Test your knowledge and track your progress'}
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
