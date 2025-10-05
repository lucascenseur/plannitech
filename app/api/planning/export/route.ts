import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarExport } from "@/types/planning";

// POST /api/planning/export - Exporter le planning
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { format, events, startDate, endDate }: CalendarExport = body;

    if (format === "ICAL") {
      return exportToICal(events, startDate, endDate);
    } else if (format === "GOOGLE") {
      return exportToGoogleCalendar(events, startDate, endDate);
    } else {
      return NextResponse.json(
        { error: "Format d'export non supporté" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Fonction pour exporter vers iCal
function exportToICal(events: any[], startDate: Date, endDate: Date) {
  const icalContent = generateICalContent(events, startDate, endDate);
  
  return new NextResponse(icalContent, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="planning-${new Date().toISOString().split('T')[0]}.ics"`,
    },
  });
}

// Fonction pour exporter vers Google Calendar
function exportToGoogleCalendar(events: any[], startDate: Date, endDate: Date) {
  const csvContent = generateGoogleCalendarCSV(events, startDate, endDate);
  
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="planning-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}

// Fonction pour générer le contenu iCal
function generateICalContent(events: any[], startDate: Date, endDate: Date) {
  const now = new Date();
  const calendarId = `planning-${now.getTime()}`;
  
  let ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Planitech//Planning//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Planning Planitech`,
    `X-WR-CALDESC:Planning exporté depuis Planitech`,
    `X-WR-TIMEZONE:Europe/Paris`,
  ];

  // Ajouter chaque événement
  events.forEach(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    ical.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@planitech.com`,
      `DTSTAMP:${formatICalDate(now)}`,
      `DTSTART:${formatICalDate(eventStart)}`,
      `DTEND:${formatICalDate(eventEnd)}`,
      `SUMMARY:${escapeICalText(event.title)}`,
      event.description ? `DESCRIPTION:${escapeICalText(event.description)}` : "",
      event.location ? `LOCATION:${escapeICalText(event.location)}` : "",
      `STATUS:${event.status === "CONFIRMED" ? "CONFIRMED" : "TENTATIVE"}`,
      `PRIORITY:${getICalPriority(event.priority)}`,
      event.isRecurring ? generateRecurrenceRule(event.recurrence) : "",
      "END:VEVENT"
    );
  });

  ical.push("END:VCALENDAR");
  
  return ical.filter(line => line !== "").join("\r\n");
}

// Fonction pour générer le CSV Google Calendar
function generateGoogleCalendarCSV(events: any[], startDate: Date, endDate: Date) {
  const headers = [
    "Subject",
    "Start Date",
    "Start Time",
    "End Date",
    "End Time",
    "All Day Event",
    "Description",
    "Location",
    "Private",
  ];

  const rows = events.map(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    return [
      event.title,
      eventStart.toLocaleDateString("en-US"),
      eventStart.toLocaleTimeString("en-US", { hour12: false }),
      eventEnd.toLocaleDateString("en-US"),
      eventEnd.toLocaleTimeString("en-US", { hour12: false }),
      event.allDay ? "True" : "False",
      event.description || "",
      event.location || "",
      "False",
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

// Fonction pour formater les dates iCal
function formatICalDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Fonction pour échapper le texte iCal
function escapeICalText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

// Fonction pour obtenir la priorité iCal
function getICalPriority(priority: string) {
  const priorities = {
    LOW: "9",
    MEDIUM: "5",
    HIGH: "3",
    URGENT: "1",
  };
  return priorities[priority as keyof typeof priorities] || "5";
}

// Fonction pour générer la règle de récurrence
function generateRecurrenceRule(recurrence: any) {
  if (!recurrence) return "";
  
  let rule = "RRULE:";
  
  switch (recurrence.frequency) {
    case "DAILY":
      rule += `FREQ=DAILY;INTERVAL=${recurrence.interval}`;
      break;
    case "WEEKLY":
      rule += `FREQ=WEEKLY;INTERVAL=${recurrence.interval}`;
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        const days = recurrence.daysOfWeek.map((day: number) => {
          const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
          return dayNames[day];
        });
        rule += `;BYDAY=${days.join(",")}`;
      }
      break;
    case "MONTHLY":
      rule += `FREQ=MONTHLY;INTERVAL=${recurrence.interval}`;
      if (recurrence.dayOfMonth) {
        rule += `;BYMONTHDAY=${recurrence.dayOfMonth}`;
      }
      break;
    case "YEARLY":
      rule += `FREQ=YEARLY;INTERVAL=${recurrence.interval}`;
      break;
  }
  
  if (recurrence.endDate) {
    rule += `;UNTIL=${formatICalDate(new Date(recurrence.endDate))}`;
  } else if (recurrence.count) {
    rule += `;COUNT=${recurrence.count}`;
  }
  
  return rule;
}

