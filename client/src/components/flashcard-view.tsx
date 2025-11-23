import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCw } from "lucide-react";
import type { VocabularyItem } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSpeechSynthesis, getLanguageCode } from "@/hooks/use-speech-synthesis";

interface FlashcardViewProps {
  vocabulary: VocabularyItem[];
  scenarioId: string;
  language: string;
}

export default function FlashcardView({ vocabulary, scenarioId, language }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { speak, stop, isSpeaking, isSupported, activeId } = useSpeechSynthesis();

  const markAsMasteredMutation = useMutation({
    mutationFn: (wordId: string) =>
      apiRequest("POST", `/api/progress?language=${language}`, {
        action: "master-word",
        wordId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${language}`] });
      toast({
        title: "Great job!",
        description: "Word marked as mastered",
      });
    },
  });

  if (vocabulary.length === 0) {
    return (
      <Card data-testid="card-no-vocabulary">
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground text-lg">
            No vocabulary available for this difficulty level.
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentWord = vocabulary[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    markAsMasteredMutation.mutate(currentWord.id);
    handleNext();
  };

  // Separate handler for speaking the vocabulary word
  const handleSpeakWord = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio button
    // Toggle word audio - if playing word, stop it; otherwise start word audio
    speak(currentWord.word, { 
      lang: getLanguageCode(language),
      id: `word-${currentWord.id}`
    });
  };

  // Separate handler for speaking the example sentence
  const handleSpeakExample = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio button
    // Toggle example audio - if playing example, stop it; otherwise start example audio
    speak(currentWord.exampleSentence, { 
      lang: getLanguageCode(language),
      id: `example-${currentWord.id}`
    });
  };

  // Check if this specific audio is currently playing
  const isWordPlaying = activeId === `word-${currentWord.id}`;
  const isExamplePlaying = activeId === `example-${currentWord.id}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Card {currentIndex + 1} of {vocabulary.length}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={vocabulary.length <= 1}
            data-testid="button-previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={vocabulary.length <= 1}
            data-testid="button-next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card
        className="min-h-96 cursor-pointer hover-elevate transition-all duration-300"
        onClick={handleFlip}
        data-testid="card-flashcard"
      >
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-96">
          {!isFlipped ? (
            <div className="text-center space-y-6 w-full">
              {currentWord.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={currentWord.imageUrl}
                    alt={currentWord.word}
                    className="w-56 h-56 object-contain rounded-lg"
                    data-testid="img-vocabulary"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h3 className="font-serif text-4xl font-bold text-foreground" data-testid="text-word">
                    {currentWord.word}
                  </h3>
                  {isSupported && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSpeakWord}
                      className="hover-elevate"
                      data-testid="button-speak-word"
                    >
                      {isWordPlaying ? (
                        <VolumeX className="w-6 h-6 text-primary" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-primary" />
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-lg italic text-muted-foreground" data-testid="text-pronunciation">
                  {currentWord.pronunciation}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Click to see translation
              </p>
            </div>
          ) : (
            <div className="text-center space-y-6 w-full">
              <div>
                <h3 className="font-serif text-4xl font-bold text-primary mb-4" data-testid="text-translation">
                  {currentWord.translation}
                </h3>
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-semibold text-muted-foreground">
                        Example:
                      </div>
                      {isSupported && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSpeakExample}
                          className="h-6 gap-1.5 text-xs hover-elevate"
                          data-testid="button-speak-example"
                        >
                          {isExamplePlaying ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          Listen
                        </Button>
                      )}
                    </div>
                    <p className="text-lg text-foreground italic" data-testid="text-example">
                      "{currentWord.exampleSentence}"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">
                      Translation:
                    </div>
                    <p className="text-base text-muted-foreground" data-testid="text-example-translation">
                      {currentWord.exampleTranslation}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Click to flip back
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={handleFlip}
          className="gap-2"
          data-testid="button-flip"
        >
          <RotateCw className="w-4 h-4" />
          Flip Card
        </Button>
        <Button
          onClick={handleMastered}
          disabled={markAsMasteredMutation.isPending}
          className="gap-2"
          data-testid="button-mark-mastered"
        >
          I Know This Word
        </Button>
      </div>
    </div>
  );
}
