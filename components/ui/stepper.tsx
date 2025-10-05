"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  disabled?: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <nav className={cn("flex items-center justify-center", className)}>
      <ol className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  step.completed
                    ? "bg-blue-600 border-blue-600 text-white"
                    : step.current
                    ? "bg-blue-50 border-blue-600 text-blue-600"
                    : step.disabled
                    ? "bg-gray-100 border-gray-300 text-gray-400"
                    : "bg-white border-gray-300 text-gray-600"
                )}
              >
                {step.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="ml-4">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.completed
                      ? "text-blue-600"
                      : step.current
                      ? "text-blue-600"
                      : step.disabled
                      ? "text-gray-400"
                      : "text-gray-600"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 ml-8",
                  step.completed ? "bg-blue-600" : "bg-gray-300"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface StepContentProps {
  step: Step;
  children: React.ReactNode;
  className?: string;
}

export function StepContent({ step, children, className }: StepContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
        {step.description && (
          <p className="text-gray-600 mt-2">{step.description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}