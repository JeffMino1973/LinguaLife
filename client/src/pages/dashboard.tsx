import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, BookOpen, TrendingUp, Award, ChevronRight, Flame } from "lucide-react";
import type { UserProgress } from "@shared/schema";
import shoppingImage from "@assets/generated_images/Shopping_scenario_illustration_e40e850d.png";
import diningImage from "@assets/generated_images/Dining_scenario_illustration_ba707407.png";
import travelImage from "@assets/generated_images/Traveling_scenario_illustration_5583bbf6.png";
import schoolImage from "@assets/generated_images/School_scenario_illustration_fcb31735.png";
import homeSceneImage from "@assets/generated_images/Home_scenario_illustration_d26dec36.png";

const scenarios = [
  { id: "shopping", title: "Shopping", image: shoppingImage, totalWords: 25 },
  { id: "dining", title: "Dining Out", image: diningImage, totalWords: 30 },
  { id: "traveling", title: "Traveling", image: travelImage, totalWords: 28 },
  { id: "school", title: "At School", image: schoolImage, totalWords: 32 },
  { id: "home", title: "At Home", image: homeSceneImage, totalWords: 26 },
];

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("spanish");

  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: [`/api/progress/${selectedLanguage}`],
  });

  const getScenarioProgress = (scenarioId: string) => {
    if (!progress) return 0;
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return 0;
    
    const masteredInScenario = progress.masteredWords.filter(w => w.startsWith(scenarioId)).length;
    return Math.round((masteredInScenario / scenario.totalWords) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground hover-elevate px-2 py-1 rounded-md" data-testid="link-home">
                LinguaLife
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Welcome Back!
          </h2>
          <p className="text-muted-foreground text-lg">
            Continue your language learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-stats-words">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  <div className="text-4xl font-bold text-foreground" data-testid="text-words-learned">
                    {progress?.totalWordsLearned || 0}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Words Learned</div>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-scenarios">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  <div className="text-4xl font-bold text-foreground" data-testid="text-scenarios-completed">
                    {progress?.completedScenarios.length || 0}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Scenarios Completed</div>
            </CardContent>
          </Card>

          <Card data-testid="card-stats-streak">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-accent-foreground" />
                </div>
                {isLoading ? (
                  <Skeleton className="w-16 h-8" />
                ) : (
                  <div className="text-4xl font-bold text-foreground" data-testid="text-current-streak">
                    {progress?.currentStreak || 0}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Learning Scenarios
            </h3>
            <Badge variant="outline" className="text-sm" data-testid="badge-total-scenarios">
              {scenarios.length} scenarios
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => {
              const progressPercent = getScenarioProgress(scenario.id);
              const isCompleted = progress?.completedScenarios.includes(scenario.id);

              return (
                <Link key={scenario.id} href={`/scenario/${scenario.id}`}>
                  <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-scenario-${scenario.id}`}>
                    <div className="flex gap-4 p-4">
                      <div className="relative w-32 h-32 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={scenario.image} 
                          alt={scenario.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-scenario-${scenario.id}`}
                        />
                        {isCompleted && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-serif text-xl font-bold text-foreground" data-testid={`text-scenario-title-${scenario.id}`}>
                            {scenario.title}
                          </h4>
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground" data-testid={`text-progress-${scenario.id}`}>
                              {isLoading ? "..." : `${progressPercent}%`}
                            </span>
                          </div>
                          {isLoading ? (
                            <Skeleton className="w-full h-2" />
                          ) : (
                            <Progress value={progressPercent} className="h-2" data-testid={`progress-bar-${scenario.id}`} />
                          )}
                          <div className="text-sm text-muted-foreground">
                            {scenario.totalWords} vocabulary words
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
