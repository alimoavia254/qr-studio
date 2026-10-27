import type { Metadata } from "next";
import { CalendarDays, BellRing, Printer } from "lucide-react";
import { UseCasePage } from "@/components/UseCasePage";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/event-qr-code-generator",
  title: "Calendar Event QR Code Generator - Free Add-to-Calendar",
  description: "Create a free QR code that adds your event to the phone calendar with date, time and place. Great for invitations and flyers. Download PNG, SVG or PDF.",
  socialTitle: "Free Calendar Event QR Code Generator | QR Vibe",
  socialDescription: "Guests scan and save your event to their calendar in one tap.",
});

export default function EventQRPage() {
  return (
    <UseCasePage
      path="/event-qr-code-generator"
      contentType="event"
      badgeIcon={CalendarDays}
      badge="iCalendar (.ics) event"
      titleLead="Free Calendar Event"
      titleAccent="QR Code Generator"
      intro="Make sure guests never forget. Enter the event details and the QR code offers to add it to their phone calendar with the date, time and location filled in."
      features={[
        { icon: CalendarDays, title: "Date, Time and Place", text: "Title, start, end, location and notes are all included, using the standard iCalendar format." },
        { icon: BellRing, title: "Fewer No-Shows", text: "Once the event is in the calendar, phones remind guests automatically." },
        { icon: Printer, title: "Perfect for Print", text: "Use it on invitations, tickets, posters, conference badges and flyers." },
      ]}
      howToName="How to create a calendar event QR code"
      stepsTitle="How to create a calendar event QR code"
      steps={[
        "Open the Event tab in the generator above.",
        "Enter the title, start and end time, and location.",
        "Add a description if you like.",
        "Wait for the green scan test, then download.",
      ]}
      tipsTitle="Tips for Event QR Codes"
      tips={[
        { label: "Double-check the time zone", text: "Event times are local, so the guest's calendar shows the same clock time you typed." },
        { label: "Add the location", text: "A venue name helps guests open directions straight from the calendar." },
        { label: "Keep the title short", text: "Short titles read well on a lock-screen reminder." },
      ]}
      faqTitle="Event QR Code FAQ"
      faqs={[
        { q: "How do I make a QR code that adds an event to a calendar?", a: "Choose Event in QR Vibe, fill in the title, dates and location, and download the QR code. Scanning offers to save the event to the calendar." },
        { q: "Does it work on iPhone and Android?", a: "Yes. Both recognise the iCalendar format. Some Android cameras open the event in Google Calendar after you scan." },
        { q: "Can I change the event later?", a: "A static QR code cannot be edited, so create a new one if the details change." },
      ]}
    />
  );
}
