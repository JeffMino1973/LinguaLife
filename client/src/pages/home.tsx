import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Globe, TrendingUp, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Students_learning_together_hero_ce38bf0a.png";
import shoppingImage from "@assets/generated_images/Shopping_scenario_illustration_e40e850d.png";
import diningImage from "@assets/generated_images/Dining_scenario_illustration_ba707407.png";
import travelImage from "@assets/generated_images/Traveling_scenario_illustration_5583bbf6.png";
import schoolImage from "@assets/generated_images/School_scenario_illustration_fcb31735.png";
import homeSceneImage from "@assets/generated_images/Home_scenario_illustration_d26dec36.png";

const scenarios = [
  {
    id: "shopping",
    title: "Shopping",
    description: "Learn essential phrases for markets and stores",
    image: shoppingImage,
    vocabularyCount: 25,
  },
  {
    id: "dining",
    title: "Dining Out",
    description: "Order food and navigate restaurants with confidence",
    image: diningImage,
    vocabularyCount: 30,
  },
  {
    id: "traveling",
    title: "Traveling",
    description: "Master travel vocabulary for airports and hotels",
    image: travelImage,
    vocabularyCount: 28,
  },
  {
    id: "school",
    title: "At School",
    description: "Communicate effectively in academic settings",
    image: schoolImage,
    vocabularyCount: 32,
  },
  {
    id: "home",
    title: "At Home",
    description: "Talk about family, rooms, and daily routines",
    image: homeSceneImage,
    vocabularyCount: 26,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODg4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <Badge className="text-sm font-semibold px-4 py-1.5" data-testid="badge-new-feature">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Learn Through Real-Life Scenarios
              </Badge>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Master Languages the Fun Way
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Build practical language skills through everyday situations. Shopping, dining, traveling, and more - learn the words and phrases that matter most.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-base font-semibold" data-testid="button-get-started">
                    Get Started Free
                    <BookOpen className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="text-base font-semibold" data-testid="button-explore-scenarios">
                    Explore Scenarios
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">3 Languages</div>
                    <div className="text-sm text-muted-foreground">Spanish, French, Mandarin</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Track Progress</div>
                    <div className="text-sm text-muted-foreground">See your improvement</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Students learning together" 
                className="relative rounded-2xl shadow-2xl w-full"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each scenario is packed with practical vocabulary, example sentences, and interactive exercises to help you learn faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} href={`/scenario/${scenario.id}`}>
              <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 h-full" data-testid={`card-scenario-${scenario.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={scenario.image} 
                    alt={scenario.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-scenario-${scenario.id}`}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="font-semibold shadow-md" data-testid={`badge-vocab-count-${scenario.id}`}>
                      {scenario.vocabularyCount} words
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2" data-testid={`text-scenario-title-${scenario.id}`}>
                    {scenario.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`text-scenario-desc-${scenario.id}`}>
                    {scenario.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students learning practical language skills through real-world scenarios.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-base font-semibold" data-testid="button-start-learning">
              Start Learning Now
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
