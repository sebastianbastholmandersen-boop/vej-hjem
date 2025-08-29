import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const { toast } = useToast();

  const sampleQuestions = [
    "Hvad betyder inkasso?",
    "Hvordan laver jeg en afdragsplan?",
    "Hvad sker der hvis jeg ikke kan betale nu?",
    "Hvad er forskellen på debitor og kreditor?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const body: any = {
        message: text,
      };

      // Include session_id if we have one
      if (sessionId) {
        body.session_id = sessionId;
      }

      const { data, error } = await supabase.functions.invoke('chat', {
        body
      });

      if (error) {
        console.error('Chat error:', error);
        toast({
          title: "Fejl",
          description: "Der opstod en fejl. Prøv venligst igen.",
          variant: "destructive",
        });
        return;
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        isBot: true
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Fejl",
        description: "Der opstod en fejl. Prøv venligst igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted text-foreground px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv dit spørgsmål her..."
              className="flex-1 rounded-xl border-border/50 focus:ring-primary/20"
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(inputValue);
                }
              }}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              className="bg-gradient-hero hover:shadow-soft rounded-xl px-6"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ChatSection;