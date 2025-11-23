import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, RotateCw } from "lucide-react";
import type { VocabularyItem } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuizViewProps {
  vocabulary: VocabularyItem[];
  scenarioId: string;
  difficulty: string;
  language: string;
}

export default function QuizView({ vocabulary, scenarioId, difficulty, language }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuizMutation = useMutation({
    mutationFn: (data: { scenarioId: string; difficulty: string; score: number; totalQuestions: number }) =>
      apiRequest("POST", `/api/quiz/submit?language=${language}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${language}`] });
    },
  });

  const questions = useMemo(() => {
    if (vocabulary.length < 4) return [];
    
    return vocabulary.slice(0, 10).map((word) => {
      const otherWords = vocabulary.filter(w => w.id !== word.id);
      const incorrectOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.translation);
      
      const allOptions = [word.translation, ...incorrectOptions]
        .sort(() => Math.random() - 0.5);
      
      return {
        word: word.word,
        correctAnswer: word.translation,
        options: allOptions,
        pronunciation: word.pronunciation,
      };
    });
  }, [vocabulary]);

  if (vocabulary.length < 4) {
    return (
      <Card data-testid="card-not-enough-words">
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground text-lg">
            Need at least 4 vocabulary words to start a quiz.
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      submitQuizMutation.mutate({
        scenarioId,
        difficulty,
        score: score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0),
        totalQuestions: questions.length,
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const finalScore = Math.round((score / questions.length) * 100);
    
    return (
      <Card data-testid="card-quiz-complete">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
              Quiz Complete!
            </h3>
            <p className="text-muted-foreground text-lg">
              Great job on completing the quiz
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 space-y-4">
            <div className="text-6xl font-bold text-primary" data-testid="text-final-score">
              {finalScore}%
            </div>
            <div className="text-muted-foreground">
              You got {score} out of {questions.length} questions correct
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handleRestart} className="gap-2" data-testid="button-restart-quiz">
              <RotateCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="font-semibold text-foreground" data-testid="text-quiz-score">
            Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" data-testid="progress-quiz" />
      </div>

      <Card data-testid="card-quiz-question">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-sm font-semibold px-4 py-1.5">
              Translate this word
            </Badge>
            <div>
              <h3 className="font-serif text-4xl font-bold text-foreground mb-2" data-testid="text-question-word">
                {question.word}
              </h3>
              <p className="text-lg italic text-muted-foreground" data-testid="text-question-pronunciation">
                {question.pronunciation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = option === selectedAnswer;
              
              let variant: "default" | "outline" | "secondary" = "outline";
              let className = "min-h-14 text-base justify-start hover-elevate";
              
              if (showResult) {
                if (isCorrect) {
                  className = "min-h-14 text-base justify-start bg-secondary/20 border-secondary text-secondary-foreground";
                } else if (isSelected) {
                  className = "min-h-14 text-base justify-start bg-destructive/20 border-destructive text-destructive-foreground";
                }
              } else if (isSelected) {
                variant = "default";
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={className}
                  data-testid={`button-option-${index}`}
                >
                  <span className="flex-1 text-left">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </Button>
              );
            })}
          </div>

          {showResult && (
            <div className="flex justify-center pt-4">
              <Button onClick={handleNext} size="lg" data-testid="button-next-question">
                {currentQuestion + 1 < questions.length ? "Next Question" : "View Results"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
