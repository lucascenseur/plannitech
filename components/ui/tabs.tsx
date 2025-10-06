"use client";

import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Context pour les tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {activeTabContent}
      </div>
    </div>
  );
}

interface TabCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function TabCard({ title, description, children, className }: TabCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

// Composants compatibles avec Radix UI
interface TabsRootProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsRoot({ defaultValue, className, children }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("space-y-4", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={cn("border-b border-gray-200", className)}>
      <nav className="flex space-x-8">
        {children}
      </nav>
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
        activeTab === value
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={cn("mt-4", className)}>
      {children}
    </div>
  );
}

