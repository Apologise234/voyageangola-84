import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CloudSun, DollarSign, Phone, MapPin, Plane, 
  Shield, Calendar, Languages, Thermometer, 
  CreditCard, Zap, Clock, AlertTriangle, Info
} from "lucide-react";

interface TravelInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TravelInfoModal = ({ open, onOpenChange }: TravelInfoModalProps) => {
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const currencies = {
    USD: { rate: 825, symbol: "$" },
    EUR: { rate: 900, symbol: "€" },
    BRL: { rate: 160, symbol: "R$" },
    ZAR: { rate: 45, symbol: "R" }
  };

  const convertCurrency = (amount: number, from: string): number => {
    return amount * currencies[from as keyof typeof currencies].rate;
  };

  const weatherData = [
    { city: "Luanda", temp: "28°C", condition: "Ensolarado", humidity: "75%" },
    { city: "Benguela", temp: "26°C", condition: "Parcialmente nublado", humidity: "68%" },
    { city: "Huambo", temp: "22°C", condition: "Fresco", humidity: "60%" },
    { city: "Lubango", temp: "20°C", condition: "Ameno", humidity: "55%" }
  ];

  const emergencyContacts = [
    { service: "Polícia", number: "113", icon: Shield },
    { service: "Bombeiros", number: "115", icon: Zap },
    { service: "Ambulância", number: "112", icon: Phone },
    { service: "Turismo", number: "+244 222 310 334", icon: Info }
  ];

  const essentialPhrases = [
    { portuguese: "Olá", kimbundu: "Muene", english: "Hello" },
    { portuguese: "Obrigado", kimbundu: "Asante", english: "Thank you" },
    { portuguese: "Por favor", kimbundu: "Fazavor", english: "Please" },
    { portuguese: "Desculpe", kimbundu: "Disculpa", english: "Sorry" },
    { portuguese: "Onde fica?", kimbundu: "Konde ku?", english: "Where is?" },
    { portuguese: "Quanto custa?", kimbundu: "Custa maningui?", english: "How much?" }
  ];

  const travelTips = [
    {
      category: "Documentação",
      icon: Plane,
      tips: [
        "Passaporte válido por no mínimo 6 meses",
        "Visto obrigatório para a maioria dos países",
        "Certificado de febre amarela necessário",
        "Seguro viagem recomendado"
      ]
    },
    {
      category: "Saúde",
      icon: Shield,
      tips: [
        "Vacina contra febre amarela obrigatória",
        "Profilaxia de malária recomendada",
        "Água mineral ou filtrada",
        "Protetor solar e repelente"
      ]
    },
    {
      category: "Dinheiro",
      icon: CreditCard,
      tips: [
        "Kwanza Angolano (AOA) é a moeda local",
        "USD amplamente aceito",
        "Cartões aceitos em estabelecimentos principais",
        "Troque dinheiro em casas autorizadas"
      ]
    },
    {
      category: "Cultura",
      icon: MapPin,
      tips: [
        "Cumprimente com aperto de mão",
        "Vista-se conservadoramente em locais religiosos",
        "Pontualidade é valorizada",
        "Negocie preços em mercados locais"
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Informações de Viagem - Angola
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="weather" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudSun className="h-4 w-4" />
              <span className="hidden md:inline">Clima</span>
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden md:inline">Moeda</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">Emergência</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden md:inline">Idioma</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">Dicas</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Horário</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {weatherData.map((weather, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {weather.city}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">{weather.temp}</div>
                      <p className="text-sm text-muted-foreground">{weather.condition}</p>
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <Thermometer className="h-4 w-4" />
                        <span>Umidade: {weather.humidity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Informações Climáticas Gerais</h3>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div>• Clima tropical com duas estações</div>
                <div>• Estação seca: Maio a Setembro</div>
                <div>• Estação chuvosa: Outubro a Abril</div>
                <div>• Temperaturas variam de 20°C a 32°C</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="currency" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversor de Moeda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={currencyAmount}
                        onChange={(e) => setCurrencyAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">De</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                      >
                        {Object.entries(currencies).map(([code, data]) => (
                          <option key={code} value={code}>{code} ({data.symbol})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Para AOA</label>
                      <div className="p-2 bg-muted rounded-md font-bold text-primary">
                        {currencyAmount ? 
                          `${convertCurrency(parseFloat(currencyAmount), selectedCurrency).toLocaleString()} Kz` : 
                          '0 Kz'
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Monetárias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• Moeda oficial: Kwanza Angolano (AOA)</div>
                    <div>• Símbolo: Kz</div>
                    <div>• Notas: 10, 20, 50, 100, 200, 500, 1000, 2000 Kz</div>
                    <div>• Moedas: 1, 5, 10, 20, 50 centavos; 1, 2, 5 Kz</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dicas Financeiras</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>• USD amplamente aceito</div>
                    <div>• Cartões aceitos em hotéis e restaurantes</div>
                    <div>• ATMs disponíveis nas cidades principais</div>
                    <div>• Troque em casas de câmbio autorizadas</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyContacts.map((contact, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500/10 rounded-full">
                        <contact.icon className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.service}</h3>
                        <p className="text-2xl font-bold text-primary">{contact.number}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Informações Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Mantenha sempre cópias dos documentos</div>
                <div>• Registre-se no consulado do seu país</div>
                <div>• Tenha contatos de emergência sempre à mão</div>
                <div>• Informe-se sobre áreas a evitar</div>
                <div>• Contrate seguro viagem abrangente</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frases Essenciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <div className="grid grid-cols-3 gap-4 p-2 bg-muted rounded font-semibold text-sm">
                    <div>Português</div>
                    <div>Kimbundu</div>
                    <div>English</div>
                  </div>
                  {essentialPhrases.map((phrase, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-2 border-b text-sm">
                      <div className="font-medium">{phrase.portuguese}</div>
                      <div className="text-primary">{phrase.kimbundu}</div>
                      <div className="text-muted-foreground">{phrase.english}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Informações Linguísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• Idioma oficial: Português</div>
                <div>• Idiomas nacionais: Kimbundu, Umbundu, Kikongo, Chokwe, entre outros</div>
                <div>• Inglês falado em hotéis e estabelecimentos turísticos</div>
                <div>• Francês menos comum, mas útil em áreas fronteiriças</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {travelTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tip.icon className="h-5 w-5 text-primary" />
                      {tip.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {tip.tips.map((item, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="time" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Fuso Horário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">UTC +1</div>
                    <p className="text-muted-foreground">Horário de Angola (WAT)</p>
                    <div className="space-y-2 text-sm">
                      <div>• 1 hora à frente de Londres (UTC)</div>
                      <div>• 4 horas à frente de Brasília</div>
                      <div>• Mesmo fuso que Lagos, Nigéria</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horários Importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Bancos:</span>
                    <span>8h-15h (Seg-Sex)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lojas:</span>
                    <span>9h-18h (Seg-Sáb)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restaurantes:</span>
                    <span>12h-15h, 19h-23h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supermercados:</span>
                    <span>8h-22h (Todo dia)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Órgãos públicos:</span>
                    <span>8h-16h (Seg-Sex)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TravelInfoModal;