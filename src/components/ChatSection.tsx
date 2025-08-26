import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hej! Jeg er her for at hjælpe dig med at forstå din gældssituation. Hvad vil du gerne vide om?",
      isBot: true
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const sampleQuestions = [
    "Hvad betyder inkasso?",
    "Hvordan laver jeg en afdragsplan?",
    "Hvad sker der hvis jeg ikke kan betale nu?",
    "Hvad er forskellen på debitor og kreditor?"
  ];

  const botResponses: { [key: string]: string } = {
    "inkasso": "Inkasso betyder, at en virksomhed prøver at inddrive penge, som du skylder. Det er ikke farligt - det er bare en måde at få hjælp til at betale gæld tilbage på en struktureret måde.",
    "afdragsplan": "En afdragsplan er en aftale om at betale din gæld tilbage i mindre beløb over tid. Vi kan hjælpe dig med at finde en plan, der passer til din økonomi.",
    "ikke kan betale": "Hvis du ikke kan betale lige nu, er det vigtigste at tage kontakt hurtigst muligt. Der findes altid løsninger - det kan være en betalingsaftale eller anden hjælp.",
    "debitor kreditor": "Du er debitor (den der skylder penge), og kreditor er den du skylder penge til. Enkelt sagt: du skylder, de får."
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate bot response
    setTimeout(() => {
      const lowercaseText = text.toLowerCase();
      let response = "Tak for dit spørgsmål. Jeg forstår at det kan være forvirrende. Lad mig hjælpe dig med at finde den rigtige løsning til din situation.";

      // Simple keyword matching for demo
      for (const [keyword, botResponse] of Object.entries(botResponses)) {
        if (lowercaseText.includes(keyword)) {
          response = botResponse;
          break;
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputValue("");
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <section id="ai-chat" className="py-20 px-6 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-hero rounded-2xl shadow-soft">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-light text-foreground mb-4">
            Stil dine spørgsmål
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Få klare svar på dine spørgsmål om gæld og inkasso - ingen jurasprog, kun hjælpsomme forklaringer
          </p>
        </div>

        {/* Sample questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {sampleQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 h-auto text-left justify-start bg-secondary/50 hover:bg-secondary border-border/50 hover:shadow-soft transition-all duration-300"
              onClick={() => handleQuestionClick(question)}
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Chat interface */}
        <Card className="p-6 shadow-card border-border/50">
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.isBot && (
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-gradient-hero text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv dit spørgsmål her..."
              className="flex-1 rounded-xl border-border/50 focus:ring-primary/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputValue);
                }
              }}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              className="bg-gradient-hero hover:shadow-soft rounded-xl px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatSection;