// Configuration du site de vente Plannitech
export const siteConfig = {
  name: "Plannitech",
  description: "La solution complète pour la gestion du spectacle vivant",
  url: "https://plannitech.com",
  ogImage: "https://plannitech.com/og-image.jpg",
  
  // Navigation
  nav: [
    { name: "Accueil", href: "/" },
    { name: "Fonctionnalités", href: "/features" },
    { name: "Tarifs", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Démo", href: "/demo" },
    { name: "Contact", href: "/contact" }
  ],

  // Plans de tarification
  plans: [
    {
      name: "Freelance",
      description: "Parfait pour les indépendants",
      monthlyPrice: 19,
      annualPrice: 190,
      features: [
        "5 projets actifs",
        "100 contacts",
        "Planning illimité",
        "Gestion financière basique",
        "Support email",
        "1 utilisateur",
        "Stockage 5GB",
        "Intégrations de base"
      ],
      popular: false
    },
    {
      name: "Team",
      description: "Idéal pour les petites équipes",
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        "25 projets actifs",
        "500 contacts",
        "Planning avancé",
        "Gestion financière complète",
        "Support prioritaire",
        "5 utilisateurs",
        "Stockage 25GB",
        "Toutes les intégrations",
        "API complète",
        "Rapports avancés",
        "Automatisation basique"
      ],
      popular: true
    },
    {
      name: "Pro",
      description: "Pour les organisations",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Projets illimités",
        "Contacts illimités",
        "Planning avec IA",
        "Gestion financière avancée",
        "Support dédié",
        "15 utilisateurs",
        "Stockage 100GB",
        "Intégrations personnalisées",
        "API complète + webhooks",
        "Rapports personnalisés",
        "Automatisation avancée",
        "IA pour optimisation",
        "Formation personnalisée"
      ],
      popular: false
    }
  ],

  // Fonctionnalités principales
  features: [
    {
      category: "Gestion d'événements",
      icon: "Calendar",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "Création et organisation d'événements",
        "Planning interactif et intuitif",
        "Gestion des répétitions et représentations",
        "Synchronisation calendrier",
        "Notifications automatiques",
        "Gestion des conflits d'agenda"
      ]
    },
    {
      category: "Base de données contacts",
      icon: "Users",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Fiche complète par contact",
        "Gestion des compétences et spécialités",
        "Suivi des disponibilités",
        "Historique des collaborations",
        "Import/Export CSV",
        "Recherche avancée et filtres"
      ]
    },
    {
      category: "Gestion financière",
      icon: "DollarSign",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        "Budgets prévisionnels par projet",
        "Suivi des dépenses en temps réel",
        "Génération automatique de devis",
        "Gestion des factures et paiements",
        "Calcul des charges sociales",
        "Rapports financiers détaillés"
      ]
    },
    {
      category: "Outils techniques",
      icon: "Shield",
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        "Fiches techniques complètes",
        "Plans de feu interactifs",
        "Inventaire matériel avec disponibilités",
        "Checklists de montage/démontage",
        "Conducteurs techniques",
        "Templates réutilisables"
      ]
    },
    {
      category: "Analytics & Rapports",
      icon: "BarChart3",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: [
        "Tableaux de bord personnalisables",
        "Métriques de performance",
        "Analyse des tendances",
        "Rapports automatisés",
        "Export PDF/Excel",
        "Alertes intelligentes"
      ]
    },
    {
      category: "Automatisation",
      icon: "Zap",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      items: [
        "Workflows personnalisables",
        "Notifications intelligentes",
        "Intégrations tierces",
        "Synchronisation multi-plateforme",
        "Templates automatisés",
        "IA pour l'optimisation"
      ]
    }
  ],

  // Témoignages
  testimonials: [
    {
      name: "Marie Dubois",
      role: "Directrice, Théâtre Municipal",
      content: "Plannitech a révolutionné notre gestion d'événements. L'interface est intuitive et nous fait gagner des heures chaque semaine.",
      rating: 5,
      avatar: "MD"
    },
    {
      name: "Jean Martin",
      role: "Producteur, Tech Events",
      content: "La gestion financière intégrée est un game-changer. Plus besoin de plusieurs outils, tout est centralisé.",
      rating: 5,
      avatar: "JM"
    },
    {
      name: "Sophie Leroy",
      role: "Organisatrice, Festival d'Été",
      content: "L'équipe support est exceptionnelle. Ils comprennent nos besoins et nous accompagnent parfaitement.",
      rating: 5,
      avatar: "SL"
    }
  ],

  // Statistiques
  stats: [
    { label: "Organisateurs", value: "500+" },
    { label: "Événements", value: "10k+" },
    { label: "Billets vendus", value: "50k+" },
    { label: "Satisfaction", value: "98%" }
  ],

  // Intégrations
  integrations: [
    { name: "Google Calendar", icon: "Calendar" },
    { name: "Stripe", icon: "DollarSign" },
    { name: "Mailchimp", icon: "Globe" },
    { name: "Slack", icon: "Settings" },
    { name: "WhatsApp", icon: "Smartphone" },
    { name: "Excel", icon: "FileText" }
  ],

  // FAQ
  faq: [
    {
      question: "Comment puis-je commencer ?",
      answer: "Inscrivez-vous pour un essai gratuit de 14 jours. Aucune carte de crédit requise."
    },
    {
      question: "Proposez-vous une formation ?",
      answer: "Oui, nous offrons des sessions de formation personnalisées pour tous nos clients."
    },
    {
      question: "Vos données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et sommes conformes au RGPD."
    },
    {
      question: "Puis-je intégrer mes outils existants ?",
      answer: "Oui, nous proposons de nombreuses intégrations et pouvons développer des connexions personnalisées."
    },
    {
      question: "Y a-t-il un support en français ?",
      answer: "Oui, notre équipe support est entièrement francophone et disponible en français."
    },
    {
      question: "Puis-je annuler à tout moment ?",
      answer: "Oui, vous pouvez annuler votre abonnement à tout moment sans frais."
    }
  ],

  // Équipe
  team: [
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
  ],

  // Contact
  contact: {
    email: "contact@plannitech.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Avenue des Spectacles, 75001 Paris, France",
    hours: {
      weekdays: "Lundi - Vendredi : 9h00 - 18h00",
      saturday: "Samedi : 10h00 - 16h00",
      sunday: "Dimanche : Fermé"
    }
  }
};

