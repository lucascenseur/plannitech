"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ContextCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stats?: {
    value: string | number;
    label: string;
    trend?: "up" | "down" | "neutral";
  }[];
  quickLinks?: QuickLink[];
  mainAction?: {
    label: string;
    href: string;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  className?: string;
  locale: string;
}

export function ContextCard({
  title,
  description,
  icon: Icon,
  stats,
  quickLinks,
  mainAction,
  color = "blue",
  className,
  locale
}: ContextCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          icon: "text-blue-600 bg-blue-100",
          accent: "text-blue-600",
          border: "border-blue-200 hover:border-blue-300"
        };
      case "green":
        return {
          icon: "text-green-600 bg-green-100",
          accent: "text-green-600",
          border: "border-green-200 hover:border-green-300"
        };
      case "purple":
        return {
          icon: "text-purple-600 bg-purple-100",
          accent: "text-purple-600",
          border: "border-purple-200 hover:border-purple-300"
        };
      case "orange":
        return {
          icon: "text-orange-600 bg-orange-100",
          accent: "text-orange-600",
          border: "border-orange-200 hover:border-orange-300"
        };
      case "red":
        return {
          icon: "text-red-600 bg-red-100",
          accent: "text-red-600",
          border: "border-red-200 hover:border-red-300"
        };
      default:
        return {
          icon: "text-blue-600 bg-blue-100",
          accent: "text-blue-600",
          border: "border-blue-200 hover:border-blue-300"
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card className={cn(
      "bg-white text-gray-900 hover:shadow-md transition-all duration-200 cursor-pointer",
      colorClasses.border,
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg", colorClasses.icon)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {description}
              </p>
            </div>
          </div>
          <ArrowRight className={cn("h-4 w-4", colorClasses.accent)} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600">
                  {stat.label}
                </div>
                {stat.trend && (
                  <Badge
                    variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "destructive" : "secondary"}
                    className="mt-1"
                  >
                    {stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "→"}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        {quickLinks && quickLinks.length > 0 && (
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-medium text-gray-700">
              {locale === 'en' ? 'Quick Access' : locale === 'es' ? 'Acceso Rápido' : 'Accès Rapide'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link, index) => {
                const LinkIcon = link.icon;
                return (
                  <Link key={index} href={`/${locale}${link.href}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {LinkIcon && <LinkIcon className="h-3 w-3 mr-1" />}
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Action */}
        {mainAction && (
          <Link href={`/${locale}${mainAction.href}`}>
            <Button
              className={cn(
                "w-full justify-center",
                color === "blue" ? "bg-blue-600 hover:bg-blue-700" :
                color === "green" ? "bg-green-600 hover:bg-green-700" :
                color === "purple" ? "bg-purple-600 hover:bg-purple-700" :
                color === "orange" ? "bg-orange-600 hover:bg-orange-700" :
                color === "red" ? "bg-red-600 hover:bg-red-700" :
                "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <Plus className="h-4 w-4 mr-2" />
              {mainAction.label}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
