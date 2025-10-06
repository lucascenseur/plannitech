import { FrenchLaborLaw, TimeCalculation, FRENCH_LABOR_LAW } from "@/types/team";

// Jours fériés français 2024
const FRENCH_HOLIDAYS_2024 = [
  '2024-01-01', // Jour de l'An
  '2024-04-01', // Lundi de Pâques
  '2024-05-01', // Fête du Travail
  '2024-05-08', // Victoire 1945
  '2024-05-09', // Ascension
  '2024-05-20', // Lundi de Pentecôte
  '2024-07-14', // Fête Nationale
  '2024-08-15', // Assomption
  '2024-11-01', // Toussaint
  '2024-11-11', // Armistice
  '2024-12-25', // Noël
];

export class FrenchLaborCalculator {
  private laborLaw: FrenchLaborLaw;

  constructor(laborLaw: FrenchLaborLaw = FRENCH_LABOR_LAW) {
    this.laborLaw = laborLaw;
  }

  // Calculer les heures et la rémunération pour une période donnée
  calculateTimeAndPay(
    startDate: Date,
    endDate: Date,
    hourlyRate: number,
    isIntermittent: boolean = false
  ): TimeCalculation {
    const violations: string[] = [];
    let regularHours = 0;
    let overtimeHours = 0;
    let nightHours = 0;
    let sundayHours = 0;
    let holidayHours = 0;
    let totalHours = 0;

    // Calculer les heures par jour
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayHours = this.calculateDayHours(currentDate, startDate, endDate);
      const dayType = this.getDayType(currentDate);
      
      // Vérifier les limites quotidiennes
      if (dayHours > this.laborLaw.maxDailyHours) {
        violations.push(`Dépassement des heures quotidiennes le ${currentDate.toLocaleDateString()}: ${dayHours}h > ${this.laborLaw.maxDailyHours}h`);
      }

      // Calculer les heures selon le type de jour
      switch (dayType) {
        case 'holiday':
          holidayHours += dayHours;
          break;
        case 'sunday':
          sundayHours += dayHours;
          break;
        case 'night':
          nightHours += dayHours;
          break;
        default:
          regularHours += dayHours;
          break;
      }

      totalHours += dayHours;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculer les heures supplémentaires (au-delà de 35h/semaine)
    const weeklyHours = this.calculateWeeklyHours(startDate, endDate);
    if (weeklyHours > 35) {
      const weeklyOvertime = weeklyHours - 35;
      overtimeHours += weeklyOvertime;
      regularHours -= weeklyOvertime;
    }

    // Calculer les rémunérations
    const regularPay = regularHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * this.laborLaw.overtimeRate;
    const nightPay = nightHours * hourlyRate * this.laborLaw.nightWorkRate;
    const sundayPay = sundayHours * hourlyRate * this.laborLaw.sundayWorkRate;
    const holidayPay = holidayHours * hourlyRate * this.laborLaw.holidayWorkRate;

    const totalPay = regularPay + overtimePay + nightPay + sundayPay + holidayPay;

    // Calculer le temps de repos
    const restTime = this.calculateRestTime(startDate, endDate);

    // Vérifier la conformité
    const isCompliant = violations.length === 0 && 
                       totalHours <= this.laborLaw.maxWeeklyHours &&
                       restTime >= this.laborLaw.minWeeklyRest;

    return {
      regularHours,
      overtimeHours,
      nightHours,
      sundayHours,
      holidayHours,
      totalHours,
      regularPay,
      overtimePay,
      nightPay,
      sundayPay,
      holidayPay,
      totalPay,
      restTime,
      isCompliant,
      violations
    };
  }

  // Calculer les heures pour une journée donnée
  private calculateDayHours(date: Date, startDate: Date, endDate: Date): number {
    // Pour simplifier, on considère 8h par jour
    // En réalité, cela devrait venir des données de tâches
    const start = new Date(date);
    const end = new Date(date);
    
    if (date < startDate || date > endDate) {
      return 0;
    }

    // Heures de travail typiques (8h-17h)
    start.setHours(8, 0, 0, 0);
    end.setHours(17, 0, 0, 0);
    
    return 8; // 8 heures par jour par défaut
  }

  // Déterminer le type de jour
  private getDayType(date: Date): 'regular' | 'sunday' | 'holiday' | 'night' {
    const dateStr = date.toISOString().split('T')[0];
    
    // Vérifier si c'est un jour férié
    if (FRENCH_HOLIDAYS_2024.includes(dateStr)) {
      return 'holiday';
    }
    
    // Vérifier si c'est un dimanche
    if (date.getDay() === 0) {
      return 'sunday';
    }
    
    // Vérifier si c'est du travail de nuit (22h-6h)
    const hour = date.getHours();
    if (hour >= 22 || hour < 6) {
      return 'night';
    }
    
    return 'regular';
  }

  // Calculer les heures hebdomadaires
  private calculateWeeklyHours(startDate: Date, endDate: Date): number {
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(daysDiff * 8, 48); // Maximum 48h par semaine
  }

  // Calculer le temps de repos
  private calculateRestTime(startDate: Date, endDate: Date): number {
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalRestTime = daysDiff * 24 - (daysDiff * 8); // 16h de repos par jour
    return Math.max(totalRestTime, this.laborLaw.minWeeklyRest);
  }

  // Vérifier la conformité des heures de travail
  checkCompliance(
    startDate: Date,
    endDate: Date,
    previousEndDate?: Date
  ): { isCompliant: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Vérifier le repos entre deux périodes de travail
    if (previousEndDate) {
      const restBetweenShifts = (startDate.getTime() - previousEndDate.getTime()) / (1000 * 60 * 60);
      if (restBetweenShifts < this.laborLaw.minRestBetweenShifts) {
        violations.push(`Repos insuffisant entre deux périodes: ${restBetweenShifts}h < ${this.laborLaw.minRestBetweenShifts}h`);
      }
    }

    // Vérifier les heures hebdomadaires
    const weeklyHours = this.calculateWeeklyHours(startDate, endDate);
    if (weeklyHours > this.laborLaw.maxWeeklyHours) {
      violations.push(`Dépassement des heures hebdomadaires: ${weeklyHours}h > ${this.laborLaw.maxWeeklyHours}h`);
    }

    // Vérifier les heures annuelles (approximation)
    const annualHours = weeklyHours * 52; // Approximation
    if (annualHours > this.laborLaw.maxAnnualHours) {
      violations.push(`Dépassement des heures annuelles: ${annualHours}h > ${this.laborLaw.maxAnnualHours}h`);
    }

    return {
      isCompliant: violations.length === 0,
      violations
    };
  }

  // Calculer les charges sociales pour intermittents
  calculateSocialCharges(
    grossPay: number,
    isIntermittent: boolean
  ): {
    employeeCharges: number;
    employerCharges: number;
    netPay: number;
    totalCost: number;
  } {
    if (!isIntermittent) {
      // Salarié classique
      const employeeCharges = grossPay * 0.22; // ~22% de charges salariales
      const employerCharges = grossPay * 0.45; // ~45% de charges patronales
      const netPay = grossPay - employeeCharges;
      const totalCost = grossPay + employerCharges;
      
      return {
        employeeCharges,
        employerCharges,
        netPay,
        totalCost
      };
    } else {
      // Intermittent du spectacle
      const employeeCharges = grossPay * 0.12; // ~12% de charges intermittents
      const employerCharges = grossPay * 0.23; // ~23% de charges employeur
      const netPay = grossPay - employeeCharges;
      const totalCost = grossPay + employerCharges;
      
      return {
        employeeCharges,
        employerCharges,
        netPay,
        totalCost
      };
    }
  }

  // Générer un rapport de conformité
  generateComplianceReport(
    teamMemberId: string,
    startDate: Date,
    endDate: Date,
    hourlyRate: number,
    isIntermittent: boolean
  ): {
    memberId: string;
    period: { start: Date; end: Date };
    calculation: TimeCalculation;
    socialCharges: any;
    compliance: { isCompliant: boolean; violations: string[] };
    recommendations: string[];
  } {
    const calculation = this.calculateTimeAndPay(startDate, endDate, hourlyRate, isIntermittent);
    const socialCharges = this.calculateSocialCharges(calculation.totalPay, isIntermittent);
    const compliance = this.checkCompliance(startDate, endDate);
    
    const recommendations: string[] = [];
    
    if (!compliance.isCompliant) {
      recommendations.push("Réduire les heures de travail pour respecter la législation");
      recommendations.push("Augmenter les temps de repos entre les périodes");
    }
    
    if (calculation.overtimeHours > 0) {
      recommendations.push("Prévoir une compensation pour les heures supplémentaires");
    }
    
    if (calculation.nightHours > 0) {
      recommendations.push("Vérifier les autorisations pour le travail de nuit");
    }
    
    return {
      memberId: teamMemberId,
      period: { start: startDate, end: endDate },
      calculation,
      socialCharges,
      compliance,
      recommendations
    };
  }
}

// Instance globale du calculateur
export const frenchLaborCalculator = new FrenchLaborCalculator();

// Fonctions utilitaires
export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Lundi à Vendredi
}

export function isHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return FRENCH_HOLIDAYS_2024.includes(dateStr);
}

export function getNextWorkingDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isWorkingDay(nextDay) || isHoliday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}
