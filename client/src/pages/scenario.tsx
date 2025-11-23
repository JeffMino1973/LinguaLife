import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Brain, Globe } from "lucide-react";
import type { Scenario as ScenarioType, VocabularyItem } from "@shared/schema";
import FlashcardView from "@/components/flashcard-view";
import QuizView from "@/components/quiz-view";

export default function Scenario() {
  const { id } = useParams();
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedLanguage, setSelectedLanguage] = useState("spanish");

  const { data: scenario, isLoading } = useQuery<ScenarioType>({
    queryKey: [`/api/scenarios/${id}?language=${selectedLanguage}`],
  });

  const filteredVocabulary = scenario?.vocabulary.filter(v => v.difficulty === difficulty) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
            Scenario not found
          </h2>
          <Link href="/dashboard">
            <Button data-testid="button-back-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spanish" data-testid="option-spanish">Spanish</SelectItem>
                  <SelectItem value="french" data-testid="option-french">French</SelectItem>
                  <SelectItem value="mandarin" data-testid="option-mandarin">Mandarin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-scenario-title">
            {scenario.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6" data-testid="text-scenario-description">
            {scenario.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="secondary" className="text-sm font-semibold px-4 py-1.5" data-testid="badge-vocab-total">
              <BookOpen className="w-4 h-4 mr-1.5" />
              {scenario.vocabulary.length} total words
            </Badge>
            <Badge variant="outline" className="text-sm font-semibold px-4 py-1.5" data-testid="badge-vocab-filtered">
              {filteredVocabulary.length} {difficulty} words
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={difficulty === "beginner" ? "default" : "outline"}
              onClick={() => setDifficulty("beginner")}
              className="gap-2"
              data-testid="button-difficulty-beginner"
            >
              Beginner
            </Button>
            <Button
              variant={difficulty === "intermediate" ? "default" : "outline"}
              onClick={() => setDifficulty("intermediate")}
              className="gap-2"
              data-testid="button-difficulty-intermediate"
            >
              Intermediate
            </Button>
            <Button
              variant={difficulty === "advanced" ? "default" : "outline"}
              onClick={() => setDifficulty("advanced")}
              className="gap-2"
              data-testid="button-difficulty-advanced"
            >
              Advanced
            </Button>
          </div>
        </div>

        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="flashcards" className="gap-2" data-testid="tab-flashcards">
              <BookOpen className="w-4 h-4" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2" data-testid="tab-quiz">
              <Brain className="w-4 h-4" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards">
            <FlashcardView vocabulary={filteredVocabulary} scenarioId={id!} language={selectedLanguage} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizView vocabulary={filteredVocabulary} scenarioId={id!} difficulty={difficulty} language={selectedLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
