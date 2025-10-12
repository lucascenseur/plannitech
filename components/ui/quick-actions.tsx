"use client";

import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, MapPin, FileText, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "outline" | "secondary";
  color?: "blue" | "green" | "purple" | "orange";
}

interface QuickActionsProps {
  locale: string;
  className?: string;
}

const getQuickActions = (locale: string): QuickAction[] => [
  {
    id: "new-show",
    label: locale === 'en' ? 'New Show' : locale === 'es' ? 'Nuevo Espectáculo' : 'Nouveau Spectacle',
    href: "/dashboard/shows/new",
    icon: Plus,
    variant: "default",
    color: "blue"
  },
  {
    id: "quick-planning",
    label: locale === 'en' ? 'Quick Planning' : locale === 'es' ? 'Planificación Rápida' : 'Planning Rapide',
    href: "/dashboard/planning",
    icon: Calendar,
    variant: "outline",
    color: "green"
  },
  {
    id: "new-contact",
    label: locale === 'en' ? 'New Contact' : locale === 'es' ? 'Nuevo Contacto' : 'Nouveau Contact',
    href: "/dashboard/team",
    icon: Users,
    variant: "outline",
    color: "purple"
  },
  {
    id: "new-venue",
    label: locale === 'en' ? 'New Venue' : locale === 'es' ? 'Nuevo Lugar' : 'Nouveau Lieu',
    href: "/dashboard/shows",
    icon: MapPin,
    variant: "outline",
    color: "orange"
  }
];

export function QuickActions({ locale, className }: QuickActionsProps) {
  const actions = getQuickActions(locale);

  const getColorClasses = (color: string, variant: string) => {
    if (variant === "default") {
      switch (color) {
        case "blue": return "bg-blue-600 hover:bg-blue-700 text-white";
        case "green": return "bg-green-600 hover:bg-green-700 text-white";
        case "purple": return "bg-purple-600 hover:bg-purple-700 text-white";
        case "orange": return "bg-orange-600 hover:bg-orange-700 text-white";
        default: return "bg-blue-600 hover:bg-blue-700 text-white";
      }
    } else {
      switch (color) {
        case "blue": return "border-blue-600 text-blue-600 hover:bg-blue-50";
        case "green": return "border-green-600 text-green-600 hover:bg-green-50";
        case "purple": return "border-purple-600 text-purple-600 hover:bg-purple-50";
        case "orange": return "border-orange-600 text-orange-600 hover:bg-orange-50";
        default: return "border-blue-600 text-blue-600 hover:bg-blue-50";
      }
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.id} href={`/${locale}${action.href}`}>
            <Button
              variant={action.variant}
              className={cn(
                "inline-flex items-center gap-2",
                getColorClasses(action.color || "blue", action.variant || "default")
              )}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
