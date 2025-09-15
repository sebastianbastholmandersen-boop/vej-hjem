import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, Info, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Navigation from "@/components/Navigation";
import ConsentBanner from "@/components/ConsentBanner";
import { useDataCollection } from "@/hooks/useDataCollection";

interface Question {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

interface Result {
  title: string;
  description: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
  icon: typeof CheckCircle;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Hvor mange forskellige gældsposter har du?",
    options: [
      { text: "Ingen eller 1-2 stk", points: 0 },
      { text: "3-5 stk", points: 2 },
      { text: "6-10 stk", points: 4 },
      { text: "Mere end 10 stk", points: 6 }
    ]
  },
  {
    id: 2,
    question: "Hvor stor del af din månedlige indkomst går til gældsafbetaling?",
    options: [
      { text: "Under 20%", points: 0 },
      { text: "20-40%", points: 2 },
      { text: "40-60%", points: 4 },
      { text: "Over 60%", points: 6 }
    ]
  },
  {
    id: 3,
    question: "Hvor ofte kan du kun betale minimum på dine kreditkort eller lån?",
    options: [
      { text: "Aldrig - jeg betaler altid hele saldoen", points: 0 },
      { text: "Sjældent", points: 1 },
      { text: "Nogle gange", points: 3 },
      { text: "Altid eller næsten altid", points: 5 }
    ]
  },
  {
    id: 4,
    question: "Har du overblik over din samlede gæld?",
    options: [
      { text: "Ja, jeg ved præcist hvad jeg skylder", points: 0 },
      { text: "Jeg har nogenlunde overblik", points: 1 },
      { text: "Jeg har kun delvist overblik", points: 3 },
      { text: "Nej, jeg har ikke overblik", points: 5 }
    ]
  },
  {
    id: 5,
    question: "Hvor ofte oplever du økonomisk stress?",
    options: [
      { text: "Aldrig eller meget sjældent", points: 0 },
      { text: "En gang imellem", points: 2 },
      { text: "Flere gange om måneden", points: 4 },
      { text: "Dagligt eller næsten dagligt", points: 6 }
    ]
  },
  {
    id: 6,
    question: "Har du en nødopsparing?",
    options: [
      { text: "Ja, 3+ måneder udgifter", points: 0 },
      { text: "Ja, 1-2 måneders udgifter", points: 1 },
      { text: "Mindre end en måneds udgifter", points: 3 },
      { text: "Ingen nødopsparing", points: 5 }
    ]
  },
  {
    id: 7,
    question: "Låner du penge til daglige udgifter?",
    options: [
      { text: "Aldrig", points: 0 },
      { text: "Meget sjældent", points: 1 },
      { text: "En gang imellem", points: 3 },
      { text: "Ofte eller altid", points: 6 }
    ]
  }
];

const results: Record<string, Result> = {
  low: {
    title: "God økonomisk kontrol",
    description: "Du har god kontrol over din gæld og dine økonomiske forhold. Fortsæt med dine gode vaner!",
    recommendations: [
      "Bevar dit overblik over gæld og udgifter",
      "Overvej at øge din opsparing hvis muligt",
      "Gennemgå dine lånerenter - kan de forhandles ned?",
      "Lav en langsigtet økonomisk plan"
    ],
    severity: 'low',
    icon: CheckCircle
  },
  medium: {
    title: "Moderat gældsbelastning", 
    description: "Du har nogle udfordringer med din gæld, men det er håndterbart med de rette tiltag.",
    recommendations: [
      "Lav et komplet overblik over al din gæld",
      "Prioriter gæld med højeste rente først",
      "Overvej gældskonsolidering hvis det giver mening",
      "Opret et budget og hold øje med dine udgifter",
      "Søg rådgivning hos din bank eller en økonom"
    ],
    severity: 'medium',
    icon: AlertTriangle
  },
  high: {
    title: "Høj gældsbelastning",
    description: "Din gældssituation kræver øjeblikkelig handling. Det er vigtigt at få professionel hjælp.",
    recommendations: [
      "Kontakt din bank eller en gældsrådgiver med det samme",
      "Lav en detaljeret liste over al din gæld og indkomst", 
      "Stop med at optage ny gæld",
      "Undersøg muligheder for gældssanering eller betalingsordninger",
      "Overvej at kontakte kommunens gældsrådgivning",
      "Søg støtte fra familie eller venner hvis muligt"
    ],
    severity: 'high',
    icon: AlertTriangle
  }
};

const DebtQuiz = () => {
  const { saveToolData } = useDataCollection();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleAnswer = async (points: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = points;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
      // Save quiz results when completed
      await saveQuizResults(newAnswers);
    }
  };

  const saveQuizResults = async (answersData: number[]) => {
    const totalPoints = answersData.reduce((sum, points) => sum + points, 0);
    const result = calculateResult();
    
    const toolData = {
      answers: answersData,
      totalPoints,
      result: {
        severity: result.severity,
        title: result.title
      },
      timestamp: new Date().toISOString(),
      questionsCount: questions.length
    };

    const newSessionId = await saveToolData('debt_quiz', toolData);
    if (newSessionId) {
      setSessionId(newSessionId);
    }
  };

  const calculateResult = (): Result => {
    const totalPoints = answers.reduce((sum, points) => sum + points, 0);
    
    if (totalPoints <= 8) return results.low;
    if (totalPoints <= 20) return results.medium;
    return results.high;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const result = isCompleted ? calculateResult() : null;
  const IconComponent = result?.icon || Info;

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 bg-gradient-hero rounded-2xl shadow-soft">
                <Info className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              Gælds<span className="bg-gradient-hero bg-clip-text text-transparent font-medium">vurdering</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Få indsigt i din gældssituation med vores selvvurderings-quiz
            </p>
          </div>

          {!isCompleted ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-primary/10">
                    Spørgsmål {currentQuestion + 1} af {questions.length}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(progress)}% færdig
                  </div>
                </div>
                <Progress value={progress} className="h-2 mb-6" />
                <CardTitle className="text-2xl leading-relaxed">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(option.points)}
                    className="w-full text-left justify-start p-6 h-auto bg-card hover:bg-secondary/50 border border-border/50"
                  >
                    {option.text}
                  </Button>
                ))}
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={goToPrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Forrige
                  </Button>
                  
                  {answers[currentQuestion] !== undefined && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.min(currentQuestion + 1, questions.length - 1))}
                      className="flex items-center gap-2"
                      disabled={currentQuestion === questions.length - 1}
                    >
                      Næste
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl ${
                      result?.severity === 'low' ? 'bg-green-100 text-green-700' :
                      result?.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{result?.title}</CardTitle>
                      <CardDescription className="text-lg">
                        {result?.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-4">Anbefalede næste skridt:</h3>
                    <ul className="space-y-2">
                      {result?.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={resetQuiz}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Tag quiz igen
                    </Button>
                    
                    <Button 
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="bg-gradient-hero"
                    >
                      Få professionel hjælp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result?.severity !== 'low' && (
                <Card className="shadow-card border-accent/20 bg-accent/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Husk:</h4>
                        <p className="text-muted-foreground text-sm">
                          Du er ikke alene med dine gældsudfordringer. Professionel rådgivning kan hjælpe dig 
                          med at finde løsninger og skabe en plan frem til gældfrihed. Der er altid en vej ud.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <ConsentBanner />
    </div>
  );
};

export default DebtQuiz;