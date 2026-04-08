"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  Calendar,
  Monitor,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    id: "membership",
    label: "Membership",
    icon: Users,
    headline: "Complete member management",
    description:
      "Full member profiles with contact details, interaction history, notes, and digital waiver storage. Handle family accounts, trials, and everything in between from one place.",
    bullets: [
      "Member profiles with full history",
      "Family accounts & trial management",
      "Digital waiver storage",
      "Lead pipeline and conversion tracking",
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    headline: "Automated recurring billing",
    description:
      "Set up payment plans once and let Kanri handle the rest. Automated recurring charges, failed payment retries, and a clean financial dashboard.",
    bullets: [
      "Automated monthly billing",
      "Failed payment retry logic",
      "Multiple payment plans per student",
      "Financial reporting & exports",
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    icon: Calendar,
    headline: "Class scheduling & attendance",
    description:
      "Build your weekly class schedule and track who shows up. Students can register, and you always know exactly who attended.",
    bullets: [
      "Flexible weekly class templates",
      "Automated attendance tracking",
      "Class capacity & waitlists",
      "Attendance history per student",
    ],
  },
  {
    id: "kiosk",
    label: "Kiosk",
    icon: Monitor,
    headline: "Self-service student kiosk",
    description:
      "Students check themselves in when they arrive. No staff intervention needed, no queues at the front desk — just fast, frictionless check-ins.",
    bullets: [
      "Touchscreen-friendly kiosk mode",
      "QR code or name-based check-in",
      "Real-time class roll display",
      "Works on any tablet or display",
    ],
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    headline: "Branded email & SMS",
    description:
      "Send beautiful branded emails or text messages to your students. Custom templates, mass announcements, and automated sequences — all from one hub.",
    bullets: [
      "Custom email & SMS templates",
      "Mass communications tools",
      "Automated messaging sequences",
      "Your own branded domain & number",
    ],
  },
  {
    id: "progress",
    label: "Progress",
    icon: TrendingUp,
    headline: "Belt & rank progression",
    description:
      "Track every student's journey from beginner to black belt. Log promotions, attendance milestones, and requirements with a clean visual timeline.",
    bullets: [
      "Belt & rank promotion tracking",
      "Attendance milestone alerts",
      "Requirement checklists per rank",
      "Promotion history & certificates",
    ],
  },
];

function MembershipPreview() {
  const members = [
    {
      initials: "JS",
      name: "John Smith",
      belt: "Blue Belt",
      classes: 247,
      active: true,
    },
    {
      initials: "AL",
      name: "Amy Lee",
      belt: "White Belt",
      classes: 31,
      active: true,
    },
    {
      initials: "MK",
      name: "Mike Ko",
      belt: "Brown Belt",
      classes: 412,
      active: false,
    },
  ];
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Active Members
      </p>
      {members.map((m) => (
        <div
          key={m.name}
          className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {m.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {m.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {m.belt} · {m.classes} classes
            </p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.active ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}
          >
            {m.active ? "Active" : "Overdue"}
          </span>
        </div>
      ))}
    </div>
  );
}

function BillingPreview() {
  const payments = [
    { name: "John Smith", amount: "$120.00", date: "Jun 1", paid: true },
    { name: "Amy Lee", amount: "$85.00", date: "Jun 1", paid: true },
    { name: "Rachel Park", amount: "$120.00", date: "Jun 3", paid: false },
  ];
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Recent Billing
        </p>
        <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
          Auto-collected
        </span>
      </div>
      {payments.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border"
        >
          <div>
            <p className="text-xs font-medium text-foreground">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.date}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-foreground">{p.amount}</p>
            <span
              className={`text-xs ${p.paid ? "text-green-400" : "text-amber-400"}`}
            >
              {p.paid ? "Paid" : "Scheduled"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SchedulingPreview() {
  const classes = [
    {
      name: "Beginner Karate",
      time: "Mon 6:00 PM",
      enrolled: 12,
      capacity: 15,
    },
    { name: "Advanced BJJ", time: "Tue 7:30 PM", enrolled: 8, capacity: 10 },
    { name: "Kids Class", time: "Wed 4:00 PM", enrolled: 14, capacity: 14 },
  ];
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        This Week
      </p>
      {classes.map((c) => (
        <div
          key={c.name}
          className="p-3 rounded-lg bg-background/60 border border-border"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-medium text-foreground">{c.name}</p>
            <span className="text-xs text-muted-foreground">{c.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(c.enrolled / c.capacity) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {c.enrolled}/{c.capacity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function KioskPreview() {
  const checkedIn = ["John Smith", "Amy Lee", "Rachel Park", "David Kim"];
  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/8 to-primary/3 p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Advanced BJJ — Tonight
      </p>
      <div className="space-y-2 mb-4">
        {checkedIn.map((name) => (
          <div
            key={name}
            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background/60 border border-border"
          >
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="text-xs text-foreground">{name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-primary font-medium">
        {checkedIn.length} students checked in
      </p>
    </div>
  );
}

function CommunicationsPreview() {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-background/60 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">
            Belt Promotion Notice
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
            Email
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          "Congratulations! You're eligible for your next belt promotion. Your
          test is scheduled for Saturday..."
        </p>
      </div>
      <div className="p-4 rounded-xl bg-background/60 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">
            Class Reminder
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent">
            SMS
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          "Reminder: Advanced BJJ tonight at 7:30 PM. See you on the mat!"
        </p>
      </div>
    </div>
  );
}

function ProgressPreview() {
  const belts = [
    { name: "White", style: "bg-white" },
    { name: "Yellow", style: "bg-yellow-400" },
    { name: "Orange", style: "bg-orange-400" },
    { name: "Green", style: "bg-green-500" },
    { name: "Blue", style: "bg-blue-500" },
    { name: "Brown", style: "bg-amber-700" },
    { name: "Black", style: "bg-zinc-800 border border-zinc-600" },
  ];
  const earned = 4;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-foreground">Amy Lee</p>
        <span className="text-xs text-muted-foreground">
          Current: Green Belt
        </span>
      </div>
      <div className="flex gap-1.5 mb-5">
        {belts.map((b, i) => (
          <div
            key={b.name}
            title={b.name}
            className={`flex-1 h-3 rounded-full ${b.style} ${i < earned ? "opacity-100" : "opacity-20"} transition-opacity`}
          />
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background/60 border border-border">
          <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-xs text-foreground">30 classes attended ✓</span>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background/60 border border-border">
          <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-xs text-foreground">
            All stripe requirements met ✓
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/40 border border-border/50">
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">
            Blue Belt test — upcoming
          </span>
        </div>
      </div>
    </div>
  );
}

const previews: Record<string, () => React.JSX.Element> = {
  membership: MembershipPreview,
  billing: BillingPreview,
  scheduling: SchedulingPreview,
  kiosk: KioskPreview,
  communications: CommunicationsPreview,
  progress: ProgressPreview,
};

export function KanriSection() {
  const [activeId, setActiveId] = useState("membership");
  const active = features.find((f) => f.id === activeId)!;
  const Preview = previews[activeId];

  return (
    <section
      id="kanri"
      className="relative py-24 sm:py-32 overflow-hidden scroll-mt-20 md:scroll-mt-24"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-4 uppercase tracking-wider">
            Kanri
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Built for martial arts schools
          </h2>
          <p className="text-lg text-muted-foreground">
            Every tool you need to run operations — from first trial to black
            belt.
          </p>
        </div>

        {/* Scrollable tab strip */}
        <div className="flex overflow-x-auto gap-1 mb-8 pb-1 -mx-1 px-1 scrollbar-hide">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveId(f.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeId === f.id
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <f.icon className="w-4 h-4 shrink-0" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Stable container — animated content inside */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-2xl border border-border bg-card p-8 min-h-[380px]">
          {/* Left: description */}
          <div
            key={activeId}
            className="flex flex-col justify-center animate-fade-in"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <active.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {active.headline}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {active.description}
            </p>
            <ul className="space-y-3">
              {active.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: product UI preview */}
          <div
            key={`${activeId}-preview`}
            className="flex items-start pt-2 animate-fade-in"
          >
            <div className="w-full">
              <Preview />
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group"
            asChild
          >
            <a
              href="https://kanrimemberships.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Kanri
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          {/* <Button variant="outline" size="lg" className="border-border text-foreground" asChild> */}
          {/*   <a href="https://kanrimemberships.com" target="_blank" rel="noopener noreferrer"> */}
          {/*     Book a Demo */}
          {/*   </a> */}
          {/* </Button> */}
        </div>
      </div>
    </section>
  );
}
