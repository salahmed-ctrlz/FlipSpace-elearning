import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { ExplainAnswer } from './ui/explain-answer';

interface QuizPlayerProps {
  quiz: any;
  onComplete?: () => void;
}

export const QuizPlayer = ({ quiz, onComplete }: QuizPlayerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { submitQuizAttempt } = useData();
  const { toast } = useToast();

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await submitQuizAttempt(user.id, quiz, answers);
      setResults(result);
      setSubmitted(true);
      toast({
        title: 'Quiz submitted!',
        description: `You scored ${result.score} out of ${result.total} (${result.percentage}%)`,
      });
      onComplete?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted && results) {
    return (
      <Card className="paper-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif">{quiz.title} - Results</CardTitle>
            <Badge 
              className={results.percentage >= 70 ? 'bg-green-600' : 'bg-yellow-600'}
            >
              {results.percentage}%
            </Badge>
          </div>
          <CardDescription>
            You scored {results.score} out of {results.total}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.questions.map((q: any, index: number) => {
            const questionForExplain = {
              id: q.id,
              stem: q.text,
              options: q.options.map((opt: string, i: number) => ({ id: `${i}`, label: opt })),
              correctOptionId: `${q.answer}`,
              explanations: {
                correct: q.explain,
                fallbackIncorrect: q.explain,
              },
            };
            const selectedId = results.results[index].userAnswer;

            return (
              <ExplainAnswer
                key={q.id}
                question={questionForExplain}
                selectedOptionId={selectedId !== null ? `${selectedId}` : null}
              />
            );
          })}
          <Button onClick={() => {
            setSubmitted(false);
            setResults(null);
            setAnswers([]);
            setCurrentQuestion(0);
          }}>
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="paper-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif">{quiz.title}</CardTitle>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium">{question.text}</p>

          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            {question.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLastQuestion ? 'Submit Quiz' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
