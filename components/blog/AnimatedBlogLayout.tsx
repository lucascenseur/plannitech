"use client";

import { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedIcon,
  AnimatedGrid,
  AnimatedGridItem
} from "@/components/ui/animations";

interface AnimatedBlogLayoutProps {
  children: React.ReactNode;
}

export function AnimatedBlogLayout({ children }: AnimatedBlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}

// Re-export des composants d'animation
export { 
  AnimatedSection, 
  AnimatedText, 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedIcon,
  AnimatedGrid,
  AnimatedGridItem
};
