import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Handshake, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useState } from "react";

const BusinessPartners = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const partnerTypes = [
    {
      title: "Banker & Kreditinstitutter",
      description: "Integrer gældsrådgivning direkte i jeres kundeportal",
      icon: Building2,
      benefits: ["Forbedret kundetilfredshed", "Reducerede tab på dårlig gæld", "Automatiseret rådgivning"]
    },
    {
      title: "Inkassoselskaber",
      description: "Hjælp jeres kunder med konstruktive gældsløsninger",
      icon: Shield,
      benefits: ["Højere inddrivelsesrate", "Forbedret kundeforhold", "Reduktion i konflikter"]
    },
    {
      title: "Finansielle Rådgivere",
      description: "Udvid jeres service med specialiseret gældsrådgivning",
      icon: TrendingUp,
      benefits: ["Bredere service-palette", "Flere kundesegmenter", "Øget værditilbud"]
    }
  ];

  const features = [
    {
      title: "API Integration",
      description: "Seamless integration med jeres eksisterende systemer",
      icon: Zap
    },
    {
      title: "White Label Løsning",
      description: "Tilpas platformen til jeres brand og behov",
      icon: Building2
    },
    {
      title: "Compliance & Sikkerhed",
      description: "GDPR-compliant og bank-niveau sikkerhed",
      icon: Shield
    },
    {
      title: "Analytics & Rapporter",
      description: "Detaljeret indsigt i kundeadfærd og resultater",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="p-4 bg-gradient-hero rounded-2xl shadow-soft">
                <Handshake className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">
              Partner med
              <span className="bg-gradient-hero bg-clip-text text-transparent font-medium block">
                GældVej
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Styrk jeres kundeforhold og forretning med Danmarks mest omfattende 
              platform for gældsrådgivning og økonomisk vejledning
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-6 py-2 text-sm">
                🏆 Markedsledende teknologi
              </Badge>
              <Badge variant="outline" className="px-6 py-2 text-sm">
                🔒 GDPR-compliant
              </Badge>
              <Badge variant="outline" className="px-6 py-2 text-sm">
                ⚡ Hurtig implementation
              </Badge>
            </div>
          </div>

          {/* Partner Types */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {partnerTypes.map((partner, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-hero rounded-2xl w-fit mb-4">
                    <partner.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{partner.title}</CardTitle>
                  <CardDescription className="text-base">
                    {partner.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {partner.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <Card className="shadow-card mb-16">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Hvorfor partnere med GældVej?</CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Vores platform tilbyder alt hvad I behøver for at hjælpe jeres kunder 
                med at få styr på deres gæld og økonomi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-soft rounded-2xl">
                    <div className="mx-auto p-3 bg-accent/20 rounded-xl w-fit mb-4">
                      <feature.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid gap-6 md:grid-cols-4 mb-16">
            <div className="text-center p-6 bg-gradient-hero rounded-2xl text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/90">Hjulpne familier</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-card">
              <div className="text-4xl font-bold text-foreground mb-2">2.5M</div>
              <div className="text-muted-foreground">DKK i reduceret gæld</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-card">
              <div className="text-4xl font-bold text-foreground mb-2">94%</div>
              <div className="text-muted-foreground">Kundetilfredshed</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-card">
              <div className="text-4xl font-bold text-foreground mb-2">&lt; 24t</div>
              <div className="text-muted-foreground">Implementeringstid</div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-accent" />
                  Lad os tale sammen
                </CardTitle>
                <CardDescription>
                  Udfyld formularen og vi kontakter jer inden for 24 timer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Virksomhedsnavn *</Label>
                      <Input
                        id="companyName"
                        placeholder="Jeres virksomhed"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Kontaktperson *</Label>
                      <Input
                        id="contactPerson"
                        placeholder="Navn på kontaktperson"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="kontakt@virksomhed.dk"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        placeholder="+45 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Virksomhedstype *</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => setFormData({...formData, businessType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Vælg jeres branche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank / Kreditinstitut</SelectItem>
                        <SelectItem value="inkasso">Inkassoselskab</SelectItem>
                        <SelectItem value="advisor">Finansiel rådgiver</SelectItem>
                        <SelectItem value="insurance">Forsikringsselskab</SelectItem>
                        <SelectItem value="fintech">Fintech virksomhed</SelectItem>
                        <SelectItem value="other">Andet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Besked</Label>
                    <Textarea
                      id="message"
                      placeholder="Fortæl os om jeres behov og hvordan vi kan hjælpe..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-hero">
                    Send forespørgsel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Kontakt os direkte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">+45 70 20 30 40</p>
                      <p className="text-sm text-muted-foreground">Hverdage 9-17</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">partner@gaeldvej.dk</p>
                      <p className="text-sm text-muted-foreground">Vi svarer inden 24 timer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">København, Danmark</p>
                      <p className="text-sm text-muted-foreground">Book et møde</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-hero text-white shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">🚀 Kom hurtigt i gang</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Vores team kan have jer op at køre på under 24 timer. 
                    Book en demo og se hvordan GældVej kan styrke jeres forretning.
                  </p>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
                    Book demo nu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessPartners;