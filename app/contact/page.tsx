"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedIcon
} from "@/components/ui/animations";
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de l'envoi du formulaire
    console.log("Formulaire envoyé:", formData);
    alert("Message envoyé ! Nous vous répondrons dans les 24h.");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 24h",
      contact: "contact@plannitech.com",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Lun-Ven 9h-18h",
      contact: "+33 1 23 45 67 89",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MessageCircle,
      title: "Chat en direct",
      description: "Support instantané",
      contact: "Disponible 24/7",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const teamMembers = [
    {
      name: "Marie Dubois",
      role: "Directrice Commerciale",
      email: "marie@plannitech.com",
      avatar: "MD"
    },
    {
      name: "Jean Martin",
      role: "Responsable Support",
      email: "jean@plannitech.com",
      avatar: "JM"
    },
    {
      name: "Sophie Leroy",
      role: "Responsable Technique",
      email: "sophie@plannitech.com",
      avatar: "SL"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MarketingHeader currentPage="contact" />

      {/* Hero Section */}
      <AnimatedSection className="py-20">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Contactez notre{" "}
              <span className="text-blue-600">équipe</span>
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nous sommes là pour vous aider. Que vous ayez des questions sur nos fonctionnalités, 
              besoin d'un devis personnalisé ou d'un support technique, notre équipe vous répond rapidement.
            </p>
          </AnimatedText>
        </div>
      </AnimatedSection>

      {/* Contact Methods */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment nous contacter
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le moyen qui vous convient le mieux
            </p>
          </AnimatedText>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <AnimatedCard key={index} className="text-center" delay={0.1 * (index + 1)}>
                <Card>
                  <CardHeader>
                    <AnimatedIcon delay={0.2 * (index + 1)}>
                      <div className={`w-16 h-16 ${method.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <method.icon className={`w-8 h-8 ${method.color}`} />
                      </div>
                    </AnimatedIcon>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-900">{method.contact}</p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Form */}
      <AnimatedSection className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <AnimatedCard delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                    <CardDescription>
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24h.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company">Entreprise</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleChange("company", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type de demande *</Label>
                          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="demo">Demande de démo</SelectItem>
                              <SelectItem value="pricing">Question sur les tarifs</SelectItem>
                              <SelectItem value="support">Support technique</SelectItem>
                              <SelectItem value="partnership">Partenariat</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange("subject", e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          rows={6}
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer le message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedCard>

              {/* Contact Info */}
              <div className="space-y-8">
                <AnimatedCard delay={0.3}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        Notre adresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        123 Avenue des Spectacles<br />
                        75001 Paris, France
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                <AnimatedCard delay={0.4}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        Horaires d'ouverture
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-gray-600">
                        <p>Lundi - Vendredi : 9h00 - 18h00</p>
                        <p>Samedi : 10h00 - 16h00</p>
                        <p>Dimanche : Fermé</p>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                <AnimatedCard delay={0.5}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Notre équipe
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-gray-600">
                                {member.avatar}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedText className="text-center mb-16" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </AnimatedText>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <AnimatedText delay={0.1}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Comment puis-je commencer ?
                    </h3>
                    <p className="text-gray-600">
                      Inscrivez-vous pour un essai gratuit de 14 jours. Aucune carte de crédit requise.
                    </p>
                  </div>
                </AnimatedText>
                <AnimatedText delay={0.2}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Proposez-vous une formation ?
                    </h3>
                    <p className="text-gray-600">
                      Oui, nous offrons des sessions de formation personnalisées pour tous nos clients.
                    </p>
                  </div>
                </AnimatedText>
                <AnimatedText delay={0.3}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Vos données sont-elles sécurisées ?
                    </h3>
                    <p className="text-gray-600">
                      Absolument. Nous utilisons un chiffrement de niveau bancaire et sommes conformes au RGPD.
                    </p>
                  </div>
                </AnimatedText>
              </div>
              <div className="space-y-6">
                <AnimatedText delay={0.4}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Puis-je intégrer mes outils existants ?
                    </h3>
                    <p className="text-gray-600">
                      Oui, nous proposons de nombreuses intégrations et pouvons développer des connexions personnalisées.
                    </p>
                  </div>
                </AnimatedText>
                <AnimatedText delay={0.5}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Y a-t-il un support en français ?
                    </h3>
                    <p className="text-gray-600">
                      Oui, notre équipe support est entièrement francophone et disponible en français.
                    </p>
                  </div>
                </AnimatedText>
                <AnimatedText delay={0.6}>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Puis-je annuler à tout moment ?
                    </h3>
                    <p className="text-gray-600">
                      Oui, vous pouvez annuler votre abonnement à tout moment sans frais.
                    </p>
                  </div>
                </AnimatedText>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <AnimatedText delay={0.2}>
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à nous rejoindre ?
            </h2>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Découvrez comment Plannitech peut transformer votre gestion d'événements. 
              Commencez votre essai gratuit dès aujourd'hui.
            </p>
          </AnimatedText>
          <AnimatedButton delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Commencer l'essai gratuit
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                <Headphones className="mr-2 h-5 w-5" />
                Planifier un appel
              </Button>
            </div>
          </AnimatedButton>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}
