import { useState } from "react";
import { Send, MapPin, Utensils, Music, Camera, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const TourGuide = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {
      text: "👋 Bem-vindo! Este chat está conectado ao ZEUS, o novo guia virtual de Angola 🌍. ⚡ Ainda não está totalmente disponível, mas você já pode conversar comigo e explorar Angola de forma única.\n\nSou como aquele amigo que conhece Angola de cabo a rabo - das praias paradisíacas às montanhas da Huíla, da deliciosa culinária aos ritmos que fazem o coração vibrar. O que você gostaria de descobrir sobre este país maravilhoso?",
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickTopics = [
    { icon: MapPin, label: "Pontos Turísticos", color: "bg-blue-500" },
    { icon: Utensils, label: "Gastronomia", color: "bg-green-500" },
    { icon: Music, label: "Cultura & Tradições", color: "bg-purple-500" },
    { icon: Camera, label: "Províncias", color: "bg-orange-500" },
    { icon: Clock, label: "Dicas de Viagem", color: "bg-red-500" }
  ];

  const handleQuickTopic = (topic: string) => {
    const topicQuestions: {[key: string]: string} = {
      "Pontos Turísticos": "Quais são os principais pontos turísticos de Angola que devo visitar?",
      "Gastronomia": "Conte-me sobre a gastronomia típica angolana e pratos que devo experimentar.",
      "Cultura & Tradições": "Quero conhecer mais sobre a cultura e tradições de Angola.",
      "Províncias": "Quais províncias de Angola são mais interessantes para turismo?",
      "Dicas de Viagem": "Que dicas práticas você tem para quem vai viajar para Angola?"
    };
    
    setQuestion(topicQuestions[topic] || "");
  };

  const generateResponse = (userQuestion: string, conversationContext: string[] = []): string => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Gastronomia
    if (lowerQuestion.includes("gastronomia") || lowerQuestion.includes("comida") || lowerQuestion.includes("prato") || lowerQuestion.includes("típica")) {
      return `A culinária angolana é incrível! 🍽️ Os pratos principais são o **funge** (feito de mandioca), **calulu** (peixe com folhas de abóbora), **mufete** (peixe grelhado com feijão e dendê) e **muamba de galinha**. Recomendo experimentar nos mercados tradicionais como o Roque Santeiro em Luanda!`;
    }
    
    // Pontos turísticos
    if (lowerQuestion.includes("turístico") || lowerQuestion.includes("visitar") || lowerQuestion.includes("lugar")) {
      return `Angola tem lugares incríveis! 🏞️ Em **Luanda**, visite a Fortaleza de São Miguel e a Ilha de Luanda. **Benguela** tem praias paradisíacas como Caota. No **Namibe**, o deserto e o Arco são únicos. Na **Huíla**, não perca a Serra da Leba e Tundavala - vistas de tirar o fôlego!`;
    }
    
    // Cultura e tradições
    if (lowerQuestion.includes("cultura") || lowerQuestion.includes("tradição") || lowerQuestion.includes("música")) {
      return `A cultura angolana é vibrante! 🎭 Nossa música inclui **semba** (origem da samba brasileira), **kuduro**, **kizomba** e **kazukuta**. A arte tradicional como máscaras Chokwe e esculturas em madeira é reconhecida mundialmente. Visite durante o Carnaval de Luanda ou Festival Nacional de Cultura!`;
    }
    
    // Províncias
    if (lowerQuestion.includes("província") || lowerQuestion.includes("região")) {
      return `Angola tem 18 províncias fascinantes! 🗺️ **Luanda** é a capital vibrante, **Benguela** tem as melhores praias costeiras, **Namibe** oferece aventuras no deserto, **Huíla** tem montanhas e Tundavala, e **Cabinda** é nossa joia tropical. Cada uma tem características únicas de cultura, economia e paisagens!`;
    }
    
    // Dicas de viagem
    if (lowerQuestion.includes("dica") || lowerQuestion.includes("viagem") || lowerQuestion.includes("viajar")) {
      return `Para viajar para Angola: ✈️ **Melhor época** é maio-outubro (estação seca). **Documentos** necessários: visto, passaporte válido e certificado de febre amarela. **Transporte**: TAP/TAAG para chegada, carro com motorista local recomendado. Reserve hospedagem antecipadamente e mantenha documentos sempre seguros!`;
    }
    
    // Resposta padrão
    return `Ainda não tenho essa informação completa, mas posso te orientar em como buscar. 😊 Recomendo consultar o Ministério do Turismo de Angola ou guias locais credenciados. Que tal me perguntar sobre gastronomia, pontos turísticos, cultura ou dicas de viagem? 🇦🇴`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    const userMessage = { text: question, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    // Simular delay para resposta mais realista
    setTimeout(() => {
      const response = generateResponse(question);
      const botMessage = { text: response, isUser: false };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);

    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">
              ZEUS - Guia Virtual de Angola ⚡
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Converse com ZEUS e descubra Angola como nunca antes! 
              Um guia que fala de coração sobre as maravilhas angolanas.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Topics */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Tópicos Rápidos
                  </CardTitle>
                  <CardDescription>
                    Clique para fazer perguntas sobre estes temas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <Button
                        key={topic.label}
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto p-4"
                        onClick={() => handleQuickTopic(topic.label)}
                      >
                        <div className={`p-2 rounded-full ${topic.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-left">{topic.label}</span>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Sobre o Guia</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Sou especializado em turismo angolano e posso ajudá-lo com:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Informações sobre as 18 províncias</li>
                    <li>Pontos turísticos e atividades</li>
                    <li>Gastronomia típica</li>
                    <li>Cultura e tradições</li>
                    <li>Dicas práticas de viagem</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Chat com o Guia</CardTitle>
                  <CardDescription>
                    Faça suas perguntas sobre Angola
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Preparando resposta...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Faça sua pergunta sobre Angola..."
                      className="flex-1 min-h-[60px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                    <Button type="submit" disabled={!question.trim() || isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;