import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import * as THREE from 'three';
import { db, auth, microsoftProvider } from './firebase';
import {
  collection, doc, getDoc, setDoc, onSnapshot,
  query, orderBy, writeBatch,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  Bell,
  BellRing,
  BookMarked,
  BookOpen,
  Bot,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CircleUserRound,
  ClipboardList,
  Clock3,
  Copy,
  Database,
  Download,
  Dumbbell,
  Eye,
  ExternalLink,
  FileSpreadsheet,
  Globe2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  HeartPulse,
  HelpCircle,
  Home,
  Key,
  LayoutDashboard,
  Leaf,
  LifeBuoy,
  ListChecks,
  Lock,
  MailCheck,
  MapPinned,
  MessageCircle,
  MessageSquare,
  Music,
  Pencil,
  Plus,
  Rocket,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  UserPlus,
  UserX,
  Users,
  Utensils,
  Wifi,
  WifiOff,
  X,
  XCircle,
  Zap,
} from './icons';

type LucideIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement> & { size?: string | number; absoluteStrokeWidth?: boolean }, 'ref'> &
    RefAttributes<SVGSVGElement>
>;

type UserRole = 'student' | 'mentor';
type DemoMode = 'freshman' | 'returning';
type View = 'today' | 'launchpad' | 'events' | 'people' | 'fifth-row' | 'classes' | 'messages' | 'kb' | 'campus-life' | 'mentor-home' | 'mentor-help' | 'privacy' | 'notifications';
type InstitutionId = 'sutd';
type BelongingEntry = { week: string; score: number; at: number };
type InterventionStage = 'flagged' | 'contacted' | 're-measured' | 'resolved' | 'escalated';

type Institution = {
  id: InstitutionId;
  shortName: string;
  name: string;
  domains: string[];
  studentIdHint: string;
};

type VerifiedUser = {
  name: string;
  email: string;
  studentId: string;
  institutionId: InstitutionId;
  institutionName: string;
  shortName: string;
  verifiedAt: string;
};

type EventItem = {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  location: string;
  audience: string;
  meta: string;
  description: string;
  tone: 'social' | 'study' | 'arrival' | 'sports' | 'culture' | 'academic';
};

type Person = {
  name: string;
  role: string;
  detail: string;
  match: string;
  tags: string[];
  color: string;
  bio?: string;
  modules?: string[];
  availability?: string;
  helpStyle?: string[];
  year?: string;
  pillar?: string;
};

type ClassRoom = {
  code: string;
  title: string;
  activity: string;
  mentors: string;
  status: string;
  isDesignAI?: boolean;
};

type PromptPost = { id: string; author: string; time: string; category: string; prompt: string; use: string; upvotes: number };
type TeamPost = { id: string; name: string; looking: string; members: string[]; slots: number; desc: string; tags: string[] };
type ShowcasePost = { id: string; author: string; time: string; title: string; desc: string; tags: string[]; likes: number };

type StudentProfile = {
  role: UserRole;
  classes: string[];
  interests: string[];
  goals: string[];
  availability: string;
  homeBase: string;
  intro: string;
  pfpDataUrl?: string;
  pillar?: string;
  term?: string;
  year?: string;
  campusHomeBase?: string;
  campusCommunity?: string;
  mentorYear?: string;
  mentorPillar?: string;
  mentorModules?: string[];
  mentorHelpStyle?: string[];
};

// ─── Notification model ───────────────────────────────────────────────────────

type NotifType = 'connection' | 'qa_answer' | 'event' | 'system' | 'mentor';
type NotifItem = {
  id: string; type: NotifType;
  title: string; body: string;
  read: boolean; time: string;
  action?: { label: string; view: View };
};

const seedNotifs: NotifItem[] = [
  { id: 'n1', type: 'qa_answer',  title: 'Question answered',    body: 'Aarav answered your recursion question in 10.014', read: false, time: '8m ago',  action: { label: 'View answer', view: 'classes' } },
  { id: 'n2', type: 'connection', title: 'New connection',        body: 'Mei Lin accepted your intro request',             read: false, time: '45m ago', action: { label: 'View profile', view: 'people' } },
  { id: 'n3', type: 'event',      title: 'Event reminder',        body: 'First Friday food crawl starts in 2 hours',       read: false, time: '1h ago',  action: { label: 'View event', view: 'events' } },
  { id: 'n4', type: 'system',     title: 'Welcome to Cohortly',   body: 'Your SUTD student profile is now verified.',       read: true,  time: '2h ago' },
  { id: 'n5', type: 'mentor',     title: 'Office hour available', body: 'Aarav posted a study session slot for 10.014',    read: true,  time: '3h ago',  action: { label: 'View slot', view: 'classes' } },
];

function loadNotifs(email: string): NotifItem[] {
  try { return JSON.parse(localStorage.getItem(`notifs_${email}`) ?? 'null') ?? seedNotifs; }
  catch { return seedNotifs; }
}
function saveNotifs(email: string, items: NotifItem[]) {
  try { localStorage.setItem(`notifs_${email}`, JSON.stringify(items)); } catch {}
}

const navItems: Array<{ id: View; label: string; icon: LucideIcon }> = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'launchpad', label: 'Launchpad', icon: Rocket },
  { id: 'events', label: 'Events', icon: CalendarCheck },
  { id: 'people', label: 'People', icon: Users },
  { id: 'fifth-row', label: 'Fifth Row', icon: Trophy },
  { id: 'classes', label: 'Classes', icon: BookOpen },
  { id: 'campus-life', label: 'Campus Life', icon: MapPinned },
  { id: 'kb', label: 'Knowledge Base', icon: BookMarked },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
];

const mentorNavItems: Array<{ id: View; label: string; icon: LucideIcon }> = [
  { id: 'mentor-home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mentor-help', label: 'Help Requests', icon: BookOpen },
  { id: 'people', label: 'Students', icon: Users },
  { id: 'events', label: 'Events', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
];

const fallbackInstitutions: Institution[] = [
  {
    id: 'sutd',
    shortName: 'SUTD',
    name: 'Singapore University of Technology and Design',
    domains: ['sutd.edu.sg', 'mymail.sutd.edu.sg'],
    studentIdHint: '1001234',
  },
];

const starterEvents: EventItem[] = [
  {
    id: 'food-crawl',
    title: 'First Friday food crawl',
    host: 'Mei Lin',
    date: '2026-06-05',
    time: '7:30 PM',
    location: 'Outside Dover MRT → Ghim Moh',
    audience: 'Incoming freshmores',
    meta: '42 going · 12 open spots',
    description: 'Small groups pick dinner spots around Dover and Ghim Moh, then merge for dessert at Campus Bistro. Built for people who know nobody yet.',
    tone: 'social',
  },
  {
    id: 'coding-room',
    title: '10.014 Computational Thinking prep',
    host: 'Aarav, Year 3 ISTD',
    date: '2026-06-03',
    time: '8:30 PM',
    location: 'Building 5 Library, Room 3',
    audience: 'Freshmore — Computational Thinking',
    meta: '68 joined · 4 returning students active',
    description: 'Returning-student prep for tracing code, recursion basics, and what to revise before the first graded lab. ISTD and EPD students rotate through.',
    tone: 'study',
  },
  {
    id: 'exchange-coffee',
    title: 'Exchange student arrival chat',
    host: 'Noah',
    date: '2026-06-06',
    time: '10:00 AM',
    location: 'Campus Bistro, Building 3',
    audience: 'Exchange students',
    meta: '23 going · housing Q&A',
    description: 'Arrival questions, campus-life tips, SIM cards, and how to navigate SUTD before orientation week.',
    tone: 'arrival',
  },
  {
    id: 'badminton',
    title: 'Badminton beginner court',
    host: 'Priya',
    date: '2026-06-07',
    time: '5:00 PM',
    location: 'Sports Complex, Court 2',
    audience: 'Anyone new',
    meta: '18 going · rackets available',
    description: 'Casual games for beginners and rusty players. Rackets are loanable from the SAC counter. No experience needed.',
    tone: 'sports',
  },
  {
    id: 'design-breakfast',
    title: 'ASD design studio breakfast',
    host: 'Sarah, Year 2 ASD',
    date: '2026-06-10',
    time: '9:00 AM',
    location: 'Building 2, FabLab entrance',
    audience: 'ASD and Design pillar students',
    meta: '31 going · critique buddies',
    description: 'Meet people taking ASD design studios and trade survival tips on pin-ups, critique culture, and FabLab bookings before project teams form.',
    tone: 'culture',
  },
  {
    id: 'startup-night',
    title: 'Student founder night',
    host: 'Nikhil',
    date: '2026-06-12',
    time: '6:45 PM',
    location: 'iCube Auditorium',
    audience: 'Startups · AI · SUTD Entrepreneurship',
    meta: '54 going · 8 ideas pitched',
    description: 'Bring an idea, join someone else\'s team, or just listen. SUTD Entrepreneurship Club hosts. First-years and exchange students explicitly welcome.',
    tone: 'culture',
  },
];

const people: Person[] = [
  {
    name: 'Aarav Menon',
    role: 'Year 3 · ISTD',
    detail: 'Year 3 ISTD student running weekly 10.014 coding prep. Reach him through the cohort drop.',
    match: '94%',
    tags: ['10.014', '50.007 ML', 'Badminton'],
    color: 'teal',
      pillar: 'ISTD',
    year: 'Year 3',
    bio: "Hey! I'm a Y3 ISTD student who loves helping freshmores crack computational thinking. I run weekly coding prep sessions for 10.014 and I'm always down to chat about anything SUTD — modules, campus life, or which hawker to hit before 8 AM.",
    modules: ['10.014 Computational Thinking', '50.007 Machine Learning', '10.009 The Digital World'],
    availability: 'Weekday evenings 8–10 PM · Saturday mornings',
    helpStyle: ['Live coding walkthroughs', 'Drop-in prep sessions', 'Async Q&A'],
  },
  {
    name: 'Sara Binte Halim',
    role: 'Year 2 · DAI',
    detail: 'Python specialist and data viz enthusiast. Helped 30+ students through 10.014 last term.',
    match: '88%',
    tags: ['10.014', 'Python', 'Data viz'],
    color: 'coral',
      pillar: 'DAI',
    year: 'Year 2',
    bio: "Second-year DAI student with a passion for making data make sense. If you're stuck on lab code or confused about pandas, hit me up — I answer fast.",
    modules: ['10.014 Computational Thinking', '10.009 The Digital World'],
    availability: 'Weekday afternoons 3–6 PM',
    helpStyle: ['1-on-1 code review', 'Office hours', 'Lab partner pairing'],
  },
  {
    name: 'Tan Mei Lin',
    role: 'Incoming freshmore · ASD',
    detail: 'Starting an ASD design accountability circle and organising the first-week food crawl.',
    match: '91%',
    tags: ['ASD Studio', 'Food crawl', 'Dance'],
    color: 'violet',
  },
  {
    name: 'Noah Richter',
    role: 'Exchange · EPD pillar',
    detail: 'Mapping move-in basics, maker-space bookings, and the Dover area for first-timers.',
    match: '87%',
    tags: ['Exchange', 'FabLab', 'Robotics'],
    color: 'blue',
  },
  {
    name: 'Priya Nair',
    role: 'Incoming freshmore · ESD',
    detail: 'Looking for badminton, a startup team for iCube, and a 40.011 study group.',
    match: '85%',
    tags: ['40.011', 'Startups', 'Badminton'],
    color: 'teal',
  },
  {
    name: 'Wei Jian Lim',
    role: 'Year 3 · ISTD',
    detail: 'Covers 10.009 Digital World and loves systems design. Runs the Sunday study cram.',
    match: '82%',
    tags: ['10.009', 'Systems design', 'Gaming'],
    color: 'coral',
      pillar: 'ISTD',
    year: 'Year 3',
    bio: "Y3 ISTD here. I help with 10.009 and enjoy thinking about how large systems talk to each other. Sunday crammer — building 1.401, every week.",
    modules: ['10.009 The Digital World', '30.007 Engineering Design Innovation'],
    availability: 'Sundays 2–6 PM · Wednesday evenings',
    helpStyle: ['Group cram sessions', 'System design whiteboarding'],
  },
];

// ─── Launchpad phases ────────────────────────────────────────────────────────

type TaskStatus = 'not-started' | 'in-progress' | 'done' | 'need-help';
type LaunchpadTask = { id: string; label: string; desc: string; link?: { label: string; view: View } };
type LaunchpadPhase = { id: string; label: string; icon: string; tasks: LaunchpadTask[] };

const launchpadPhases: LaunchpadPhase[] = [
  {
    id: 'pre-arrival', label: 'Before I arrive', icon: 'arrival',
    tasks: [
      { id: 'offer', label: 'Accept your offer letter', desc: 'Via SUTD portal — confirm your place before the deadline.' },
      { id: 'cohortly', label: 'Join Cohortly', desc: "You're here — SUTD email verified." },
      { id: 'modules-review', label: 'Review Freshmore module list', desc: 'Term 1: 10.001, 10.002, 10.003, 10.009, 10.014. Know what\'s coming.' },
      { id: 'housing-app', label: 'Submit housing application', desc: 'Compulsory for Terms 1-3 (AY2026). Apply via the official SUTD housing portal.' },
      { id: 'visa', label: 'Settle visa / entry requirements', desc: 'International students — check with OSA for the correct pass type.' },
      { id: 'packing', label: 'Pack move-in essentials', desc: 'Bedsheet, laptop, NRIC/passport, Singpass setup, toiletries, and approved appliances only.' },
      { id: 'connect3', label: 'Connect with 3 incoming Freshmores', desc: 'Find your first-week circle before you land.', link: { label: 'Go to People', view: 'people' } },
    ],
  },
  {
    id: 'campus-life', label: 'Move into campus life', icon: 'community',
    tasks: [
      { id: 'move-in', label: 'Complete official move-in', desc: 'Collect keys from Housing. Use official channels for exact room and facilities information.' },
      { id: 'wifi', label: 'Connect to campus Wi-Fi', desc: 'eduroam or SUTD-Student using your student account credentials.' },
      { id: 'card', label: 'Collect your student card', desc: 'Needed for labs, library, printing, and building access after hours.' },
      { id: 'community', label: 'Join your campus home base', desc: 'Choose a broad residential or commuter community so people can include you without exposing exact rooms.', link: { label: 'Open Campus Life', view: 'campus-life' } },
      { id: 'meal-jio', label: 'Join a first-week jio', desc: 'Breakfast, dinner, study, and sports plans are grouped by broad campus community.', link: { label: 'Find jios', view: 'campus-life' } },
      { id: 'housing-brief', label: 'Read official housing guidance', desc: 'Quiet hours, facilities, emergency contacts, visitor policy, and safety rules belong in official housing guidance.' },
    ],
  },
  {
    id: 'week0', label: 'Week 0 orientation', icon: 'orientation',
    tasks: [
      { id: 'camp', label: 'Attend Freshmore Orientation Camp', desc: 'SUTD\'s intro event — ice breakers, campus tour, team building.' },
      { id: 'campus-tour', label: 'Get a campus tour from a returning student', desc: 'FabLab, library, Level 3 hangout spots, best food nearby.' },
      { id: 'admin', label: 'Complete admin setup', desc: 'SUTD email, Canvas LMS, ModTrek, Student Hub — all activated.' },
      { id: 'fifth-row-fair', label: 'Attend Fifth Row Club Fair', desc: 'Browse 80+ clubs — find your co-curricular home.', link: { label: 'Browse Fifth Row', view: 'fifth-row' } },
      { id: 'wellbeing', label: 'Know where Wellbeing Services is', desc: 'Level 2, Building 54. Counselling, mental health support — no stigma.' },
    ],
  },
  {
    id: 'week1', label: 'Week 1 academic setup', icon: 'academic',
    tasks: [
      { id: 'first-class', label: 'Attend your first class', desc: 'Check Canvas for room allocation and pre-read materials.' },
      { id: 'module-room', label: 'Join your module rooms on Cohortly', desc: 'Returning students are already answering in 10.014 and 10.009.', link: { label: 'Open Classes', view: 'classes' } },
      { id: 'returning-match', label: 'Connect with a returning student', desc: 'Find Year 2, 3, and 4 students grouped by pillar and module.', link: { label: 'Find people', view: 'people' } },
      { id: 'first-q', label: 'Ask your first module question', desc: 'No question is too basic. Post it in the class room.', link: { label: 'Ask a question', view: 'classes' } },
      { id: 'study-group', label: 'Form or join a study group', desc: 'Check Events or module rooms for group study sessions.', link: { label: 'Browse Events', view: 'events' } },
    ],
  },
  {
    id: 'people5', label: 'Find my first 5 people', icon: 'people',
    tasks: [
      { id: 'p1', label: 'Connect with someone in your module', desc: 'Find a 10.014 or 10.009 coursemate.', link: { label: 'Find people', view: 'people' } },
      { id: 'p2', label: 'Connect with a returning student', desc: 'Someone who has done your exact modules already.', link: { label: 'Find returning students', view: 'people' } },
      { id: 'p3', label: 'Connect with a campus-life buddy', desc: 'From your Freshmore, returning-student, commuter, or broad residential community.' },
      { id: 'p4', label: 'Connect with someone from a different pillar', desc: 'SUTD is cross-disciplinary — start meeting across pillars early.', link: { label: 'Browse everyone', view: 'people' } },
      { id: 'p5', label: 'Connect with an international student', desc: 'Exchange or international Freshmore — build a global circle.' },
    ],
  },
  {
    id: 'fifth-row-phase', label: 'Join one Fifth Row', icon: 'clubs',
    tasks: [
      { id: 'fr-quiz', label: 'Take the Fifth Row quiz', desc: 'Find out which cluster fits — Arts, Sports, Makers, Community, Culture.', link: { label: 'Take quiz', view: 'fifth-row' } },
      { id: 'fr-browse', label: 'Browse 3 clubs you\'re curious about', desc: 'Go deep on one before committing.', link: { label: 'Browse clubs', view: 'fifth-row' } },
      { id: 'fr-trial', label: 'Attend a trial session', desc: 'Most clubs have no-commitment trials in Week 1–2.', link: { label: 'Find trials', view: 'fifth-row' } },
      { id: 'fr-join', label: 'Sign up for one club', desc: 'Fifth Row is a real part of your SUTD experience.' },
    ],
  },
  {
    id: 'qa-phase', label: 'Ask my first module question', icon: 'qa',
    tasks: [
      { id: 'q-read', label: 'Read existing Q&A threads in your module', desc: 'See what returning students have already answered in 10.014 and 10.009.', link: { label: 'Open Classes', view: 'classes' } },
      { id: 'q-post', label: 'Post your first question', desc: 'Any confusion in any module — ask it. No question is too small.', link: { label: 'Post a question', view: 'classes' } },
      { id: 'q-answered', label: 'Get an answer from a returning student', desc: 'Helpful classmates usually respond within a few hours.' },
    ],
  },
  {
    id: 'returning-phase', label: 'Join a returning-student session', icon: 'people',
    tasks: [
      { id: 'm-view', label: 'View a returning student profile', desc: 'See their modules, year, pillar, availability, and compatibility score.', link: { label: 'Browse people', view: 'people' } },
      { id: 'm-connect', label: 'Request an intro with a returning student', desc: 'Send your first connection request to someone a year or two ahead.', link: { label: 'Find people', view: 'people' } },
      { id: 'm-attend', label: 'Attend a prep session or office hours', desc: 'Aarav runs weekly 10.014 coding prep — check Events.', link: { label: 'Browse Events', view: 'events' } },
    ],
  },
];

// ─── Fifth Row clubs ─────────────────────────────────────────────────────────

type FifthRowCluster = 'Arts' | 'Sports' | 'Community' | 'Culture' | 'Makers';
type Club = { id: string; name: string; cluster: FifthRowCluster; commitment: 'Low' | 'Medium' | 'High'; beginnerFriendly: boolean; trialDate: string; desc: string; members: number };

const fifthRowClubs: Club[] = [
  { id: 'drama', name: 'SUTD Drama', cluster: 'Arts', commitment: 'Medium', beginnerFriendly: true, trialDate: 'Week 2 · Fri 7 PM', desc: 'Student theatre — comedy sketches to full productions. No experience needed.', members: 42 },
  { id: 'choir', name: 'SUTD Choir', cluster: 'Arts', commitment: 'Medium', beginnerFriendly: true, trialDate: 'Week 1 · Tue 7 PM', desc: 'A cappella and choral music. Relaxed auditions — just bring your voice.', members: 38 },
  { id: 'dance', name: 'SUTD Dance', cluster: 'Arts', commitment: 'High', beginnerFriendly: false, trialDate: 'Week 2 · Sat 2 PM', desc: 'Contemporary and hip-hop. Multiple shows per term.', members: 55 },
  { id: 'photog', name: 'Photography Society', cluster: 'Arts', commitment: 'Low', beginnerFriendly: true, trialDate: 'Ongoing drop-in', desc: 'Campus walks, workshops, and exhibitions. Gear not required.', members: 61 },
  { id: 'habitat', name: 'Habitat for Humanity', cluster: 'Community', commitment: 'Low', beginnerFriendly: true, trialDate: 'Week 1 · Sat 10 AM', desc: 'Build homes for underprivileged families. Trips and campus events.', members: 73 },
  { id: 'envu', name: 'ENVU (Environment)', cluster: 'Community', commitment: 'Low', beginnerFriendly: true, trialDate: 'Week 1 · Thu 6 PM', desc: 'Sustainability projects, zero-waste campaigns, campus garden.', members: 48 },
  { id: 'entrep', name: 'Entrepreneurship Society', cluster: 'Community', commitment: 'Low', beginnerFriendly: true, trialDate: 'Week 1 · Thu 7 PM', desc: 'Pitch nights, startup mentorship, iCube connection.', members: 88 },
  { id: 'basketball', name: 'Basketball', cluster: 'Sports', commitment: 'Medium', beginnerFriendly: true, trialDate: 'Week 1 · Mon+Wed 7 PM', desc: 'Recreational and competitive teams. All levels welcome.', members: 66 },
  { id: 'badminton', name: 'Badminton', cluster: 'Sports', commitment: 'Low', beginnerFriendly: true, trialDate: 'Week 1 · Tue+Thu 8 PM', desc: 'Most popular sport on campus. Casual and competitive sessions.', members: 94 },
  { id: 'climbing', name: 'Climbing', cluster: 'Sports', commitment: 'Medium', beginnerFriendly: true, trialDate: 'Week 2 · Sat 10 AM', desc: 'Bouldering and lead. Campus wall open 24/7 for members.', members: 57 },
  { id: 'dsia', name: 'DSIA (Design & Society)', cluster: 'Culture', commitment: 'Low', beginnerFriendly: true, trialDate: 'Week 2 · Wed 6 PM', desc: 'Seminars, field trips, and cross-disciplinary design critique.', members: 44 },
  { id: 'motorsports', name: 'SUTD Motorsports', cluster: 'Makers', commitment: 'High', beginnerFriendly: false, trialDate: 'Week 1 · Fri 6 PM', desc: 'Build and race electric vehicles. High commitment, world-class fabrication.', members: 31 },
  { id: 'fablab', name: 'FabLab Community', cluster: 'Makers', commitment: 'Low', beginnerFriendly: true, trialDate: 'Ongoing drop-in', desc: 'Learn 3D printing, laser cutting, electronics. Drop in anytime.', members: 112 },
  { id: 'robotics', name: 'Robotics Club', cluster: 'Makers', commitment: 'Medium', beginnerFriendly: true, trialDate: 'Week 2 · Sat 2 PM', desc: 'Hardware projects, competitions, and maker community.', members: 67 },
];

const classRooms: ClassRoom[] = [
  {
    code: '10.014',
    title: 'Computational Thinking for Design',
    activity: '28 questions answered this week',
    mentors: 'Aarav (Y3 ISTD), Daryl (Y3 EPD), Sara (Y2 DAI)',
    status: 'Prep room live tonight — Building 5, Rm 3',
  },
  {
    code: '10.009',
    title: 'The Digital World',
    activity: '19 questions · 3 returning students active',
    mentors: 'Wei Jian (Y3 ISTD), Priya (Y2 ESD)',
    status: '2D project kickoff slides pinned',
  },
  {
    code: '30.007',
    title: 'Engineering Design Innovation',
    activity: '11 team formation posts',
    mentors: 'Mei Lin (Y3 EPD), Noah (Y2 EPD)',
    status: 'Prototype critique slots open — FabLab',
  },
  {
    code: '40.011',
    title: 'Data-Driven World',
    activity: '16 dataset help threads',
    mentors: 'Sarah (Y4 ESD), Nikhil (Y3 ESD)',
    status: 'Visualisation examples pinned',
  },
  {
    code: '50.007',
    title: 'Machine Learning',
    activity: '22 questions · assignment 1 help',
    mentors: 'Aarav (Y3 ISTD), Kevin (Y4 ISTD)',
    status: 'Assignment 1 walkthrough Friday',
  },
  {
    code: 'ASD Studio',
    title: 'ASD Design Studio I',
    activity: '8 pin-up feedback threads',
    mentors: 'Mei Lin (Y2 ASD), Tariq (Y3 ASD)',
    status: 'Critique sign-ups open — Building 2',
  },
  {
    code: 'iDeA-1',
    title: 'Innovating with Design & AI — Term 1',
    activity: '34 prompts shared · 12 teams forming',
    mentors: 'Sara (Y2 DAI), Aarav (Y3 ISTD), Mei Lin (Y2 ASD)',
    status: 'Team formation open · Week 3 brief released',
    isDesignAI: true,
  },
  {
    code: 'iDeA-2',
    title: 'Innovating with Design & AI — Term 2',
    activity: '21 prototypes in showcase · 8 teams active',
    mentors: 'Wei Jian (Y3 ISTD), Tariq (Y3 ASD)',
    status: 'Mid-term prototype review — submit by Friday',
    isDesignAI: true,
  },
  {
    code: 'iDeA-3',
    title: 'Innovating with Design & AI — Term 3',
    activity: '17 final builds · showcase voting open',
    mentors: 'Aarav (Y3 ISTD), Sarah (Y4 ESD)',
    status: 'Final showcase — Design Week submissions open',
    isDesignAI: true,
  },
];

type ClassGroup = { label: string; pillarKey: string; courses: string[] };

const classGroups: ClassGroup[] = [
  {
    label: 'Freshmore Core',
    pillarKey: 'freshmore',
    courses: [
      '10.001 Advanced Maths I',
      '10.002 Advanced Maths II',
      '10.003 Circuits & Electronics',
      '10.004 Advanced Maths III',
      '10.007 Humanity-Centred Technology',
      '10.009 The Digital World',
      '10.012 Modelling & Analysis',
      '10.014 Computational Thinking',
      '10.015 Physical World',
      '10.016 Technology & World',
      '2D Project',
    ],
  },
  {
    label: 'ASD — Architecture & Sustainable Design',
    pillarKey: 'asd',
    courses: [
      'ASD Studio I',
      'ASD Studio II',
      'ASD Studio III',
      'ASD Studio IV',
      'Architecture History & Theory',
      'Building Systems & Technology',
      'Environmental Ecology',
      'Structural Systems',
      'Urban Design',
      'Visual Computing',
      'ASD Capstone / Thesis',
    ],
  },
  {
    label: 'EPD — Engineering Product Development',
    pillarKey: 'epd',
    courses: [
      '30.003 Signals & Systems',
      '30.004 Stochastic Modelling',
      '30.005 Autonomous Mobile Robots',
      '30.007 Engineering Design',
      '30.100 Thermodynamics',
      '30.101 Mechanics of Machines',
      '30.102 Materials Science',
      '30.200 Advanced Mechanics',
      '30.201 Dynamics',
      '30.202 Fluid Mechanics',
      'EPD Capstone / Thesis',
    ],
  },
  {
    label: 'ESD — Engineering Systems & Design',
    pillarKey: 'esd',
    courses: [
      '40.002 Probability & Statistics',
      '40.004 Design Thinking',
      '40.005 Simulation Modelling',
      '40.006 System Architecture',
      '40.011 Data-Driven World',
      '40.012 Operations',
      '40.302 Advanced Optimisation',
      'Supply Chain & Logistics',
      'Risk & Decision Analysis',
      'ESD Capstone / Thesis',
    ],
  },
  {
    label: 'ISTD — Information Systems & Technology Design',
    pillarKey: 'istd',
    courses: [
      '50.001 Introduction to ISTD',
      '50.002 Computation Structures',
      '50.003 Software Construction',
      '50.004 Algorithm Design',
      '50.005 Computer System Engineering',
      '50.006 Visualisation',
      '50.007 Machine Learning',
      '50.012 Networks',
      '50.017 Graphics & Visualisation',
      '50.019 Distributed Systems',
      '50.020 Network Security',
      '50.021 AI Planning',
      '50.032 Distributed System Design',
      'ISTD Capstone / Thesis',
    ],
  },
  {
    label: 'DAI — Design & Artificial Intelligence',
    pillarKey: 'dai',
    courses: [
      'DAI Studio I',
      'DAI Studio II',
      'Computational Design',
      'Creative AI',
      'AI and Society',
      'Human-Computer Interaction',
      'Data Visualisation',
      'Interaction Design',
      'DAI Capstone / Thesis',
    ],
  },
  {
    label: 'HASS & Electives',
    pillarKey: 'hass',
    courses: [
      'HASS I',
      'HASS II',
      'HASS III',
      'HASS IV',
      'Science, Technology & Society',
      'Entrepreneurship & Innovation',
      'Technology & Policy',
      'Global Studies',
      'UROP Research',
      'SMT (Special Module in Teaching)',
    ],
  },
];

const classOptions = classGroups.flatMap((g) => g.courses);
const interestOptions = [
  'Startups & iCube',
  'Badminton',
  'AI & ML',
  'Dance',
  'Robotics',
  'Design & FabLab',
  'Fitness & Gym',
  'Photography',
  'Music',
  'Sustainability',
  'Gaming',
  'Food & Cafes',
  'Research / UROP',
  'Social Impact',
];
const goalOptions = [
  'Find my first-week circle',
  'Get returning-student module advice',
  'Join casual sports events',
  'Build a study group',
  'Find a startup co-founder',
  'Explore FabLab and making',
  'Get ASD critique feedback',
  'Land a summer internship',
];
const availabilityOptions = ['Weekday evenings', 'Weekend mornings', 'After lunch', 'Late-night study', 'Flexible'];
const mentorYearOptions = ['Year 2', 'Year 3', 'Year 4'];
const mentorPillarOptions = ['ASD', 'EPD', 'ESD', 'ISTD', 'DAI'];
const mentorHelpStyleOptions = ['One-on-one sessions', 'Group study rooms', 'Q&A threads only', 'Weekly office hours'];
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pulseStats = [
  { value: '812', label: 'verified students', change: '+184 this week' },
  { value: '126', label: 'student events', change: '38 before Day 1' },
  { value: '2,480', label: 'class answers', change: '91% answered' },
  { value: '5.7k', label: 'new intros', change: 'avg 6.8 per student' },
];

const liveMoments = [
  { title: 'Aarav answered a 10.014 recursion question', meta: '4 students joined the thread' },
  { title: 'Mei Lin opened 12 more food crawl spots', meta: 'Freshmores nearby first' },
  { title: 'Noah pinned the exchange arrival checklist', meta: 'Housing, SIM cards, transport' },
];

const campusZones = [
  { place: 'Building 5 Library', signal: 'Study rooms forming', count: '68 active', tone: 'study' },
  { place: 'Campus Bistro', signal: 'Food crawl groups', count: '42 going', tone: 'social' },
  { place: 'Sports Complex', signal: 'Beginner badminton', count: '18 going', tone: 'sports' },
  { place: 'Building 2 FabLab', signal: 'ASD design buddies', count: '31 going', tone: 'culture' },
];

// ─── Knowledge Base data ─────────────────────────────────────────────────────

type KBCategory = 'Academics' | 'Campus Life & Housing' | 'Admin & Registration' | 'Fifth Row' | 'Wellbeing' | 'Technology';
type KBArticle = { id: string; category: KBCategory; title: string; summary: string; content: string; views: number; helpful: number };

const kbArticles: KBArticle[] = [
  {
    id: 'ka1', category: 'Academics', title: 'How Freshmore modules work', summary: 'All Year 1s take the same 5 Freshmore modules in Term 1. Here\'s what to expect.',
    content: `<p>Every SUTD Freshmore takes a common set of 5 modules in Term 1: <strong>10.001 Advanced Mathematics I</strong>, <strong>10.002 Modelling the Systems World</strong>, <strong>10.003 Modelling Space and Systems</strong>, <strong>10.009 The Digital World</strong>, and <strong>10.014 Computational Thinking for Design</strong>.</p><p>These modules are integrated — the maths you learn feeds directly into the design modules. Attendance is compulsory and there are no bell curves in most assessments. Collaborate freely; academic integrity rules apply to final exams and individual assignments.</p><ul><li>Canvas is the LMS — check it daily for announcements</li><li>ModTrek shows your timetable</li><li>Office hours are posted in the module room — use them</li><li>Returning students in Cohortly answer practical module questions through the same student network</li></ul>`,
    views: 512, helpful: 89,
  },
  {
    id: 'ka2', category: 'Academics', title: 'Grading and assessment at SUTD', summary: 'No letter grades in Freshmore year — it\'s Pass/Fail. Here\'s how it all works.',
    content: `<p>SUTD uses a <strong>Pass/Fail system for Freshmore year</strong> (Terms 1–2). This is intentional — it reduces grade anxiety and encourages exploration. You still need to pass all modules to progress.</p><p>From Year 2 onwards, letter grades (A+ to D) apply and contribute to your GPA. Pillar selection happens at the end of Freshmore year and is competitive — but many pillars have ample places for those who engage actively.</p><ul><li>Continuous assessment: typically 40–60% of final grade</li><li>Group projects are a major component — choose your team wisely</li><li>Deferral and make-up policies: speak to OSA within 48h of a missed assessment</li></ul>`,
    views: 388, helpful: 74,
  },
  {
    id: 'ka3', category: 'Academics', title: 'Using the Cohortly module rooms', summary: 'How to get help fast from classmates and returning students in 10.014, 10.009, and more.',
    content: `<p>Each module on Cohortly has a <strong>Q&A room</strong> where verified students ask and answer questions. Returning students are grouped by year and pillar inside the same student network.</p><p>To get the best answers: be specific about your problem, share relevant code or working (a screenshot is fine), and mention what you've already tried. Vague questions get vague answers.</p><ul><li>Most questions in 10.014 and 10.009 should include the exact error message or worksheet step</li><li>Urgent? Post in the module room and message a classmate or returning student in the same module</li><li>Prep rooms and office hours live in Events so everyone sees the same schedule</li></ul>`,
    views: 290, helpful: 68,
  },
  {
    id: 'kh1', category: 'Campus Life & Housing', title: 'Freshmore housing — what to expect', summary: 'What to handle through official Housing and what Cohortly helps with socially.',
    content: `<p>SUTD has compulsory on-campus housing for Freshmore students (Terms 1-3, AY2026). Your exact assignment, key collection, maintenance, and policy questions should always be handled through the official Housing channel.</p><p><strong>Key things to know on arrival:</strong></p><ul><li>Bring your student ID photo and required documents for key collection</li><li>Pack bedding, toiletries, chargers, laundry basics, and approved appliances only</li><li>Wi-Fi: connect to eduroam using your SUTD student account</li><li>Keep emergency, visitor, and quiet-hour rules from official Housing guidance bookmarked</li><li>Use Cohortly for broad student support: meal jios, campus walks, study circles, and returning-student advice</li></ul><p>Cohortly does not publish room, floor, resident, or live occupancy directories.</p>`,
    views: 621, helpful: 112,
  },
  {
    id: 'kh2', category: 'Campus Life & Housing', title: 'Campus jios — how to find people to eat and study with', summary: 'Meal jios, supper runs, study groups, and sports plans without room-level feeds.',
    content: `<p>A "jio" (Singapore slang for "invite") is a simple plan people can join: breakfast, dinner, study prep, sports, or a campus walk.</p><p>On Cohortly, <strong>Campus Life</strong> shows active jios grouped by broad student context: Freshmore arrival, returning-student guides, commuter students, modules, and interests.</p><ul><li>Breakfast plans usually start from common campus meeting points</li><li>Late supper runs are public enough that nobody has to walk alone</li><li>Study sessions around Building 5 and FabLab link back to module rooms</li><li>Move-in questions stay in broad housing guidance and official Housing channels</li></ul>`,
    views: 407, helpful: 88,
  },
  {
    id: 'kh3', category: 'Campus Life & Housing', title: 'Getting around campus during move-in week', summary: 'A practical guide to finding core campus zones without turning housing into a room map.',
    content: `<p>During move-in week, students mostly need to know four things: where official Housing support is, where to meet groups, where to study, and where to get food.</p><ul><li><strong>Official Housing support</strong>: use the move-in desk, Housing emails, or staff instructions for exact assignment questions</li><li><strong>Common meeting points</strong>: main campus walkways, Building 5 study areas, campus food areas, and sports facilities</li><li><strong>Academic anchors</strong>: Building 5 for library/computer labs, Building 2 for FabLab, and module rooms for class-specific plans</li><li><strong>Support</strong>: use Cohortly Campus Life if you want a peer check-in without posting publicly</li></ul><p>Cohortly intentionally avoids room maps, floor-by-floor occupancy, and resident lookup.</p>`,
    views: 684, helpful: 146,
  },
  {
    id: 'kh4', category: 'Campus Life & Housing', title: 'Privacy rules for campus-life matching', summary: 'What Cohortly will and will not collect for student housing-related support.',
    content: `<p>Campus Life is designed around broad belonging, not exact location. Cohortly helps students find jios, guides, study circles, and support signals without asking them to publish a room.</p><ul><li><strong>Visible to students</strong>: year, pillar, modules, interests, broad home base, and opted-in plans</li><li><strong>Not shown</strong>: room number, floor number, live occupancy, floor maps, or resident rosters</li><li><strong>Admin view</strong>: staff see aggregate readiness and support signals, not casual location browsing</li><li><strong>Change anytime</strong>: update your broad home base from Campus Life or profile settings</li></ul><p>If your official room assignment changes, update it only through the official Housing channel.</p>`,
    views: 512, helpful: 119,
  },
  {
    id: 'kr1', category: 'Admin & Registration', title: 'What to do in your first week — admin checklist', summary: 'Student card, bank account, Singpass, Canvas — the complete list.',
    content: `<p>There are several things you need to set up in Week 0–1. Missing any of these causes access problems later.</p><ul><li><strong>Student card</strong>: collect from Student Hub (Building 1, Level 2) with your ID. Needed for labs, library, printers, and after-hours access</li><li><strong>SUTD email</strong>: activated via IT portal — this is your official communication channel</li><li><strong>Canvas</strong>: SUTD's learning management system. Check it the night before every class</li><li><strong>ModTrek</strong>: your official timetable system</li><li><strong>Singpass</strong>: required for government services. International students — your pass type determines your access</li><li><strong>Bank account</strong>: most students use DBS/POSB or OCBC. Bring your student card and IPA letter</li></ul><p>Questions? Walk into the Student Hub or email OSA at osa@sutd.edu.sg.</p>`,
    views: 744, helpful: 135,
  },
  {
    id: 'kr2', category: 'Admin & Registration', title: 'International students — visas and passes', summary: 'Student\'s Pass, IPA letter, SingPass — what you need and when.',
    content: `<p>International students need a <strong>Student's Pass</strong> issued by ICA (Immigration & Checkpoints Authority). The process starts when SUTD sends you an IPA (In-Principle Approval) letter.</p><ul><li>Arrive in Singapore with the IPA letter printed</li><li>Register online at myICA portal within 2 weeks of arrival</li><li>Attend the ICA appointment to collect your Student's Pass card</li><li>OSA will brief you on this during orientation — attend the international student session</li></ul><p>Your pass type affects what jobs you can take (including part-time work on campus). Speak to OSA before accepting any paid internship or research assistant role.</p>`,
    views: 318, helpful: 67,
  },
  {
    id: 'kr3', category: 'Admin & Registration', title: 'Telegram and WhatsApp alert setup', summary: 'How Cohortly alert channels work and what still needs official bot credentials.',
    content: `<p>Cohortly can send the same alert stream to browser push, Telegram, and WhatsApp: module answer received, event starting soon, new connection request, housing notice, or admin safety message.</p><ul><li><strong>Telegram</strong>: start the Cohortly bot, enter your username, and verify the connection in Notifications & Bots</li><li><strong>WhatsApp</strong>: WhatsApp Cloud API requires the student to message first, so use the opt-in link before enabling alerts</li><li><strong>Privacy</strong>: alert channels store only the handle/phone required to deliver notifications</li><li><strong>Production</strong>: working delivery requires official Telegram bot and Meta WhatsApp Cloud API credentials on the backend webhook host</li></ul><p>If the app is running on GitHub Pages only, alerts can be configured in the UI but server-side delivery still requires a deployed webhook service.</p>`,
    views: 431, helpful: 92,
  },
  {
    id: 'kf1', category: 'Fifth Row', title: 'What is Fifth Row and why it matters', summary: 'SUTD\'s co-curricular system — and how to find your community in it.',
    content: `<p>SUTD calls its co-curricular activities "Fifth Row" — a nod to the academic, social, sports, and cultural pillars, with Fifth Row as the fifth dimension of your education. It's taken seriously here; many students say their Fifth Row CCA is where they made their closest friends.</p><p>There are 80+ clubs across 5 clusters: <strong>Arts</strong>, <strong>Sports</strong>, <strong>Community</strong>, <strong>Culture</strong>, and <strong>Makers</strong>. Most clubs have low-commitment trial sessions in Week 1–2 — you don't need to commit to anything upfront.</p><ul><li>Fifth Row Fair: Week 0, all clubs set up booths on campus</li><li>Use the Fifth Row tab on Cohortly to filter by cluster, commitment level, and beginner-friendliness</li><li>Most clubs have WhatsApp groups — join the trial group first</li></ul>`,
    views: 489, helpful: 93,
  },
  {
    id: 'kw1', category: 'Wellbeing', title: 'Mental health support at SUTD', summary: 'Counselling, peer support, and what to do when you\'re not okay.',
    content: `<p>SUTD takes student wellbeing seriously. The <strong>Student Wellbeing Centre</strong> is in Building 54, Level 2. Walk-ins are welcome; confidential appointments available.</p><p>Services available:</p><ul><li><strong>Counselling</strong>: 1-on-1 sessions with professional counsellors — free for all students</li><li><strong>Peer Support Network (PSN)</strong>: trained student peers you can talk to informally</li><li><strong>MoodTracker</strong>: SUTD's anonymous wellbeing tool — your responses help the university identify support needs early</li><li><strong>External referral</strong>: the counselling team can refer you to IMH or polyclinics if needed</li></ul><p>If you're in acute distress: call SOS (1767, 24h) or Samaritans of Singapore (1800-221-4444). SUTD security can also assist — call 6303-6002.</p><p>There is no stigma in using these services. Many students do. Your academic record is not affected by seeking help.</p>`,
    views: 556, helpful: 121,
  },
  {
    id: 'kw2', category: 'Wellbeing', title: 'Managing Freshmore workload — practical strategies', summary: 'The first semester is intense. Here is what returning students say actually works.',
    content: `<p>Freshmore Term 1 is genuinely demanding — five integrated modules, orientation activities, and a new environment simultaneously. The students who thrive are those who build systems early.</p><ul><li><strong>Front-load understanding</strong>: Don't wait until the night before. Read the pre-lecture notes on the train or at breakfast</li><li><strong>Study in groups</strong>: for 10.014 especially, talking through code with someone else is faster than debugging alone</li><li><strong>Use office hours</strong>: professors and TAs are here to help. Coming in with a specific question gets you far more than attending lectures passively</li><li><strong>Sleep</strong>: non-negotiable. Protect at least one regular sleep block during project weeks</li><li><strong>Talk to returning students</strong>: they have been through the exact same modules and know which weeks are rough</li></ul>`,
    views: 412, helpful: 98,
  },
  {
    id: 'kt1', category: 'Technology', title: 'Setting up your development environment', summary: 'Python, Git, VS Code, and everything else you need before Week 1.',
    content: `<p>For 10.014 Computational Thinking, you need a working Python environment. The fastest setup:</p><ul><li><strong>Install Python 3.11+</strong> from python.org (or use Anaconda if you prefer bundled packages)</li><li><strong>VS Code</strong>: install the Python and Jupyter extensions</li><li><strong>Git</strong>: required for group projects. Set up GitHub with your SUTD email for GitHub Education benefits (free Copilot)</li></ul><p>SUTD also has <strong>lab machines</strong> with all software pre-installed — Building 5 computer labs are open 24h with your student card.</p><p>If you get stuck on setup, post in the 10.014 module room on Cohortly — usually answered within an hour during term.</p>`,
    views: 334, helpful: 72,
  },
];

// ─── AI Companion knowledge ───────────────────────────────────────────────────

// ─── Cohortly Local AI Engine ────────────────────────────────────────────────

type AIEntry = {
  id: string;
  triggers: string[];      // phrases scored against input (longer = more specific = higher score)
  response: string;        // markdown-lite: **bold**, - bullets, \n newlines
  followUps?: string[];    // chips shown after this response
};

const COHORTLY_KB: AIEntry[] = [
  // ── Modules ──────────────────────────────────────────────────────────────
  {
    id: 'm-10014',
    triggers: ['10.014', 'computational thinking', 'computational thinking for design', 'python module', 'coding module', 'programming module', 'lab 1', 'lab 2', 'lab 3', 'recursion', 'tree traversal', 'jupyter', 'ctd'],
    response: `**10.014 Computational Thinking for Design** is your intro to Python and algorithmic thinking. Here's what to know:\n\n- Labs use **Jupyter notebooks** — install Anaconda or use the lab machines in Building 5 (open 24h)\n- Key topics: functions, loops, recursion, data structures, basic algorithms\n- Recursion trips most people up — trace through the factorial example by hand before the lab\n- **Submit via Canvas** — check the assignment page for the exact deadline and format\n- Returning student **Aarav** (Y3 ISTD) runs weekly prep sessions — check Events for the next one\n- Stuck? Post in the **10.014 module room** on Cohortly — classmates and returning students usually answer within a few hours`,
    followUps: ['How do I set up Python?', 'Who is Aarav Menon?', 'Where do I submit my lab?'],
  },
  {
    id: 'm-10009',
    triggers: ['10.009', 'digital world', 'the digital world', '2d project', '2d project brief', 'digital world project', 'team formation 10.009'],
    response: `**10.009 The Digital World** is about technology, systems, and how digital tools shape society. The big deliverable is the **2D Group Project** — here's what returning students say:\n\n- The brief drops in **Week 2** — don't wait to form your team\n- Pick teammates with **complementary skills** — ideally across different pillars (ASD + ISTD combos work well)\n- Past project themes: smart city systems, assistive tech, sustainability platforms\n- Module room on Cohortly has **Wei Jian** and Aarav answering scope questions\n- Don't overbuild — scoping down is always better than running out of time`,
    followUps: ['How do I form a good team?', 'What other modules do I take?', 'How does Pass/Fail grading work?'],
  },
  {
    id: 'm-10001',
    triggers: ['10.001', 'advanced mathematics', 'advanced maths', 'advanced math', 'maths module', 'math module', '10.001 maths'],
    response: `**10.001 Advanced Mathematics I** covers calculus, linear algebra, and differential equations — the mathematical backbone for everything else you'll do at SUTD.\n\n- Goes fast — keep up with the weekly problem sets, don't fall behind\n- Office hours are posted on Canvas — use them, professors actually want you there\n- Study groups work really well for this module — find 2–3 people at similar pace\n- No dedicated Cohortly module room yet, but you can start a thread in Messages`,
    followUps: ['How do I find a study group?', 'What is Freshmore grading like?', 'What other modules do I take?'],
  },
  {
    id: 'm-10002-10003',
    triggers: ['10.002', '10.003', 'modelling', 'modelling the systems world', 'modelling space and systems', 'systems world', 'space and systems'],
    response: `**10.002** (Modelling the Systems World) and **10.003** (Modelling Space and Systems) are your physics/engineering modules.\n\n- 10.002: Focuses on systems thinking — mechanics, dynamics, and quantitative modelling\n- 10.003: Geometry, spatial reasoning, and how physical objects behave in 3D space\n- Both are heavily linked to 10.009 and your design projects\n- Pro tip: the FabLab (Building 2) lets you build physical prototypes — great for 10.003 concepts\n- Form a cross-disciplinary study group — ASD students have strong spatial intuition, ISTD students often think in systems`,
    followUps: ['What is the FabLab?', 'What is the 2D project?', 'How does grading work?'],
  },
  {
    id: 'm-50007',
    triggers: ['50.007', 'machine learning', 'ml module', 'gradient descent', 'neural network', 'deep learning', 'ai module'],
    response: `**50.007 Machine Learning** is a Year 2–3 module, so you'll get there after Freshmore year. But if you're curious:\n\n- Covers supervised learning, neural nets, gradient descent, and model evaluation\n- Python is essential — strong 10.014 foundations help a lot\n- **Aarav Menon** (Y3 ISTD) is in the 50.007 module room and has answered questions on gradient descent and backprop\n- The assignment on gradient descent trips people up — check your learning rate first (0.01 is a safe default to start)`,
    followUps: ['Who is Aarav Menon?', 'How do I do well in 10.014 first?', 'What is ISTD pillar?'],
  },
  // ── Grading & Academic ───────────────────────────────────────────────────
  {
    id: 'grading-pf',
    triggers: ['pass fail', 'pass/fail', 'grades', 'grading', 'gpa', 'letter grade', 'transcript', 'how am i graded', 'assessment', 'no grades', 'marks'],
    response: `Good news — **Freshmore year is entirely Pass/Fail**. No letter grades, no GPA stress in Terms 1–2.\n\n- This is intentional — SUTD designed it to let you explore without grade anxiety\n- You still need to **pass every module** to progress to Year 2\n- Continuous assessment (labs, projects, participation) is typically 40–60% of your grade\n- **Letter grades (A+ to D) start from Year 2** and count toward your GPA\n- Pillar selection at end of Freshmore year is competitive — your engagement and projects matter more than Freshmore grades`,
    followUps: ['What is pillar selection?', 'What modules do I take?', 'How do I prepare for Year 2?'],
  },
  {
    id: 'pillar-selection',
    triggers: ['pillar selection', 'pillar', 'choose pillar', 'asd pillar', 'esd pillar', 'epd pillar', 'istd pillar', 'dai pillar', 'which pillar', 'architecture pillar', 'engineering pillar', 'design ai', 'information systems'],
    response: `SUTD has **5 undergraduate pillars** — you choose at the end of Freshmore year:\n\n- **ASD** — Architecture and Sustainable Design: spatial design, buildings, sustainability\n- **ESD** — Engineering Systems and Design: complex systems, supply chain, finance engineering\n- **EPD** — Engineering Product Development: physical products, manufacturing, robotics\n- **ISTD** — Information Systems Technology and Design: software, cybersecurity, AI/ML\n- **DAI** — Design and Artificial Intelligence: human-centred AI, UX, data design\n\nPillar selection is competitive but most pillars have enough places for engaged students. Start thinking about which direction excites you most — talk to Year 2+ students in each pillar via Cohortly's People tab.`,
    followUps: ['Who are the ISTD students?', 'How do I connect with returning students?', 'What is Freshmore grading?'],
  },
  {
    id: 'canvas-modtrek',
    triggers: ['canvas', 'lms', 'modtrek', 'timetable', 'schedule', 'class schedule', 'learning management', 'assignments', 'announcements', 'how to access canvas'],
    response: `Two platforms you'll live on:\n\n- **Canvas** — SUTD's LMS. Check it every evening for announcements, assignment deadlines, and lecture slides. Activate your account using your SUTD email credentials.\n- **ModTrek** — your official timetable. Shows lecture times, tutorial slots, and room allocations.\n\nBoth are accessible at sutd.edu.sg → Student Resources. If your Canvas isn't loading modules, go to the **IT Help Desk in Building 1** or email ithelp@sutd.edu.sg.`,
    followUps: ['How do I set up my SUTD email?', 'What do I need to set up in Week 1?', 'Where is the IT helpdesk?'],
  },
  {
    id: 'python-setup',
    triggers: ['python setup', 'install python', 'set up python', 'vs code', 'vscode', 'git setup', 'github setup', 'development environment', 'coding environment', 'anaconda', 'jupyter setup', 'github education', 'github copilot'],
    response: `For **10.014**, get this set up before Week 1:\n\n- **Python 3.11+**: download from python.org or install Anaconda (includes Jupyter, numpy, etc.)\n- **VS Code**: add the Python and Jupyter extensions from the Extensions marketplace\n- **Git**: create a GitHub account with your **SUTD email** — unlocks GitHub Education (free Copilot, private repos, etc.)\n- **Jupyter**: either via Anaconda or \`pip install jupyter\` in your terminal\n\nDon't stress if setup breaks — **lab machines in Building 5** have everything pre-installed and are open 24h with your student card. Post in the 10.014 module room if you're stuck.`,
    followUps: ['What is the 10.014 module?', 'Where is Building 5?', 'How do I use module rooms on Cohortly?'],
  },
  // ── Campus Life & Housing ────────────────────────────────────────────────
  {
    id: 'housing-overview',
    triggers: ['hostel', 'housing', 'on campus housing', 'on-campus housing', 'dorm', 'dormitory', 'block 1n', 'block 1s', 'move in', 'move-in', 'compulsory housing', 'stay on campus'],
    response: `**All Freshmores live on campus for Terms 1-3** — use official SUTD Housing channels for exact assignment, key collection, maintenance, and policy details.\n\n**Move-in checklist:**\n- Bring the documents requested by Housing for key collection\n- Pack bedding, pillow, towel, toiletries, laptop charger, and approved adapters\n- Follow official fire-safety guidance on appliances\n- Wifi: connect to **eduroam** using your SUTD student account credentials\n- Visitor and quiet-hour policies should be checked against official Housing guidance\n\nCohortly's **Campus Life** area helps with broad student support: jios, first-week plans, returning-student guides, and private settling-in help. It does not show rooms, floors, resident rosters, or live occupancy.`,
    followUps: ['What food options are nearby?', 'How does the jio system work?', 'What is Campus Life?'],
  },
  {
    id: 'housing-rules',
    triggers: ['quiet hours', 'hostel rules', 'hostel regulations', 'visitor policy', 'noise', 'overnight guests', 'hostel policy', 'kettle ban', 'no kettle'],
    response: `Key hostel rules to know:\n\n- **Quiet hours**: 11 PM – 8 AM weekdays, midnight – 9 AM weekends\n- **No kettles, rice cookers, or high-wattage appliances** — fire safety, room inspections do happen\n- **Overnight guests**: need to be registered at security and can only stay a limited number of nights\n- **Visitor sign-in**: all guests (including other SUTD students from different blocks) sign in at security\n- **Laundry**: book machines via the campus housing app — peak time is Sunday 2–6 PM, avoid it\n- Floor RAs (Resident Advisors) are your first point of contact for any issues`,
    followUps: ['What food options are nearby?', 'How do I meet people?', 'What is Campus Life?'],
  },
  {
    id: 'campus-food',
    triggers: ['food', 'eat', 'canteen', 'jio', 'lunch', 'dinner', 'breakfast', 'supper', 'makan', 'meal', 'hungry', 'koufu', 'bistro', 'mcdonald', 'pgp canteen', 'campus food', 'hawker'],
    response: `Campus and nearby food options:\n\n- **Koufu at 1N**: opens 7:30 AM — good for quick breakfast before 8 AM lectures\n- **Campus Bistro**: opens 8 AM, more variety, slightly pricier\n- **Sports Complex Canteen**: lunch crowd, affordable\n- **PGP Canteen** (short walk): popular for dinner with more options\n- **McDonald's Dover**: 12 min walk, open 24h — the go-to for late supper runs\n- **Ghim Moh hawker centre**: 15 min walk or short Grab ride\n\nCheck **Campus Life → First-week jios** for people heading out. Plans are grouped by broad student context, not exact rooms.`,
    followUps: ['How do I join a meal jio?', 'What is Campus Life?', 'What are quiet hours?'],
  },
  {
    id: 'jio-culture',
    triggers: ['jio', 'meal jio', 'supper run', 'join jio', 'post jio', 'food run', 'going to eat'],
    response: `A **jio** is Singapore slang for "invite" — someone posts they're heading somewhere and anyone can join.\n\nOn Cohortly: go to **Campus Life** to see meal, study, sports, and campus-walk plans. The groups are broad: Freshmore arrival, returning-student guides, commuter students, modules, and interests.\n\n**How to join:**\n- Open Campus Life\n- Pick a jio that fits your timing\n- Tap Join jio\n\nJios are how many first-week friendships start. Say yes to the first few, even if you're tired.`,
    followUps: ['What food is available near campus?', 'How do I meet people?', 'What is Campus Life?'],
  },
  // ── Admin & Registration ──────────────────────────────────────────────────
  {
    id: 'admin-week1',
    triggers: ['admin setup', 'first week admin', 'what to do first week', 'week 1 checklist', 'week 0 checklist', 'setup checklist', 'things to do', 'orientation checklist', 'register'],
    response: `**Week 0–1 admin checklist** — get all of this done early:\n\n- **Student card** → Student Hub, Building 1 Level 2, bring your IC/passport\n- **SUTD email** → activate via IT portal at sutd.edu.sg/it — this is your official comms channel\n- **Canvas** → log in with SUTD credentials, check all your modules are visible\n- **ModTrek** → confirm your timetable for Term 1\n- **Bank account** → DBS/POSB or OCBC recommended; bring student card + IPA letter\n- **Singpass** → required for most government services\n- **Cohortly Launchpad** → check the Admin & Registration phase for a full tick-off list\n\nIf anything breaks: walk into **Student Hub** or email osa@sutd.edu.sg.`,
    followUps: ['Where is the Student Hub?', 'How do I set up Singpass?', 'What about international student pass?'],
  },
  {
    id: 'student-card',
    triggers: ['student card', 'collect card', 'student id card', 'id card', 'access card', 'where to get card', 'student hub'],
    response: `**Collect your student card at the Student Hub, Building 1 Level 2** — usually during Week 0 orientation.\n\nBring: your NRIC or passport + a passport-size photo (or they may take one on the spot).\n\n**What your student card unlocks:**\n- Labs and computer rooms (including 24h FabLab access)\n- Library printing and borrowing\n- Building access after hours\n- Sports Complex and gym\n- Student discounts at some campus vendors\n\nIf you lose it: report at Student Hub and pay a replacement fee (~S$15). Do this quickly — you need it for lab access.`,
    followUps: ['What is the FabLab?', 'Where is the library?', 'What else do I need to set up?'],
  },
  {
    id: 'international-student',
    triggers: ["international student", "student's pass", "student pass", "ipa letter", "ica", "myica", "immigration", "visa", "work permit", "part time work", "overseas student", "foreign student"],
    response: `**International students — key things to sort on arrival:**\n\n- Arrive with your **IPA (In-Principle Approval) letter** — printed, not just on your phone\n- Register at **myICA portal** within 2 weeks of arrival to get your Student's Pass\n- Attend the **OSA international student briefing** during orientation — mandatory\n- Your **Student's Pass** specifies if you can work (including campus part-time jobs)\n- For bank accounts: DBS requires the Student's Pass card — do myICA registration first\n\nQuestions? Email **OSA at osa@sutd.edu.sg** before your arrival — they respond quickly.`,
    followUps: ['What do I bring to hostel?', 'Week 1 admin checklist?', 'How to open a bank account?'],
  },
  {
    id: 'sutd-email',
    triggers: ['sutd email', 'mymail', 'set up email', 'email activation', 'email not working', 'student email', 'activate email'],
    response: `Your **SUTD email** (yourname@mymail.sutd.edu.sg) is your official communication channel — professors, OSA, and Canvas all use it.\n\n**How to activate:**\n1. Go to sutd.edu.sg → Student Resources → IT Services\n2. Activate your account using your student ID\n3. You'll get Microsoft 365 — Outlook, Teams, OneDrive, all included free\n\nTip: **Use your SUTD email for GitHub** to unlock GitHub Education (free Copilot, free private repos). Also use it for Spotify, Adobe, and other student discounts.\n\nIf activation fails: IT Help Desk, Building 1, or ithelp@sutd.edu.sg.`,
    followUps: ['How do I set up Canvas?', 'What about Singpass?', 'What student discounts are available?'],
  },
  // ── Wellbeing ─────────────────────────────────────────────────────────────
  {
    id: 'wellbeing-services',
    triggers: ['wellbeing', 'wellbeing centre', 'counselling', 'mental health', 'counselor', 'therapist', 'talk to someone', 'psn', 'peer support', 'wellbeing building', 'building 54'],
    response: `**SUTD Student Wellbeing Centre — Building 54, Level 2**\n\n- Walk-ins are welcome during office hours — no appointment needed\n- All sessions are **free and confidential** — nothing goes on your academic record\n- 1-on-1 counselling with professional counsellors\n- **Peer Support Network (PSN)**: trained fellow students you can talk to informally — sometimes easier as a first step\n- Referrals to external support (IMH, polyclinics) if needed\n\nMany students use these services — there's genuinely no stigma at SUTD. If something feels off, go early rather than waiting.`,
    followUps: ['What if I need urgent help?', 'How do I manage workload stress?', 'What is the Weekly Belonging Pulse?'],
  },
  {
    id: 'crisis-help',
    triggers: ['crisis', 'emergency mental health', 'sos', 'suicidal', 'self harm', 'urgent help', 'in crisis', 'not okay', 'really struggling', '1767', 'samaritans'],
    response: `If you or someone you know needs urgent help right now:\n\n- **SOS Singapore: 1767** (24 hours, free call)\n- **Samaritans of Singapore: 1800-221-4444** (24 hours)\n- **SUTD Security: 6303-6002** — can assist on campus any time\n- **A&E at CGH** (Changi General Hospital, nearest): go there if immediate safety is a concern\n\nYou don't have to be in crisis to reach out. If things feel heavy, the Wellbeing Centre (Building 54 Level 2) is open during the day — walk in.`,
    followUps: ['Where is the Wellbeing Centre?', 'What is the Peer Support Network?'],
  },
  {
    id: 'workload-tips',
    triggers: ['workload', 'so much work', 'overwhelmed', 'stressed', 'too many assignments', 'behind', 'falling behind', 'time management', 'study tips', 'how to cope', 'busy', 'manage work', 'semester hard'],
    response: `Freshmore Term 1 is genuinely intense — 5 modules simultaneously. Here's what returning students say actually works:\n\n- **Front-load understanding**: skim the lecture before class, even for 5 minutes — makes everything click faster\n- **Study in groups**: for 10.014 especially, working through code with someone else is 3x faster than debugging alone\n- **Use office hours**: most students don't — showing up with a specific question gets you more than a whole extra hour of solo study\n- **Sleep**: non-negotiable. Students who consistently sleep under 6 hours see the steepest drop in Term 2\n- **Ask early**: don't wait until the night before — post in module rooms on Cohortly the day you're confused\n- If it's more than work stress, the **Wellbeing Centre** (Bldg 54) is genuinely helpful`,
    followUps: ['How do I ask a question in a module room?', 'How do I find a study group?', 'Where is the Wellbeing Centre?'],
  },
  // ── Fifth Row ─────────────────────────────────────────────────────────────
  {
    id: 'fifth-row-overview',
    triggers: ['fifth row', 'cca', 'co-curricular', 'co curricular', 'extracurricular', 'club', 'clubs', 'activities', 'student club', 'join club', 'club fair', 'sutd clubs'],
    response: `**Fifth Row** is SUTD's co-curricular system — named for being the "fifth" dimension of your education alongside the four academic pillars.\n\nThere are 80+ clubs across 5 clusters:\n- **Arts**: Drama, Choir, Dance, Photography Society\n- **Sports**: Basketball, Badminton, Climbing, and more\n- **Community**: Habitat for Humanity, ENVU, Entrepreneurship Society\n- **Culture**: DSIA (Design & Society in Action)\n- **Makers**: FabLab, Robotics, Motorsports\n\n**Club Fair** happens in **Week 0** — all clubs have booths. Browse the **Fifth Row tab** on Cohortly to filter by cluster, commitment level, and beginner-friendliness.\n\nMost clubs have **no-commitment trials in Weeks 1–2** — go to 3 trials before you decide.`,
    followUps: ['Tell me about the Makers clubs', 'What is the FabLab?', 'How do I find trial sessions?'],
  },
  {
    id: 'fablab',
    triggers: ['fablab', 'fab lab', 'fabrication lab', '3d printing', '3d print', 'laser cut', 'laser cutting', 'maker space', 'building 2', 'electronics workshop', 'prototyping'],
    response: `**FabLab (Fabrication Laboratory) — Building 2, open 24 hours** with your student card.\n\nWhat you can do:\n- **3D printing**: FDM and resin printers, self-service after a short induction\n- **Laser cutting**: for acrylic, wood, cardboard — induction required\n- **Electronics**: soldering stations, oscilloscopes, Raspberry Pi/Arduino kits available\n- **Woodworking and metalworking**: in the adjacent workshop (safety induction required)\n- **Free for SUTD students** — just book machines via the FabLab booking system\n\nFabLab Community is also a Fifth Row club — join if you want to go deeper. Best place to build your 10.003 and 10.009 project prototypes.`,
    followUps: ['What is Fifth Row?', 'What is the Robotics Club?', 'How do I access campus buildings at night?'],
  },
  {
    id: 'sports-clubs',
    triggers: ['basketball', 'badminton', 'climbing', 'bouldering', 'sports club', 'gym', 'swimming', 'sports complex', 'sports fifth row'],
    response: `SUTD's Sports cluster has clubs for almost everything:\n\n- **Badminton**: most popular sport on campus — Low commitment. Trials: Tuesdays and Thursdays 8 PM. Casual and competitive sessions.\n- **Basketball**: recreational and competitive teams. All levels. Trials: Mondays and Wednesdays 7 PM\n- **Climbing**: bouldering and lead climbing. The campus wall is open 24h for members. Trials: Week 2, Saturday 10 AM\n\nSports Complex is near Building 5 — gym, courts, pool. Your student card gets you in. If there's a sport you don't see listed, check if there's an informal group in Events or ask in the Fifth Row tab.`,
    followUps: ['What other Fifth Row clubs are there?', 'How do I join a club?', 'Where is the Sports Complex?'],
  },
  {
    id: 'arts-clubs',
    triggers: ['drama', 'choir', 'dance', 'photography', 'arts club', 'performing arts', 'music club', 'singing', 'theatre', 'acting'],
    response: `SUTD's Arts cluster — more active than you'd expect at a tech university:\n\n- **SUTD Drama**: comedy sketches to full productions. Beginner-friendly. Trials: Week 2, Friday 7 PM\n- **SUTD Choir**: a cappella and choral. Relaxed auditions — just bring your voice. Trials: Week 1, Tuesday 7 PM\n- **SUTD Dance**: contemporary and hip-hop. Multiple shows per term. Slightly more competitive. Trials: Week 2, Saturday 2 PM\n- **Photography Society**: campus walks, workshops, exhibitions. No gear required. Ongoing drop-in.\n\nAll have trial sessions — no commitment needed to attend. Even if you've never performed, orientation week is the best time to try.`,
    followUps: ['What other clubs exist?', 'How do I find trial sessions?', 'What is Fifth Row?'],
  },
  {
    id: 'community-clubs',
    triggers: ['habitat for humanity', 'envu', 'environment', 'sustainability', 'entrepreneurship', 'startup', 'vcf', 'volunteer', 'community service', 'icube', 'community club'],
    response: `Community cluster clubs — doing good while at SUTD:\n\n- **Habitat for Humanity**: build homes for underprivileged families. Overseas trips and local events. Trials: Week 1, Saturday 10 AM\n- **ENVU**: sustainability and zero-waste. Campus garden, green campaigns. Trials: Week 1, Thursday 6 PM\n- **Entrepreneurship Society**: pitch nights, startup mentorship, iCube connection. Probably the most career-useful club for people interested in startups. Trials: Week 1, Thursday 7 PM — 88 members, very active\n\niCube is SUTD's startup incubator — Entrepreneurship Society has direct connections there.`,
    followUps: ['What is iCube?', 'What other Fifth Row clubs exist?', 'What is Fifth Row?'],
  },
  // ── Campus & Location ─────────────────────────────────────────────────────
  {
    id: 'campus-location',
    triggers: ['where is sutd', 'sutd location', 'campus location', 'how to get to sutd', 'dover mrt', 'mrt to sutd', 'bus to sutd', 'address', '8 dover road', 'changi campus', 'get to campus'],
    response: `**SUTD is at 8 Dover Road, Singapore 138682.**\n\n- **By MRT**: Dover MRT (Circle Line) → 5-min walk. Or Jurong East → bus 99 to campus gate.\n- **By bus**: Routes 99, 147, 175 stop at the campus gate\n- **By Grab**: about S$8–12 from the city, S$15–20 from Changi Airport\n\nThe campus is compact — most buildings are connected and walkable. Building 1 is admin (Student Hub), Building 2 is FabLab, Building 5 is the library and computer labs. You'll know the layout within a week.`,
    followUps: ['Where is the Student Hub?', 'Where is the FabLab?', 'What is near campus?'],
  },
  {
    id: 'library',
    triggers: ['library', 'building 5', 'study room', 'study space', 'print', 'printing', 'book library', 'borrow book', 'library hours'],
    response: `The **SUTD Library is in Building 5** — open 24h for students with your card.\n\n- Study rooms (bookable via library portal — book early, they fill up fast)\n- Printing: charge to your student card account, top it up via the portal\n- Computer labs: all software pre-installed including Python, MATLAB, and Adobe CC\n- Book borrowing: search the SUTD LibrarySearch catalogue online first\n- **Top floor quiet zone**: respected, actually quiet — good for exams period\n\nBuilding 5 Level 3 common area is also a popular casual study and hangout spot.`,
    followUps: ['How do I book a study room?', 'How do I set up my laptop for coding?', 'What are good study spots?'],
  },
  {
    id: 'study-spots',
    triggers: ['study spot', 'where to study', 'study area', 'best place to study', 'quiet study', 'level 3', 'hangout spot', '24 hour study'],
    response: `Best spots to study on campus:\n\n- **Building 5 Library** (Level 3, quiet zone): enforced quiet, best for deep focus. 24h access.\n- **Building 5 Level 3 common area**: casual, good for group work\n- **FabLab** (Building 2): open 24h, great if you're working on a project with hardware components\n- **Campus Bistro area** (off-peak): good wifi, good light, coffee available\n- **Hostel common rooms**: each floor has one — good for late-night 10.014 debugging sessions with your floor\n- **Level 3 hangout corridor**: popular social study zone — expect background noise`,
    followUps: ['Where is the FabLab?', 'How do I book a library study room?', 'What are quiet hour rules?'],
  },
  // ── Cohortly Features ─────────────────────────────────────────────────────
  {
    id: 'launchpad-feature',
    triggers: ['launchpad', 'freshmore launchpad', 'checklist', 'task checklist', '8 phases', 'phase', 'orientation tasks', 'launchpad tasks', 'what is launchpad'],
    response: `The **Freshmore Launchpad** is your guided checklist for the whole first year — 8 phases, ~38 tasks.\n\n**The 8 phases:**\n1. Before I arrive (visa, module review, housing application)\n2. Move into campus life\n3. Week 0 orientation\n4. Week 1 academic setup\n5. Find my first 5 people\n6. Join one Fifth Row club\n7. Ask my first module question\n8. Ask my first returning-student question\n\nEach task has 4 states: **todo → doing → done → need-help**. Click the circle to cycle through. Progress is saved — your completions stay across sessions.\n\nFind it on the main nav as **Launchpad**.`,
    followUps: ['How do I connect with people?', 'How do I join a Fifth Row club?', 'How do I ask a question?'],
  },
  {
    id: 'people-feature',
    triggers: ['people tab', 'people feature', 'connect with people', 'compatibility', 'compatibility score', 'how to connect', 'request intro', 'find students', 'network', 'people section'],
    response: `The **People tab** is where you build your network on Cohortly.\n\n- **Everyone**: all verified SUTD students\n- **Year 1**: freshmen, exchange students, and new arrivals\n- **Year 2** and **Year 3+**: returning students grouped by year and pillar\n- **My Modules**: people in your same modules\n- **Campus Life**: broad home-base and interest context without room-level lookup\n\nEach card shows a **% compatibility score** based on shared interests, modules, and goals — the higher the %, the more you have in common.\n\nClick any card to see key highlights first, then open the full profile for detail. Hit "Request intro" to connect.`,
    followUps: ['How is compatibility calculated?', 'How do I find returning students?', 'What is Campus Life?'],
  },
  {
    id: 'returning-students',
    triggers: ['mentor', 'senior mentor', 'find mentor', 'get a mentor', 'aarav', 'sara halim', 'wei jian', 'mentor profile', 'connect mentor', 'mentor match', 'senior student', 'returning student', 'year 2', 'year 3'],
    response: `Cohortly no longer uses a separate mentor concept. Returning students are grouped by year, pillar, module, and activity.\n\nUseful returning students right now:\n\n- **Aarav Menon** (Y3 ISTD): active in 10.014, 50.007, and 10.009; runs weekly coding prep sessions\n- **Sara Binte Halim** (Y2 DAI): active in 10.014 and 10.009; good for Python and data questions\n- **Wei Jian Lim** (Y3 ISTD): active in 10.009 and systems design; runs Sunday study crams\n\n**How to connect:** People → Year 2 or Year 3+ → click a card → Request intro. You can also post in the module room so everyone benefits from the answer.`,
    followUps: ['How do I use module rooms?', 'What events are running?', 'How does compatibility work?'],
  },
  {
    id: 'module-rooms',
    triggers: ['module room', 'qa room', 'class room', 'q&a', 'ask question', 'post question', 'classes tab', 'how to ask', 'question forum', 'cohortly classes'],
    response: `**Module rooms** are Q&A forums for each module — accessed via the **Classes tab**.\n\n**How they work:**\n- Select your module (10.014, 10.009, etc.)\n- Read existing threads — someone may have already asked your question\n- Post a new question: be specific (include error messages, what you've tried)\n- Classmates and returning students answer in shared threads so the answer helps everyone\n\n**Tips for getting fast answers:**\n- Post the actual error message, not just "it doesn't work"\n- Say what you've already tried\n- Post early in the day (not the night before the deadline)`,
    followUps: ['Who answers in the module rooms?', 'How do I post a question?', 'What is 10.014 like?'],
  },
  {
    id: 'events-feature',
    triggers: ['events', 'events tab', 'rsvp', 'create event', 'join event', 'event approval', 'campus events', 'sutd events', 'post event'],
    response: `The **Events tab** is where all campus happenings live.\n\n- **Browse and RSVP** to upcoming events — from study sessions to food crawls to sports\n- **Create your own event**: fill in the form and submit — it goes through admin approval before appearing in the feed\n- **Filter by type**: social, academic, sports, cultural, community\n\nReturning students and class groups post prep sessions here, like Aarav's 10.014 coding nights. Check it weekly — especially in Weeks 1–4 when most orientation events cluster.\n\n**Student-created events need approval** — so post at least 24h before you want it live.`,
    followUps: ['How do I create an event?', 'What events are coming up?', 'How do I connect with people at events?'],
  },
  {
    id: 'weekly-pulse',
    triggers: ['weekly pulse', 'belonging pulse', 'pulse', 'wellbeing check', 'weekly check', 'anonymous survey', 'pulse questions'],
    response: `The **Weekly Belonging Pulse** is a 10-second anonymous check-in — it shows up once a week in the app.\n\n6 questions on:\n- How much you feel you belong at SUTD\n- Academic confidence\n- Whether you have people to talk to\n- Energy levels\n- Comfort asking for help\n- Overall how the week went\n\nYour responses are **completely anonymous** and help SUTD's OSA identify where students might need more support — it feeds directly into the Isolation Risk system used by staff.\n\nIt takes 10 seconds. Worth doing.`,
    followUps: ['How does SUTD use my pulse data?', 'What is the Wellbeing Centre?', 'What is PDPA consent?'],
  },
  {
    id: 'knowledge-base',
    triggers: ['knowledge base', 'kb', 'articles', 'faq', 'help articles', 'how do i find info', 'information', 'guides'],
    response: `The **Knowledge Base** (in the nav bar) is a searchable library of articles on everything SUTD:\n\n- **Academics**: how modules work, grading, Canvas, pillar selection\n- **Campus Life & Housing**: move-in checklist, food guide, official housing guidance, privacy rules\n- **Admin & Registration**: student card, SUTD email, international student passes\n- **Fifth Row**: what it is, how to join\n- **Wellbeing**: mental health resources, managing workload\n- **Technology**: Python setup, dev environment guide\n\nEach article is short and actionable. If you can't find what you need there, ask me!`,
    followUps: ['What is the Launchpad?', 'How do I use module rooms?', 'What is Fifth Row?'],
  },
  {
    id: 'campus-life-feature',
    triggers: ['campus life', 'campus life tab', 'housing community', 'block community', 'hostel community', 'find first week people'],
    response: `**Campus Life** shows:\n\n- **First-week jios**: meal runs, study sessions, sports outings, and campus walks\n- **Broad communities**: Freshmore arrival, returning-student guides, commuter groups, and settling-in support\n- **Privacy-first matching**: no room numbers, no floor maps, no resident rosters, and no live occupancy\n\nOpen Campus Life when you want a plan or a low-pressure way to meet people before Week 1.`,
    followUps: ['How do jios work?', 'What food is nearby?', 'How do I meet people?'],
  },
  // ── Making Friends & Social ────────────────────────────────────────────────
  {
    id: 'making-friends',
    triggers: ['make friends', 'making friends', 'meet people', 'lonely', 'dont know anyone', 'no friends yet', 'how to meet', 'first week social', 'feel alone', 'social anxiety'],
    response: `It's completely normal to feel this way in Week 1 — everyone does, even if they don't show it.\n\n**Highest-ROI things you can do:**\n- **Say yes to everything in Week 0**: orientation events, jios, campus walks — even if you're tired\n- **Join one Campus Life plan**: a meal, study circle, or sports booking gives you a natural first group\n- **Join a module study group**: instant shared struggle, instant bond\n- **Attend a Fifth Row trial** you're even slightly curious about\n- **Use the Cohortly People tab**: send a connection request to 3 people in your modules — low pressure, high upside\n\nThe first 2 weeks set the social trajectory. Be a little uncomfortable — it pays off.`,
    followUps: ['What is Fifth Row?', 'How do I find a study group?', 'What is Campus Life?'],
  },
  {
    id: 'orientation-camp',
    triggers: ['orientation camp', 'orientation', 'camp', 'o week', 'week 0', 'freshmore camp', 'orientation activities', 'frosh'],
    response: `**Freshmore Orientation** runs during Week 0 (the week before classes start).\n\nWhat to expect:\n- **Orientation Camp**: 1–2 days of icebreakers, team activities, campus exploration — run by student leaders\n- **Admin setup sessions**: help desks for student card, email, Canvas\n- **Fifth Row Club Fair**: all 80+ clubs have booths — browse and sign up for trial mailing lists\n- **Campus tour**: returning students take you through all the buildings, labs, and hidden hangout spots\n- **Wellbeing briefing**: they'll tell you about all the support services\n\nGo to everything. It feels optional but it's actually your best window to meet people before the semester pressure starts.`,
    followUps: ['What is Fifth Row?', 'What should I set up in Week 1?', 'How do I meet people?'],
  },
  // ── About Cohortly ────────────────────────────────────────────────────────
  {
    id: 'about-cohortly',
    triggers: ['what is cohortly', 'about cohortly', 'how does cohortly work', 'cohortly features', 'what can cohortly do', 'explain cohortly', 'cohortly app'],
    response: `**Cohortly** is SUTD's verified student network — built for Freshmore belonging and connection.\n\n**What it does:**\n- **Launchpad**: guided checklist from pre-arrival to first-week readiness\n- **People**: find and connect with freshmen, returning students, and module mates\n- **Campus Life**: first-week jios, broad student communities, housing guidance, and settling-in support\n- **Events**: discover and join campus events, create your own\n- **Fifth Row**: browse and track interest in 80+ clubs\n- **Classes**: Q&A module rooms where classmates and returning students answer questions\n- **Knowledge Base**: searchable articles on everything SUTD\n- **Messages**: 1-on-1 and group threads\n- **Weekly Pulse**: anonymous wellbeing check-in\n- **Cohortly AI** (that's me!): ask anything, any time\n\nAll profiles are verified against SUTD email — so everyone you see is real.`,
    followUps: ['How do I use the Launchpad?', 'How do I connect with people?', 'What module rooms are available?'],
  },
  {
    id: 'about-sutd',
    triggers: ['what is sutd', 'about sutd', 'sutd overview', 'sutd university', 'sutd history', 'sutd ranking', 'sutd reputation', 'sutd mit', 'sutd unique'],
    response: `**SUTD (Singapore University of Technology and Design)** is one of Singapore's most distinctive universities.\n\n- Founded in **2012** in collaboration with **MIT and Zhejiang University**\n- ~1,000 undergrads per cohort — small and tight-knit\n- Mission: design thinking + engineering + technology, integrated\n- Strong industry connections and research — many faculty are MIT-trained\n- **Compulsory freshmore year** where everyone takes the same modules — builds a cohort identity\n- Campus at **8 Dover Road** (Dover MRT, Circle Line)\n- 5 undergraduate pillars: ASD, ESD, EPD, ISTD, DAI\n\nIt's not a big campus — which is a feature, not a bug. You'll know your professors by name.`,
    followUps: ['What are the 5 pillars?', 'What is the Freshmore year?', 'Where is SUTD?'],
  },
  // ── Healthcare ────────────────────────────────────────────────────────────
  {
    id: 'healthcare-clinic',
    triggers: ['clinic', 'sick', 'health centre', 'health center', 'medical', 'doctor', 'unwell', 'ill', 'fever', 'mc', 'medical certificate', 'sick leave', 'campus clinic', 'healthcare', 'polyclinic', 'medical leave', 'see a doctor'],
    response: `**When you're sick at SUTD:**\n\n- **Campus Health Centre** (Building 1, Level 1): general practitioner, Mon–Fri office hours. Subsidised for students. Bring your student card.\n- For serious issues or after hours: **Changi General Hospital (CGH) A&E** or the nearest **polyclinic** (Alexandra, Queenstown, or Buona Vista)\n- **Telemedicine**: Doctor Anywhere and MyDoc apps let you consult a GP online and get an e-MC\n\n**Getting an MC for class/lab:**\n- You need an MC from a registered clinic (not just rest at home) to be excused\n- Email your prof and the module coordinator on the same day — don't wait\n- Subject line: "Medical Excuse – [Module Code] – [Your Name/Student ID]"\n- Attach a scan/photo of the MC\n\nIf you feel too unwell to go to the clinic alone, tell your RA or a floor neighbour — they can accompany you.`,
    followUps: ['How do I email a professor?', 'What is the excused absence process?', 'Where is Building 1?'],
  },
  {
    id: 'excused-absence',
    triggers: ['excused absence', 'absent', 'miss class', 'miss lab', 'miss lecture', 'late submission', 'extension', 'deadline extension', 'missed deadline', 'skip class', 'attendance policy', 'medical excuse'],
    response: `**Missing a class or deadline at SUTD:**\n\n**Attendance**: SUTD takes attendance seriously, especially for labs and tutorials — typically 80% minimum attendance to pass.\n\n**If you're sick:**\n- Get an MC from a registered doctor or clinic\n- Email the professor and module coordinator **the same day** with your MC attached\n- Subject: "Medical Leave – [Module] – [Your Name]"\n\n**Deadline extensions:**\n- Email the professor **before** the deadline — most are reasonable if you ask early\n- Explain your situation briefly; attach evidence if relevant (MC, etc.)\n- Don't wait until after the deadline to ask — late requests are much less likely to be granted\n\n**Repeated absences**: More than 20% missed attendance can mean failing the module. Talk to OSA or the module coordinator early if you're struggling.`,
    followUps: ['How do I get an MC?', 'How do I email a professor?', 'What happens if I fail a module?'],
  },
  // ── Finance ───────────────────────────────────────────────────────────────
  {
    id: 'finance-fees',
    triggers: ['tuition fee', 'tuition fees', 'fees', 'how much is sutd', 'cost of sutd', 'bursary', 'scholarship', 'financial aid', 'moe bursary', 'moe tuition grant', 'tuition grant', 'sutd scholarship', 'financial assistance', 'school fees', 'study loan', 'cpf education', 'subsidised'],
    response: `**SUTD Tuition Fees and Financial Aid:**\n\n**Annual tuition (approximate, AY2026):**\n- Singapore Citizens: ~S$9,450/year after MOE Tuition Grant\n- Singapore PRs: ~S$13,150/year after MOE Tuition Grant\n- International students: ~S$28,850/year (with MOE grant); higher without\n\n**MOE Tuition Grant**: Most students take this — it subsidises fees heavily in exchange for working in Singapore for 3 years after graduation.\n\n**Scholarships:**\n- **SUTD Scholarship** (merit-based, full fees + allowance) — apply on admission\n- **SUTD-DSO, DSTA, MINDEF** scholarships — for specific career tracks\n- **Mendaki/CDAC/SINDA** bursaries for eligible students from respective community groups\n- **SUTD Financial Aid** — means-tested bursaries, apply via OSA each year\n\n**Study loan**: CPF Education Scheme or bank study loans available. Talk to Student Hub (Building 1 Level 2) for guidance on your specific situation.`,
    followUps: ['How do I apply for financial aid?', 'How do I open a bank account?', 'What is the cost of living in Singapore?'],
  },
  {
    id: 'bank-account',
    triggers: ['bank account', 'open bank account', 'dbs', 'posb', 'ocbc', 'uob', 'bank', 'banking', 'paynow', 'bank setup', 'transfer money', 'receive money'],
    response: `**Opening a bank account in Singapore:**\n\n**Recommended for students:**\n- **DBS/POSB Multiplier or Student Account**: most campus-friendly, largest ATM network, integrates with PayNow\n- **OCBC Frank Account**: no minimum balance, zero fees, good for students\n- **UOB One Account**: if you have specific perks needs\n\n**What you need to bring:**\n- NRIC (Singapore Citizens/PRs) or passport + Student's Pass card (international students must have the physical pass, not just the IPA letter)\n- SUTD student card for student account rates\n\n**International students**: Complete your **myICA Student's Pass registration** first — banks need the physical card, which takes 1–2 weeks to arrive.\n\n**PayNow**: Link your SingPass to your bank account for instant transfers by IC/mobile number — you'll need it for most peer-to-peer payments at SUTD.`,
    followUps: ['How do I set up Singpass?', 'International student admin?', 'What is the cost of living?'],
  },
  {
    id: 'cost-of-living',
    triggers: ['cost of living', 'how much money', 'monthly budget', 'living expenses', 'expensive', 'singapore expensive', 'pocket money', 'allowance', 'spending', 'how much to budget', 'money management'],
    response: `**Realistic monthly budget as a SUTD student:**\n\n- **Food**: S$300–500 (hawker centre meals ~S$4–7, campus canteen similar; Grab/delivery adds up fast)\n- **Transport**: S$80–120 (MRT + bus; get a concession EZ-Link card)\n- **Personal/toiletries**: S$50–80\n- **Entertainment/activities**: S$100–200\n- **Miscellaneous**: S$50–100\n\n**Total comfortable budget: ~S$600–900/month** on top of school fees and hostel\n\n**Money-saving tips:**\n- Hawker centres beat food courts and restaurants every time\n- Cook occasionally using the hostel kitchen (pasta, instant noodles upgraded)\n- Use the Student Concession Card for MRT/bus\n- Buy second-hand textbooks on Carousell or borrow from the library first\n- The campus gym is free with your student card`,
    followUps: ['How do I get an EZ-Link card?', 'What food is near campus?', 'Are there part-time jobs?'],
  },
  // ── Singapore Admin ───────────────────────────────────────────────────────
  {
    id: 'singpass',
    triggers: ['singpass', 'sing pass', 'myinfo', 'ndi', 'national digital identity', 'singpass app', 'singpass face', 'how to register singpass', 'set up singpass'],
    response: `**Singpass** is Singapore's national digital identity — you'll need it for almost everything: bank accounts, government forms, CPF, insurance, healthcare.\n\n**Singapore Citizens & PRs**: You already have a Singpass. Download the Singpass app → register with your NRIC → set up 2FA.\n\n**International students**: You get a Singpass once you have your Student's Pass card. Register at singpass.gov.sg or at a Singpass counter (nearest: ICA Building at Lavender MRT).\n\n**Why you need it at SUTD:**\n- Opening a DBS/OCBC bank account (online)\n- CPF contributions and financial transactions\n- Polyclinic subsidies at subsidised rates (with myHealth records)\n- Most government digital services\n\nSet it up in Week 1 — it's surprisingly fast once you have the right ID.`,
    followUps: ['How do I open a bank account?', 'International student admin?', 'What do I need to set up in Week 1?'],
  },
  {
    id: 'transport-singapore',
    triggers: ['mrt', 'ez-link', 'ez link', 'ezlink', 'bus', 'transport', 'concession card', 'getting around', 'train', 'singapore transport', 'transit', 'citymapper', 'simply go', 'simplygo', 'student concession', 'transit app', 'grab', 'public transport'],
    response: `**Getting around Singapore from SUTD:**\n\n**MRT from Dover station** (Circle Line, 5 min walk from campus):\n- City (Bras Basah/Dhoby Ghaut): ~20 min\n- Orchard: ~25 min\n- Changi Airport: ~50 min (via Tanah Merah)\n- Jurong East: ~15 min\n\n**Get an EZ-Link card** (at Dover MRT or 7-Eleven) — works for all MRT and buses. Top up at MRT gates or 7-Eleven.\n\n**Student Concession**: Register for a **Student Concession Card** through TransitLink — cuts MRT/bus fares by ~50%. Use your SUTD student card + your IC. Apply in Week 1 — takes a few days to activate.\n\n**Apps to use:**\n- **SimplyGo app**: track card balance, recent trips\n- **Google Maps or Citymapper**: best for transit navigation in Singapore\n\n**Grab**: Reliable for late nights or when buses are infrequent. Shared Grab is cheaper.`,
    followUps: ['How do I get to SUTD?', 'What is near campus?', 'How much does transport cost monthly?'],
  },
  {
    id: 'nearby-amenities',
    triggers: ['supermarket', 'grocery', 'groceries', 'atm', 'pharmacy', 'convenience store', 'ntuc', 'fairprice', 'giant', 'cold storage', 'guardian', 'watsons', 'nearby shops', 'shopping near sutd', 'minimart', '7 eleven', 'atm near'],
    response: `**Near-campus amenities:**\n\n**Groceries:**\n- **NTUC FairPrice**: Ghim Moh (15 min walk/short Grab), or Dover MRT area (Clementi Mall is 2 stops, Holland Village is 1 stop for Cold Storage)\n- **Sheng Siong**: Clementi (2 MRT stops) — cheapest for basics\n\n**Convenience stores on campus:**\n- **Cheers/7-Eleven**: inside campus near the Koufu block — snacks, drinks, basic toiletries, top-up EZ-Link\n\n**Pharmacy:**\n- **Guardian / Watsons**: Holland Village (1 MRT stop, Circle Line) or Clementi Mall\n- For urgent basics: Cheers on campus has Panadol and plasters\n\n**ATMs:**\n- DBS ATM: inside Koufu canteen block\n- OCBC/UOB: Dover MRT station\n\n**Post office / courier:**\n- SingPost: Queenstown (2 stops), or use Popstation lockers (many at Clementi)\n- Best nearby mall: **Clementi Mall** (2 MRT stops) — has food court, NTUC, Watsons, bookshop, cinema`,
    followUps: ['How do I get to Clementi Mall?', 'What food is near campus?', 'How do I receive packages at hostel?'],
  },
  {
    id: 'housing-laundry',
    triggers: ['laundry', 'washing machine', 'dryer', 'wash clothes', 'iron', 'ironing board', 'laundry room', 'laundry cost', 'laundry booking', 'how to wash clothes', 'laundry machine'],
    response: `**Hostel laundry at SUTD:**\n\n- **Machines per floor**: typically 2–3 washers and dryers per block floor\n- **Cost**: ~S$1.50–2.00 per wash, ~S$1.00–1.50 per dry cycle — pay via the campus laundry app or coins\n- **Booking**: use the **SUTD Housing app** to see which machines are free in real time — especially useful during peak hours\n- **Peak time**: Sunday 2–6 PM is the worst. Thursday/Friday mornings are nearly empty.\n- **Cycle time**: Wash is ~35–40 min, dry is ~45–50 min. Don't leave clothes in machines — others will move them.\n- **Ironing**: Ironing boards are in the laundry room. Bring your own iron (low-wattage, under 1000W allowed)\n- **Hang-drying**: Clothes racks are available on the balcony area of each floor. Don't hang outside windows — against the rules.`,
    followUps: ['What are hostel rules?', 'What should I pack for hostel?', 'What are nearby amenities?'],
  },
  {
    id: 'housing-packages',
    triggers: ['package', 'parcel', 'delivery', 'receive parcel', 'mail', 'courier', 'shopee', 'lazada', 'amazon', 'carousell', 'postal address', 'hostel address', 'where to receive package'],
    response: `**Receiving parcels and mail at SUTD hostel:**\n\n**Your hostel postal address:**\n8 Dover Road, [Block Number], Room [Room Number], Singapore 138682\n(e.g., "Block 1N, Room 04-12, 8 Dover Road, Singapore 138682")\n\n**How delivery works:**\n- Shopee/Lazada parcels: delivered to the **block mailroom or security counter** — you'll get an SMS or the delivery slip in your mailbox\n- For trackable couriers (DHL, FedEx, SingPost): check your tracking number; security desk holds oversized parcels\n- **Popstation lockers** at Clementi MRT (2 stops away) are great for Lazada/Shopee if you want control over pickup time\n\n**Mailbox**: Each room has a mailbox near the block lobby — check it weekly for letters from ICA, OSA, or banks.\n\n**Tip**: Set your default delivery address in Shopee/Lazada to the campus security address — they handle it well.`,
    followUps: ['What is the hostel address?', 'What nearby amenities are there?', 'What should I pack?'],
  },
  // ── Academic Processes ────────────────────────────────────────────────────
  {
    id: 'academic-calendar',
    triggers: ['academic calendar', 'term dates', 'term 1', 'term 2', 'term 3', 'semester dates', 'when does term start', 'when does school start', 'when is term break', 'school calendar', 'recess week', 'reading week', 'study week', 'exam period', 'vacation', 'term break', 'break week'],
    response: `**SUTD Academic Calendar (AY2026–27 Freshmore Year):**\n\n**Term 1** (approx. Sep – Nov 2026):\n- ~13 teaching weeks\n- **Recess Week**: Week 7 — a proper mid-term break, use it to catch up and rest\n- Continuous assessment throughout; final project/exam in weeks 12–13\n\n**Term Break 1** (approx. late Nov – early Jan 2027): ~6 weeks\n\n**Term 2** (approx. Jan – Apr 2027):\n- ~13 teaching weeks, Recess Week at midpoint\n- More lab-intensive; 10.009 2D project submission\n\n**Term Break 2** (approx. Apr – May 2027): ~5 weeks\n\n**Term 3** (approx. May – Aug 2027): ~13 weeks\n- This is when pillar electives begin to appear\n- Pillar selection process happens around end of Term 2 / start of Term 3\n\nCheck **Canvas announcements** and the SUTD Academic Calendar at sutd.edu.sg for exact dates each year — they shift slightly.`,
    followUps: ['What is Recess Week?', 'What should I do during term break?', 'What is pillar selection?'],
  },
  {
    id: 'fail-module',
    triggers: ['fail', 'failed', 'failing', 'fail module', 'failed module', 'retake', 'academic probation', 'academic warning', 'remediation', 'what if i fail', 'repeat module', 'consequence', 'flunk'],
    response: `**If you fail a module at SUTD:**\n\nFreshmore is Pass/Fail — so the bar is clear: you either pass or you don't, and it's based on attendance + continuous assessment + finals.\n\n**Consequences of failing:**\n- You may need to **retake the module** in the next available term — this can delay your pillar entry\n- Two failed modules in a term triggers an **academic review** with OSA and your faculty advisor\n- Continued poor performance leads to **academic probation** — official letter, reduced module load, mandatory check-ins\n\n**Before it gets to that:**\n- If you're struggling mid-term, talk to the **module coordinator or prof** early — they have seen it all and often have accommodations\n- Post in the **Cohortly module room** — returning students spot common misconceptions fast\n- **OSA student advisors** (Building 1) can help you make a recovery plan\n\nMost students who fail a module in Term 1 and get support do fine in Term 2.`,
    followUps: ['How does Pass/Fail grading work?', 'Where is OSA?', 'How do I manage workload?'],
  },
  {
    id: 'academic-integrity',
    triggers: ['plagiarism', 'academic integrity', 'cheat', 'cheating', 'copy', 'turnitin', 'academic dishonesty', 'AI assistance', 'ai writing', 'chatgpt allowed', 'collaboration policy', 'what counts as plagiarism', 'cite', 'citation'],
    response: `**Academic Integrity at SUTD:**\n\nSUTD takes this very seriously — violations can result in failing the module or suspension.\n\n**What counts as plagiarism:**\n- Copying code or text from another student (even "adapting" it heavily)\n- Submitting work from online sources without citation\n- Sharing your solution with another student (even if you didn't copy — giving access is also a violation)\n\n**AI assistance (ChatGPT, Copilot, etc.):**\n- Rules vary by module — some allow AI for ideation but not code/writing; some ban it entirely\n- **Always check the module policy on Canvas** before using any AI tool\n- If unsure, ask your professor — they appreciate the question more than the assumption\n\n**Collaboration:**\n- Study groups are encouraged — discussing concepts is fine\n- But each person's submitted work must be independently written\n\n**If you're caught**: the process goes through the Academic Integrity Committee. The safest question is: "Did I produce this myself?" If no, cite it or ask your prof.`,
    followUps: ['What happens if I fail a module?', 'How do I ask a professor about policy?', 'How do I email a professor?'],
  },
  {
    id: 'email-prof',
    triggers: ['email professor', 'email prof', 'how to email', 'email tutor', 'email teacher', 'email instructor', 'contact professor', 'professional email', 'email etiquette', 'prof contact', 'office hours'],
    response: `**How to email a professor at SUTD:**\n\nProfessors get a lot of email. This format gets responses:\n\n**Subject**: [Module Code] – Brief topic (e.g., "10.014 – Question on Lab 3 submission format")\n\n**Opening**: "Dear Prof [Last Name]," (use Prof, not Dr., unless you know their preference)\n\n**Body** (keep it short):\n- State the context in one line: "I'm a Term 1 student in your 10.014 class."\n- Ask your specific question. Say what you've already tried.\n- Don't pad it with apologies — just be clear and direct\n\n**Closing**: "Thank you, [Your Full Name] (Student ID: XXXXXXX)"\n\n**Office hours**: Almost always more effective than email for technical questions. Check Canvas for the schedule — show up with a written-down question.\n\n**Response time**: 24–48h is typical. For urgent matters (MC submission deadline), call the department office.`,
    followUps: ['How do I ask for a deadline extension?', 'What are office hours?', 'What is Canvas?'],
  },
  {
    id: 'part-time-jobs',
    triggers: ['part time job', 'part-time job', 'work while studying', 'earn money', 'student job', 'tutor', 'freelance', 'campus job', 'TA', 'teaching assistant', 'paid internship', 'work permit student', 'can i work', 'side income'],
    response: `**Working part-time while studying at SUTD:**\n\n**Singapore Citizens & PRs**: No restrictions — you can work up to whatever hours you can manage. Most students do at most 10–15h/week to avoid burning out.\n\n**International students**: Your Student's Pass allows up to **16 hours of part-time work per week** during term. Full-time during official vacation periods. Check your pass type — some have restrictions.\n\n**Popular options for SUTD students:**\n- **Teaching Assistant (TA)**: paid by the module — apply through the module coordinator in Year 2+\n- **Tuition**: strong demand for A-Level and O-Level Maths/Science tutors (S$25–50/h)\n- **Campus research assistant**: professors post RA positions on Canvas and department boards\n- **iCube startups**: some student-founded startups hire campus students for part-time roles\n\n**Don't work too much in Freshmore year**: Term 1 is intense. Pick up work from Term 2 onwards when you know your pace.`,
    followUps: ['What is iCube?', 'When can I do internships?', 'How much does living cost?'],
  },
  {
    id: 'ns-national-service',
    triggers: ['ns', 'national service', 'nsman', 'reservist', 'in-camp training', 'disrupted studies', 'ns exemption', 'ns deferment', 'mindef', 'operationally ready', 'ord', 'pre-enlistee'],
    response: `**National Service (NS) and SUTD studies:**\n\n**Pre-enlistees (not yet done NS)**: Singapore male citizens who got a SAF/SPF/SCDF offer and deferred — your deferment letter should already be sorted before matriculation. If unsure, contact CMPB and copy OSA.\n\n**NS-men (operationally ready)**: You may be called for **In-Camp Training (ICT)** during term. Do this:\n1. Notify your prof and module coordinator as soon as you get the order\n2. Email with your NS call-up letter attached\n3. OSA has a standard process for NS-related absences — visit Student Hub for a form\n\n**MINDEF/Scholarship holders**: If you're on a MINDEF scholarship, your bonding and work arrangements are already structured — your scholarship manager handles this.\n\n**SUTD's policy**: NS obligations are recognised and accommodated. Don't skip modules or hide it — profs are understanding if you communicate early.`,
    followUps: ['How do I email a professor?', 'What is the excused absence process?', 'Where is Student Hub?'],
  },
  // ── IT & Tech ─────────────────────────────────────────────────────────────
  {
    id: 'it-services',
    triggers: ['vpn', 'microsoft 365', 'office 365', 'teams', 'onedrive', 'matlab', 'adobe cc', 'adobe creative cloud', 'software license', 'free software', 'sutd software', 'sutd vpn', 'it helpdesk', 'wifi password', 'eduroam setup', 'it support'],
    response: `**Free software and IT services for SUTD students:**\n\n**Microsoft 365** (free): Outlook, Word, Excel, PowerPoint, Teams, OneDrive 1TB — activate with your SUTD email at office.com\n\n**MATLAB**: Licensed for SUTD students — download from IT portal (needed for 10.002 and some Year 2 modules)\n\n**Adobe Creative Cloud**: Full suite free for enrolled students — register at adobe.com/education with your SUTD email. Includes Photoshop, Illustrator, Premiere, InDesign, Figma alternative (XD)\n\n**SUTD VPN**: Required to access some library resources and internal portals from off-campus. Download Palo Alto GlobalProtect from the SUTD IT portal.\n\n**eduroam WiFi**: Use your SUTD email credentials (username: full email, password: your student account password). Works at universities worldwide — handy if you go on exchange.\n\n**IT Help Desk**: Building 1 Level 1, or email ithelp@sutd.edu.sg. Response within 1 business day usually.`,
    followUps: ['How do I set up my SUTD email?', 'What is the SUTD VPN for?', 'How do I connect to eduroam?'],
  },
  // ── Campus Buildings ──────────────────────────────────────────────────────
  {
    id: 'campus-buildings',
    triggers: ['building map', 'campus map', 'where is building', 'building 1', 'building 2', 'building 3', 'building 4', 'building 5', 'building 6', 'building 8', 'campus layout', 'find building', 'navigate campus', 'where is'],
    response: `**SUTD Campus Buildings Guide:**\n\n- **Building 1 (Academics)**: Lecture theatres LT1–LT4, Student Hub (Level 2), Campus Clinic (Level 1), IT Helpdesk (Level 1), OSA office\n- **Building 2 (Design)**: FabLab, design studios, architecture workshops, 24h with student card\n- **Building 3**: Seminar rooms, tutorial rooms, ASD design studios\n- **Building 4**: Classrooms, research labs, staff offices\n- **Building 5 (Learning Hub)**: Library (24h), computer labs, study rooms, Level 3 hangout area, Level 3 quiet zone\n- **Building 6**: Engineering labs (EPD, ESD), machine shop, advanced manufacturing\n- **Building 8**: Sports Complex — gym, courts, 25m pool, changing rooms\n- **Block 54**: Wellbeing Centre (Level 2), student activity rooms\n- **Hostel Blocks**: 1N, 1S (Freshmore), 2N, 2S (upper years)\n\nAll buildings connect via covered walkways — you rarely need to go outside. Campus is compact — end to end is about 10 minutes on foot.`,
    followUps: ['Where is the FabLab?', 'Where is the library?', 'Where is the Wellbeing Centre?'],
  },
  // ── Muslim & Dietary Needs ────────────────────────────────────────────────
  {
    id: 'muslim-halal',
    triggers: ['halal', 'prayer room', 'surau', 'muslim', 'prayer', 'solat', 'friday prayer', 'jumaat', 'vegetarian', 'vegan', 'dietary', 'no pork', 'kosher', 'hindu vegetarian', 'food allergy'],
    response: `**Halal food and Muslim student needs at SUTD:**\n\n**Prayer room (Surau)**: Building 1, Level 3 — open daily. Separate sections for male and female. There's also a wudu' (ablution) area nearby.\n\n**Halal food on campus:**\n- **Koufu at 1N**: has halal-certified stalls — look for the halal certification logo\n- **Campus Bistro**: some stalls are halal-certified; check the notice board\n- **PGP Canteen** (10 min walk): mostly halal options\n\n**Friday prayers**: Dover MRT area has mosques — **Masjid Muttaqin** (near Clementi) is closest, or head to **Masjid Sultan** if you're in town. SUTD usually has no Friday afternoon lectures to accommodate this.\n\n**Muslim Students' Association**: Active Fifth Row club — check the Fifth Row tab for events and Ramadan iftars.\n\n**Vegetarian/vegan**: Koufu has vegetarian stalls; the Ghim Moh hawker centre has dedicated vegetarian options. More variety at Holland Village (1 MRT stop).`,
    followUps: ['What food is near campus?', 'Where is Building 1?', 'What Fifth Row clubs exist?'],
  },
  // ── Student Government ────────────────────────────────────────────────────
  {
    id: 'student-government',
    triggers: ['sga', 'student government', 'student association', 'student council', 'student union', 'student rep', 'student body', 'sutd student association', 'ssa', 'student representative'],
    response: `**SUTD Student Government Association (SGA):**\n\nThe SGA is the main student representative body at SUTD — they advocate for student interests with the administration and organise campus-wide events.\n\n**What SGA does:**\n- Represents students at faculty and senate meetings\n- Organises orientation, rag & flag, and campus-wide events\n- Coordinates with Fifth Row clubs\n- Manages student welfare funds and subsidies for club events\n\n**How to get involved:**\n- Run for SGA elections (usually Year 2 onwards)\n- Volunteer for SGA-run events during Freshmore year — good way to get experience and connections\n- Check the SUTD SGA page on Instagram or Canvas announcements for positions opening up\n\nJoining SGA is especially valuable if you want student leadership experience on your resume — it's taken seriously by SUTD's admin.`,
    followUps: ['What is Fifth Row?', 'How do I make friends?', 'What is the orientation camp?'],
  },
  // ── Career & Internships ──────────────────────────────────────────────────
  {
    id: 'internships',
    triggers: ['internship', 'intern', 'job', 'career', 'work experience', 'co-op', 'industry', 'summer internship', 'when can i intern', 'oip', 'office of industry', 'career services', 'job fair', 'linkedin', 'resume', 'cv'],
    response: `**Internships and career at SUTD:**\n\n**When can you intern:**\n- **First real internship opportunity: Summer after Year 1 (May–Aug 2027)** — term break is long enough for a 2–3 month stint\n- **Structured internship (mandatory for most pillars)**: typically Year 3, built into the academic calendar\n\n**SUTD Career Services (OIP — Office of Industry Programs):**\n- Located in Building 1 — runs job fairs, company talks, mock interviews\n- **SUTD Internship Fair**: usually October and March — major tech companies, consulting firms, local companies all attend\n- Career portal: careers.sutd.edu.sg (log in with your SUTD credentials)\n\n**For Freshmores — build now:**\n- Strengthen Python via 10.014\n- Start a GitHub portfolio with your lab projects\n- Join the Entrepreneurship Society for startup exposure\n- Talk to returning students about their internship experiences via People tab\n\n**iCube (SUTD's startup incubator)** at Building 2 sometimes takes student interns — check their board.`,
    followUps: ['What is iCube?', 'How do I build a portfolio?', 'How do I use the SUTD email for GitHub?'],
  },
  {
    id: 'icube',
    triggers: ['icube', 'i-cube', 'startup', 'startup incubator', 'entrepreneur', 'startup ecosystem', 'venture', 'business idea', 'found a startup', 'student startup'],
    response: `**iCube — SUTD's Startup Incubator (Building 2, Level 3):**\n\niCube is SUTD's entrepreneurship incubator, one of the most active student-startup ecosystems in Singapore.\n\n**What iCube offers:**\n- Office space, meeting rooms, and resources for student-founded startups\n- Mentorship from entrepreneurs-in-residence and investors\n- Access to SUTD's industry network\n- Seed funding opportunities and connections to VC firms\n\n**How Freshmores can engage:**\n- **Entrepreneurship Society** (Fifth Row, Community cluster) has direct iCube connections — the most direct entry point\n- **SUTD Hackathons**: often co-organised with iCube — check Events tab. Great for team-building and rapid prototyping\n- **iCube open days**: drop-in afternoons where anyone can tour and meet current startup teams\n\nMany successful SUTD-linked startups (in fintech, biotech, deep tech) came out of iCube. It's taken seriously.`,
    followUps: ['What is the Entrepreneurship Society?', 'How do I join Fifth Row?', 'What are internship options?'],
  },
  {
    id: 'sep-exchange',
    triggers: ['exchange program', 'exchange programme', 'sep', 'study abroad', 'partner university', 'overseas study', 'student exchange', 'exchange year', 'ntu exchange', 'nus exchange', 'mit exchange', 'overseas university'],
    response: `**Student Exchange Programme (SEP) at SUTD:**\n\nSUTD has exchange partnerships with 70+ universities worldwide — MIT, ETH Zürich, TU Delft, NUS, NTU, and many more.\n\n**When you can go:**\n- Typically **Year 3 Term 1 or 2** — after pillar selection and core module completion\n- Duration: 1 semester (13–14 weeks)\n\n**How to apply:**\n- Applications open in **Year 2 Term 2** via the OSA Global Programmes office\n- GPA requirement: typically 3.0/4.0+ (letter grade GPA from Year 2 onwards)\n- Need a **Statement of Purpose** and faculty recommendation\n\n**What to expect:**\n- You take equivalent modules at the host university that map back to SUTD electives\n- Accommodation is arranged through the host university (usually in their dorms)\n- Cost is roughly similar to studying at SUTD (some are cheaper, some more expensive)\n\nStart researching in Year 1 — talk to returning students who've been on exchange via the People tab.`,
    followUps: ['When do letter grades start?', 'What is pillar selection?', 'What is Year 2 like?'],
  },
  {
    id: 'urop',
    triggers: ['urop', 'research', 'undergraduate research', 'research opportunity', 'lab research', 'research assistant', 'professor research', 'research project', 'work with prof'],
    response: `**UROP — Undergraduate Research Opportunities Programme:**\n\nSUTD's UROP lets you work on real research projects alongside faculty. Paid (~S$10–15/h), credit-bearing, or both.\n\n**When to start:**\n- Can start as early as **Term 2 Year 1** but most begin in **Year 2**\n- Year 1 Terms 1–2 are typically too full to take on research work comfortably\n\n**How to get in:**\n1. Browse **SUTD Research** page for open positions, or email professors whose work interests you directly\n2. Prepare a brief email: your name, year, modules taken, why you're interested in their specific project, and 2–3 lines on relevant skills\n3. Some UROP positions are posted on Canvas — check department boards\n\n**What it leads to:**\n- Co-authorship on publications for significant contributions\n- PhD recommendation letters (if relevant)\n- Strong internship talking points — industry values research experience at SUTD specifically\n\nFor ISTD/DAI students: ML and data research projects are often open to students with strong 10.014 foundations.`,
    followUps: ['How do I email a professor?', 'What is iCube?', 'What is ISTD pillar?'],
  },
  // ── Teaching Style ────────────────────────────────────────────────────────
  {
    id: 'teaching-style',
    triggers: ['teaching style', 'how does sutd teach', 'project based', 'flipped classroom', 'design thinking', 'cohort learning', 'sutd pedagogy', 'hands on', 'different from jc', 'different from poly', 'no lectures', 'problem based'],
    response: `**SUTD's teaching approach is genuinely different:**\n\n**Flipped classroom**: Lecture content is often pre-recorded or in readings — class time is used for discussion, problem solving, and working through concepts together. Skim the materials before class.\n\n**Project-based learning**: Almost every module has a significant project component. You'll build and make things, not just do problem sets. The 10.009 2D project is the centrepiece of Freshmore year.\n\n**Design thinking**: SUTD embeds design process into technical modules — framing problems, ideating solutions, prototyping, testing. It feels unusual at first if you come from a pure JC/poly exam-focused environment.\n\n**Cohort identity**: Your Freshmore cohort takes the same 5 modules — this shared struggle is intentional. It builds community.\n\n**What this means for you:**\n- Engage during class — participation is often graded\n- Start projects early — last-minute rushing doesn't work when physical prototypes are involved\n- Office hours and module room Q&A are how the top students get better, not private mugging`,
    followUps: ['What is the 2D project?', 'What are the Freshmore modules?', 'How do I manage my workload?'],
  },
  // ── Year 2 / Post-Freshmore ───────────────────────────────────────────────
  {
    id: 'year2-onwards',
    triggers: ['year 2', 'year2', 'after freshmore', 'post freshmore', 'what happens after year 1', 'sophomore', 'second year', 'upper years', 'year 3', 'year 4', 'graduation', 'capstone', 'graduation requirements'],
    response: `**What comes after Freshmore Year:**\n\n**Year 2 (Term 4–6)**: You've chosen your pillar. Now you take pillar-specific core modules alongside some cross-disciplinary electives. GPA counts from here.\n\n**Year 3 (Term 7–9)**: Pillar deepening, UROP option, and usually the **structured internship** (built into the academic calendar — 6 months for most pillars).\n\n**Year 4 (Term 10–12)**: **Capstone project** — your major final-year design/engineering project, often done with an industry partner. Plus electives, final modules, and preparation for graduation.\n\n**Graduation requirements** (approximate):\n- Complete all core pillar modules\n- Minimum number of credit hours including electives\n- Complete the mandatory internship\n- Pass all graduation requirements and maintain satisfactory GPA\n\n**The fast version**: Freshmore is the foundation; Year 2+ is where you specialise and build your career trajectory. The pillar you choose at the end of Year 1 matters, but it doesn't lock your career — SUTD grads work across industries regardless of pillar.`,
    followUps: ['What is pillar selection?', 'What are SUTD scholarships?', 'What are internship options?'],
  },
  // ── Makers / Culture Clubs (more) ─────────────────────────────────────────
  {
    id: 'makers-clubs',
    triggers: ['robotics', 'motorsports', 'makers club', 'makers cluster', 'engineering club', 'sutd motorsports', 'cadt', 'coding club', 'hackathon club', 'maker', 'lego robotics', 'autonomous vehicle'],
    response: `**Makers cluster — building and engineering clubs:**\n\n- **FabLab Community**: Drop-in, 3D printing, laser cutting, electronics. Best first stop for any Freshmore — open 24h.\n- **SUTD Motorsports**: Design and race an electric go-kart. Competitive but beginner-friendly — they train you on the manufacturing. High commitment.\n- **Robotics Club**: Autonomous robots, competitive robotics (RoboCon), embedded systems. Good if you're into hardware+software.\n- **SUTD Hackers (Hackathon Club)**: Organises and participates in hackathons locally and internationally. Mixed skill levels.\n- **CADT (Computing and Data Team)**: Competitive data science and ML competitions (Kaggle etc.) — popular among ISTD/DAI students\n\nAll Makers clubs have strong links to the FabLab and iCube. If you want to build things and work with your hands and code simultaneously, this is your cluster.`,
    followUps: ['What is the FabLab?', 'What is Fifth Row?', 'What is iCube?'],
  },
  {
    id: 'culture-clubs',
    triggers: ['culture cluster', 'dsia', 'design society', 'culture club', 'tea culture', 'cultural club', 'games club', 'sutd games', 'tabletop', 'culture fifth row'],
    response: `**Culture cluster Fifth Row clubs:**\n\n- **DSIA (Design & Society in Action)**: SUTD's design research and activism club. Runs talks, workshops, and social design projects. One of SUTD's most intellectually distinctive clubs — discussions on how technology shapes society.\n- **Makerculture**: Zine-making, DIY crafts, screen printing — creative making without the engineering focus\n- **Tabletop and Games Club**: Weekly board game sessions, RPG campaigns. Very low commitment, great for unwinding.\n- **Tea Club**: Singapore tea culture, tastings, and sessions. Genuinely chill.\n\nCulture clubs are lighter on commitment than Sports or Arts but great for meeting people across pillars and years. DSIA in particular has strong alumni and industry connections in the design world.`,
    followUps: ['What other Fifth Row clubs exist?', 'How do I join a club?', 'What is Fifth Row?'],
  },
  // ── Weekend & Singapore Life ───────────────────────────────────────────────
  {
    id: 'weekend-activities',
    triggers: ['weekend', 'what to do in singapore', 'things to do', 'explore singapore', 'day trip', 'johor bahru', 'jb', 'malaysia', 'sentosa', 'universal studios', 'botanic gardens', 'orchard', 'night safari', 'free things to do', 'singapore attractions', 'off campus'],
    response: `**Things to do on weekends from SUTD:**\n\n**Free or cheap:**\n- **Gardens by the Bay**: 20 min MRT, free outdoor garden (paid for the conservatories)\n- **MacRitchie Reservoir**: 25 min MRT + bus, hiking trails, free\n- **East Coast Park**: cycling, beach, food. Rent a bike from Mobike.\n- **Chinatown, Little India, Arab Street**: food, culture, cheap eats\n- **National Museum**: free on Fridays after 6 PM\n\n**Worth spending on:**\n- **Universal Studios Singapore**: Sentosa, 30 min from campus\n- **Hawker Centre crawl**: Lau Pa Sat, Tiong Bahru, Maxwell — Singapore's best cheap food\n\n**JB (Johor Bahru, Malaysia):**\n- 1h bus from Queen Street or Kranji MRT — get your passport!\n- Food and shopping much cheaper than Singapore\n- Popular SUTD student weekend trip; go in groups\n\n**Student discount tip**: Many attractions have student discounts with your SUTD card.`,
    followUps: ['How do I get around Singapore?', 'What is the cost of living?', 'How do I meet people for day trips?'],
  },
  {
    id: 'term-break',
    triggers: ['term break', 'holiday break', 'school holiday', 'vacation', 'what to do during break', 'between terms', 'recess week plans', 'break plans', 'travel during break', 'internship during break'],
    response: `**What SUTD students do during term breaks:**\n\n**Term Break 1 (~6 weeks, Nov–Jan):**\n- Internships — many companies run winter internships\n- Overseas trips — popular to explore SEA (Bali, Bangkok, Vietnam) in groups of friends\n- Part-time work to earn money\n- Rest — genuinely, the best thing you can do before Term 2\n- SUTD Short Courses or workshops — some departments run optional enrichment\n\n**Recess Week (mid-semester, 1 week):**\n- This is NOT a holiday — it's a breather week to catch up, not fall further behind\n- Use it for: group project work, past-year papers, sleep, and one social outing\n- Don't waste all of it and don't grind all of it — balance\n\n**Term Break 2 (~5 weeks, Apr–May):**\n- Summer internship season starts here (Year 1 onwards)\n- Some students go on overseas programmes (MIT, Zhejiang) — check Canvas announcements in Term 2\n\n**Hostel during break**: The hostel is still open during term breaks (no checkout needed for most breaks). Confirm with Housing each time.`,
    followUps: ['What are internship options?', 'What are SEP exchange programmes?', 'What weekend activities are near SUTD?'],
  },
  // ── Lab Safety & Access ────────────────────────────────────────────────────
  {
    id: 'lab-safety',
    triggers: ['lab safety', 'lab induction', 'safety briefing', 'safety training', 'lab access', 'lab rules', 'ehs', 'environment health safety', 'fablab induction', 'lab accident', 'how to use lab', 'safety shoes', 'ppe'],
    response: `**Lab safety at SUTD:**\n\n**Mandatory inductions** before you can use equipment:\n- **FabLab induction**: 1.5h session covering 3D printers, laser cutters, and basic tools. Book via the FabLab portal or just show up during a drop-in session. Must complete before touching machines.\n- **Engineering workshop**: Additional induction for power tools, lathe, metal work — required before EPD-type projects\n- **Chemistry/biology labs**: Specific EHS briefings run by the module coordinator\n\n**General rules:**\n- Closed-toe shoes required in all labs (no flip-flops — they will turn you away)\n- Safety glasses when working with anything that chips, sparks, or sprays\n- Never work alone with dangerous equipment — bring a buddy\n- First aid kits are marked in every lab. SUTD Security (6303-6002) for emergencies.\n\n**FabLab-specific:** Don't run jobs unsupervised if you're new. The first few times, ask a FabLab staff member or a returning Makers club student to guide you.`,
    followUps: ['Where is the FabLab?', 'How do I join the FabLab club?', 'What are the campus buildings?'],
  },
  // ── Chitchat ─────────────────────────────────────────────────────────────
  {
    id: 'chitchat-thanks',
    triggers: ['thank you', 'thanks', 'thank u', 'tq', 'ty', 'thx', 'appreciate it', 'helpful', 'that helps'],
    response: `Anytime! That's what I'm here for.\n\nIf you think of anything else — modules, hostel, social stuff, admin — just ask. Good luck with your Freshmore journey.`,
    followUps: ['What is the Launchpad?', 'How do I find returning students?', 'What is Fifth Row?'],
  },
  {
    id: 'chitchat-greeting',
    triggers: ['hello', 'hi', 'hey', 'hiya', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    response: `Hey! Welcome to Cohortly AI — I know everything about SUTD and this app.\n\nWhat can I help you with? You can ask about modules, campus life, housing guidance, clubs, returning students, admin setup, or anything else about starting at SUTD.`,
    followUps: ['Tell me about 10.014', 'What should I pack for move-in?', 'What is Fifth Row?', 'How does Pass/Fail work?'],
  },
  {
    id: 'chitchat-how-are-you',
    triggers: ['how are you', 'how are u', 'you ok', 'are you real', 'are you an ai', 'who made you', 'what are you'],
    response: `I'm Cohortly AI — built right into this app to help SUTD Freshmores navigate university life. No external API, no data leaving your campus network.\n\nI know the SUTD curriculum, campus life, official housing guidance, admin processes, Fifth Row clubs, Cohortly features, wellbeing resources, and more. What do you want to know?`,
    followUps: ['What is Cohortly?', 'What modules will I take?', 'What is Fifth Row?'],
  },
  {
    id: 'laptop-recommendations',
    triggers: ['laptop', 'which laptop', 'macbook', 'buy laptop', 'best laptop', 'laptop for sutd', 'laptop recommendation', 'mac or windows', 'computer recommendation', 'laptop specs', 'ram for sutd', 'laptop storage'],
    response: `**Laptop recommendations for SUTD:**\n\n**Most popular:**\n- **MacBook Air M2/M3**: Best battery, runs Python/Jupyter fast, lightweight. ~S$1,500–2,200\n- **MacBook Pro M3**: For heavy simulations. ~S$2,500+\n- **Dell XPS** or **ASUS Zenbook**: Good Windows alternatives. ~S$1,200–2,000\n- **Lenovo ThinkPad X1 Carbon**: Reliable Windows, excellent keyboard. ~S$1,800–2,200\n\n**Minimum specs**: 16GB RAM, 256GB SSD (512GB preferred)\n\n**Tip**: Buy from Apple Education Store or Challenger/Courts with student ID for discounts (~S$100–200 off). Get a USB-C hub — you'll need HDMI + USB-A for presentations.`,
    followUps: ['What free software do I get at SUTD?', 'How do I set up Python?'],
  },
  {
    id: 'hass-electives',
    triggers: ['hass', 'humanities', 'arts social sciences', 'hass elective', 'elective module', 'free elective', 'hass module', 'language module', 'japanese', 'mandarin', 'french', 'german', 'hass requirement', 'optional module'],
    response: `**HASS — Humanities, Arts & Social Sciences at SUTD:**\n\n**Types of electives:**\n- Language modules: Japanese, Mandarin, French, German, Korean — fill up fast, register early\n- Writing & Communication: Technical writing, presentation skills — directly useful for job applications\n- Social sciences: Economics, Psychology, Sociology\n- Philosophy & Ethics: Technology ethics, design ethics\n- Arts: Visual communication, design history\n\n**Requirement**: Usually 2–3 HASS modules per year across your degree. Check your pillar's graduation audit on the Registrar's portal.`,
    followUps: ['What are the graduation requirements?', 'How do I register for modules?'],
  },
  {
    id: 'gpa-calculation',
    triggers: ['gpa calculation', 'how is gpa calculated', 'grade points', 'cumulative gpa', 'cgpa', 'gpa formula', 'grade scale', 'gpa for scholarship', 'minimum gpa', 'low gpa', 'improve gpa', '4.0 scale', '5.0 scale'],
    response: `**GPA at SUTD (Year 2 onwards, 5.0 scale):**\n\n- A+ / A: 5.0 points\n- A-: 4.5 | B+: 4.0 | B: 3.5 | B-: 3.0\n- C+: 2.5 | C: 2.0 | D+: 1.5 | D: 1.0 | F: 0.0\n\n**Benchmarks:**\n- 4.0+: Dean's List consideration, scholarship eligibility\n- 3.5+: Strong — competitive internships and exchange applications\n- 3.0+: SEP exchange minimum\n- Below 2.0: Academic probation risk\n\n**Freshmore (Year 1) is Pass/Fail — does NOT count toward CGPA.**`,
    followUps: ['What is Pass/Fail grading?', 'How do I apply for exchange?'],
  },
  {
    id: 'leave-of-absence',
    triggers: ['leave of absence', 'LOA', 'take a break', 'defer studies', 'gap year', 'pause studies', 'take semester off', 'medical leave', 'withdrawal', 'withdraw from sutd', 'transfer university', 'leave sutd', 'suspend studies'],
    response: `**Leave of Absence (LOA) at SUTD:**\n\n**Medical LOA**: Supported by medical documentation. Your place is held.\n\n**Personal LOA**: Case-by-case. Talk to OSA (Building 1, Level 2) first.\n\n**How to apply:**\n1. Meet with OSA\n2. Submit LOA application with supporting documentation\n3. Faculty advisor endorsement usually required\n\n**Important**: Scholarship conditions vary — check before applying. International students: LOA may affect your Student's Pass.\n\n**Withdrawal**: Always try LOA or reduced load first. If you're considering withdrawal, please talk to the Wellbeing Centre first.`,
    followUps: ['Where is the Wellbeing Centre?', 'What is OSA?'],
  },
  {
    id: 'module-waiver',
    triggers: ['module waiver', 'module exemption', 'advanced standing', 'polytechnic diploma', 'poly diploma', 'credit transfer', 'exempt module', 'waive module', 'diploma holder', 'skip module', 'bypass module', 'transfer credit'],
    response: `**Module waivers / advanced standing at SUTD:**\n\nStudents with poly diplomas, ITE certs, or A-Level distinctions can apply for waivers on certain modules — mainly HASS electives or some foundational modules.\n\n**Core Freshmore technical modules (10.001–10.014) are generally NOT waivable** — SUTD's versions are taught differently and the cohort experience is intentional.\n\n**How to apply**: Email the module coordinator or faculty advisor with your transcript/certificate. May need a placement test. Apply before or in Week 1 of the module.\n\n**Contact**: Registrar's Office (Building 1) for assessment.`,
    followUps: ['What are the Freshmore modules?', 'What is HASS?'],
  },
  {
    id: 'academic-appeal',
    triggers: ['appeal grade', 'grade appeal', 'contest grade', 'dispute grade', 'wrong grade', 'unfair grade', 're-marking', 're-grade', 'appeal exam', 'appeal assignment', 'academic appeal'],
    response: `**Appealing a grade at SUTD:**\n\n**Step 1**: Talk to the prof first (always). Email or visit office hours: "Could I understand how my submission was assessed?"\n\n**Step 2 — Formal appeal** (if unresolved):\n- Submit a Grade Appeal form to the module coordinator within **2 weeks of grade release**\n- Clearly cite the marking error or rubric misapplication\n- "I worked hard" is not valid grounds — you need a demonstrable error\n\n**Step 3**: Escalate to pillar head or Academic Appeals Committee if still unresolved.\n\n**Timeline**: 2–4 weeks for formal appeals.`,
    followUps: ['How do I email a professor?', 'What happens if I fail a module?'],
  },
  {
    id: 'housing-room-guidance',
    triggers: ['hostel room size', 'room facilities', 'what is in my room', 'air conditioning', 'aircon hostel', 'ac hostel', 'hostel bed size', 'room amenities', 'hot water', 'shower hostel', 'how big is the room', 'bathroom shared', 'en suite'],
    response: `For exact room dimensions, furnishing, air-conditioning, bathroom, and maintenance details, use official SUTD Housing guidance or your assignment email. Cohortly intentionally does not maintain a room database.\n\nWhat Cohortly can help with:\n- Move-in checklist and packing reminders\n- Campus Life jios so you can meet people early\n- Returning-student tips on what to bring\n- Private support if settling in feels difficult`,
    followUps: ['What should I pack?', 'What are hostel rules?', 'How does laundry work?'],
  },
  {
    id: 'housing-room-change',
    triggers: ['room change', 'change room', 'swap room', 'different room', 'hostel room issue', 'room problem', 'hostel maintenance', 'aircon not working', 'repair hostel', 'pest', 'bedbugs', 'cockroach', 'ants hostel'],
    response: `**Hostel room changes and maintenance:**\n\n**Room change**: Submit via the SUTD Housing portal or walk to the Housing office (Building 1). Changes are subject to availability — valid reasons (noise, health, defects) are required.\n\n**Maintenance**: Log via the campus e-Service portal or email housing@sutd.edu.sg with a photo. Response: 1–3 days for non-urgent; same day for AC or water issues.\n\n**Pests**: Report to Housing immediately — pest control arrives within 24–48h. Don't handle it yourself.`,
    followUps: ['Who is my RA?', 'What are hostel rules?'],
  },
  {
    id: 'housing-smoking-alcohol',
    triggers: ['smoking', 'cigarette', 'vape', 'where to smoke', 'smoking area', 'can i smoke', 'alcohol hostel', 'drinking hostel', 'can i drink', 'alcohol rules', 'alcohol on campus', 'drugs sutd'],
    response: `**Smoking and alcohol at SUTD:**\n\n**Smoking**: Prohibited in all campus buildings and hostels including vaping. Designated outdoor smoking zones exist — marked areas near campus perimeter.\n\n**Alcohol**: Permitted in hostel rooms for students 18+ (Singapore's legal age). Not allowed in common areas. Being drunk and disruptive is a disciplinary matter.\n\n**Drugs**: Zero tolerance. Singapore has mandatory minimum sentences for drug offences. Non-negotiable.`,
    followUps: ['What are hostel rules?', 'What are quiet hours?'],
  },
  {
    id: 'apps-to-download',
    triggers: ['apps to download', 'what apps', 'useful apps', 'must have apps', 'apps singapore', 'essential apps', 'apps for sutd', 'recommended apps', 'download what'],
    response: `**Apps every SUTD student needs:**\n\n**Day 1 must-haves:**\n- Singpass (national digital ID)\n- Google Maps / Citymapper (transit)\n- SimplyGo or bank app (EZ-Link balance)\n- MyTransport.SG (bus arrival times)\n- Grab (transport + delivery)\n- PayNow via bank app (money transfers)\n\n**Campus & Study:**\n- Canvas (SUTD LMS), Microsoft Outlook (email), Teams (projects)\n- Notion or Obsidian (notes), GitHub Mobile\n\n**Finance:**\n- Your bank app (DBS/POSB/OCBC)\n- Seedly or Spendee (budget tracking)\n\n**Shopping:**\n- Carousell (second-hand textbooks), Shopee/Lazada, Daiso/IKEA`,
    followUps: ['How do I get an EZ-Link card?', 'What is PayNow?'],
  },
  {
    id: 'telegram-groups',
    triggers: ['telegram group', 'whatsapp group', 'discord sutd', 'sutd telegram', 'student group chat', 'freshmore group', 'where to find group chat', 'sutd reddit', 'sutd social media', 'how to join group'],
    response: `**SUTD student communication:**\n\n**Official**: Canvas announcements + SUTD email for all formal comms.\n\n**Student-run (you'll be added by peers):**\n- **Telegram**: Freshmore cohort group — OGLs share the link during Week 0. Module-specific groups and class groups also on Telegram.\n- **WhatsApp**: small-group event, project, and friend-circle chats\n- **Instagram**: @sutd_sg official, plus club accounts\n- **Reddit**: r/SUTD — small but candid for real opinions\n\n**Finding groups**: Your OGL adds you to the main cohort group during orientation. Module groups appear in the first lecture — just ask classmates.`,
    followUps: ['What is the orientation camp?', 'How do I make friends?'],
  },
  {
    id: 'printing',
    triggers: ['printing', 'print', 'printer', 'how to print', 'campus printer', 'library printer', 'printing cost', 'print quota', 'free printing', 'colour print', 'scan document', 'a4 print'],
    response: `**Printing at SUTD:**\n\n**Where**: Library (Building 5) Level 1 and 3. Also in computer labs.\n\n**Cost**: B&W ~S$0.05/page, Colour ~S$0.30/page. Top up via the campus print portal.\n\n**How to print:**\n1. Send to print queue via campus print portal (accessible on campus network or via VPN)\n2. Tap student card on any campus printer → select job → print\n\n**Scanning**: Free — scan to your SUTD email.\n\n**Tip**: Most readings and textbooks are on Canvas or library e-resources as PDFs — print only what you need to annotate.`,
    followUps: ['Where is the library?', 'How do I use my SUTD email?'],
  },
  {
    id: 'cycling',
    triggers: ['cycling', 'cycle to sutd', 'bicycle', 'bike', 'cycle to school', 'bike storage', 'bicycle storage', 'bring bike', 'bike lane', 'lime bike', 'sg bike', 'bike share'],
    response: `**Cycling at SUTD:**\n\n**Getting here**: Connected to Park Connector Network from Queenstown/Buona Vista/one-north. Google Maps cycling mode works well in Singapore.\n\n**Bike storage**: Racks at main entrance and near hostels. Register your bike with Campus Services (sticker required — unregistered bikes may be removed). Use a D-lock — theft happens.\n\n**Bike sharing**: Anywheel, SG Bike, Neuron near Dover MRT. ~S$0.50–1.00 per 15 min, useful for one-way trips to Clementi or Holland Village.`,
    followUps: ['How do I get to SUTD?', 'What is near campus?'],
  },
  {
    id: 'gym-hours',
    triggers: ['gym hours', 'gym timing', 'gym open', 'when is gym open', 'gym sutd', 'sports complex hours', 'pool hours', 'swimming pool timing', 'court booking', 'badminton court', 'basketball court', 'gym equipment', 'gym membership'],
    response: `**Sports Complex (Building 8):**\n\n**Gym**: Mon–Fri 7 AM – 10 PM, Sat–Sun 8 AM – 9 PM (verify on Canvas — hours can vary). Free weights, barbells, squat racks, treadmills, bikes. Free with student card.\n\n**Swimming pool**: Lap swimming in booked time slots, open recreational swim. Check the Sports Complex booking portal.\n\n**Courts** (badminton, basketball, squash): Book online via student portal 1–3 days ahead. Drop-in slots also available.\n\n**Best time**: 7–8 AM weekdays — almost always empty. Avoid 6–8 PM — busiest.`,
    followUps: ['What sports clubs are there?', 'How do I join a sports club?'],
  },
  {
    id: 'lost-and-found',
    triggers: ['lost and found', 'lost item', 'found item', 'lost phone', 'lost wallet', 'lost laptop', 'lost bag', 'lost keys', 'lost card', 'left behind', 'forgot something', 'where to report lost', 'lost something campus'],
    response: `**Lost and found at SUTD:**\n\n**Where to check:**\n- **Campus Security desk** (main entrance, Building 1): all found items logged here. Visit in person or call SUTD Security: 6303-6002\n- Library (Building 5) Level 1 counter: items found in study rooms\n- FabLab front desk (Building 2)\n- Sports Complex reception (Building 8)\n\n**Lost student card**: Report to Student Hub (Building 1, Level 2) immediately — card deactivated and replacement issued.\n\n**Tip**: Label your laptop, charger, and power bank with your name and number — dramatically increases return rate.`,
    followUps: ['How do I replace my student card?', 'Where is campus security?'],
  },
  {
    id: 'lockers',
    triggers: ['locker', 'lockers', 'campus locker', 'store stuff campus', 'day locker', 'storage locker', 'where to store bag', 'leave bag campus', 'luggage storage campus', 'store luggage break'],
    response: `**Lockers at SUTD:**\n\n**Library (Building 5)**: Day-use lockers on Level 1 and 3. Bring your own combination lock (sold at Cheers, Daiso). First-come-first-served — clear by closing time.\n\n**Gym (Building 8)**: Day-use changing room lockers. Bring your own padlock. Do NOT leave items overnight.\n\n**Hostel**: Your room is your main secure storage. Some students buy a small personal safe (~S$30 at IKEA) for passport and valuables.\n\n**Luggage during term break**: Your room stays yours during breaks — confirm with Housing for each specific break.`,
    followUps: ['What amenities are near campus?', 'Hostel during term break?'],
  },
  {
    id: 'group-project-conflict',
    triggers: ['group project conflict', 'team conflict', 'bad teammate', 'teammate not contributing', 'free rider', 'group project problem', 'team member not doing work', 'team issue', 'teammate lazy', 'group conflict', 'unfair contribution', 'team contribution'],
    response: `**Handling group project conflict:**\n\n**Prevention**: Set expectations Week 1 — meeting schedule, communication channel, and what "done" means. Use a shared task tracker (Notion, GitHub Projects).\n\n**If someone isn't contributing:**\n1. Private conversation first — maybe life stuff is happening\n2. Document it — keep records of task assignments\n3. Rebalance tasks explicitly (state it, don't assume)\n4. Escalate to the prof with specifics if it's serious — most profs adjust grades for contribution differences\n\n**Peer evaluation**: Most 10.009 projects include a confidential peer eval form — fill it honestly. That's the formal mechanism.\n\n**Don't**: Absorb all the work silently.`,
    followUps: ['How do I email a professor?', 'What is the 2D project?'],
  },
  {
    id: 'exam-prep',
    triggers: ['night before exam', 'exam preparation', 'exam tips', 'study for exam', 'exam strategy', 'how to study', 'revision tips', 'exam stress', 'past year papers', 'all nighter', 'should i pull an all nighter', 'submission tomorrow', 'exam tomorrow'],
    response: `**Before an exam or major submission:**\n\n**Do NOT pull an all-nighter** — sleep deprivation impairs recall more than extra cramming helps. Sleep by midnight.\n\n**The night before**: Review summary notes, not new material. Test yourself — close notes and explain each concept aloud.\n\n**For submissions**: Check Canvas file naming requirements carefully. Submit 1–2 hours before deadline — servers slow down with simultaneous submissions. Keep a copy of your submission confirmation.\n\n**Exam technique**: Read all questions first, allocate time by marks, move on if stuck. SUTD exams often assess reasoning process — show your work.\n\n**Morning of**: Eat breakfast. Even if not hungry.`,
    followUps: ['How do I manage stress?', 'Where is the Wellbeing Centre?'],
  },
  {
    id: 'cost-saving-tips',
    triggers: ['save money', 'money saving', 'cheap singapore', 'budget tips', 'student discount', 'cheap things to do', 'money tight', 'broke student', 'cut costs', 'spend less', 'cheap food', 'free stuff singapore'],
    response: `**Student money-saving tips:**\n\n**Food**: Hawker centres S$3–5/meal. Koufu student meal deals under S$4. Cook in hostel kitchen once or twice a week — eggs and pasta are almost free. Use campus water refill stations instead of buying drinks.\n\n**Transport**: Student Concession EZ-Link card gives ~50% off all buses and MRT.\n\n**Shopping**: Carousell for second-hand textbooks. Shopee with vouchers. Daiso at Clementi Mall (S$2 for everything).\n\n**Entertainment**: National Museum free on Fridays after 6 PM. GV student movie tickets ~S$9. Spotify student plan ~S$6/month.\n\n**Always show student card** — most Singapore attractions give 20–30% off.`,
    followUps: ['What food is on campus?', 'How much does living cost?'],
  },
  {
    id: 'imposter-syndrome',
    triggers: ['imposter syndrome', 'feel dumb', 'not smart enough', 'everyone smarter than me', 'feel like i dont belong', 'out of my depth', 'not good enough', 'feel like a fraud', 'dont deserve to be here', 'comparing myself', 'regret sutd', 'doubt myself', 'not fit for sutd'],
    response: `**On imposter syndrome at SUTD:**\n\nThis is one of the most common Freshmore experiences — and you're almost certainly not the only one on your floor feeling it.\n\n**What's actually happening**: The people around you who seem confident are often also scared. Almost without exception.\n\n**What helps:**\n- SUTD selected you after reviewing thousands of applications. That wasn't an accident.\n- Compare yourself to yourself from last month, not to others\n- Say "I felt totally lost in 10.001 today" in the floor lounge — you'll get universal agreement\n- Focus on understanding, not on seeming smart\n\n**If it's persistent**: The Wellbeing Centre (Building 54, Level 2) sees this constantly — it's one of their most common issues.\n\nYou belong here.`,
    followUps: ['Where is the Wellbeing Centre?', 'How do I manage workload?', 'How do I make friends?'],
  },
  {
    id: 'water-facilities',
    triggers: ['water refill', 'drinking water', 'water points', 'water dispenser', 'water fountain', 'hot water sutd', 'fill water bottle', 'where to get water', 'hydration campus', 'is tap water safe', 'tap water singapore'],
    response: `**Water at SUTD:**\n\n**Singapore tap water is safe to drink directly** — WHO standard, no filter needed.\n\n**Water refill stations:**\n- Hot and cold dispensers on every hostel floor (near laundry/pantry)\n- Water coolers in Library (Building 5) on each level\n- Near Koufu and Campus Bistro vending areas\n- FabLab has a water cooler\n\n**Bring a reusable bottle** — this is the single best campus money-saving habit. S$1.50–2.00 per bought drink vs free from the dispenser, every day, adds up to hundreds per term.`,
    followUps: ['What should I pack for hostel?', 'What is cheap food near campus?'],
  },
  {
    id: 'singapore-culture',
    triggers: ['singapore culture', 'living in singapore', 'singlish', 'singapore customs', 'sg customs', 'what is singlish', 'singapore etiquette', 'chope', 'tissue paper chope', 'culture shock singapore', 'adapt singapore', 'singapore weather', 'humid singapore'],
    response: `**Singapore culture guide:**\n\n**Singlish basics:**\n- "Lah" (softener): "Can lah" = it's fine\n- "Can / Cannot" = yes / no\n- "Jio" = invite someone\n- "Shiok" = feels great\n- "Kiasu" = scared to lose/miss out\n- "Chope" = reserve a seat with tissues\n\n**Practical norms:**\n- Always queue — jumping a queue is genuinely offensive\n- No eating/drinking on MRT (fine)\n- No littering (fines)\n- Tipping is not customary — service charge is already included\n\n**Weather**: ~30–33°C, 80%+ humidity year-round. Rain appears suddenly, passes in 30 min — always carry a foldable umbrella.\n\n**The campus is fully air-conditioned** — dress light outdoors, bring a layer for inside.`,
    followUps: ['What is near campus?', 'How do I get around Singapore?'],
  },
  {
    id: 'year2-housing',
    triggers: ['year 2 housing', 'year 2 hostel', 'upper year housing', 'y2 hostel', 'returning student hostel', 'can i stay hostel year 2', 'off campus year 2', 'leave hostel', 'move out hostel', 'housing after freshmore', 'accommodation year 2'],
    response: `**Housing for Year 2 and beyond:**\n\n**On-campus (Blocks 2N and 2S)**: Available for Year 2 students subject to availability. Apply via the SUTD Housing portal in Freshmore Term 3 — apply early.\n\n**Off-campus option**: Some students rent near Clementi, Buona Vista, or one-north (1–2 MRT stops). HDB rooms ~S$800–1,200/month. Sharing a flat with 2–3 friends is most cost-effective.\n\n**Why stay on campus**: Convenient, cheaper than renting, community continues.\n\n**International students**: Check with OSA that your Student's Pass conditions don't require on-campus housing (rarely an issue but worth confirming).`,
    followUps: ['How much does living cost?', 'What is the hostel like?'],
  },
  {
    id: 'term-3',
    triggers: ['term 3', 'third term', 'summer term', 'summer semester', 'what happens term 3', 'year 1 term 3', 'freshmore term 3', 'term 3 modules', 'hostel term 3'],
    response: `**Term 3 at SUTD (approx. May–August):**\n\nTerm 3 is structured differently — lighter load, bridges Freshmore year to Year 2.\n\n**For Freshmores:**\n- Some pillar-specific taster modules may begin\n- Pillar selection finalisation happens around this time\n- Many students do their **first internship** (timing aligns well with industry intakes)\n- UROP research opportunities — some labs specifically recruit in Term 3\n\n**Housing**: Hostel continues — you don't need to move out. Confirm with Housing at start of Term 3.\n\n**Atmosphere**: Noticeably quieter campus. Good for exploring Singapore, catching up on sleep, and preparing for Year 2.`,
    followUps: ['What is pillar selection?', 'What are internship options?', 'What is UROP?'],
  },
  {
    id: 'scholarship-bonds',
    triggers: ['scholarship bond', 'bond obligation', 'scholarship service', 'bond period', 'break bond', 'scholarship conditions', 'dsta bond', 'mindef bond', 'psc bond', 'temasek bond', 'scholarship employer', 'return scholarship', 'repay scholarship'],
    response: `**SUTD scholarship bonds:**\n\n**MOE Tuition Grant bond** (most students): Work in Singapore for **3 years** after graduation. Company-neutral — any Singapore-registered company counts.\n\n**SUTD Scholarship**: Full fees + allowance. Typically **4–5 year bond** to work in Singapore.\n\n**Government agency scholarships** (DSTA, MINDEF, MHA, GIC etc.): 4–6 year bonds to work specifically at the sponsoring agency. Breaking the bond requires pro-rated repayment of tuition + allowance — legally binding.\n\n**Before signing**: Talk to current scholarship holders via the People tab on Cohortly. Understand the career track, not just the money.`,
    followUps: ['What scholarships are available?', 'What are tuition fees?'],
  },
  {
    id: 'sim-card',
    triggers: ['sim card', 'phone plan', 'mobile plan', 'which telco', 'singtel', 'starhub', 'm1', 'circles life', 'giga', 'best phone plan', 'cheap phone plan', 'prepaid sim', 'data plan singapore', 'get a sim', 'buy sim card', 'phone number singapore'],
    response: `**Getting a SIM card in Singapore:**\n\n**Best for students:**\n- **Giga** (~S$15–18/month): Unlimited data (throttled after cap), no contract. Most popular among students.\n- **Circles.Life** (~S$20–28/month): Flexible, digital-only management via app\n- **Singtel / StarHub / M1**: More reliable, ~S$20–35/month\n- **Prepaid SIM**: Get at Changi Airport the moment you land — S$10–15 for the first week while you decide\n\n**Where to buy**: Changi Airport (best), Challenger/Courts, or telco shops at major MRTs. Giga/Circles are online-only.\n\n**Registration**: Requires Singpass or ICA FIN + passport.\n\n**Pro tip**: Buy prepaid at the airport first, then switch to a monthly plan from your hostel room in Week 1.`,
    followUps: ['What apps do I need?', 'What is Singpass?', 'How do I get to SUTD?'],
  },
  {
    id: 'deans-list',
    triggers: ["dean's list", 'deans list', 'top student award', 'academic award', 'academic excellence', 'gold medal', 'top gpa', 'highest gpa', 'dean list criteria', 'academic honour', 'honor roll'],
    response: `**Dean's List at SUTD:**\n\n**What it is**: Awarded each term to students in the top 10% of their cohort (based on term GPA). Automatic — no application needed.\n\n**Eligibility**: Year 2 onwards (Freshmore year is Pass/Fail). Must be taking a full module load with no failed/withdrawn modules that term.\n\n**GPA target**: Typically 4.5+ out of 5.0 for the term. Exact cutoff varies by cohort each term.\n\n**Benefits**: Formal recognition letter + listed on your transcript — useful for graduate school, government scholarships, and competitive internships.\n\n**Gold Medal**: Awarded at convocation to the single student with the highest overall CGPA in the graduating cohort.`,
    followUps: ['What is GPA?', 'How are modules graded?', 'What are scholarships?'],
  },
  {
    id: 'reading-week',
    triggers: ['reading week', 'study break', 'recess week', 'mid-term break', 'when is study break', 'no classes week', 'free week', 'week off', 'what is reading week', 'study week'],
    response: `**Reading Week at SUTD:**\n\nTypically after Week 6–7 of each term, before final assessments. Exact timing is in the Academic Calendar on Canvas.\n\n**What it means**: No lectures or tutorials. FabLab, library, and study spaces are all open. Most profs hold extra office hours.\n\n**What most students do**: Catch up on the mid-semester backlog, review lecture notes systematically, group project final push, schedule prof consultations.\n\n**Don't**: Treat it as a full holiday — assessments come immediately after.\n\n**Hostel**: You stay in your room as usual. Campus is quieter but still populated.`,
    followUps: ['How do I prepare for exams?', 'What are study spots?', 'What is the academic calendar?'],
  },
  {
    id: 'housing-guest-policy',
    triggers: ['can friends visit', 'hostel guest', 'overnight guest', 'visitor policy', 'can i have a guest', 'can family visit hostel', 'overnight stay friend', 'bring someone to hostel', 'guest in room', 'opposite gender guest', 'visitor rules'],
    response: `**Hostel guest policy:**\n\n**Daytime visitors**: Friends and family can visit campus and common areas. Visitors register at the security desk and get a visitor pass.\n\n**Hostel rooms**: Guests are generally permitted during daytime. **Overnight stays by non-residents are not permitted** as a general rule — check the current Housing handbook or ask your RA for exact current rules.\n\n**Family visits**: Visitors can eat at Koufu/Campus Bistro freely. If family is coming from abroad for orientation week, OSA runs a family orientation programme.\n\n**RA and floor norms**: Your RA briefs you on practical norms for your specific floor.`,
    followUps: ['What are hostel rules?', 'What are quiet hours?', 'Who is my RA?'],
  },
  {
    id: 'housing-cooking',
    triggers: ['can i cook', 'cooking hostel', 'hostel kitchen', 'cook in room', 'microwave hostel', 'kettle hostel', 'rice cooker hostel', 'communal kitchen', 'hostel pantry', 'cooking facilities', 'make food hostel', 'electric appliances hostel', 'can i bring rice cooker'],
    response: `**Cooking in the SUTD hostel:**\n\n**What's available**: Communal pantry on each floor with a microwave, electric kettle, and sink. Hot water dispenser for instant noodles and oats.\n\n**Allowed in your room**: Small electric kettle (check with Housing). Standard electronics.\n\n**NOT allowed in rooms**: Rice cookers, hot plates, induction cookers, toasters — fire risk. Use the communal pantry for these.\n\n**Common habits**: Cup noodles/oats with the floor kettle, reheating takeaway in the communal microwave, simple cooking (eggs, pasta) in the pantry.\n\n**Grocery runs**: FairPrice at Clementi Mall (2 MRT stops), Sheng Siong near Clementi (cheaper), Giant at Clementi — all 15–20 min from campus.`,
    followUps: ['What food is on campus?', 'Where can I buy groceries?', 'What are hostel rules?'],
  },
  {
    id: 'housing-move-in',
    triggers: ['move in day', 'move in tips', 'first day hostel', 'check in hostel', 'hostel check in', 'moving into hostel', 'arrival day', 'key collection', 'room key', 'how to move in', 'first day sutd', 'what to do when you arrive'],
    response: `**Move-in process:**\n\n**Arrival day:**\n1. Follow the official Housing email for where to collect keys and what documents to bring\n2. Bring: student acceptance letter, passport/IC, and any documents requested by Housing\n3. Sign required housing forms through official channels\n4. Use official staff guidance for access-card, maintenance, safety, and visitor-policy questions\n\n**Practical tips:**\n- Pack bedding, towels, toiletries, charger, approved adapters, and laundry basics\n- Ask staff where to move large luggage safely\n- Join a Campus Life jio or campus walk on Day 1 so you are not settling in alone\n\n**International students**: Student's Pass collection appointment is coordinated by OSA within your first 2 weeks — attend when called.`,
    followUps: ['What should I pack?', 'Who is my RA?', 'What happens during orientation?'],
  },
  {
    id: 'supplementary-exams',
    triggers: ['supplementary exam', 'makeup exam', 'missed exam', 'miss exam', 'sick during exam', 'medical cert exam', 'sick on exam day', 'absent exam', 'defer exam', 'special consideration', 'what if i miss exam', 'retake exam', 'mc for exam'],
    response: `**Missing an exam or assessment:**\n\n**If sick on exam day:**\n1. See a doctor **before or as close to exam time as possible** and get a valid MC\n2. Email the module coordinator **the same day** — don't wait\n3. Attach your MC and student ID\n\n**Supplementary/make-up**: A supplementary exam may be scheduled, or grade calculated from other components. Extensions for projects granted case-by-case with MC — contact the coordinator promptly.\n\n**Personal emergencies** (bereavement, serious accident): Contact OSA immediately — they liaise with faculty on your behalf.\n\n**Important**: Do NOT sit the exam when very unwell and then claim illness after the fact — documentation must be contemporaneous.\n\n**Failing due to absence without excuse**: Module fail — see OSA before it reaches that point.`,
    followUps: ['What happens if I fail a module?', 'How do I get a medical certificate?', 'Where is OSA?'],
  },
  {
    id: 'career-fair',
    triggers: ['career fair', 'job fair', 'recruitment fair', 'company booth', 'internship fair', 'when is career fair', 'company recruitment', 'campus recruitment', 'company presentation', 'employer presentation', 'networking event', 'industry talk', 'career event'],
    response: `**Career fairs and recruitment at SUTD:**\n\n**Annual events:**\n- **SUTD Career Fair**: Once or twice a year (typically Term 2). Companies set up booths — tech firms, engineering companies, government agencies, startups.\n- **Industry Talks**: Companies visit year-round for 1–2 hour presentations + Q&A. Check CDC calendar on Canvas.\n- **Company-specific recruitment drives**: DSTA, DBS Tech, SEA Group, etc. run dedicated SUTD events.\n\n**Tips:**\n- Bring printed CVs even as a Freshmore — introduce yourself and ask about Year 2+ internships\n- Dress smart-casual\n- Research companies before approaching their booth — recruiters remember specific questions\n- Connect on LinkedIn after: \"I'm a SUTD Freshmore — we spoke at the career fair about [X]\"\n\n**For Freshmores**: Great for scoping what companies expect. Internship applications in earnest start Year 2.`,
    followUps: ['How do I apply for internships?', 'What is the CDC?', 'How do I build a resume?'],
  },
  {
    id: 'resume-linkedin',
    triggers: ['resume', 'cv', 'curriculum vitae', 'write resume', 'build cv', 'linkedin', 'linkedin profile', 'resume tips', 'how to write cv', 'portfolio', 'design portfolio', 'cover letter', 'resume template', 'student resume'],
    response: `**Resume, CV, and LinkedIn:**\n\n**Resume basics:**\n- 1 page for student internship applications\n- Sections: Contact → Education (SUTD, GPA if 3.5+) → Skills → Projects → Work Experience → Awards\n- Your Freshmore projects (10.009, 10.014) are real portfolio pieces — describe what you built, tech used, and outcome\n\n**LinkedIn:**\n- Set up in Week 1 of Year 1 — recruiters look for you\n- Headline: \"CS & Design student @ SUTD | Python, React, ML\" — specific beats vague\n- Connect with profs, industry speakers after talks, career fair recruiters\n\n**CDC help**: SUTD's Career Development Centre offers free resume reviews. Mock interview sessions in Term 2 — book via CDC portal.\n\n**Portfolio (ASD, DAI, ISTD)**: Behance, personal website, or GitHub is often more important than your resume in design-heavy roles.`,
    followUps: ['What are internship options?', 'When should I start applying for jobs?', 'What is the CDC?'],
  },
  {
    id: 'graduate-programs',
    triggers: ['masters', 'phd', 'graduate school', 'sutd masters', 'sutd phd', 'postgraduate', 'msc', 'master of science', 'doctoral', 'research degree', 'stay for masters', 'study further', 'after bachelor', 'sutd graduate programme'],
    response: `**Graduate programs at SUTD:**\n\n**Masters programs:**\n- MSc in Innovation (DTP — Design and Technology Programme)\n- MSc in Urban Science (with MIT)\n- MSc in AI (ISTD / DAI)\n- MSc in Engineering Product Development (EPD)\n- Research-based and coursework-based options\n\n**PhD**: Available across all five pillars. Fully-funded positions with research stipend (~S$2,000–2,500/month).\n\n**Who should consider**: Students who loved the research process (UROP), want deep specialisation, or are targeting academia or R&D roles.\n\n**SUTD undergrad advantage**: SUTD graduates sometimes get priority consideration for SUTD Masters programmes — ask your Faculty Advisor.`,
    followUps: ['What is UROP?', 'What are research institutes?', 'What are career options after SUTD?'],
  },
  {
    id: 'housing-checkout',
    triggers: ['hostel checkout', 'check out hostel', 'vacate room', 'leave hostel', 'end of year hostel', 'room inspection', 'hostel room inspection', 'hostel deposit', 'deposit return', 'hostel move out', 'clear room', 'checkout process'],
    response: `**Hostel checkout / room inspection:**\n\n**Process:**\n1. Clear all belongings from the room\n2. Return any borrowed items\n3. Clean to a reasonable standard — wipe desk, take out rubbish\n4. Return room key/access card to Housing office\n5. Housing officer inspects for damage\n\n**Damage charges:**\n- Normal wear and tear: no charge\n- Damage beyond normal (wall damage, broken furniture, stains): deducted from your hostel deposit\n\n**Hostel deposit**: Paid at start of Year 1, refunded after checkout inspection if room is in good condition.\n\n**If returning next term**: Your room stays yours — no checkout needed.`,
    followUps: ['What is the hostel deposit?', 'How much does housing cost?'],
  },
  {
    id: 'study-abroad-non-sep',
    triggers: ['winter program', 'summer program', 'non sep abroad', 'study abroad short', 'mit program', 'mit visit', 'sutd mit link', 'zju program', 'zhejiang program', 'overseas programme', 'sutd global', 'global programmes', 'summer school abroad'],
    response: `**Non-SEP study abroad at SUTD:**\n\n**SUTD–MIT Global Leadership Programme (SMGLP)**: Annual 1–2 week programme at MIT (Cambridge, USA). Leadership + MIT campus experience. Open to Years 2–4. Apply via OSA Global Programmes in Term 2.\n\n**SUTD–ZJU (Zhejiang University) Exchange**: Summer programme in Hangzhou, China. Design and engineering focus, 3–6 weeks in Term 3. Apply via OSA in Term 2.\n\n**Other programmes**: Short-term partnerships with universities in Japan, Germany, Netherlands, USA. Check OSA Global Programmes page each term.\n\n**Financial support**: Most SUTD-organised programmes have subsidised fees or travel grants for students with demonstrated financial need — ask OSA when applying.`,
    followUps: ['What is the SEP exchange?', 'How do I apply for global programmes?'],
  },
  {
    id: 'hackathons-competitions',
    triggers: ['hackathon', 'design competition', 'competition sutd', 'student competition', 'coding competition', 'case competition', 'innovation challenge', 'startup competition', 'pitching competition', 'enter competition', 'tech competition'],
    response: `**Hackathons and competitions:**\n\n**On campus:**\n- **iCube competitions**: Pitch competitions throughout the year, prizes + mentorship\n- **Fifth Row events**: IEEE coding competitions, GEAR robotics demos, etc.\n- **Faculty/industry design challenges**: Watch Canvas and OSA announcements\n\n**Singapore-wide:**\n- GovTech hackathons (HackforPublicGood) — SUTD students often win\n- NUS and NTU open tech fests\n- SEA/Shopee/Grab internal hackathons\n\n**Tips:**\n- Start with 24-hour hackathons — lower stakes, high learning\n- Best team: 1 designer + 1 backend dev + 1 presenter\n- Winning is secondary — the network and experience are the real prize\n- Find competitions at: Devpost, SUTD Fifth Row social pages, Canvas announcements`,
    followUps: ['What is iCube?', 'What are Fifth Row clubs?', 'How do I find a team?'],
  },
  {
    id: 'materials-sourcing',
    triggers: ['where to buy materials', 'buy components', 'buy arduino', 'buy raspberry pi', 'buy sensors', 'where to buy electronics', 'sim lim', 'where to buy fabric', 'material sourcing', '3d printing filament', 'buy filament', 'craft materials', 'buy wood', 'acrylic', 'hardware store near sutd', 'project materials'],
    response: `**Where to buy project materials:**\n\n**Electronics / Maker components:**\n- **Sim Lim Square** (Rochor MRT, ~25 min): 6-storey electronics mall. Arduino, Raspberry Pi, sensors, cables — cheapest in Singapore\n- **Lazada / Shopee**: Jumper wires, displays, common modules — cheap and delivered to campus\n- **RS Components / Element14**: Professional-grade, fast SG delivery\n\n**3D printing filament**: FabLab stocks basic PLA. Lazada for extra spools (PLA 1.75mm).\n\n**Wood / Acrylic**: Hardware stores at Boon Lay/Jurong (~30 min MRT). Daiso (Clementi Mall) for craft supplies and foam board. FabLab has scrap material — ask before buying.\n\n**Fabric (ASD)**: Spotlight at Parkway Parade or Peninsula Shopping Centre (City Hall MRT). Mustafa Centre in Little India (cheaper, open 24h).`,
    followUps: ['What is FabLab?', 'How do I start a project?'],
  },
  {
    id: 'banking-sg',
    triggers: ['open bank account', 'bank account singapore', 'which bank', 'dbs', 'posb', 'ocbc', 'uob', 'bank account student', 'how to open bank account', 'student bank account', 'money transfer', 'bank near campus', 'savings account'],
    response: `**Opening a bank account in Singapore:**\n\n**Best for students:**\n- **DBS/POSB**: Most SUTD students use this. Zero/low fees, ATM on campus (in Koufu), widely accessible.\n- **OCBC 360**: Good if you want interest on savings\n- **Wise** (online): Best for international students receiving money from abroad — lower FX fees\n\n**How to open DBS/POSB**: Download the app → "Open an Account" (fully digital with Singpass). Or walk into a branch with passport + Student's Pass (international students).\n\n**ATMs near campus**: DBS inside Koufu block (on campus). DBS/OCBC/UOB at Clementi MRT (2 stops).\n\n**PayNow**: Link your phone number once your account is set up — essential for splitting meals and paying for almost everything.`,
    followUps: ['What is PayNow?', 'What apps do I need?', 'How do I get here from the airport?'],
  },
  {
    id: 'mental-health-crisis',
    triggers: ['mental health crisis', 'crisis line', 'suicidal thoughts', 'suicide', 'self harm', 'feeling suicidal', 'want to die', 'cant go on', 'emergency mental health', 'mental breakdown', 'panic attack', 'SOS', 'samaritans of singapore', 'crisis hotline', 'in crisis', 'having a breakdown'],
    response: `If you're in crisis right now, please reach out immediately:\n\n**24/7 crisis support:**\n- **Samaritans of Singapore (SOS)**: 1-767 (24h, free, confidential)\n- **IMH Crisis Helpline**: 6389-2222 (24h)\n- **Emergency (ambulance)**: 995\n\n**On campus:**\n- **SUTD Security**: 6303-6002 (any time)\n- **Wellbeing Centre** (Building 54, Level 2): Walk in during office hours\n\n**Text option**: WhatsApp "Hello" to 1800-221-4444 (Befrienders) if you can't speak.\n\nYou don't have to be okay right now. You just have to reach out to one person. That's enough.`,
    followUps: ['Where is the Wellbeing Centre?', 'How do I talk to someone on campus?'],
  },
  {
    id: 'airport-arrival',
    triggers: ['arriving singapore', 'airport to sutd', 'changi to sutd', 'how to get from airport', 'arrived singapore', 'just landed', 'from changi', 'airport transport', 'mrt from airport', 'airport to campus', 'taxi from airport', 'grab from airport', 'arriving changi', 'first time singapore'],
    response: `**Getting from Changi Airport to SUTD:**\n\n**MRT (recommended, cheapest):**\n- East-West Line (green) from Changi Airport\n- Change at Tanah Merah → continue West\n- Alight at **Dover MRT**\n- Total: ~50–60 min, S$2.50–3.00\n- Grab an EZ-Link card from the airport Arrivals hall vending machines\n\n**Grab/Taxi**: ~30–35 min, S$25–45. Good for heavy luggage on move-in day.\n\n**Orientation shuttle**: Check your OSA pre-arrival email — they often arrange a move-in shuttle.\n\n**On arrival**: Get a prepaid SIM at the airport before leaving — you'll need mobile data immediately.\n\n**Address**: 8 Somapah Road, SUTD, Singapore 487372`,
    followUps: ['How do I get around Singapore?', 'How do I get a SIM card?', 'What do I need on arrival?'],
  },
  {
    id: 'late-night-transport',
    triggers: ['night bus', 'late night bus', 'mrt last train', 'last train timing', 'when does mrt close', 'owlbus', 'night rider', 'late night train', 'transport after midnight', 'coming back late', 'how to get home late', 'night transport', 'late bus singapore'],
    response: `**Late night transport in Singapore:**\n\n**MRT last train**: Shuts down around **midnight–12:30 AM** (varies by line). No service until ~5:30 AM.\n\n**Night Owl (NightRider / NR) buses**: ~11:30 PM – 3 AM from city hubs (Chinatown, Clarke Quay, Orchard). Fare ~S$4–5. Check SBS Transit app or Google Maps for NR routes.\n\n**Grab / GoJek**: Available 24/7. Surge pricing applies late night (S$12–20 for short trips). Split with friends.\n\n**Pro tip**: Leave Orchard/Clarke Quay by **11:30 PM** to catch the last MRT to Dover — or budget S$15–20 for a Grab back.`,
    followUps: ['How do I get around Singapore?', 'What are evening activities?'],
  },
  {
    id: 'ica-registration',
    triggers: ['ica registration', 'student pass', "student's pass", 'immigration', 'in-principle approval', 'ipa letter', 'collect student pass', 'student pass renewal', 'ica appointment', 'immigration checkpoint authority', 'visa singapore', 'register ica', 'international student pass'],
    response: `**ICA / Student's Pass (international students):**\n\n**Before arriving**: SUTD Registrar coordinates your In-Principle Approval (IPA) letter after you accept. Bring it + original documents when you fly in.\n\n**On arrival**: Enter on the IPA (short-term stay). OSA schedules a **group ICA appointment** within your first 2 weeks — you MUST attend to collect your actual Student's Pass.\n\n**Bring to ICA appointment**: Passport, IPA letter, SUTD acceptance docs, passport-sized photos.\n\n**Student's Pass**: Valid for the full duration of your degree. Renew via OSA if your degree is extended.\n\n**Key rules**: Stay enrolled and in good standing. Part-time work allowed up to **16 hours/week**. Notify OSA immediately if you lose your passport or Student's Pass.`,
    followUps: ['What is OSA?', 'What are part-time job rules?', 'What documents do I need?'],
  },
];

// ─── AI Engine ────────────────────────────────────────────────────────────────

function aiTokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/['".,!?;:()\[\]{}]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function aiScore(entry: AIEntry, rawInput: string): number {
  const lower = rawInput.toLowerCase();
  const tokens = aiTokenize(rawInput);
  let score = 0;

  for (const trigger of entry.triggers) {
    const tLower = trigger.toLowerCase();
    if (lower.includes(tLower)) {
      // Exact phrase match — score by length (longer phrase = more specific)
      score += tLower.split(' ').length * 4;
    } else {
      const tWords = tLower.split(' ');
      const matched = tWords.filter((tw) => tokens.some((t) => t.includes(tw) || tw.includes(t)));
      if (matched.length === tWords.length && tWords.length > 1) {
        // All words present, not contiguous
        score += tWords.length * 1.5;
      } else {
        // Partial match
        score += matched.length * 0.4;
      }
    }
  }

  return score;
}

const CONTEXT_BOOSTED = ['tell me more', 'more about that', 'explain more', 'go on', 'and then', 'what else', 'really', 'seriously', 'how so', 'elaborate'];

function findAIResponse(input: string, lastEntryId: string | null): { response: string; followUps: string[]; entryId: string } {
  const lower = input.trim().toLowerCase();

  // Chitchat shortcircuit
  if (lower.length < 15 && CONTEXT_BOOSTED.some((p) => lower.includes(p))) {
    return {
      response: "I'd be happy to go deeper! Could you tell me a bit more about what specifically you'd like to know? Or pick one of the suggestions below.",
      followUps: ['Tell me about 10.014', 'What should I pack?', 'What is Fifth Row?'],
      entryId: lastEntryId ?? 'none',
    };
  }

  // Score all entries
  const scored = COHORTLY_KB.map((e) => ({ e, s: aiScore(e, input) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  if (!scored.length || scored[0].s < 1.2) {
    return {
      response: `I'm not sure I have specific information on that. Here are a few things I can help with:\n\n- Module questions (10.014, 10.009, etc.)\n- Hostel, food, and campus life\n- Admin setup (student card, email, etc.)\n- Finding classmates and returning students\n- Wellbeing and support resources\n- Fifth Row clubs\n\nTry rephrasing your question, or check the **Knowledge Base** tab for articles!`,
      followUps: ['What modules do I take?', 'Tell me about the hostel', 'Where do I get my student card?'],
      entryId: 'fallback',
    };
  }

  const best = scored[0].e;
  return {
    response: best.response,
    followUps: best.followUps ?? [],
    entryId: best.id,
  };
}

// ─── Admin invite data ────────────────────────────────────────────────────────

type Invite = { code: string; cohort: string; emailDomain: string; createdAt: string; status: 'unused' | 'used' | 'revoked'; usedBy?: string };

const initialInvites: Invite[] = [
  { code: 'SUTD-FM26-A1K', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-01', status: 'used', usedBy: 'vanika.r@mymail.sutd.edu.sg' },
  { code: 'SUTD-FM26-B2M', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-01', status: 'used', usedBy: 'wei.jian@mymail.sutd.edu.sg' },
  { code: 'SUTD-FM26-C3N', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-03', status: 'unused' },
  { code: 'SUTD-FM26-D4P', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-03', status: 'unused' },
  { code: 'SUTD-EX26-E5Q', cohort: 'Exchange AY2026',  emailDomain: '@sutd.edu.sg',         createdAt: '2026-05-10', status: 'used', usedBy: 'noah.r@sutd.edu.sg' },
  { code: 'SUTD-EX26-F6R', cohort: 'Exchange AY2026',  emailDomain: '@sutd.edu.sg',         createdAt: '2026-05-10', status: 'revoked' },
  { code: 'SUTD-FM26-G7S', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-15', status: 'unused' },
  { code: 'SUTD-FM26-H8T', cohort: 'Freshmore AY2026', emailDomain: '@mymail.sutd.edu.sg', createdAt: '2026-05-15', status: 'unused' },
];

// ─── Isolation Risk data ──────────────────────────────────────────────────────

type RiskLevel = 'critical' | 'warning' | 'watch';
type RiskSignal = { text: string; severity: 'red' | 'amber' | 'blue' };
type RiskStudent = { id: string; name: string; pillar: string; year: string; riskLevel: RiskLevel; signals: RiskSignal[]; lastActive: string; daysInactive: number };

const riskStudents: RiskStudent[] = [
  {
    id: 'r1', name: 'Yusuf A.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'critical',
    signals: [
      { text: '14 days since last login', severity: 'red' },
      { text: 'No connections made (0/5 target)', severity: 'red' },
      { text: 'No events attended', severity: 'red' },
      { text: 'Skipped last 2 weekly pulses', severity: 'amber' },
    ],
    lastActive: '2026-05-25', daysInactive: 14,
  },
  {
    id: 'r2', name: 'Aisha M.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'critical',
    signals: [
      { text: '10 days since last login', severity: 'red' },
      { text: 'Pulse score: belonging 1/5 (last response)', severity: 'red' },
      { text: '1 connection only (below cohort avg of 6.8)', severity: 'amber' },
    ],
    lastActive: '2026-05-29', daysInactive: 10,
  },
  {
    id: 'r3', name: 'Leon K.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'warning',
    signals: [
      { text: '6 days since last login', severity: 'amber' },
      { text: 'Pulse score: social connection 2/5', severity: 'amber' },
      { text: 'No Fifth Row activity', severity: 'blue' },
    ],
    lastActive: '2026-06-02', daysInactive: 6,
  },
  {
    id: 'r4', name: 'Priscilla T.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'warning',
    signals: [
      { text: '5 days since last login', severity: 'amber' },
      { text: '0 questions asked in any module room', severity: 'amber' },
      { text: 'No returning-student connection yet', severity: 'blue' },
    ],
    lastActive: '2026-06-03', daysInactive: 5,
  },
  {
    id: 'r5', name: 'Haruto Y.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'watch',
    signals: [
      { text: '3 days since last login', severity: 'blue' },
      { text: 'Pulse: energy score 2/5 for 2 weeks', severity: 'amber' },
    ],
    lastActive: '2026-06-05', daysInactive: 3,
  },
  {
    id: 'r6', name: 'Divya S.', pillar: 'Undeclared (Freshmore)', year: 'Y1', riskLevel: 'watch',
    signals: [
      { text: '2 connections (below average)', severity: 'blue' },
      { text: 'International student — first semester away from home', severity: 'blue' },
    ],
    lastActive: '2026-06-06', daysInactive: 2,
  },
];

// ─── Pending events for approval ──────────────────────────────────────────────

type EventApproval = { id: string; title: string; host: string; date: string; time: string; audience: string; tone: EventItem['tone']; status: 'pending' | 'approved' | 'rejected' };

const initialPendingEvents: EventApproval[] = [
  { id: 'pa1', title: 'Late-night bouldering session @ Campus Wall', host: 'Sofia (1N-09)', date: '2026-09-12', time: '10:30 PM', audience: 'All students · Sports', tone: 'sports', status: 'pending' },
  { id: 'pa2', title: 'ASD Freshmore design studio warmup', host: 'Marcus (Y3 ASD)', date: '2026-09-10', time: '2:00 PM', audience: 'ASD students · all welcome', tone: 'academic', status: 'pending' },
  { id: 'pa3', title: 'Supper run — Ghim Moh hawker', host: 'Jerome · Freshmore circle', date: '2026-09-09', time: '9:45 PM', audience: 'Freshmore campus-life community', tone: 'social', status: 'approved' },
  { id: 'pa4', title: '10.014 exam prep marathon', host: 'Aarav (Y3 ISTD)', date: '2026-09-11', time: '7:00 PM', audience: 'All Freshmores · 10.014', tone: 'academic', status: 'approved' },
  { id: 'pa5', title: 'Minecraft server launch party', host: 'Anonymous', date: '2026-09-13', time: '11:00 PM', audience: 'Gamers', tone: 'social', status: 'rejected' },
];

// ─── Admin dashboard data ───
type AdminView = 'overview' | 'students' | 'classes' | 'events' | 'alerts' | 'invites' | 'isolation' | 'roster' | 'outcomes';

const adoptionSteps: Array<{ label: string; count: number; total: number; pct: number }> = [
  { label: 'Invited', count: 1400, total: 1400, pct: 100 },
  { label: 'Registered', count: 812, total: 1400, pct: 58 },
  { label: 'Profile complete', count: 687, total: 1400, pct: 49 },
  { label: 'Active this week', count: 502, total: 1400, pct: 36 },
];

const adminClassHealth: Array<{
  code: string; title: string; students: number;
  questions: number; answered: number; mentors: number; status: 'healthy' | 'attention';
}> = [
  { code: '10.014', title: 'Computational Thinking', students: 68, questions: 28, answered: 28, mentors: 4, status: 'healthy' },
  { code: '10.009', title: 'The Digital World', students: 43, questions: 19, answered: 18, mentors: 2, status: 'healthy' },
  { code: '50.007', title: 'Machine Learning', students: 38, questions: 22, answered: 20, mentors: 2, status: 'healthy' },
  { code: '30.007', title: 'Engineering Design', students: 22, questions: 11, answered: 9, mentors: 1, status: 'attention' },
  { code: '40.011', title: 'Data-Driven World', students: 19, questions: 16, answered: 14, mentors: 2, status: 'healthy' },
  { code: 'ASD Studio', title: 'ASD Design Studio I', students: 16, questions: 8, answered: 7, mentors: 2, status: 'healthy' },
];

const adminAlerts: Array<{ type: 'urgent' | 'warning' | 'info'; title: string; detail: string; action: string }> = [
  { type: 'urgent', title: '3 questions unanswered for >6 hours', detail: '10.014 Computational Thinking · Lab 2 recursion help', action: 'Notify returning students' },
  { type: 'warning', title: '14 students have zero connections', detail: 'First-week isolation risk — no events RSVPd or messages sent', action: 'Send care nudge' },
  { type: 'warning', title: '22 students haven\'t joined any event', detail: 'Signed up and verified but not yet engaged with the cohort', action: 'Highlight events' },
  { type: 'info', title: '30.007 Engineering Design needs more returning-student coverage', detail: 'Only 1 active Year 2+ student — 11 open questions this week', action: 'Invite returning students' },
];

const adminStudents: Array<{ name: string; pillar: string; joined: string; connections: number; events: number }> = [
  { name: 'Vanika Sharma', pillar: 'Freshmore', joined: '2h ago', connections: 3, events: 1 },
  { name: 'Jerome Tan', pillar: 'Freshmore', joined: '4h ago', connections: 0, events: 0 },
  { name: 'Sofia Chen', pillar: 'ASD', joined: '6h ago', connections: 5, events: 2 },
  { name: 'Kai Rahman', pillar: 'ISTD', joined: '1d ago', connections: 8, events: 3 },
  { name: 'Mei Lin Teo', pillar: 'Freshmore', joined: '1d ago', connections: 12, events: 4 },
  { name: 'Noah Richter', pillar: 'EPD Exchange', joined: '1d ago', connections: 6, events: 2 },
  { name: 'Priya Nair', pillar: 'ESD', joined: '2d ago', connections: 4, events: 1 },
];

function getDemoProfile(mode: DemoMode): StudentProfile {
  if (mode === 'returning') {
    return {
      role: 'student',
      classes: ['50.001 Introduction to ISTD', '50.004 Algorithm Design', '50.007 Machine Learning'],
      interests: ['Startups & iCube', 'Robotics', 'Study groups'],
      goals: ['Find project teammates', 'Share module notes', 'Join a returning-student circle'],
      availability: 'Weekday evenings',
      homeBase: 'Returning student home base',
      intro: 'Returning ISTD student looking for project teammates, class groups, and useful ways to help incoming students settle in.',
      pillar: 'ISTD',
      year: 'Year 3',
      campusHomeBase: 'Returning student home base',
      campusCommunity: 'Year 3 ISTD / project circles',
    };
  }
  return {
    role: 'student',
    classes: ['10.014 Computational Thinking', '10.009 The Digital World', '10.001 Advanced Maths I'],
    interests: ['Startups & iCube', 'Badminton', 'Food & Cafes'],
    goals: ['Find my first-week circle', 'Get module advice from returning students'],
    availability: 'Weekday evenings',
    homeBase: 'Freshmore campus-life community',
    intro: 'New to SUTD — looking for low-pressure events, coding help, and startup friends.',
    pillar: 'Freshmore',
    year: 'Year 1',
    campusHomeBase: 'Freshmore campus-life community',
    campusCommunity: 'Freshmore arrival circle',
  };
}

// ─── Belonging Score helpers ─────────────────────────────────────────────────

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function calcBelongingScore(answers: Record<string, number>): number {
  const vals = Object.values(answers);
  if (vals.length === 0) return 0;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  return Math.round((avg / 4) * 100);
}

function loadBelongingHistory(email: string): BelongingEntry[] {
  try {
    return JSON.parse(localStorage.getItem(`cohortly.belonging.${email}`) ?? '[]') as BelongingEntry[];
  } catch { return []; }
}

function saveBelongingEntry(email: string, score: number): void {
  const history = loadBelongingHistory(email);
  const week = isoWeek(new Date());
  const filtered = history.filter((e) => e.week !== week);
  filtered.push({ week, score, at: Date.now() });
  filtered.sort((a, b) => a.week.localeCompare(b.week));
  try { localStorage.setItem(`cohortly.belonging.${email}`, JSON.stringify(filtered.slice(-12))); } catch {}
}

// ─── Bot/notification prefs ────────────────────────────────────────────────

type NotifPrefs = {
  telegramHandle: string;
  whatsappNumber: string;
  onAnswer: boolean;
  onEvent: boolean;
  onConnection: boolean;
  botConnected: boolean;
  whatsappConnected?: boolean;
};

type NotificationStatus = {
  ok: boolean;
  apiOnline: boolean;
  telegram: {
    configured: boolean;
    botUsername: string;
    webhookUrlConfigured: boolean;
    webhookSecretConfigured?: boolean;
    connected: boolean;
    username: string;
    chatRegistered: boolean;
  };
  whatsapp: {
    configured: boolean;
    phoneNumberIdConfigured: boolean;
    verifyTokenConfigured: boolean;
    appSecretConfigured?: boolean;
    templateConfigured?: boolean;
    businessPhone: string;
    connected: boolean;
    optedIn: boolean;
    phone: string;
  };
  dispatch?: {
    configured: boolean;
  };
  startToken?: string;
  preferences: Pick<NotifPrefs, 'onAnswer' | 'onEvent' | 'onConnection'>;
};

function loadNotifPrefs(email: string): NotifPrefs {
  try {
    return JSON.parse(localStorage.getItem(`cohortly.notif.${email}`) ?? 'null') ?? { telegramHandle: '', whatsappNumber: '', onAnswer: true, onEvent: true, onConnection: true, botConnected: false, whatsappConnected: false };
  } catch { return { telegramHandle: '', whatsappNumber: '', onAnswer: true, onEvent: true, onConnection: true, botConnected: false, whatsappConnected: false }; }
}

function saveNotifPrefs(email: string, prefs: NotifPrefs): void {
  try { localStorage.setItem(`cohortly.notif.${email}`, JSON.stringify(prefs)); } catch {}
}

// pfp stays in localStorage (base64 is too large for Firestore documents)
function savePfpLocal(email: string, dataUrl: string) {
  try { localStorage.setItem(`cohortly.pfp.${email}`, dataUrl); } catch {}
}
function loadPfpLocal(email: string): string | undefined {
  try { return localStorage.getItem(`cohortly.pfp.${email}`) ?? undefined; } catch { return undefined; }
}

async function loadProfile(email: string): Promise<StudentProfile | null> {
  const localRead = (): StudentProfile | null => {
    try {
      const raw = localStorage.getItem(`cohortly.profile.${email}`);
      return raw ? (JSON.parse(raw) as StudentProfile) : null;
    } catch { return null; }
  };

  if (db) {
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const snap = await Promise.race([
        getDoc(doc(db, 'profiles', email)),
        timeout,
      ]);
      if (snap && typeof (snap as { exists?: unknown }).exists === 'function' && (snap as { exists: () => boolean }).exists()) {
        const data = (snap as unknown as { data: () => Omit<StudentProfile, 'pfpDataUrl'> }).data();
        return { ...data, pfpDataUrl: loadPfpLocal(email) };
      }
    } catch (e) {
      console.warn('[cohortly] Firestore read failed, falling back to localStorage', e);
    }
  }
  return localRead();
}

async function saveProfile(email: string, profile: StudentProfile): Promise<void> {
  const { pfpDataUrl, ...profileData } = profile;
  if (pfpDataUrl) savePfpLocal(email, pfpDataUrl);
  // Always write to localStorage first — reliable across server restarts and network failures
  try { localStorage.setItem(`cohortly.profile.${email}`, JSON.stringify(profile)); } catch {}
  // Also persist to Firestore for cross-device sync
  if (db) {
    try {
      await setDoc(doc(db, 'profiles', email), { ...profileData, updatedAt: new Date() });
    } catch (e) {
      console.warn('[cohortly] Firestore write failed', e);
    }
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const toneNames: Record<EventItem['tone'], string> = {
  social: 'Social',
  study: 'Study',
  academic: 'Academic',
  arrival: 'Arrival',
  sports: 'Sports',
  culture: 'Culture',
};

function toneName(tone: EventItem['tone']) {
  return toneNames[tone];
}

function institutionFor(id: InstitutionId, institutions: Institution[]) {
  return institutions.find((institution) => institution.id === id) ?? institutions[0];
}

function parseDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

function formatFullDate(key: string) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(parseDateKey(key));
}

function formatShortDate(key: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parseDateKey(key));
}

function formatDateParts(key: string) {
  const date = parseDateKey(key);
  return {
    day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date),
    weekday: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date),
  };
}

function buildCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      key: dateKey(date),
      inMonth: date.getMonth() === month,
      dayNumber: date.getDate(),
    };
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new Error(payload.message || 'Request failed.');
  return payload as T;
}

const notificationApiBase = (import.meta.env.VITE_COHORTLY_API_BASE || '').replace(/\/$/, '');

function notificationApi(path: string): string {
  return `${notificationApiBase}${path}`;
}

function notificationStartToken(email: string): string {
  return btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function notificationJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(notificationApi(path), {
    ...init,
    credentials: notificationApiBase ? 'omit' : 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(notificationApiBase
      ? 'Notification API did not return JSON. Check the deployed API URL.'
      : 'Notification server is not available on this static deployment.');
  }
  const payload = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) throw new Error(payload.message || 'Notification request failed.');
  return payload as T;
}

const SUTD_DOMAINS = ['sutd.edu.sg', 'mymail.sutd.edu.sg'];
const STATIC_DEMO_CODE = '123456';

function isStaticHostedDemo(): boolean {
  return typeof window !== 'undefined' && (
    import.meta.env.PROD ||
    window.location.hostname.endsWith('github.io') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

function emailIsSUTD(email: string): boolean {
  return SUTD_DOMAINS.some((d) => email.toLowerCase().endsWith(`@${d}`));
}

function validateManualIdentity(name: string, email: string, studentId: string): string | null {
  if (!name.trim()) return 'Enter your full name.';
  if (!emailIsSUTD(email.trim())) return 'Use a verified SUTD email: sutd.edu.sg or mymail.sutd.edu.sg.';
  if (!/^[0-9]{7,9}$/i.test(studentId.trim())) return 'Use your numeric SUTD student ID, for example 1001234.';
  return null;
}

function createVerifiedManualUser(name: string, email: string, studentId: string): VerifiedUser {
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    studentId: studentId.trim().toUpperCase(),
    institutionId: 'sutd',
    institutionName: 'Singapore University of Technology and Design',
    shortName: 'SUTD',
    verifiedAt: new Date().toISOString(),
  };
}

function verifiedUserFromSSO(firebaseUser: { displayName: string | null; email: string | null }): VerifiedUser | null {
  const email = firebaseUser.email;
  if (!email || !emailIsSUTD(email)) return null;
  return {
    name: firebaseUser.displayName || email.split('@')[0].replace(/[._]/g, ' '),
    email,
    studentId: email.split('@')[0],
    institutionId: 'sutd',
    institutionName: 'Singapore University of Technology and Design',
    shortName: 'SUTD',
    verifiedAt: new Date().toISOString(),
  };
}

function App() {
  const [session, setSession] = useState<VerifiedUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // don't block render on server API
  const [institutions, setInstitutions] = useState<Institution[]>(fallbackInstitutions);
  const [preRole, setPreRole] = useState<UserRole | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(() => checkPrivacyConsent());
  const [ssoError, setSsoError] = useState('');
  const wasReset = useRef(false);

  // Firebase Auth SSO listener — takes priority over server session
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const verified = verifiedUserFromSSO(firebaseUser);
        if (verified) setSession(verified);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    let active = true;

    if (isStaticHostedDemo()) {
      setInstitutions(fallbackInstitutions);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    Promise.all([
      fetch('/api/auth/institutions').then((response) => response.json()).catch(() => ({ institutions: fallbackInstitutions })),
      fetch('/api/auth/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null).catch(() => null),
    ]).then(([institutionPayload, sessionPayload]) => {
      if (!active) return;
      if (institutionPayload?.institutions?.length) setInstitutions(institutionPayload.institutions);
      if (sessionPayload?.user && !session) setSession(sessionPayload.user);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);
    loadProfile(session.email).then((p) => {
      setProfile(p);
      setProfileLoaded(true);
    }).catch(() => {
      setProfile(null);
      setProfileLoaded(true);
    });
  }, [session?.email]);

  const handleVerified = (user: VerifiedUser) => {
    setProfile(null);
    setProfileLoaded(false);
    setSession(user);
  };

  const completeOnboarding = (nextProfile: StudentProfile) => {
    if (!session) return;
    setProfile(nextProfile);
    setProfileLoaded(true);
    saveProfile(session.email, nextProfile); // async fire-and-forget
  };

  const handleDemoLogin = (mode: DemoMode) => {
    const demoUsers: Record<DemoMode, VerifiedUser> = {
      freshman: {
        name: 'Vanika Sharma',
        email: 'demo.student@mymail.sutd.edu.sg',
        studentId: 'DEMO0001',
        institutionId: 'sutd',
        institutionName: 'Singapore University of Technology and Design',
        shortName: 'SUTD',
        verifiedAt: new Date().toISOString(),
      },
      returning: {
        name: 'Aarav Menon',
        email: 'demo.returning@mymail.sutd.edu.sg',
        studentId: 'DEMO0002',
        institutionId: 'sutd',
        institutionName: 'Singapore University of Technology and Design',
        shortName: 'SUTD',
        verifiedAt: new Date().toISOString(),
      },
    };
    const user = demoUsers[mode];
    if (wasReset.current) {
      wasReset.current = false;
      setSession(user);
    } else {
      const demoProfile = getDemoProfile(mode);
      setSession(user);
      setProfile(demoProfile);
      setProfileLoaded(true);
      saveProfile(user.email, demoProfile);
    }
  };

  const handleSSOLogin = async (_provider: 'microsoft') => {
    if (!auth) return;
    setSsoError('');
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const verified = verifiedUserFromSSO(result.user);
      if (!verified) {
        setSsoError('Only SUTD accounts (@sutd.edu.sg / @mymail.sutd.edu.sg) are allowed.');
        await signOut(auth);
        return;
      }
      setSession(verified);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in failed.';
      if (!msg.includes('popup-closed')) setSsoError(msg);
    }
  };

  const logout = () => {
    setProfile(null);
    setSession(null);
    setPreRole(null);
    if (auth) signOut(auth).catch(() => {});
  };

  const resetDemo = () => {
    Object.keys(localStorage).filter((k) => k.startsWith('cohortly.')).forEach((k) => localStorage.removeItem(k));
    if (auth) signOut(auth).catch(() => {});
    wasReset.current = true;
    setProfile(null);
    setSession(null);
    setPreRole(null);
    setShowAdmin(false);
    setSsoError('');
  };

  if (loading) return <LoadingScreen />;

  if (!privacyAccepted) {
    return (
      <PrivacyConsentModal
        onAccept={() => setPrivacyAccepted(true)}
        onDecline={() => { window.location.href = 'https://www.sutd.edu.sg'; }}
      />
    );
  }

  if (showAdmin) return <AdminApp onClose={() => setShowAdmin(false)} onResetDemo={resetDemo} />;

  if (!session && preRole === null) {
    return (
      <LandingScreen
        onSelectRole={setPreRole}
        onDemoLogin={handleDemoLogin}
        onAdminDemo={() => setShowAdmin(true)}
        onSSOLogin={handleSSOLogin}
        ssoError={ssoError}
      />
    );
  }

  if (!session) {
    return (
      <AuthScreen
        institutions={institutions}
        role={preRole!}
        onVerified={handleVerified}
        onBack={() => setPreRole(null)}
        onSSOLogin={handleSSOLogin}
        ssoError={ssoError}
      />
    );
  }

  if (!profileLoaded) return <LoadingScreen />;

  if (!profile) {
    return <ProfileOnboarding institutions={institutions} user={session} onComplete={completeOnboarding} initialRole={preRole ?? undefined} />;
  }

  return <StudentApp institutions={institutions} profile={profile} user={session} onLogout={logout} onProfileUpdate={completeOnboarding} onResetDemo={resetDemo} />;
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <span className="brand-mark">C</span>
      <strong>Opening Cohortly</strong>
    </div>
  );
}

function LandingHero3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(6.8, 5.2, 8.2);
    camera.lookAt(0, 0.35, 0);

    const root = new THREE.Group();
    root.rotation.y = -0.42;
    root.rotation.x = -0.02;
    root.position.y = 0.28;
    root.scale.setScalar(1.12);
    scene.add(root);

    const ambient = new THREE.HemisphereLight(0xf6fbff, 0x17315d, 2.6);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 4.8);
    key.position.set(6, 9, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0x41e7c6, 3.2, 12);
    rim.position.set(-4, 2.4, -3);
    scene.add(rim);
    const cobaltGlow = new THREE.PointLight(0x3155ff, 4.4, 14);
    cobaltGlow.position.set(3, 3, 3);
    scene.add(cobaltGlow);

    const materials = {
      platform: new THREE.MeshStandardMaterial({ color: 0xeaf1ff, roughness: 0.54, metalness: 0.08 }),
      platformSide: new THREE.MeshStandardMaterial({ color: 0xb9c8f2, roughness: 0.5, metalness: 0.16 }),
      building: new THREE.MeshStandardMaterial({ color: 0xf9fbff, roughness: 0.36, metalness: 0.18 }),
      buildingBlue: new THREE.MeshStandardMaterial({ color: 0xd9e6ff, roughness: 0.34, metalness: 0.22 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x10203a, roughness: 0.42, metalness: 0.2 }),
      cobalt: new THREE.MeshStandardMaterial({ color: 0x2346c7, emissive: 0x0b2a92, emissiveIntensity: 0.3, roughness: 0.32, metalness: 0.28 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x9bd8ff,
        roughness: 0.1,
        metalness: 0,
        transmission: 0.22,
        transparent: true,
        opacity: 0.56,
        thickness: 0.5,
      }),
      mint: new THREE.MeshStandardMaterial({ color: 0x45d6a3, emissive: 0x0d7b5d, emissiveIntensity: 0.45, roughness: 0.22 }),
      amber: new THREE.MeshStandardMaterial({ color: 0xffc45c, emissive: 0xb56700, emissiveIntensity: 0.35, roughness: 0.25 }),
      purple: new THREE.MeshStandardMaterial({ color: 0x9c7cff, emissive: 0x4023a8, emissiveIntensity: 0.38, roughness: 0.25 }),
      line: new THREE.MeshBasicMaterial({ color: 0x40d9ff, transparent: true, opacity: 0.52 }),
      packet: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      window: new THREE.MeshBasicMaterial({ color: 0xdbeaff, transparent: true, opacity: 0.82 }),
    };

    const addBox = (
      parent: THREE.Group,
      position: [number, number, number],
      scale: [number, number, number],
      material: THREE.Material,
      rotation: [number, number, number] = [0, 0, 0],
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      mesh.rotation.set(...rotation);
      parent.add(mesh);
      return mesh;
    };

    const addTower = (
      parent: THREE.Group,
      x: number,
      z: number,
      floors: number,
      width: number,
      depth: number,
      material: THREE.Material,
    ) => {
      const height = floors * 0.26;
      const tower = addBox(parent, [x, height / 2, z], [width, height, depth], material);
      addBox(parent, [x, height + 0.045, z], [width * 1.05, 0.08, depth * 1.05], materials.dark);
      for (let floor = 1; floor < floors; floor += 1) {
        const y = floor * 0.26;
        addBox(parent, [x, y, z + depth / 2 + 0.012], [width * 0.72, 0.018, 0.018], materials.window);
        addBox(parent, [x + width / 2 + 0.012, y, z], [0.018, 0.018, depth * 0.62], materials.window);
      }
      return tower;
    };

    const campus = new THREE.Group();
    root.add(campus);

    addBox(campus, [0, -0.14, 0], [6.4, 0.28, 4.55], materials.platformSide);
    addBox(campus, [0, 0.02, 0], [6.15, 0.12, 4.3], materials.platform);
    addBox(campus, [-1.95, 0.1, -1.28], [2.65, 0.055, 0.22], materials.cobalt, [0, 0.42, 0]);
    addBox(campus, [-1.1, 0.11, 0.52], [2.75, 0.055, 0.22], materials.cobalt, [0, -0.22, 0]);
    addBox(campus, [1.7, 0.11, 0.6], [2.4, 0.055, 0.2], materials.mint, [0, 0.38, 0]);
    addBox(campus, [1.25, 0.12, -1.3], [2.1, 0.055, 0.2], materials.amber, [0, -0.48, 0]);

    addTower(campus, -2.05, -0.85, 9, 0.72, 0.92, materials.building);
    addTower(campus, -1.2, -1.2, 11, 0.66, 1.02, materials.buildingBlue);
    addTower(campus, -1.6, 0.45, 8, 0.7, 0.9, materials.building);
    addTower(campus, 0.25, -0.15, 5, 1.15, 0.8, materials.glass);
    addTower(campus, 1.35, -0.82, 7, 0.78, 1.0, materials.building);
    addTower(campus, 2.18, -0.42, 10, 0.74, 1.0, materials.buildingBlue);
    addTower(campus, 1.7, 1.08, 6, 1.4, 0.54, materials.building);
    addTower(campus, 2.62, 1.15, 5, 0.72, 0.76, materials.glass);

    const court = new THREE.Group();
    campus.add(court);
    addBox(court, [-0.1, 0.16, 1.42], [1.6, 0.035, 0.92], materials.mint);
    addBox(court, [-0.1, 0.2, 1.42], [1.44, 0.018, 0.02], materials.window);
    addBox(court, [-0.1, 0.2, 1.42], [0.02, 0.018, 0.82], materials.window);

    const arcNodes: THREE.Mesh[] = [];
    const cGeo = new THREE.BoxGeometry(0.22, 0.13, 0.58);
    for (let i = 0; i < 33; i += 1) {
      const angle = THREE.MathUtils.degToRad(52 + i * 8.3);
      if (angle > THREE.MathUtils.degToRad(330)) continue;
      const radius = 3.1;
      const segment = new THREE.Mesh(cGeo, materials.cobalt);
      segment.position.set(Math.cos(angle) * radius, 0.42 + Math.sin(i * 0.7) * 0.035, Math.sin(angle) * radius * 0.72);
      segment.rotation.y = -angle + Math.PI / 2;
      campus.add(segment);
      arcNodes.push(segment);
    }

    const nodePositions: Array<[number, number, number, THREE.Material]> = [
      [-2.05, 2.72, -0.85, materials.mint],
      [-1.2, 3.18, -1.2, materials.cobalt],
      [0.25, 1.6, -0.15, materials.purple],
      [1.35, 2.18, -0.82, materials.amber],
      [2.18, 2.98, -0.42, materials.mint],
      [1.7, 1.82, 1.08, materials.cobalt],
      [-0.1, 0.54, 1.42, materials.amber],
    ];

    const nodeGeo = new THREE.SphereGeometry(0.11, 24, 24);
    const nodes = nodePositions.map(([x, y, z, mat]) => {
      const node = new THREE.Mesh(nodeGeo, mat);
      node.position.set(x, y + 0.24, z);
      campus.add(node);
      return node;
    });

    const curves: THREE.CatmullRomCurve3[] = [];
    const packets: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; speed: number; offset: number }> = [];
    const packetGeo = new THREE.SphereGeometry(0.055, 18, 18);

    for (let i = 0; i < nodes.length; i += 1) {
      const start = nodes[i].position.clone();
      const end = nodes[(i + 2) % nodes.length].position.clone();
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 0.72 + (i % 3) * 0.18;
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      curves.push(curve);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 42, 0.012, 8, false), materials.line);
      campus.add(tube);
      const packet = new THREE.Mesh(packetGeo, materials.packet);
      campus.add(packet);
      packets.push({ mesh: packet, curve, speed: 0.08 + i * 0.012, offset: i / nodes.length });
    }

    const halo = new THREE.Group();
    root.add(halo);
    for (let i = 0; i < 26; i += 1) {
      const angle = (i / 26) * Math.PI * 2;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), materials.line);
      node.position.set(Math.cos(angle) * 4.25, 0.75 + Math.sin(i * 1.6) * 0.12, Math.sin(angle) * 2.65);
      halo.add(node);
    }

    let frame = 0;
    const clock = new THREE.Clock();
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const animate = () => {
      const t = clock.getElapsedTime();
      root.rotation.y = -0.42 + Math.sin(t * 0.22) * 0.05;
      root.position.y = 0.28 + Math.sin(t * 0.55) * 0.05;
      halo.rotation.y = t * 0.08;
      arcNodes.forEach((segment, index) => {
        segment.position.y = 0.42 + Math.sin(t * 1.4 + index * 0.35) * 0.035;
      });
      nodes.forEach((node, index) => {
        const pulse = 1 + Math.sin(t * 2.2 + index * 0.9) * 0.16;
        node.scale.setScalar(pulse);
      });
      packets.forEach((packet) => {
        const p = packet.curve.getPoint((t * packet.speed + packet.offset) % 1);
        packet.mesh.position.copy(p);
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((object: THREE.Object3D) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      Object.values(materials).forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-3d-stage" aria-label="Animated 3D Cohortly campus network">
      <div className="hero-3d-grid" />
      <canvas ref={canvasRef} className="hero-3d-canvas" />
      <div className="hero-3d-hud hero-3d-hud--top">
        <span>Live SUTD cohort map</span>
        <strong>812 verified students</strong>
        <small>Freshmen, returning students, rooms, events and module help moving in one campus graph.</small>
      </div>
      <div className="hero-3d-hud hero-3d-hud--bottom">
        <span>Freshmore jio live</span>
        <strong>10.014 room active</strong>
      </div>
      <div className="hero-3d-chip hero-3d-chip--left">Campus-life circles</div>
      <div className="hero-3d-chip hero-3d-chip--right">Fifth Row plans</div>
    </div>
  );
}

function LandingScreen({
  onSelectRole,
  onDemoLogin,
  onAdminDemo,
  onSSOLogin,
  ssoError,
}: {
  onSelectRole: (role: UserRole) => void;
  onDemoLogin: (mode: DemoMode) => void;
  onAdminDemo: () => void;
  onSSOLogin: (p: 'microsoft') => void;
  ssoError: string;
}) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="brand-mark">C</span>
          <strong>Cohortly</strong>
          <span className="landing-badge">SUTD</span>
        </div>
        <div className="landing-nav-right">
          <span className="landing-live-pill">Verified access</span>
          <span className="landing-join-count">Freshman and returning student demos</span>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="landing-hero-left">
          <span className="landing-eyebrow-tag">
            <Sparkles size={12} /> Verified SUTD community
          </span>
          <h1>Meet your verified SUTD community before Day 1.</h1>
          <p>
            Find classmates, get module help from returning students, join small-group plans,
            and settle into campus with fewer unknowns.
          </p>

          <div className="landing-trust-row">
            <span className="landing-trust-chip"><ShieldCheck size={13} /> Verified SUTD network</span>
            <span className="landing-trust-chip"><Lock size={13} /> Private cohort</span>
            <span className="landing-trust-chip"><GraduationCap size={13} /> Built for Freshmores</span>
          </div>

          <div className="landing-story-panel">
            <strong>One calm place for the first weeks of university.</strong>
            <span>Freshmen see the next useful action. Returning students find class groups, floor circles, and first-week plans by year.</span>
          </div>

          <div className="sso-primary-block">
            <button className="sso-btn microsoft" onClick={() => onSSOLogin('microsoft')}>
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
              Sign in with SUTD Microsoft account
            </button>
            {ssoError && <p className="sso-error">{ssoError}</p>}
            <p className="sso-hint">Only @sutd.edu.sg and @mymail.sutd.edu.sg accounts are accepted.</p>
            <div className="sso-divider"><span>or continue manually</span></div>
          </div>

          <div className="landing-paths">
            <button className="path-card student-path" onClick={() => onSelectRole('student')}>
              <div className="path-card-icon"><GraduationCap size={20} /></div>
              <div className="path-card-text">
                <strong>I'm a freshman</strong>
                <span>Freshmore · Exchange · Incoming 2026</span>
              </div>
              <span className="path-card-arrow"><ArrowRight size={18} /></span>
            </button>

            <button className="path-card returning-path" onClick={() => onSelectRole('student')}>
              <div className="path-card-icon"><Users size={20} /></div>
              <div className="path-card-text">
                <strong>I'm a returning student</strong>
                <span>Year 2, 3 or 4 · grouped by year and pillar</span>
              </div>
              <span className="path-card-arrow"><ArrowRight size={18} /></span>
            </button>
          </div>

          <div className="landing-demo-inline" aria-label="Open demo modes">
            <span>Try a demo:</span>
            <button className="demo-btn student-demo" onClick={() => onDemoLogin('freshman')}>
              <GraduationCap size={14} /> Freshman
            </button>
            <button className="demo-btn returning-demo" onClick={() => onDemoLogin('returning')}>
              <Users size={14} /> Returning
            </button>
            <button className="demo-btn admin-demo" onClick={onAdminDemo}>
              <Building2 size={14} /> Admin
            </button>
          </div>
        </div>

        <div className="landing-hero-right">
          <LandingHero3D />
        </div>
      </div>

      <section className="landing-value-section">
        <h2>Built around student years and real campus groups</h2>
        <p>Cohortly keeps incoming and returning SUTD students together by cohort, module, floor, and Fifth Row interest.</p>
        <div className="landing-value-cards">
          <div className="landing-value-card landing-value-card--lead">
            <div className="landing-value-card-icon" style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}><Rocket size={20} /></div>
            <h3>Freshmore Launchpad</h3>
            <p>Track who's ready before Day 1, and surface students who quietly fall behind.</p>
          </div>
          <div className="landing-value-card">
            <div className="landing-value-card-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}><Users size={20} /></div>
            <h3>Returning student circles</h3>
            <p>Year 2, 3, and 4 students are grouped by pillar, module, floor, and live study plans.</p>
          </div>
          <div className="landing-value-card">
            <div className="landing-value-card-icon" style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc' }}><Sparkles size={20} /></div>
            <h3>Fifth Row Discovery</h3>
            <p>Clubs find their members before orientation — interest signals match students to CCAs.</p>
          </div>
          <div className="landing-value-card landing-value-card--wide">
            <div className="landing-value-card-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}><HeartHandshake size={20} /></div>
            <h3>Staff support signals</h3>
            <p>Privacy-safe support signals so advisors can reach out before a student disengages.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AuthScreen({
  institutions,
  role,
  onVerified,
  onBack,
  onSSOLogin,
  ssoError,
}: {
  institutions: Institution[];
  role: UserRole;
  onVerified: (user: VerifiedUser) => void;
  onBack: () => void;
  onSSOLogin: (p: 'microsoft') => void;
  ssoError: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [step, setStep] = useState<'identity' | 'code'>('identity');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');


  const requestCode = async () => {
    setBusy(true);
    setError('');
    try {
      if (isStaticHostedDemo()) {
        const validationError = validateManualIdentity(name, email, studentId);
        if (validationError) throw new Error(validationError);
        setDevCode(STATIC_DEMO_CODE);
        setCode(STATIC_DEMO_CODE);
        setStep('code');
        return;
      }

      const payload = await postJson<{ devCode?: string }>('/api/auth/start', {
        institutionId: 'sutd',
        name,
        email,
        studentId,
      });
      setDevCode(payload.devCode || '');
      setCode(payload.devCode || '');
      setStep('code');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not request verification code.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setBusy(true);
    setError('');
    try {
      if (isStaticHostedDemo()) {
        if (code.trim() !== STATIC_DEMO_CODE) throw new Error('Enter the 6-digit verification code shown above.');
        onVerified(createVerifiedManualUser(name, email, studentId));
        return;
      }

      const payload = await postJson<{ user: VerifiedUser }>('/api/auth/verify', { email, code });
      onVerified(payload.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not verify your code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card-brand">
          <span className="brand-mark">C</span>
          <span>
            <strong>Cohortly</strong>
            <small>SUTD verified network</small>
          </span>
        </div>

        <div className="auth-role-hint">
          <GraduationCap size={16} />
          Joining as a verified SUTD student
        </div>

        {step === 'identity' && (
          <div className="auth-sso-block">
            <button className="sso-btn microsoft" onClick={() => onSSOLogin('microsoft')}>
              <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
              Sign in with SUTD Microsoft
            </button>
            {ssoError && <p className="sso-error">{ssoError}</p>}
            <div className="sso-divider"><span>or verify manually below</span></div>
          </div>
        )}

        <h2>{step === 'identity' ? 'Verify your SUTD identity' : 'Enter your verification code'}</h2>
        <p className="auth-card-sub">
          {step === 'identity'
            ? "Use your university email and student ID. A one-time code will be sent to your inbox."
            : "We sent a 6-digit code to your SUTD email. Enter it below to finish verifying."}
        </p>

        {step === 'identity' ? (
          <div className="auth-form">
            <div className="institution-badge">
              <BadgeCheck size={18} />
              <div>
                <strong>Singapore University of Technology and Design</strong>
                <span>@sutd.edu.sg or @mymail.sutd.edu.sg</span>
              </div>
            </div>
            <label className="field">
              Full name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
            </label>
            <label className="field">
              SUTD email
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@mymail.sutd.edu.sg" />
            </label>
            <label className="field">
              Student ID
              <input value={studentId} onChange={(event) => setStudentId(event.target.value.toUpperCase())} placeholder="1001234" />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button wide" onClick={requestCode} disabled={busy}>
              <MailCheck size={18} />
              {busy ? 'Checking...' : 'Send verification code'}
            </button>
            <div className="auth-back-link">
              <button className="text-button" onClick={onBack}>
                <ChevronLeft size={15} /> Back to role selection
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-form">
            <div className="verification-note">
              <ShieldCheck size={18} />
              <div>
                <strong>Code sent to your SUTD email</strong>
                <span>Check your inbox. The code expires in 10 minutes.</span>
              </div>
            </div>
            {devCode && <div className="dev-code">Dev mode — OTP: <strong>{devCode}</strong></div>}
            <label className="field">
              Verification code
              <input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" placeholder="000000" />
            </label>
            {error && <div className="form-error">{error}</div>}
            <div className="auth-actions">
              <button className="secondary-button" onClick={() => setStep('identity')} disabled={busy}>Back</button>
              <button className="primary-button" onClick={verifyCode} disabled={busy}>
                <ArrowRight size={18} />
                {busy ? 'Verifying...' : 'Enter Cohortly'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function loadLaunchpadStatuses(email: string): Record<string, TaskStatus> {
  try { const r = localStorage.getItem(`cohortly.launchpad.${email}`); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveLaunchpadStatuses(email: string, s: Record<string, TaskStatus>) {
  try { localStorage.setItem(`cohortly.launchpad.${email}`, JSON.stringify(s)); } catch {}
}

type InterventionCase = {
  id: string;
  studentId: string;
  studentName: string;
  reason: string;
  severity: 'info' | 'warning' | 'urgent';
  suggestedAction: string;
  status: 'new' | 'contacted' | 'monitoring' | 'resolved' | 'escalated';
  notes: string;
  createdAt: string;
  updatedAt: string;
  source: string;
};

function loadInterventionCases(): InterventionCase[] {
  try { return JSON.parse(localStorage.getItem('intervention_cases') ?? '[]'); } catch { return []; }
}
function saveInterventionCases(cases: InterventionCase[]) {
  try { localStorage.setItem('intervention_cases', JSON.stringify(cases)); } catch {}
}
function addInterventionCase(studentId: string, studentName: string, reason: string, source: string) {
  const cases = loadInterventionCases();
  const existing = cases.find(c => c.studentId === studentId && c.source === source && c.status === 'new');
  if (existing) return;
  const newCase: InterventionCase = {
    id: `case-${Date.now()}`,
    studentId, studentName, reason,
    severity: 'info',
    suggestedAction: 'Send a check-in message',
    status: 'new',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source,
  };
  saveInterventionCases([newCase, ...cases]);
}

type InviteRecord = {
  id: string;
  name: string;
  email: string;
  role: 'Freshmore' | 'Exchange' | 'Returning Student' | 'Staff';
  pillar: string;
  cohort: string;
  status: 'not_sent' | 'sent' | 'opened' | 'verified' | 'onboarded';
  createdAt: string;
};

const inviteDemoCsv = `Aarav Menon,aarav_menon@mymail.sutd.edu.sg,Freshmore,Freshmore
Lim Jia En,jiaen_lim@mymail.sutd.edu.sg,Freshmore,DAI
Nur Aisyah,aisyah_nur@mymail.sutd.edu.sg,Exchange,Exchange
Tan Wei Ming,weiming_tan@mymail.sutd.edu.sg,Returning Student,ISTD
Sarah Chen,sarah_chen@mymail.sutd.edu.sg,Freshmore,ASD
Nikhil Kumar,nikhil_kumar@mymail.sutd.edu.sg,Freshmore,EPD`;

function loadInviteRecords(): InviteRecord[] {
  try { return JSON.parse(localStorage.getItem('admin_invites') ?? '[]'); } catch { return []; }
}
function saveInviteRecords(records: InviteRecord[]) {
  try { localStorage.setItem('admin_invites', JSON.stringify(records)); } catch {}
}
function parseInviteCsv(text: string, cohort: string): InviteRecord[] {
  const validRoles = ['Freshmore', 'Exchange', 'Returning Student', 'Staff'];
  return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line, i) => {
    const [name = '', email = '', role = 'Freshmore', pillar = ''] = line.split(',').map((s) => s.trim());
    const safeRole = (validRoles.includes(role) ? role : 'Freshmore') as InviteRecord['role'];
    return {
      id: `inv-${Date.now()}-${i}`,
      name, email, role: safeRole,
      pillar: pillar || safeRole,
      cohort,
      status: 'not_sent' as const,
      createdAt: new Date().toISOString(),
    };
  }).filter((r) => r.name && r.email);
}
function seedInviteRecords(): InviteRecord[] {
  const existing = loadInviteRecords();
  if (existing.length > 0) return existing;
  const statuses: InviteRecord['status'][] = ['onboarded', 'verified', 'opened', 'sent', 'not_sent', 'verified'];
  const seeded = parseInviteCsv(inviteDemoCsv, 'Freshmore AY2026').map((r, i) => ({ ...r, status: statuses[i % statuses.length] }));
  saveInviteRecords(seeded);
  return seeded;
}

function markPulseShown() {
  try { localStorage.setItem('cohortly.pulse.lastShown', Date.now().toString()); } catch {}
}

function compatClass(matchStr: string): string {
  const num = parseInt(matchStr, 10);
  if (num >= 90) return 'compat-high';
  if (num >= 75) return 'compat-good';
  if (num >= 55) return 'compat-ok';
  return 'compat-low';
}

function personYearLabel(person: Person): string {
  return person.year ?? person.role.split('·')[0].trim();
}

function personPillarLabel(person: Person): string {
  if (person.pillar) return person.pillar;
  const roleParts = person.role.split('·').map((part) => part.trim()).filter(Boolean);
  return roleParts[1] ?? person.tags[0] ?? 'SUTD';
}

function personCompactDetail(person: Person, maxLength = 88): string {
  const sentenceMatch = person.detail.match(/^.*?(?:\.(?=\s|$)|$)/);
  const firstSentence = sentenceMatch?.[0]?.replace(/\.$/, '').trim() || person.detail;
  if (firstSentence.length <= maxLength) return firstSentence;
  return `${firstSentence.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function personCardHighlight(person: Person): string {
  if (person.helpStyle?.[0]) return person.helpStyle[0];
  if (person.modules?.[0]) return person.modules[0];

  const roleLower = person.role.toLowerCase();
  const keyTags = person.tags
    .filter((tag) => !roleLower.includes(tag.toLowerCase()))
    .slice(0, 2);
  const tagSummary = keyTags.length > 0 ? keyTags.join(' + ') : person.tags.slice(0, 2).join(' + ');
  if (/incoming|freshmore/i.test(person.role)) return `Incoming ${personPillarLabel(person)} · ${tagSummary}`;
  if (/exchange/i.test(person.role)) return `Exchange ${personPillarLabel(person).replace(' pillar', '')} · ${tagSummary}`;
  return tagSummary || personCompactDetail(person, 64);
}

function personKeyHighlights(person: Person): string[] {
  const highlights = [
    person.helpStyle?.[0],
    person.modules?.[0],
    person.availability,
    personCompactDetail(person),
    ...person.tags,
  ].filter((item): item is string => Boolean(item));
  return Array.from(new Set(highlights)).slice(0, 3);
}

function PfpUpload({ pfpUrl, onChange }: { pfpUrl: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="pfp-upload" onClick={() => inputRef.current?.click()} title="Click to upload photo">
      {pfpUrl ? (
        <img src={pfpUrl} alt="Profile" className="pfp-upload-img" />
      ) : (
        <div className="pfp-upload-placeholder">
          <Camera size={22} />
          <span>Add photo</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
}

const pillarOptions = [
  { id: 'Freshmore', label: 'Freshmore', desc: 'Year 1 · Pre-pillar' },
  { id: 'ISTD', label: 'ISTD', desc: 'Info Systems & Technology' },
  { id: 'ESD', label: 'ESD', desc: 'Engineering Systems & Design' },
  { id: 'EPD', label: 'EPD', desc: 'Engineering Product Dev.' },
  { id: 'ASD', label: 'ASD', desc: 'Architecture & Sustainable Design' },
  { id: 'DAI', label: 'DAI', desc: 'Design & AI' },
  { id: 'Exchange', label: 'Exchange', desc: 'International exchange' },
];

const termOptions = [
  'September 2026 · Freshmore Year 1 (AY2026)',
  'September 2027 · Freshmore Year 1 (AY2027)',
  'September 2028 · Freshmore Year 1 (AY2028)',
];

function ProfileOnboarding({
  institutions,
  user,
  onComplete,
  initialRole,
}: {
  institutions: Institution[];
  user: VerifiedUser;
  onComplete: (profile: StudentProfile) => void;
  initialRole?: UserRole;
}) {
  const institution = institutionFor(user.institutionId, institutions);
  const [onboardStep, setOnboardStep] = useState<'role' | 'major' | 'profile'>(
    initialRole === 'student' ? 'major' : initialRole === 'mentor' ? 'profile' : 'role',
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole ?? 'student');
  const [pillar, setPillar] = useState('');
  const [term, setTerm] = useState('');
  const [pfpDataUrl, setPfpDataUrl] = useState('');

  const [timetableText, setTimetableText] = useState('');
  const [timetableDetected, setTimetableDetected] = useState<string[]>([]);

  const parseTimetable = (text: string) => {
    const modulePattern = /\b(\d{2}\.\d{3})\b/g;
    const codes = [...new Set(Array.from(text.matchAll(modulePattern)).map((m) => m[1]))];
    const matched = classOptions.filter((c) => codes.some((code) => c.startsWith(code)));
    setTimetableDetected(matched);
    if (matched.length > 0) setClasses(matched);
  };

  // Student fields
  const [classes, setClasses] = useState<string[]>(['10.014 Computational Thinking', '10.009 The Digital World']);
  const [interests, setInterests] = useState<string[]>(['Startups & iCube', 'Badminton', 'Food & Cafes']);
  const [goals, setGoals] = useState<string[]>(['Find my first-week circle', 'Get returning-student module advice']);
  const [availability, setAvailability] = useState(availabilityOptions[0]);
  const [homeBase, setHomeBase] = useState('Freshmore housing / East Coast');
  const [intro, setIntro] = useState('New to SUTD and looking for low-pressure events, coding help, and startup friends.');

  // Mentor fields
  const [mentorYear, setMentorYear] = useState('');
  const [mentorPillar, setMentorPillar] = useState('');
  const [mentorModules, setMentorModules] = useState<string[]>([]);
  const [mentorHelpStyle, setMentorHelpStyle] = useState<string[]>([]);
  const [mentorBio, setMentorBio] = useState('');

  const mentorPillarGroup = useMemo(
    () => classGroups.find((g) => g.pillarKey === mentorPillar.toLowerCase()) ?? null,
    [mentorPillar],
  );

  const studentProfile = useMemo<StudentProfile>(
    () => ({
      role: 'student', classes, interests, goals, availability, homeBase, intro,
      pillar: pillar || undefined,
      term: term || undefined,
      pfpDataUrl: pfpDataUrl || undefined,
    }),
    [availability, classes, goals, homeBase, interests, intro, pillar, term, pfpDataUrl],
  );

  const mentorProfile = useMemo<StudentProfile>(
    () => ({
      role: 'mentor',
      classes: mentorModules,
      interests: [],
      goals: [],
      availability,
      homeBase: mentorPillar,
      intro: mentorBio,
      mentorYear,
      mentorPillar,
      mentorModules,
      mentorHelpStyle,
    }),
    [availability, mentorBio, mentorHelpStyle, mentorModules, mentorPillar, mentorYear],
  );

  const toggle = (value: string, selected: string[], setSelected: (next: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  const canOpenStudent = classes.length > 0 && interests.length > 0 && goals.length > 0 && intro.trim().length > 10;
  const canOpenMentor = mentorYear !== '' && mentorPillar !== '' && mentorModules.length > 0 && mentorBio.trim().length > 10;

  if (onboardStep === 'role') {
    return (
      <main className="role-select-page">
        <div className="role-select-header">
          <div className="auth-brand compact">
            <span className="brand-mark">C</span>
            <span>
              <strong>Cohortly</strong>
              <small>{institution.shortName} verified</small>
            </span>
          </div>
          <div className="setup-proof">
            <ShieldCheck size={16} />
            <span>{user.email}</span>
          </div>
        </div>
        <div className="role-select-content">
          <h1>Welcome to SUTD Cohortly, {user.name.split(' ')[0]}.</h1>
          <p>Pick the student stage that fits you. Cohortly groups people by year, pillar, module, and floor.</p>
          <div className="role-cards">
            <button
              className="role-card student-role-card"
              onClick={() => { setSelectedRole('student'); setOnboardStep('major'); }}
            >
              <div className="role-card-icon"><GraduationCap size={28} /></div>
              <strong>Freshman</strong>
              <em>Freshmore · Exchange · New arrival</em>
              <ul>
                <li><Check size={14} /> Find your first-week cohort circle</li>
                <li><Check size={14} /> Get module help from returning students</li>
                <li><Check size={14} /> Join events before orientation starts</li>
                <li><Check size={14} /> One place for classes, people, events</li>
              </ul>
              <span className="role-card-cta">Set up student profile <ArrowRight size={15} /></span>
            </button>
            <button
              className="role-card mentor-role-card"
              onClick={() => { setSelectedRole('student'); setOnboardStep('major'); }}
            >
              <div className="role-card-icon mentor"><Users size={28} /></div>
              <strong>Returning Student</strong>
              <em>Year 2, 3 or 4 · grouped by year</em>
              <ul>
                <li><Check size={14} /> Find students in your pillar and year</li>
                <li><Check size={14} /> Join module rooms and project groups</li>
                <li><Check size={14} /> Share useful campus plans with your cohort</li>
                <li><Check size={14} /> Keep Campus Life, Fifth Row, and class circles together</li>
              </ul>
              <span className="role-card-cta">Set up returning profile <ArrowRight size={15} /></span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (onboardStep === 'major') {
    return (
      <main className="role-select-page">
        <div className="role-select-header">
          <div className="auth-brand compact">
            <span className="brand-mark">C</span>
            <span>
              <strong>Cohortly</strong>
              <small>{institution.shortName} verified</small>
            </span>
          </div>
          <div className="setup-proof">
            <ShieldCheck size={16} />
            <span>{user.email}</span>
          </div>
        </div>
        <div className="major-step">
          <div className="major-step-head">
            <button className="text-button" onClick={() => setOnboardStep('role')}>
              <ChevronLeft size={15} /> Back
            </button>
            <h1>Tell us about your journey.</h1>
            <p>Cohortly uses this to match you to the right classmates, returning students, and module rooms instantly.</p>
          </div>

          <div className="setup-section">
            <div className="setup-label"><GraduationCap size={18} /><strong>Which pillar are you in?</strong></div>
            <div className="pillar-grid">
              {pillarOptions.map((p) => (
                <button
                  key={p.id}
                  className={pillar === p.id ? 'pillar-card selected' : 'pillar-card'}
                  onClick={() => setPillar(p.id)}
                >
                  <strong>{p.label}</strong>
                  <small>{p.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <div className="setup-label"><Clock3 size={18} /><strong>When are you joining?</strong></div>
            <div className="choice-grid">
              {termOptions.map((t) => (
                <button
                  key={t}
                  className={term === t ? 'choice selected' : 'choice'}
                  onClick={() => setTerm(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-button"
            style={{ alignSelf: 'flex-start', minWidth: 160 }}
            disabled={!pillar || !term}
            onClick={() => setOnboardStep('profile')}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </main>
    );
  }

  if (selectedRole === 'mentor') {
    return (
      <main className="setup-page">
        <section className="setup-intro mentor-intro">
          <div className="auth-brand compact">
            <span className="brand-mark">C</span>
            <span>
              <strong>Cohortly</strong>
              <small>{institution.shortName} verified</small>
            </span>
          </div>
          <div>
            <span className="soft-pill"><HeartHandshake size={15} /> Returning student setup</span>
            <h1>Your profile tells freshmores exactly who to reach.</h1>
            <p>
              Pick the modules you can help with. Cohortly matches you to students who have questions in those exact rooms
              — no cold messages, no guesswork.
            </p>
          </div>
          <div className="setup-proof">
            <ShieldCheck size={18} />
            <span>{user.email}</span>
          </div>
          <button className="text-button" style={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => setOnboardStep('role')}>
            <ChevronLeft size={16} /> Switch role
          </button>
        </section>

        <section className="setup-workspace">
          <div className="setup-card">
            <div className="setup-card-head">
              <span className="eyebrow">Mentor profile</span>
              <h2>Your year, pillar, and module expertise</h2>
            </div>

            <div className="setup-section">
              <div className="setup-label"><GraduationCap size={18} /><strong>Your year</strong></div>
              <div className="choice-grid">
                {mentorYearOptions.map((year) => (
                  <button
                    key={year}
                    className={mentorYear === year ? 'choice selected' : 'choice'}
                    onClick={() => setMentorYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-section">
              <div className="setup-label"><BookOpen size={18} /><strong>Your pillar</strong></div>
              <div className="choice-grid">
                {mentorPillarOptions.map((pillar) => (
                  <button
                    key={pillar}
                    className={mentorPillar === pillar ? 'choice selected' : 'choice'}
                    onClick={() => { setMentorPillar(pillar); setMentorModules([]); }}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>

            {mentorPillarGroup && (
              <div className="setup-section">
                <div className="setup-label"><Sparkles size={18} /><strong>Modules you can help with</strong></div>
                <div className="choice-grid">
                  {[...classGroups[0].courses, ...mentorPillarGroup.courses].map((course) => (
                    <button
                      key={course}
                      className={mentorModules.includes(course) ? 'choice selected' : 'choice'}
                      onClick={() => toggle(course, mentorModules, setMentorModules)}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="setup-section">
              <div className="setup-label"><HeartHandshake size={18} /><strong>How you prefer to help</strong></div>
              <div className="choice-grid wide">
                {mentorHelpStyleOptions.map((style) => (
                  <button
                    key={style}
                    className={mentorHelpStyle.includes(style) ? 'choice selected' : 'choice'}
                    onClick={() => toggle(style, mentorHelpStyle, setMentorHelpStyle)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-fields">
              <label className="field">
                Availability
                <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                  {availabilityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            </div>

            <label className="field">
              Short bio for students
              <textarea
                value={mentorBio}
                onChange={(event) => setMentorBio(event.target.value)}
                placeholder={`Year ${mentorYear || '3'} ${mentorPillar || 'ISTD'} student. Can help with recursion, data structures, and lab preparation. Ping me through Cohortly.`}
              />
            </label>
          </div>

          <aside className="setup-preview">
            <span className="eyebrow">Your mentor card</span>
            <h2>What freshmores see</h2>
            <div className="mentor-preview-card">
              <Avatar name={user.name} color="teal" />
              <div>
                <strong>{user.name}</strong>
                <span>{mentorYear || 'Year ?'} · {mentorPillar || 'Pillar'}</span>
              </div>
              <div className="tag-row" style={{ marginTop: 8 }}>
                {mentorModules.slice(0, 4).map((m) => <span key={m}>{m}</span>)}
                {mentorModules.length > 4 && <span>+{mentorModules.length - 4} more</span>}
              </div>
              {mentorBio && <p style={{ marginTop: 10, color: 'var(--muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>{mentorBio}</p>}
            </div>
            <div className="preview-list">
              <div>
                <Users size={18} />
                <span>Matched to freshmores in {mentorModules.length || 'your'} module{mentorModules.length !== 1 ? 's' : ''}</span>
              </div>
              <div>
                <MessageCircle size={18} />
                <span>Students can reach you through Cohortly, not random Telegram cold-messages</span>
              </div>
              <div>
                <Clock3 size={18} />
                <span>{availability} availability shown on your card</span>
              </div>
            </div>
            <button className="primary-button wide" onClick={() => onComplete(mentorProfile)} disabled={!canOpenMentor}>
              <ArrowRight size={18} />
              Open mentor dashboard
            </button>
          </aside>
        </section>
      </main>
    );
  }

  // Student onboarding
  return (
    <main className="setup-page">
      <section className="setup-intro">
        <div className="auth-brand compact">
          <span className="brand-mark">C</span>
          <span>
            <strong>Cohortly</strong>
            <small>{institution.shortName} verified</small>
          </span>
        </div>
        <div>
          <span className="soft-pill"><Sparkles size={15} /> Incoming student setup</span>
          <h1>Pick your classes. Find your people.</h1>
          <p>
            Choose courses from any pillar, your interests, and first-week goals. Cohortly uses these to surface relevant
            class rooms, returning-student groups, and student circles — instead of one giant chat.
          </p>
        </div>
        <div className="setup-proof">
          <ShieldCheck size={18} />
          <span>{user.email}</span>
        </div>
        <button className="text-button" style={{ color: 'rgba(255,255,255,0.6)' }} onClick={() => setOnboardStep('major')}>
          <ChevronLeft size={16} /> Back
        </button>
      </section>

      <section className="setup-workspace">
        <div className="setup-card">
          <div className="setup-card-head">
            <span className="eyebrow">Build profile</span>
            <h2>Almost there — pick your modules and introduce yourself</h2>
          </div>

          <div className="pfp-upload-row">
            <PfpUpload pfpUrl={pfpDataUrl} onChange={setPfpDataUrl} />
            <div>
              <strong>Add a profile photo</strong>
              <p>Help your cohort put a face to the name</p>
            </div>
          </div>

          <label className="field">
            Introduce yourself
            <textarea
              value={intro}
              onChange={(event) => setIntro(event.target.value)}
              placeholder="What are you excited about, what do you need help with, what do you want to find here?"
              rows={3}
            />
          </label>

          <div className="setup-section timetable-import-box">
            <div className="setup-label"><FileSpreadsheet size={18} /><strong>Import from timetable (optional)</strong></div>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: '0 0 8px' }}>
              Copy your timetable from ModTrek or Canvas and paste it here — we'll auto-detect your module codes and pre-select your rooms.
            </p>
            <textarea
              className="timetable-paste-area"
              placeholder="Paste your ModTrek or Canvas timetable text here…"
              value={timetableText}
              rows={4}
              onChange={(e) => { setTimetableText(e.target.value); parseTimetable(e.target.value); }}
            />
            {timetableDetected.length > 0 && (
              <div className="timetable-detected">
                <Check size={13} style={{ color: '#059669', flexShrink: 0 }} />
                <span>Detected {timetableDetected.length} module{timetableDetected.length !== 1 ? 's' : ''}: {timetableDetected.map((c) => c.split(' ')[0]).join(', ')} — auto-selected below.</span>
              </div>
            )}
          </div>

          {classGroups.map((group) => (
            <div className="setup-section" key={group.pillarKey}>
              <div className="setup-label">
                <GraduationCap size={16} />
                <strong>{group.label}</strong>
              </div>
              <div className="choice-grid">
                {group.courses.map((course) => (
                  <button
                    key={course}
                    className={classes.includes(course) ? 'choice selected' : 'choice'}
                    onClick={() => toggle(course, classes, setClasses)}
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="setup-section">
            <div className="setup-label"><HeartHandshake size={18} /><strong>Interests</strong></div>
            <div className="choice-grid">
              {interestOptions.map((option) => (
                <button
                  key={option}
                  className={interests.includes(option) ? 'choice selected' : 'choice'}
                  onClick={() => toggle(option, interests, setInterests)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <div className="setup-label"><CircleUserRound size={18} /><strong>First-week goals</strong></div>
            <div className="choice-grid wide">
              {goalOptions.map((option) => (
                <button
                  key={option}
                  className={goals.includes(option) ? 'choice selected' : 'choice'}
                  onClick={() => toggle(option, goals, setGoals)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-fields">
            <label className="field">
              Availability
              <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                {availabilityOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="field">
              Home base
              <input value={homeBase} onChange={(event) => setHomeBase(event.target.value)} placeholder="Freshmore circle / commuter / etc." />
            </label>
          </div>

        </div>

        <aside className="setup-preview">
          <span className="eyebrow">What opens next</span>
          <h2>Your network is not random anymore</h2>
          <div className="preview-list">
            <div>
              <BookOpen size={18} />
              <span>{classes.slice(0, 2).join(', ') || 'Module'} rooms with returning students already attached</span>
            </div>
            <div>
              <Users size={18} />
              <span>{interests.slice(0, 2).join(', ') || 'Interest'} circles with verified SUTD students</span>
            </div>
            <div>
              <Clock3 size={18} />
              <span>{availability} events and study groups shown first</span>
            </div>
            <div>
              <Globe2 size={18} />
              <span>One verified network instead of 12 scattered Telegram chats</span>
            </div>
          </div>
          <button className="primary-button wide" onClick={() => onComplete(studentProfile)} disabled={!canOpenStudent}>
            <ArrowRight size={18} />
            Open network
          </button>
        </aside>
      </section>
    </main>
  );
}

function EditProfileSheet({
  profile,
  onSave,
  onClose,
}: {
  profile: StudentProfile;
  onSave: (p: StudentProfile) => void;
  onClose: () => void;
}) {
  const [intro, setIntro] = useState(profile.intro);
  const [interests, setInterests] = useState(profile.interests);
  const [goals, setGoals] = useState(profile.goals);
  const [availability, setAvailability] = useState(profile.availability);
  const [homeBase, setHomeBase] = useState(profile.homeBase);
  const [pfpDataUrl, setPfpDataUrl] = useState(profile.pfpDataUrl ?? '');

  const toggle = (value: string, selected: string[], setSelected: (next: string[]) => void) =>
    setSelected(selected.includes(value) ? selected.filter((i) => i !== value) : [...selected, value]);

  const save = () => {
    onSave({ ...profile, intro, interests, goals, availability, homeBase, pfpDataUrl: pfpDataUrl || undefined });
    onClose();
  };

  return (
    <div className="edit-profile-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="edit-profile-panel">
        <div className="edit-profile-header">
          <h2>Edit profile</h2>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="edit-profile-body">
          <div className="edit-profile-section">
            <strong>Profile photo</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <PfpUpload pfpUrl={pfpDataUrl} onChange={setPfpDataUrl} />
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Click the circle to upload a photo</span>
            </div>
          </div>
          <div className="edit-profile-section">
            <strong>Bio</strong>
            <label className="field">
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={3}
                placeholder="What are you excited about, what do you need help with?"
              />
            </label>
          </div>
          <div className="edit-profile-section">
            <strong>Interests</strong>
            <div className="choice-grid">
              {interestOptions.map((opt) => (
                <button
                  key={opt}
                  className={interests.includes(opt) ? 'choice selected' : 'choice'}
                  onClick={() => toggle(opt, interests, setInterests)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="edit-profile-section">
            <strong>First-week goals</strong>
            <div className="choice-grid wide">
              {goalOptions.map((opt) => (
                <button
                  key={opt}
                  className={goals.includes(opt) ? 'choice selected' : 'choice'}
                  onClick={() => toggle(opt, goals, setGoals)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="edit-profile-section">
            <strong>Availability</strong>
            <label className="field">
              <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                {availabilityOptions.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            </label>
          </div>
          <div className="edit-profile-section">
            <strong>Home base</strong>
            <label className="field">
              <input value={homeBase} onChange={(e) => setHomeBase(e.target.value)} placeholder="Freshmore circle / commuter / etc." />
            </label>
          </div>
        </div>
        <div className="edit-profile-footer">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function checkPrivacyConsent(): boolean {
  try { return !!localStorage.getItem('cohortly.privacy.v1'); } catch { return true; }
}
function acceptPrivacy() {
  try { localStorage.setItem('cohortly.privacy.v1', Date.now().toString()); } catch {}
}

function PrivacyConsentModal({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        <div className="consent-modal-head">
          <strong>Before you continue</strong>
          <p>Cohortly collects and processes your data to connect you with the right people, events, classes, and campus-life groups at SUTD. Under the Singapore Personal Data Protection Act (PDPA), you have the right to know what we collect and why.</p>
        </div>
        <div className="consent-points">
          <div className="consent-point">
            <div className="consent-point-icon"><Lock size={16} /></div>
            <div className="consent-point-text">
              <strong>What we store</strong>
              <p>Your name, SUTD email, pillar, interests, goals, and connections. Your profile photo is stored locally on your device only — never uploaded to our servers.</p>
            </div>
          </div>
          <div className="consent-point">
            <div className="consent-point-icon"><Eye size={16} /></div>
            <div className="consent-point-text">
              <strong>Who can see your data</strong>
              <p>Other verified SUTD students can see your profile and connection activity. SUTD administrators can see anonymised aggregate wellbeing signals. Individual pulse responses are never shared.</p>
            </div>
          </div>
          <div className="consent-point">
            <div className="consent-point-icon"><Database size={16} /></div>
            <div className="consent-point-text">
              <strong>Where it's stored</strong>
              <p>Your data is stored in Firebase (Google Cloud, Singapore region). It is not sold to third parties and is not used for advertising.</p>
            </div>
          </div>
          <div className="consent-point">
            <div className="consent-point-icon"><RotateCcw size={16} /></div>
            <div className="consent-point-text">
              <strong>Your rights</strong>
              <p>You can request a copy of your data or ask for deletion at any time by emailing privacy@cohortly.app. Your account and all data will be removed within 14 days.</p>
            </div>
          </div>
        </div>
        <p className="consent-fine-print">By clicking "I agree", you consent to your data being processed as described above and confirm you are a verified SUTD student or staff member. This consent can be withdrawn at any time.</p>
        <div className="consent-actions">
          <button className="secondary-button" onClick={onDecline}>Decline & exit</button>
          <button className="primary-button" onClick={() => { acceptPrivacy(); onAccept(); }}>I agree — continue to Cohortly</button>
        </div>
      </div>
    </div>
  );
}

const pulseQuestions = [
  { id: 'belonging', label: 'I feel like I belong at SUTD', options: ['😢', '😕', '😐', '🙂', '😄'] },
  { id: 'academic', label: 'I feel on top of my academics', options: ['😢', '😕', '😐', '🙂', '😄'] },
  { id: 'social', label: 'I have people I can talk to here', options: ['😢', '😕', '😐', '🙂', '😄'] },
  { id: 'energy', label: 'My energy levels this week were', options: ['Very low', 'Low', 'OK', 'Good', 'Great'] },
  { id: 'ask', label: 'I felt comfortable asking for help', options: ['Not at all', 'A bit', 'Sometimes', 'Mostly', 'Always'] },
  { id: 'overall', label: 'Overall, this week was', options: ['Really hard', 'Tough', 'OK', 'Good', 'Awesome'] },
];

type ChatMsg = { role: 'user' | 'bot'; text: string; followUps?: string[] };

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} style={{ margin: '4px 0 4px 16px', padding: 0 }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ marginBottom: 2 }}>{inlineFormat(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  const inlineFormat = (line: string): React.ReactNode => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : p
    );
  };

  for (const line of lines) {
    if (line.startsWith('- ') || line.startsWith('• ')) {
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      if (line.trim() === '') {
        nodes.push(<br key={`br-${nodes.length}`} />);
      } else {
        nodes.push(<span key={`l-${nodes.length}`} style={{ display: 'block' }}>{inlineFormat(line)}</span>);
      }
    }
  }
  flushList();
  return <>{nodes}</>;
}

const INITIAL_SUGGESTIONS = [
  'How does 10.014 work?',
  'What should I bring for move-in?',
  'How do I find returning students?',
  'How does Pass/Fail grading work?',
  'What is Fifth Row?',
  'Where to get mental health help?',
];

function AICompanion() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'bot',
      text: "Hi! I'm Cohortly AI — your SUTD campus guide.\n\nAsk me anything about modules, campus life, housing guidance, admin, Fifth Row clubs, wellbeing, careers, or Singapore life. I've got comprehensive answers on everything SUTD.",
      followUps: INITIAL_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastEntryId, setLastEntryId] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  }, [messages, loading]);

  const respond = async (query: string) => {
    const text = query.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text }]);

    let result: { response: string; followUps: string[]; entryId: string };
    try {
      if (isStaticHostedDemo()) {
        result = findAIResponse(text, lastEntryId);
      } else {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, last_entry_id: lastEntryId }),
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const data = await res.json();
          result = { response: data.response, followUps: data.followUps ?? [], entryId: data.entryId };
        } else throw new Error('server');
      }
    } catch {
      // FastAPI not running — fall back to local engine
      result = findAIResponse(text, lastEntryId);
    }

    setLastEntryId(result.entryId);
    setMessages((prev) => [...prev, { role: 'bot', text: result.response, followUps: result.followUps }]);
    setLoading(false);
  };

  const latestFollowUps = messages.length > 0 ? messages[messages.length - 1].followUps ?? [] : [];
  const showInitialSuggestions = messages.length <= 1;

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 220); }}
        title="Cohortly AI — ask me anything about SUTD"
        aria-label="Open Cohortly AI"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {open && (
        <div className="ai-panel" role="dialog" aria-label="Cohortly AI chat">
          <div className="ai-panel-header">
            <div className="ai-panel-avatar"><Bot size={18} /></div>
            <div>
              <strong>Cohortly AI</strong>
              <small>● SUTD campus guide · semantic search</small>
            </div>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close AI panel"><X size={16} /></button>
          </div>

          <div className="ai-chat-list" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-bubble ${m.role}`}>
                {m.role === 'bot' && i === 0 && <span className="ai-source">Cohortly AI</span>}
                {renderMarkdown(m.text)}
              </div>
            ))}
            {loading && (
              <div className="ai-bubble bot">
                <div className="ai-typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          {!loading && (showInitialSuggestions || latestFollowUps.length > 0) && (
            <div className="ai-suggestions">
              {(showInitialSuggestions ? INITIAL_SUGGESTIONS : latestFollowUps).map((s) => (
                <button key={s} className="ai-suggestion" onClick={() => respond(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="ai-compose">
            <input
              ref={inputRef}
              placeholder="Ask anything about SUTD…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); respond(input); } }}
              disabled={loading}
            />
            <button
              className="primary-button icon-only"
              onClick={() => respond(input)}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function KnowledgeBaseView() {
  const categories: Array<KBCategory | 'All'> = ['All', 'Academics', 'Campus Life & Housing', 'Admin & Registration', 'Fifth Row', 'Wellbeing', 'Technology'];
  const catIcons: Record<string, React.ReactNode> = {
    'All': <BookMarked size={15} />,
    'Academics': <BookOpen size={15} />,
    'Campus Life & Housing': <Home size={15} />,
    'Admin & Registration': <ClipboardList size={15} />,
    'Fifth Row': <Trophy size={15} />,
    'Wellbeing': <HeartPulse size={15} />,
    'Technology': <Zap size={15} />,
  };

  const [activeCategory, setActiveCategory] = useState<KBCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let arts = activeCategory === 'All' ? kbArticles : kbArticles.filter((a) => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      arts = arts.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
    }
    return arts;
  }, [activeCategory, search]);

  const catCount = (cat: KBCategory | 'All') => cat === 'All' ? kbArticles.length : kbArticles.filter((a) => a.category === cat).length;

  return (
    <div className="kb-layout">
      <div className="kb-sidebar">
        <div className="kb-sidebar-head">Categories</div>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`kb-cat-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => { setActiveCategory(cat); setSelectedArticle(null); }}
          >
            {catIcons[cat]} {cat}
            <span className="count">{catCount(cat)}</span>
          </button>
        ))}
      </div>
      <div className="kb-main">
        {!selectedArticle ? (
          <>
            <div className="kb-search">
              <Search size={15} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
              <span className="eyebrow">{activeCategory} · {filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="kb-articles">
              {filtered.map((article) => (
                <div key={article.id} className="kb-article" onClick={() => setSelectedArticle(article)}>
                  <div className="kb-article-meta-row">
                    <span className="kb-cat-chip">{article.category}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <div className="kb-article-foot">
                    <span>{article.views.toLocaleString()} views · {article.helpful} found helpful</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.74rem' }}>Read more →</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                  <BookMarked size={24} style={{ opacity: 0.3, marginBottom: 10 }} />
                  <div style={{ fontWeight: 600 }}>No articles match "{search}"</div>
                  <div style={{ fontSize: '0.82rem', marginTop: 4 }}>Try a different search term or browse a category</div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <button className="kb-back" onClick={() => setSelectedArticle(null)}>
              <ChevronLeft size={15} /> Back to {activeCategory}
            </button>
            <div className="kb-reader">
              <div className="kb-article-meta-row" style={{ marginBottom: 8 }}>
                <span className="kb-cat-chip">{selectedArticle.category}</span>
              </div>
              <h2>{selectedArticle.title}</h2>
              <span className="kb-reader-meta">{selectedArticle.views.toLocaleString()} views · maintained by SUTD Cohortly team</span>
              <div className="kb-reader-body" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              <div className="kb-helpful-row">
                <span>Was this helpful?</span>
                <button
                  className={helpedIds.has(selectedArticle.id) ? 'primary-button' : 'secondary-button'}
                  style={{ padding: '5px 14px', fontSize: '0.8rem' }}
                  onClick={() => setHelpedIds((s) => new Set([...s, selectedArticle.id]))}
                  disabled={helpedIds.has(selectedArticle.id)}
                >
                  {helpedIds.has(selectedArticle.id) ? <><Check size={13} /> Thanks!</> : <><ThumbsUp size={13} /> Yes, helpful</>}
                </button>
                <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '0.74rem' }}>{selectedArticle.helpful + (helpedIds.has(selectedArticle.id) ? 1 : 0)} found this helpful</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WeeklyPulseModal({ onClose, userEmail }: { onClose: () => void; userEmail?: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const canSubmit = Object.keys(answers).length === pulseQuestions.length;

  const submit = () => {
    markPulseShown();
    try { localStorage.setItem('cohortly.pulse.last', JSON.stringify({ ...answers, at: Date.now() })); } catch {}
    if (userEmail) {
      const score = calcBelongingScore(answers);
      saveBelongingEntry(userEmail, score);
    }
    onClose();
  };

  const skip = () => { markPulseShown(); onClose(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="pulse-overlay" onClick={skip}>
      <div className="pulse-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pulse-modal-head">
          <strong>Weekly Belonging Pulse ✦</strong>
          <p>10 seconds · anonymous · helps SUTD support you better</p>
        </div>
        <div className="pulse-questions">
          {pulseQuestions.map((q) => (
            <div key={q.id} className="pulse-question">
              <span>{q.label}</span>
              <div className="pulse-options">
                {q.options.map((opt, idx) => (
                  <button
                    key={opt}
                    className={`pulse-option${answers[q.id] === idx ? ' selected' : ''}`}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pulse-modal-actions">
          <button className="secondary-button" onClick={skip}>Skip this week</button>
          <button className="primary-button" onClick={submit} disabled={!canSubmit}>Submit pulse</button>
        </div>
      </div>
    </div>
  );
}

// ─── Global Search ────────────────────────────────────────────────────────────

function GlobalSearch({ onClose, onNavigate }: { onClose: () => void; onNavigate: (v: View) => void }) {
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  type SearchResult = { id: string; title: string; sub: string; tag: string; view: View; icon: LucideIcon };

  const results = useMemo((): SearchResult[] => {
    if (q.trim().length < 1) return [];
    const ql = q.toLowerCase();
    const out: SearchResult[] = [];

    people.filter(p => p.name.toLowerCase().includes(ql) || p.role.toLowerCase().includes(ql) || p.tags.some(t => t.toLowerCase().includes(ql)))
      .slice(0, 3).forEach(p => out.push({ id: 'p-'+p.name, title: p.name, sub: p.role, tag: 'People', view: 'people', icon: Users }));

    starterEvents.filter(e => e.title.toLowerCase().includes(ql) || e.location.toLowerCase().includes(ql))
      .slice(0, 2).forEach(e => out.push({ id: 'ev-'+e.id, title: e.title, sub: `${e.date} · ${e.location}`, tag: 'Events', view: 'events', icon: CalendarCheck }));

    classOptions.filter(c => c.toLowerCase().includes(ql))
      .slice(0, 2).forEach(c => out.push({ id: 'cl-'+c, title: c, sub: 'Module room', tag: 'Classes', view: 'classes', icon: BookOpen }));

    fifthRowClubs.filter(c => c.name.toLowerCase().includes(ql) || c.cluster.toLowerCase().includes(ql))
      .slice(0, 2).forEach(c => out.push({ id: 'fr-'+c.id, title: c.name, sub: `${c.cluster} · ${c.commitment}`, tag: 'Fifth Row', view: 'fifth-row', icon: Trophy }));

    kbArticles.filter(a => a.title.toLowerCase().includes(ql) || a.category.toLowerCase().includes(ql))
      .slice(0, 2).forEach(a => out.push({ id: 'kb-'+a.id, title: a.title, sub: a.category, tag: 'Knowledge Base', view: 'kb', icon: BookMarked }));

    return out;
  }, [q]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && results[focused]) { onNavigate(results[focused].view); onClose(); }
  };

  const groups = Array.from(new Set(results.map(r => r.tag)));

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-row">
          <Search size={17} />
          <input
            ref={inputRef}
            placeholder="Search people, events, modules, Fifth Row…"
            value={q}
            onChange={e => { setQ(e.target.value); setFocused(0); }}
            onKeyDown={handleKey}
          />
          <span className="search-kbd">Esc</span>
        </div>
        <div className="search-results">
          {q.trim().length === 0 && (
            <div className="search-empty">
              <strong>Start typing to search</strong>
              <span>People, events, modules, Fifth Row clubs, knowledge base</span>
            </div>
          )}
          {q.trim().length > 0 && results.length === 0 && (
            <div className="search-empty">
              <strong>No results for "{q}"</strong>
              <span>Try a name, module code, club, or topic</span>
            </div>
          )}
          {groups.map(tag => (
            <div key={tag}>
              <div className="search-group-label">{tag}</div>
              {results.filter(r => r.tag === tag).map((r, i) => {
                const globalIdx = results.indexOf(r);
                const Icon = r.icon;
                return (
                  <button key={r.id}
                    className={`search-result-row${focused === globalIdx ? ' focused' : ''}`}
                    onClick={() => { onNavigate(r.view); onClose(); }}
                    onMouseEnter={() => setFocused(globalIdx)}
                  >
                    <div className="search-result-icon"><Icon size={14} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="search-result-title">{r.title}</div>
                      <div className="search-result-sub">{r.sub}</div>
                    </div>
                    <span className="search-result-tag">{r.tag}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="search-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({
  notifs, onClose, onMarkAll, onMarkRead, onNavigate,
}: {
  notifs: NotifItem[];
  onClose: () => void;
  onMarkAll: () => void;
  onMarkRead: (id: string) => void;
  onNavigate: (v: View) => void;
}) {
  const unread = notifs.filter(n => !n.read).length;
  return (
    <div className="notif-panel-overlay" onClick={onClose}>
      <div className="notif-panel" onClick={e => e.stopPropagation()}>
        <div className="notif-panel-head">
          <strong>Notifications {unread > 0 ? `· ${unread} new` : ''}</strong>
          {unread > 0 && <button className="notif-mark-all" onClick={onMarkAll}>Mark all read</button>}
        </div>
        <div className="notif-list">
          {notifs.length === 0 && <div className="notif-empty">All caught up — no new notifications.</div>}
          {notifs.map(n => (
            <button key={n.id} className={`notif-item${n.read ? '' : ' unread'}`}
              onClick={() => {
                onMarkRead(n.id);
                if (n.action) { onNavigate(n.action.view); onClose(); }
              }}>
              <div className="notif-item-body">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-text">{n.body}</div>
                <div className="notif-item-time">{n.time}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ active, setActive, role = 'student' }: { active: View; setActive: (v: View) => void; role?: UserRole }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems: Array<{ id: View; label: string; icon: LucideIcon }> = role === 'mentor'
    ? [
        { id: 'mentor-home', label: 'Home', icon: LayoutDashboard },
        { id: 'mentor-help', label: 'Help', icon: HeartHandshake },
        { id: 'people', label: 'Students', icon: Users },
        { id: 'messages', label: 'Chats', icon: MessageCircle },
      ]
    : [
        { id: 'today', label: 'Today', icon: Home },
        { id: 'people', label: 'People', icon: Users },
        { id: 'events', label: 'Events', icon: CalendarCheck },
        { id: 'classes', label: 'Classes', icon: BookOpen },
      ];
  const moreItems: Array<{ id: View; label: string; icon: LucideIcon }> = role === 'mentor'
    ? [
        { id: 'events', label: 'Events', icon: CalendarCheck },
        { id: 'classes', label: 'Classes', icon: BookOpen },
      ]
    : [
        { id: 'messages', label: 'Messages', icon: MessageCircle },
        { id: 'launchpad', label: 'Launchpad', icon: Rocket },
        { id: 'fifth-row', label: 'Fifth Row', icon: Trophy },
        { id: 'campus-life', label: 'Campus Life', icon: MapPinned },
        { id: 'kb', label: 'Resources', icon: BookMarked },
      ];
  return (
    <>
      {moreOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setMoreOpen(false)}>
          <div className="mobile-more-sheet" onClick={e => e.stopPropagation()}>
            <div className="mobile-more-handle" />
            <div className="mobile-more-grid">
              {moreItems.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} className={`mobile-more-item${active === item.id ? ' active' : ''}`}
                    onClick={() => { setActive(item.id); setMoreOpen(false); }}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <nav className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          {primaryItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} className={`mobile-nav-btn${isActive ? ' active' : ''}`}
                onClick={() => setActive(item.id)}>
                <Icon size={20} />
                <span>{item.label}</span>
                <div className="mobile-nav-dot" />
              </button>
            );
          })}
          <button
            className={`mobile-nav-btn${moreItems.some((item) => item.id === active) ? ' active' : ''}`}
            onClick={() => setMoreOpen(true)}
          >
            <ChevronDown size={20} />
            <span>More</span>
            <div className="mobile-nav-dot" />
          </button>
        </div>
      </nav>
    </>
  );
}

// ─── Student App ──────────────────────────────────────────────────────────────

function StudentApp({
  user,
  profile,
  institutions,
  onLogout,
  onProfileUpdate,
  onResetDemo,
}: {
  user: VerifiedUser;
  profile: StudentProfile;
  institutions: Institution[];
  onLogout: () => void;
  onProfileUpdate: (p: StudentProfile) => void;
  onResetDemo: () => void;
}) {
  const isMentor = false;
  const appNavItems = navItems;
  const [activeView, setActiveView] = useState<View>('today');
  const [dmTarget, setDmTarget] = useState<string | null>(null);
  const openDm = (name: string) => { setDmTarget(name); setActiveView('messages'); };
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs] = useState<NotifItem[]>(() => loadNotifs(user.email));
  const unreadCount = notifs.filter(n => !n.read).length;
  const markAllRead = () => { const updated = notifs.map(n => ({ ...n, read: true })); setNotifs(updated); saveNotifs(user.email, updated); };
  const markRead = (id: string) => { const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n); setNotifs(updated); saveNotifs(user.email, updated); };
  const [events, setEvents] = useState(starterEvents);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const joinEvent = (id: string) => setJoinedEvents((prev) => new Set([...prev, id]));
  const [draftTitle, setDraftTitle] = useState('Saturday breakfast before orientation check-in');
  const [draftAudience, setDraftAudience] = useState('Incoming students · food · first-week friends');
  const [draftTime, setDraftTime] = useState('9:30 AM');
  const [draftLocation, setDraftLocation] = useState('Campus Center steps');
  const [draftTone, setDraftTone] = useState<EventItem['tone']>('social');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [showNotifBanner, setShowNotifBanner] = useState(false);
  const deferredInstallRef = useRef<Event | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); deferredInstallRef.current = e; setShowPwaBanner(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShowNotifBanner(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  // CMD+K / Ctrl+K global search shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(s => !s);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleInstall = () => {
    const prompt = deferredInstallRef.current as (Event & { prompt?: () => void }) | null;
    if (prompt?.prompt) { prompt.prompt(); }
    setShowPwaBanner(false);
  };

  const requestNotifPermission = async () => {
    setShowNotifBanner(false);
    if ('Notification' in window) await Notification.requestPermission();
  };

  const institution = institutionFor(user.institutionId, institutions);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [activeView]);

  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  // Realtime Firestore events listener — seeds starter events on first run
  useEffect(() => {
    const firestore = db;
    if (!firestore) return;
    const q = query(collection(firestore, 'events'), orderBy('date'));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        const batch = writeBatch(firestore);
        starterEvents.forEach((ev) => batch.set(doc(firestore, 'events', ev.id), ev));
        batch.commit();
      } else {
        setEvents(snap.docs.map((d) => d.data() as EventItem));
      }
    }, (err) => console.warn('[cohortly] events snapshot error', err));
    return unsub;
  }, []);

  const addEvent = (date: string) => {
    const title = draftTitle.trim();
    if (!title) return '';
    const id = `event-${Date.now()}`;
    const newEvent: EventItem = {
      id,
      title,
      host: 'You',
      date,
      time: draftTime.trim() || 'Time TBD',
      location: draftLocation.trim() || 'Location TBD',
      audience: draftAudience.trim() || `${institution.shortName} students`,
      meta: 'New invite',
      description: 'Student-created event. People can join, ask questions, and coordinate details from this page.',
      tone: draftTone,
    };
    if (db) {
      setDoc(doc(db, 'events', id), newEvent); // onSnapshot will update state
    } else {
      setEvents((current) => [newEvent, ...current]);
    }
    setDraftTitle('');
    setDraftAudience('');
    setDraftLocation('');
    return id;
  };

  const logout = async () => {
    if (!isStaticHostedDemo()) {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
    }
    onLogout();
  };

  return (
    <>
    {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} onNavigate={(v) => { setActiveView(v); setShowSearch(false); }} />}
    {showNotifPanel && <NotificationPanel notifs={notifs} onClose={() => setShowNotifPanel(false)} onMarkAll={markAllRead} onMarkRead={markRead} onNavigate={(v) => { setActiveView(v); setShowNotifPanel(false); }} />}
    <MobileBottomNav active={activeView} setActive={setActiveView} role="student" />
    {showPulse && <WeeklyPulseModal onClose={() => setShowPulse(false)} userEmail={user.email} />}
    {showEditProfile && (
      <EditProfileSheet
        profile={profile}
        onSave={(p) => { onProfileUpdate(p); setShowEditProfile(false); }}
        onClose={() => setShowEditProfile(false)}
      />
    )}
    <AICompanion />
    {showPwaBanner && (
      <div className="pwa-banner">
        <div className="pwa-banner-icon">C</div>
        <div className="pwa-banner-text">
          <strong>Add Cohortly to your home screen</strong>
          <p>Get instant access, offline support, and push notifications</p>
        </div>
        <div className="pwa-banner-actions">
          <button className="pwa-dismiss-btn" onClick={() => setShowPwaBanner(false)}>Later</button>
          <button className="pwa-install-btn" onClick={handleInstall}><Download size={14} style={{ marginRight: 5 }} />Install</button>
        </div>
      </div>
    )}
    <div className="student-shell">
      <aside className="app-rail">
        <button className="brand-button" onClick={() => setActiveView('today')}>
          <span className="brand-mark">C</span>
          <span>
            <strong>Cohortly</strong>
            <small>{institution.shortName} · Student</small>
          </span>
        </button>

        <nav className="rail-nav">
          {appNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activeView === item.id ? 'active' : ''}
                onClick={() => setActiveView(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {(() => {
          let pct = 20;
          if (profile.classes.length > 0) pct += 15;
          if (profile.interests.length > 0) pct += 15;
          if (profile.intro && profile.intro.length > 10) pct += 20;
          if (profile.pfpDataUrl) pct += 20;
          if (profile.pillar) pct += 10;
          return (
            <div className="rail-completion">
              <div className="rail-completion-head">
                <span className="rail-completion-label">Profile complete</span>
                <span className="rail-completion-pct">{pct}%</span>
              </div>
              <div className="rail-completion-bar">
                <div className="rail-completion-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })()}

        <div className="rail-proof">
          <ShieldCheck size={18} />
          <div>
            <strong>Verified student</strong>
            <span>{user.email}</span>
          </div>
        </div>
      </aside>

      <div className="student-main">
        <header className="app-topbar">
          <div>
            <span className="eyebrow">Student-led campus network</span>
            <h1>{activeView === 'privacy' ? 'Privacy & Data' : activeView === 'notifications' ? 'Notifications & Bots' : (appNavItems.find((item) => item.id === activeView)?.label ?? 'Cohortly')}</h1>
          </div>
          <div className="topbar-actions">
            <button className="topbar-search-btn" aria-label="Search (⌘K)" onClick={() => setShowSearch(true)}>
              <Search size={16} />
              <span className="topbar-search-label">Search or jump to…</span>
              <kbd className="topbar-search-kbd">⌘K</kbd>
            </button>
            <span className="topbar-divider" aria-hidden="true" />
            <div className="notif-wrap" style={{ position: 'relative' }}>
              <button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifPanel(p => !p)}>
                <BellRing size={18} />
              </button>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </div>
            <div className="profile-wrap" ref={profileRef}>
              <button className="profile-chip" onClick={() => setProfileOpen((o) => !o)}>
                {profile.pfpDataUrl
                  ? <img src={profile.pfpDataUrl} alt="" className="profile-chip-pfp" />
                  : <span>{initials(user.name)}</span>}
                <strong>{user.name.split(' ')[0]}</strong>
              </button>
              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <small>{profile.pillar ? `${profile.pillar} · ` : ''}{user.institutionName}</small>
                  </div>
                  <button
                    className="profile-menu-action"
                    onClick={() => { setProfileOpen(false); setShowEditProfile(true); }}
                  >
                    <Pencil size={14} /> Edit profile
                  </button>
                  <button
                    className="profile-menu-action"
                    onClick={() => { setProfileOpen(false); setActiveView('notifications'); }}
                  >
                    <Bell size={14} /> Notifications &amp; Bots
                  </button>
                  <button
                    className="profile-menu-action"
                    onClick={() => { setProfileOpen(false); setActiveView('privacy'); }}
                  >
                    <Lock size={14} /> Privacy &amp; Data
                  </button>
                  <button
                    className="profile-menu-action"
                    onClick={() => { setProfileOpen(false); logout(); }}
                  >
                    Sign out
                  </button>
                  <button
                    className="profile-menu-action demo-reset-btn"
                    onClick={() => { setProfileOpen(false); onResetDemo(); }}
                  >
                    <RotateCcw size={14} /> Reset demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-content">
          {showNotifBanner && (
            <div className="notif-permission-bar" style={{ margin: '0 0 16px' }}>
              <BellRing size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <p>Get notified when your module question is answered or a new event is posted near you.</p>
              <button className="primary-button" style={{ flexShrink: 0 }} onClick={requestNotifPermission}>Enable notifications</button>
              <button className="icon-button" onClick={() => setShowNotifBanner(false)}><X size={14} /></button>
            </div>
          )}
          <div key={activeView} className="view-wrapper">
            {activeView === 'mentor-home' && (
              <MentorDashboardView
                user={user}
                profile={profile}
                setActiveView={setActiveView}
              />
            )}
            {activeView === 'mentor-help' && <MentorHelpView profile={profile} />}
            {activeView === 'today' && !isMentor && (
              <TodayView
                user={user}
                profile={profile}
                institution={institution}
                events={events}
                setActiveView={setActiveView}
                onOpenPulse={() => setShowPulse(true)}
              />
            )}
            {activeView === 'launchpad' && !isMentor && (
              <LaunchpadView
                userEmail={user.email}
                userName={user.name}
                setActiveView={setActiveView}
              />
            )}
            {activeView === 'fifth-row' && !isMentor && <FifthRowView />}
            {activeView === 'kb' && !isMentor && <KnowledgeBaseView />}
            {activeView === 'events' && (
              <EventsView
                events={events}
                joinedEvents={joinedEvents}
                onJoin={joinEvent}
                draftTitle={draftTitle}
                draftAudience={draftAudience}
                draftTime={draftTime}
                draftLocation={draftLocation}
                draftTone={draftTone}
                setDraftTitle={setDraftTitle}
                setDraftAudience={setDraftAudience}
                setDraftTime={setDraftTime}
                setDraftLocation={setDraftLocation}
                setDraftTone={setDraftTone}
                addEvent={addEvent}
              />
            )}
            {activeView === 'people' && <PeopleView userEmail={user.email} onMessage={openDm} />}
            {activeView === 'classes' && <ClassesView enrolledClasses={profile.classes} onEnroll={(updated) => onProfileUpdate({ ...profile, classes: updated })} />}
            {activeView === 'messages' && <MessagesView isMentor={isMentor} openWith={dmTarget} onClearTarget={() => setDmTarget(null)} />}
            {activeView === 'campus-life' && !isMentor && <CampusLifeView profile={profile} onProfileUpdate={onProfileUpdate} userEmail={user.email} userName={user.name} />}
            {activeView === 'privacy' && <PrivacySettingsView userEmail={user.email} userName={user.name} onBack={() => setActiveView('today')} onLogout={logout} />}
            {activeView === 'notifications' && <NotificationsView userEmail={user.email} />}
          </div>
        </main>
      </div>
    </div>
    </>
  );
}

function TodayView({
  user,
  profile,
  institution,
  events,
  setActiveView,
  onOpenPulse,
}: {
  user: VerifiedUser;
  profile: StudentProfile;
  institution: Institution;
  events: EventItem[];
  setActiveView: (view: View) => void;
  onOpenPulse: () => void;
}) {
  const topEvents = events.slice(0, 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const checklistItems = [
    { label: 'Verify your SUTD identity', done: true, view: null as View | null },
    { label: 'Complete your profile', done: true, view: null as View | null },
    { label: 'Join your first module room', done: false, view: 'classes' as View | null },
    { label: 'RSVP to one event', done: false, view: 'events' as View | null },
    { label: 'Connect with 3 people', done: false, view: 'people' as View | null },
  ];
  const doneCount = checklistItems.filter((t) => t.done).length;
  const nextTask = checklistItems.find((t) => !t.done);
  const history = useMemo(() => loadBelongingHistory(user.email), [user.email]);

  return (
    <div className="today-stack">
      {/* Greeting */}
      <div className="today-greeting">
        <div>
          <h2>{greeting}, {user.name.split(' ')[0]}.</h2>
          <div className="week-tracker">
            <div className="week-bar"><div className="week-bar-fill" style={{ width: '8%' }} /></div>
            <span className="week-label">Week 1 of 12 — you're just getting started</span>
          </div>
          <div className="greeting-meta-row">
            <span><strong>812</strong> students</span>
            <span className="gm-dot" />
            <span><strong>38</strong> events</span>
            <span className="gm-dot" />
            <span><strong>14 days</strong> to Day 1</span>
          </div>
        </div>
        <span className="soft-pill"><BadgeCheck size={15} /> {institution.shortName} verified</span>
      </div>

      {/* Next best action — single focal hero */}
      <article className="panel next-action-card">
        <div className="next-action-main">
          <span className="eyebrow">Next best step · {doneCount}/{checklistItems.length} done</span>
          {nextTask ? (
            <>
              <h2>{nextTask.label}</h2>
              <p>The fastest way to feel settled before Day 1 — this takes most students under five minutes.</p>
              <button
                className="primary-button"
                onClick={() => nextTask.view && setActiveView(nextTask.view)}
              >
                {nextTask.label.startsWith('Join') ? 'Browse module rooms' : nextTask.label.startsWith('RSVP') ? 'See events' : 'Meet people'}
                <ArrowRight size={15} />
              </button>
            </>
          ) : (
            <>
              <h2>You're fully launched. Nice work.</h2>
              <p>Every first-week task is done — keep an eye on events and module rooms as the term gets closer.</p>
            </>
          )}
        </div>
        <div className="next-action-checklist">
          <div className="checklist-bar"><div className="checklist-bar-fill" style={{ width: `${(doneCount / checklistItems.length) * 100}%` }} /></div>
          <ul className="checklist-items">
            {checklistItems.map((task) => (
              <li key={task.label} className={`checklist-item ${task.done ? 'done' : ''}`}>
                {task.done ? <Check size={14} /> : <span className="todo-circle" />}
                {task.label}
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* For you row */}
      <div className="for-you-row">
        <button className="for-you-card for-you-card--featured" onClick={() => setActiveView('classes')}>
          <div className="for-you-icon indigo"><BookOpen size={18} /></div>
          <h4>10.014 Computational Thinking</h4>
          <p>4 returning students active now · 28 Q&amp;As this week</p>
          <span className="for-you-cta">Open room <ArrowRight size={12} /></span>
        </button>
        <button className="for-you-card" onClick={() => setActiveView('events')}>
          <div className="for-you-icon green"><CalendarCheck size={18} /></div>
          <h4>First Friday food crawl</h4>
          <p>42 going · Dover MRT → Ghim Moh · Fri 7:30 PM</p>
          <span className="for-you-cta">RSVP <ArrowRight size={12} /></span>
        </button>
        <button className="for-you-card" onClick={() => setActiveView('people')}>
          <div className="for-you-icon violet"><Users size={18} /></div>
          <h4>Aarav Menon</h4>
          <p>Year 3 ISTD · 94% match · 10.014 guide</p>
          <span className="for-you-cta">Connect <ArrowRight size={12} /></span>
        </button>
      </div>

      {/* Bottom two-col */}
      <div className="today-two-col">
        <article className="panel belonging-pulse-card">
          <div className="section-heading compact-heading" style={{ marginBottom: 14 }}>
            <div>
              <span className="eyebrow">This week</span>
              <h2>Your belonging pulse</h2>
            </div>
          </div>
          {history.length > 0 ? (
            <BelongingScoreBanner userEmail={user.email} />
          ) : (
            <p className="pulse-empty-copy">A 10-second weekly check-in — helps SUTD spot students who need support early. Fully anonymous to your peers.</p>
          )}
          <button className="secondary-button wide" onClick={onOpenPulse}>
            <Sparkles size={14} /> Take this week's pulse
          </button>
        </article>
        <article className="panel event-preview-panel">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">Upcoming</span>
              <h2>Events this week</h2>
            </div>
            <button className="text-button" onClick={() => setActiveView('events')}>
              See all <ChevronRight size={15} />
            </button>
          </div>
          <EventList events={topEvents} compact />
        </article>
      </div>
    </div>
  );
}

const phaseDesc: Record<string, string> = {
  'pre-arrival': 'Everything to sort before you step on campus.',
  'campus-life': 'Move in, find first-week plans, and get campus support.',
  'week0': 'Orientation week — meet everyone, explore everything.',
  'week1': 'Academic setup, first lectures, and your first connections.',
  'people5': 'Your first 5 key relationships on campus.',
  'fifth-row-phase': 'Find your co-curricular community.',
  'qa-phase': 'Get comfortable asking — returning students and classmates are here to answer.',
  'returning-phase': 'Use returning-student sessions grouped by year, pillar, and module.',
};

function BelongingScoreBanner({ userEmail }: { userEmail: string }) {
  const history = useMemo(() => loadBelongingHistory(userEmail), [userEmail]);
  if (history.length === 0) return null;
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];
  const delta = prev ? latest.score - prev.score : null;
  const sparkMax = Math.max(...history.map((e) => e.score), 1);
  const w = 140; const h = 36;
  const pts = history.slice(-8).map((e, i, arr) => {
    const x = (i / Math.max(arr.length - 1, 1)) * w;
    const y = h - (e.score / sparkMax) * h;
    return `${x},${y}`;
  }).join(' ');
  const trend = delta === null ? '' : delta > 0 ? `↑ ${delta} pts` : delta < 0 ? `↓ ${Math.abs(delta)} pts` : '→ steady';
  const color = latest.score >= 70 ? '#059669' : latest.score >= 45 ? '#d97706' : '#ef4444';
  return (
    <div className="belonging-banner">
      <div className="belonging-score-block">
        <span className="belonging-score-num" style={{ color }}>{latest.score}</span>
        <span className="belonging-score-label">/ 100<br />Belonging Score</span>
      </div>
      <div className="belonging-spark-block">
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
          <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <span className="belonging-trend" style={{ color }}>{trend}</span>
      </div>
      <p className="belonging-desc">Based on your Weekly Pulse responses. Updates each week you submit.</p>
    </div>
  );
}

function LaunchpadView({
  userEmail,
  userName = 'Student',
  setActiveView,
}: {
  userEmail: string;
  userName?: string;
  setActiveView: (v: View) => void;
}) {
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() => loadLaunchpadStatuses(userEmail));
  const [activePhase, setActivePhase] = useState(launchpadPhases[0].id);

  const cycleStatus = (taskId: string) => {
    setStatuses((prev) => {
      const cur = prev[taskId] ?? 'not-started';
      const next: TaskStatus =
        cur === 'not-started' ? 'in-progress'
        : cur === 'in-progress' ? 'done'
        : cur === 'done' ? 'need-help'
        : 'not-started';
      const updated = { ...prev, [taskId]: next };
      saveLaunchpadStatuses(userEmail, updated);
      return updated;
    });
  };

  const requestHelp = (task: LaunchpadTask) => {
    setStatuses((prev) => {
      const updated = { ...prev, [task.id]: 'need-help' as TaskStatus };
      saveLaunchpadStatuses(userEmail, updated);
      return updated;
    });
    addInterventionCase(userEmail, userName, `Needs help with: ${task.label}`, 'launchpad');
  };

  const totalTasks = launchpadPhases.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = Object.values(statuses).filter((s) => s === 'done').length;
  const overallPct = Math.round((doneTasks / totalTasks) * 100);

  // Next best action: first task across all phases that isn't done
  const nextAction = (() => {
    for (const phase of launchpadPhases) {
      for (const task of phase.tasks) {
        if ((statuses[task.id] ?? 'not-started') !== 'done') return { phase, task };
      }
    }
    return null;
  })();

  const currentPhase = launchpadPhases.find((p) => p.id === activePhase) ?? launchpadPhases[0];

  const phasePct = (phase: LaunchpadPhase) => {
    const done = phase.tasks.filter((t) => statuses[t.id] === 'done').length;
    return Math.round((done / phase.tasks.length) * 100);
  };

  const statusSymbol = (s: TaskStatus) =>
    s === 'done' ? '✓' : s === 'in-progress' ? '◑' : s === 'need-help' ? '!' : '○';
  const statusWord = (s: TaskStatus) =>
    s === 'done' ? 'done' : s === 'in-progress' ? 'doing' : s === 'need-help' ? 'help!' : 'todo';
  const statusBg = (s: TaskStatus) =>
    s === 'done' ? '#059669' : s === 'in-progress' ? 'var(--accent)' : s === 'need-help' ? '#d97706' : 'var(--line-strong)';
  const statusColor = (s: TaskStatus) => (s === 'not-started' ? 'var(--muted)' : '#fff');

  return (
    <div className="launchpad">
      <div className="launchpad-sidebar">
        <div className="launchpad-sidebar-head">
          <strong>Freshmore Launchpad</strong>
          <p>Your guided SUTD journey</p>
          <div className="launchpad-overall-bar">
            <span>{overallPct}% complete · {doneTasks}/{totalTasks} tasks</span>
            <div className="launchpad-overall-track">
              <div className="launchpad-overall-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>
        {launchpadPhases.map((phase) => {
          const pct = phasePct(phase);
          return (
            <button
              key={phase.id}
              className={`launchpad-phase-btn${activePhase === phase.id ? ' active' : ''}`}
              onClick={() => setActivePhase(phase.id)}
            >
              <span className={`phase-icon-dot phase-icon-${phase.icon}`} />
              <div>
                <strong>{phase.label}</strong>
                <small>{pct === 100 ? 'Complete ✓' : `${pct}% done`}</small>
              </div>
              <span className={`launchpad-phase-pct${pct === 100 ? ' done' : ''}`}>{pct === 100 ? '✓' : `${pct}%`}</span>
            </button>
          );
        })}
      </div>

      <div className="launchpad-main">
        <BelongingScoreBanner userEmail={userEmail} />
        {nextAction && (
          <div className="launchpad-next-action">
            <div className="launchpad-next-action-label">
              <Sparkles size={13} /> Next best action
            </div>
            <strong>{nextAction.task.label}</strong>
            <p>{nextAction.task.desc}</p>
            <div className="launchpad-next-action-cta">
              {nextAction.task.link && (
                <button
                  className="launchpad-next-go"
                  onClick={() => { setActivePhase(nextAction.phase.id); setActiveView(nextAction.task.link!.view); }}
                >
                  {nextAction.task.link.label} <ArrowRight size={12} />
                </button>
              )}
              <button
                className="launchpad-next-jump"
                onClick={() => setActivePhase(nextAction.phase.id)}
              >
                Go to step
              </button>
            </div>
          </div>
        )}
        <div className="launchpad-phase-head">
          <h2>{currentPhase.label}</h2>
          <p>{phaseDesc[currentPhase.id]}</p>
        </div>
        <div className="launchpad-tasks-list">
          {currentPhase.tasks.map((task) => {
            const status = statuses[task.id] ?? 'not-started';
            return (
              <div key={task.id} className={`launchpad-task status-${status}`}>
                <button
                  className="task-status-cycle"
                  onClick={() => cycleStatus(task.id)}
                  title="Click to cycle: todo → doing → done → help"
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem',
                    fontWeight: 700, flexShrink: 0,
                    background: statusBg(status), color: statusColor(status),
                  }}>
                    {statusSymbol(status)}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.2, maxWidth: 40 }}>
                    {statusWord(status)}
                  </span>
                </button>
                <div className="launchpad-task-info">
                  <strong>{task.label}</strong>
                  <p>{task.desc}</p>
                  <div className="launchpad-task-actions">
                    {task.link && (
                      <button className="launchpad-task-link" onClick={() => setActiveView(task.link!.view)}>
                        {task.link.label} <ArrowRight size={11} />
                      </button>
                    )}
                    {status !== 'need-help' && status !== 'done' && (
                      <button className="launchpad-task-help" onClick={() => requestHelp(task)}>
                        <LifeBuoy size={11} /> Need help
                      </button>
                    )}
                  </div>
                  {status === 'need-help' && (
                    <div className="launchpad-task-help-msg">
                      <HeartHandshake size={12} /> A student support advisor will check in with you soon.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const clusterColor: Record<string, string> = {
  Arts: 'arts', Sports: 'sports', Community: 'community', Culture: 'culture', Makers: 'makers',
};

const frQuizQuestions = [
  {
    id: 'vibe',
    q: "What's your ideal Friday evening?",
    options: [
      { label: 'Making or building something', cluster: 'Makers' },
      { label: 'Playing a sport or working out', cluster: 'Sports' },
      { label: 'Performing or creating art', cluster: 'Arts' },
      { label: 'Volunteering or organising', cluster: 'Community' },
      { label: 'Cultural events or music', cluster: 'Culture' },
    ],
  },
  {
    id: 'skill',
    q: 'Which skill do you most want to grow?',
    options: [
      { label: 'Technical / hands-on making', cluster: 'Makers' },
      { label: 'Physical fitness & teamwork', cluster: 'Sports' },
      { label: 'Creative expression', cluster: 'Arts' },
      { label: 'Leadership & social impact', cluster: 'Community' },
      { label: 'Cultural appreciation & language', cluster: 'Culture' },
    ],
  },
  {
    id: 'commitment',
    q: 'How much time can you commit each week?',
    options: [
      { label: 'Under 2 hours — light touch', cluster: null },
      { label: '2–4 hours — regular but manageable', cluster: null },
      { label: '4–6 hours — I\'m keen', cluster: null },
      { label: 'As much as it takes', cluster: null },
    ],
  },
  {
    id: 'outcome',
    q: 'What matters most to you in a CCA?',
    options: [
      { label: 'Building something real', cluster: 'Makers' },
      { label: 'Competing and winning', cluster: 'Sports' },
      { label: 'Creating art / performances', cluster: 'Arts' },
      { label: 'Giving back to the community', cluster: 'Community' },
      { label: 'Connecting with diverse cultures', cluster: 'Culture' },
    ],
  },
  {
    id: 'newbie',
    q: 'Experience level?',
    options: [
      { label: 'Complete beginner — never tried', cluster: null },
      { label: 'Some casual experience', cluster: null },
      { label: 'Fairly experienced', cluster: null },
      { label: 'Very experienced / competitive', cluster: null },
    ],
  },
];

function FifthRowView() {
  const [activeCluster, setActiveCluster] = useState<FifthRowCluster | 'All'>('All');
  const [interested, setInterested] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('fifth_row_interests') ?? '[]')); }
    catch { return new Set(); }
  });
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | null>>({});
  const [quizResult, setQuizResult] = useState<FifthRowCluster | null>(null);

  const clusters: Array<FifthRowCluster | 'All'> = ['All', 'Arts', 'Sports', 'Community', 'Culture', 'Makers'];
  const filtered = activeCluster === 'All' ? fifthRowClubs : fifthRowClubs.filter((c) => c.cluster === activeCluster);

  const toggleInterest = (id: string) => {
    setInterested((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('fifth_row_interests', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const handleQuizAnswer = (optCluster: string | null) => {
    const q = frQuizQuestions[quizStep];
    const updated = { ...quizAnswers, [q.id]: optCluster };
    setQuizAnswers(updated);
    if (quizStep < frQuizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const tally: Record<string, number> = {};
      Object.values(updated).forEach((c) => { if (c) tally[c] = (tally[c] ?? 0) + 1; });
      const top = (Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Community') as FifthRowCluster;
      setQuizResult(top);
    }
  };

  const resetQuiz = () => { setQuizStep(0); setQuizAnswers({}); setQuizResult(null); };
  const closeQuiz = () => { setQuizOpen(false); resetQuiz(); };

  const applyResult = () => {
    if (quizResult) setActiveCluster(quizResult);
    closeQuiz();
  };

  const currentQ = frQuizQuestions[quizStep];

  return (
    <div className="fifth-row-layout">
      {quizOpen && (
        <div className="modal-overlay" onClick={closeQuiz}>
          <div className="modal-box" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            {!quizResult ? (
              <>
                <div className="modal-head">
                  <strong>Club Match Quiz</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 8 }}>
                    {quizStep + 1} / {frQuizQuestions.length}
                  </span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 16 }}>
                    <div style={{ width: `${((quizStep) / frQuizQuestions.length) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 12 }}>{currentQ.q}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.label}
                        className="secondary-button"
                        style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                        onClick={() => handleQuizAnswer(opt.cluster)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="secondary-button" style={{ fontSize: '0.78rem' }} onClick={closeQuiz}>Cancel</button>
              </>
            ) : (
              <>
                <div className="modal-head"><strong>Your Match</strong></div>
                <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
                    <span className={`quiz-result-dot quiz-result-${quizResult?.toLowerCase()}`} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{quizResult} Cluster</div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    Based on your answers, you're a great fit for {quizResult.toLowerCase()} clubs. We've filtered the list for you.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="secondary-button" style={{ flex: 1 }} onClick={resetQuiz}>Retake</button>
                  <button className="primary-button" style={{ flex: 1 }} onClick={applyResult}>See {quizResult} clubs</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="fifth-row-head">
        <div>
          <span className="eyebrow">Fifth Row Marketplace</span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>
            {filtered.length} club{filtered.length !== 1 ? 's' : ''} · find your community
          </h2>
        </div>
      </div>

      <div className="fr-quiz-banner">
        <div>
          <strong>Not sure where to start?</strong>
          <p>Take the 2-minute quiz to get matched to clubs by your interests and schedule.</p>
        </div>
        <button className="primary-button" style={{ flexShrink: 0 }} onClick={() => setQuizOpen(true)}>
          <Sparkles size={14} /> Take quiz
        </button>
      </div>

      <div className="fr-cluster-tabs">
        {clusters.map((c) => (
          <button
            key={c}
            className={`fr-cluster-tab${activeCluster === c ? ' active' : ''}${c !== 'All' ? ` ${c.toLowerCase()}` : ''}`}
            onClick={() => setActiveCluster(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="clubs-grid">
        {filtered.map((club) => {
          const isInterested = interested.has(club.id);
          return (
            <div key={club.id} className="club-card">
              <div className="club-card-top">
                <span className={`club-cluster-badge ${clusterColor[club.cluster]}`}>{club.cluster}</span>
                {club.beginnerFriendly && <span className="club-meta-chip">Beginner-friendly</span>}
              </div>
              <h3>{club.name}</h3>
              <p>{club.desc}</p>
              <div className="club-card-meta">
                <span className="club-meta-chip">{club.commitment} commitment</span>
                <span className="club-meta-chip trial">Trial: {club.trialDate}</span>
                <span className="club-meta-chip">{club.members} members</span>
              </div>
              <div className="club-card-actions">
                <button
                  className="secondary-button"
                  onClick={() => toggleInterest(club.id)}
                  style={isInterested ? { color: '#059669', borderColor: '#059669' } : {}}
                >
                  {isInterested ? <><Check size={14} /> Interested</> : "I'm interested"}
                </button>
                <button className="primary-button">Learn more</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventsView({
  events,
  joinedEvents,
  onJoin,
  draftTitle,
  draftAudience,
  draftTime,
  draftLocation,
  draftTone,
  setDraftTitle,
  setDraftAudience,
  setDraftTime,
  setDraftLocation,
  setDraftTone,
  addEvent,
}: {
  events: EventItem[];
  joinedEvents: Set<string>;
  onJoin: (id: string) => void;
  draftTitle: string;
  draftAudience: string;
  draftTime: string;
  draftLocation: string;
  draftTone: EventItem['tone'];
  setDraftTitle: (title: string) => void;
  setDraftAudience: (audience: string) => void;
  setDraftTime: (time: string) => void;
  setDraftLocation: (location: string) => void;
  setDraftTone: (tone: EventItem['tone']) => void;
  addEvent: (date: string) => string;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateKey(events[0]?.date ?? '2026-06-01'));
  const [selectedDate, setSelectedDate] = useState(events[0]?.date ?? dateKey(new Date()));
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '');

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, EventItem[]>>((grouped, event) => {
      grouped[event.date] = [...(grouped[event.date] ?? []), event];
      return grouped;
    }, {});
  }, [events]);
  const selectedDayEvents = eventsByDate[selectedDate] ?? [];
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? selectedDayEvents[0] ?? null;

  const chooseDay = (day: string) => {
    setSelectedDate(day);
    const firstEvent = eventsByDate[day]?.[0];
    setSelectedEventId(firstEvent?.id ?? '');
  };

  const chooseEvent = (event: EventItem) => {
    setSelectedDate(event.date);
    setSelectedEventId(event.id);
    const eventMonth = parseDateKey(event.date);
    setVisibleMonth(new Date(eventMonth.getFullYear(), eventMonth.getMonth(), 1));
  };

  const moveMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const postEvent = () => {
    const id = addEvent(selectedDate);
    if (id) setSelectedEventId(id);
  };

  return (
    <div className="events-screen">
      <section className="event-command-strip">
        <div>
          <span className="eyebrow">Event radar</span>
          <h2>Pick a plan, then see the whole month.</h2>
        </div>
        <div className="event-spotlight-row">
          {events.slice(0, 3).map((event) => (
            <button
              className={`event-spotlight ${event.tone}${selectedEventId === event.id ? ' active' : ''}`}
              key={event.id}
              onClick={() => chooseEvent(event)}
            >
              <span>{formatShortDate(event.date)} · {event.time}</span>
              <strong>{event.title}</strong>
              <small>{event.meta}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="calendar-layout">
      <section className="panel calendar-panel">
        <div className="calendar-toolbar">
          <div>
            <span className="eyebrow">Campus calendar</span>
            <h2>{formatMonth(visibleMonth)}</h2>
            <p>See what students are hosting by day, then open the event to join, ask, or share.</p>
          </div>
          <div className="month-switcher">
            <button className="icon-button" aria-label="Previous month" onClick={() => moveMonth(-1)}>
              <ChevronLeft size={18} />
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                const next = parseDateKey(starterEvents[0].date);
                setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1));
                chooseEvent(starterEvents[0]);
              }}
            >
              First week
            </button>
            <button className="icon-button" aria-label="Next month" onClick={() => moveMonth(1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekdayLabels.map((day) => <span key={day} className="cal-header-cell">{day}</span>)}
          {calendarDays.map((day) => {
            const dayEvents = eventsByDate[day.key] ?? [];
            const selected = selectedDate === day.key;
            return (
              <div
                role="button"
                tabIndex={0}
                key={day.key}
                className={[
                  'calendar-day',
                  day.inMonth ? '' : 'muted',
                  selected ? 'selected' : '',
                  dayEvents.length ? 'has-events' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => chooseDay(day.key)}
                onKeyDown={(keyEvent) => {
                  if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                    keyEvent.preventDefault();
                    chooseDay(day.key);
                  }
                }}
              >
                <span className="day-number">{day.dayNumber}</span>
                <span className="day-date">{formatShortDate(day.key)}</span>
                <span className="day-events">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      type="button"
                      className={`calendar-chip ${event.tone}`}
                      key={event.id}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        chooseEvent(event);
                      }}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                          keyEvent.preventDefault();
                          keyEvent.stopPropagation();
                          chooseEvent(event);
                        }
                      }}
                    >
                      <b>{event.time}</b>
                      {event.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && <small>+{dayEvents.length - 3} more</small>}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="calendar-side">
        <section className="panel agenda-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Selected day</span>
              <h2>{formatFullDate(selectedDate)}</h2>
            </div>
            <span className="soft-pill dark">{selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}</span>
          </div>
          <div className="agenda-list">
            {selectedDayEvents.length ? selectedDayEvents.map((event) => (
              <button
                key={event.id}
                className={selectedEvent?.id === event.id ? 'agenda-item active' : 'agenda-item'}
                onClick={() => chooseEvent(event)}
              >
                <span>{event.time}</span>
                <strong>{event.title}</strong>
                <small>{event.location}</small>
              </button>
            )) : (
              <div className="empty-agenda">
                <CalendarCheck size={18} />
                <strong>No events yet</strong>
                <span>Start one for this date and it appears on the calendar.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel event-detail-panel">
          {selectedEvent ? (
            <>
              <span className={`event-type ${selectedEvent.tone}`}>{toneName(selectedEvent.tone)}</span>
              <h2>{selectedEvent.title}</h2>
              <p>{selectedEvent.description}</p>
              <div className="detail-meta-grid">
                <span><Clock3 size={17} /> {formatFullDate(selectedEvent.date)} · {selectedEvent.time}</span>
                <span><MapPinned size={17} /> {selectedEvent.location}</span>
                <span><Users size={17} /> {selectedEvent.audience}</span>
                <span><CircleUserRound size={17} /> Hosted by {selectedEvent.host}</span>
              </div>
              <div className="detail-actions">
                <button
                  className={`primary-button${joinedEvents.has(selectedEvent.id) ? ' joined' : ''}`}
                  onClick={() => onJoin(selectedEvent.id)}
                  disabled={joinedEvents.has(selectedEvent.id)}
                >
                  {joinedEvents.has(selectedEvent.id) ? <Check size={18} /> : <ArrowRight size={18} />}
                  {joinedEvents.has(selectedEvent.id) ? 'Joined' : 'Join event'}
                </button>
                <button className="secondary-button">
                  <MessageCircle size={18} />
                  Message host
                </button>
              </div>
            </>
          ) : (
            <div className="empty-agenda">
              <CalendarCheck size={18} />
              <strong>Select an event</strong>
              <span>Click an event chip or an agenda item to open the full event page here.</span>
            </div>
          )}
        </section>

        <section className="panel composer-card">
          <span className="eyebrow">Create on {formatShortDate(selectedDate)}</span>
          <h2>Post an event onto the calendar</h2>
          <label className="field">
            Event name
            <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="Name the event, study room, or meetup" />
          </label>
          <div className="composer-row">
            <label className="field">
              Date
              <input value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} type="date" />
            </label>
            <label className="field">
              Time
              <input value={draftTime} onChange={(event) => setDraftTime(event.target.value)} placeholder="7:30 PM" />
            </label>
          </div>
          <label className="field">
            Location
            <input value={draftLocation} onChange={(event) => setDraftLocation(event.target.value)} placeholder="Campus Center steps" />
          </label>
          <label className="field">
            Type
            <select value={draftTone} onChange={(event) => setDraftTone(event.target.value as EventItem['tone'])}>
              <option value="social">Social</option>
              <option value="study">Study</option>
              <option value="arrival">Arrival</option>
              <option value="sports">Sports</option>
              <option value="culture">Culture</option>
            </select>
          </label>
          <label className="field">
            Who should see it?
            <input value={draftAudience} onChange={(event) => setDraftAudience(event.target.value)} placeholder="Freshmores, exchange students, 10.014..." />
          </label>
          <button className="primary-button wide" onClick={postEvent}>
            <Send size={18} />
            Post to calendar
          </button>
        </section>
      </aside>
      </div>
    </div>
  );
}

function PersonProfileModal({
  person,
  onClose,
  onMessage,
  onConnect,
  isConnected,
}: {
  person: Person;
  onClose: () => void;
  onMessage?: (name: string) => void;
  onConnect: () => void;
  isConnected: boolean;
}) {
  const highlights = personKeyHighlights(person);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="person-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="person-modal">
        <button className="person-modal-close" onClick={onClose} aria-label="Close profile"><X size={16} /></button>

        <div className="person-modal-hero">
          <div className="person-modal-avatar-section">
            <Avatar name={person.name} color={person.color} size={66} />
            <div className="person-modal-title">
              <span className="eyebrow">Student profile hub</span>
              <h2>{person.name}</h2>
              <span>{person.role}</span>
            </div>
          </div>
          <span className={`compat-badge ${compatClass(person.match)}`}>{person.match} match</span>
        </div>

        <div className="person-modal-metrics">
          <div className="person-modal-metric">
            <strong>{person.match}</strong>
            <span>Compatibility</span>
          </div>
          <div className="person-modal-metric">
            <strong>{personYearLabel(person)}</strong>
            <span>Student year</span>
          </div>
          <div className="person-modal-metric">
            <strong>{personPillarLabel(person)}</strong>
            <span>Pillar / group</span>
          </div>
        </div>

        <div className="person-modal-grid">
          <section className="person-modal-section person-modal-section--wide">
            <div className="person-modal-section-title">
              <BadgeCheck size={16} />
              <strong>Key highlights</strong>
            </div>
            <div className="person-highlight-list">
              {highlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>
          </section>

          <section className="person-modal-section person-modal-section--wide">
            <div className="person-modal-section-title">
              <CircleUserRound size={16} />
              <strong>About</strong>
            </div>
            <p>{person.bio ?? person.detail}</p>
          </section>

          {person.modules && person.modules.length > 0 && (
            <section className="person-modal-section">
              <div className="person-modal-section-title">
                <BookOpen size={16} />
                <strong>Modules covered</strong>
              </div>
              <div className="tag-row">{person.modules.map((m) => <span key={m}>{m}</span>)}</div>
            </section>
          )}

          {person.availability && (
            <section className="person-modal-section">
              <div className="person-modal-section-title">
                <CalendarCheck size={16} />
                <strong>Availability</strong>
              </div>
              <p>{person.availability}</p>
            </section>
          )}

          {person.helpStyle && person.helpStyle.length > 0 && (
            <section className="person-modal-section">
              <div className="person-modal-section-title">
                <Sparkles size={16} />
                <strong>How they help</strong>
              </div>
              <div className="tag-row">{person.helpStyle.map((s) => <span key={s}>{s}</span>)}</div>
            </section>
          )}

          <section className="person-modal-section">
            <div className="person-modal-section-title">
              <CircleDot size={16} />
              <strong>Interests</strong>
            </div>
            <div className="tag-row">{person.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </section>
        </div>

        <div className="person-modal-actions">
          <button className={isConnected ? 'primary-button joined' : 'primary-button'} onClick={onConnect} disabled={isConnected}>
            {isConnected ? <><Check size={14} /> Connected</> : 'Request intro'}
          </button>
          <button className="secondary-button" onClick={() => { onMessage?.(person.name); onClose(); }}>
            <MessageCircle size={15} /> Message
          </button>
          <button className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

type CampusLifeIcon = 'food' | 'study' | 'sports' | 'move' | 'support';
type CampusLifeJio = {
  id: string;
  icon: CampusLifeIcon;
  title: string;
  time: string;
  desc: string;
  host: string;
  scope: string;
};

type CampusLifeCommunity = {
  id: string;
  label: string;
  scope: string;
  count: string;
  focus: string;
  tone: 'freshman' | 'returning' | 'commuter' | 'support';
};

type CampusLifeMapStop = {
  id: string;
  label: string;
  kind: 'housing' | 'academic' | 'food' | 'sports' | 'support' | 'transit';
  detail: string;
  x: number;
  y: number;
};

type CampusLifeRoute = {
  id: string;
  title: string;
  time: string;
  detail: string;
  stops: string;
};

const campusLifeJios: CampusLifeJio[] = [
  {
    id: 'jio-breakfast',
    icon: 'food',
    title: 'Breakfast before 10.014',
    time: 'Tomorrow 7:45 AM',
    desc: 'Meet at the main campus walkway and head to breakfast before the first lecture block.',
    host: 'Mei Lin · Freshmore arrival circle',
    scope: 'Open to Freshmores and returning guides',
  },
  {
    id: 'jio-dinner',
    icon: 'food',
    title: 'Dinner jio after orientation admin',
    time: 'Tonight 6:30 PM',
    desc: 'Small-group dinner for students who want a low-pressure first-week plan.',
    host: 'Noah · Year 2 community',
    scope: 'Freshman + returning students',
  },
  {
    id: 'jio-study',
    icon: 'study',
    title: '10.014 lab prep circle',
    time: 'Wed 8 PM · Building 5',
    desc: 'Returning students walk through recursion mistakes and setup checks. Bring your laptop.',
    host: 'Aarav · ISTD year circle',
    scope: 'Module-based group',
  },
  {
    id: 'jio-sports',
    icon: 'sports',
    title: 'Beginner badminton booking',
    time: 'Thu 7 PM · Sports Complex',
    desc: 'No tryout, no pressure. A first-week sports plan for people who do not know anyone yet.',
    host: 'Priya · Sports interest circle',
    scope: 'Interest-based group',
  },
];

const campusLifeCommunities: CampusLifeCommunity[] = [
  {
    id: 'freshmore-arrival',
    label: 'Freshmore arrival circle',
    scope: 'Year 1 / incoming students',
    count: '184 opted in',
    focus: 'Move-in questions, first meals, admin reminders, and Week 0 plans.',
    tone: 'freshman',
  },
  {
    id: 'returning-guides',
    label: 'Returning-student guides',
    scope: 'Years 2-4 grouped by year and pillar',
    count: '96 active',
    focus: 'Module advice, pillar expectations, study groups, and class survival tips.',
    tone: 'returning',
  },
  {
    id: 'commuter-campus',
    label: 'Commuter campus loop',
    scope: 'Off-campus and exchange students',
    count: '51 active',
    focus: 'Transport timing, food plans, late study exits, and weekend meetups.',
    tone: 'commuter',
  },
  {
    id: 'settling-support',
    label: 'Settling-in support',
    scope: 'Private help route',
    count: 'Staff-backed',
    focus: 'Quiet check-ins for students who want help without posting publicly.',
    tone: 'support',
  },
];

const campusLifeGuides = [
  {
    title: 'Official housing first',
    detail: 'Use SUTD Housing for exact assignments, key collection, policies, and maintenance. Cohortly only organizes broad student support.',
  },
  {
    title: 'No room browsing',
    detail: 'The app never shows room numbers, floors, live occupancy, or room-level maps. Community matching stays broad by year, module, and interest.',
  },
  {
    title: 'First-week anchors',
    detail: 'Join one meal, one study circle, one Fifth Row trial, and one campus walk before Week 1 ends.',
  },
  {
    title: 'Move-in essentials',
    detail: 'Pack bedding, toiletries, student card documents, laptop charger, approved adapters, and weather-safe shoes.',
  },
];

const campusLifeMapStops: CampusLifeMapStop[] = [
  {
    id: 'housing',
    label: 'Housing cluster',
    kind: 'housing',
    detail: 'Use official Housing for exact assignments. Cohortly only treats this as a broad home-base waypoint.',
    x: 72,
    y: 28,
  },
  {
    id: 'main-campus',
    label: 'Main campus',
    kind: 'academic',
    detail: 'Student Hub, teaching blocks, library, labs, and most Week 0 admin flows.',
    x: 30,
    y: 46,
  },
  {
    id: 'building-5',
    label: 'Building 5',
    kind: 'academic',
    detail: 'Library, study areas, computer labs, and common module prep meeting point.',
    x: 38,
    y: 26,
  },
  {
    id: 'food',
    label: 'Food loop',
    kind: 'food',
    detail: 'Common meeting point for breakfast, dinner, and supper jios before Week 1.',
    x: 56,
    y: 52,
  },
  {
    id: 'sports',
    label: 'Sports complex',
    kind: 'sports',
    detail: 'Beginner badminton, sports trials, gym access, pool, and first-week movement plans.',
    x: 66,
    y: 72,
  },
  {
    id: 'bus',
    label: 'Bus / MRT link',
    kind: 'transit',
    detail: 'A practical arrival anchor for students commuting or coming from airport/MRT connections.',
    x: 18,
    y: 74,
  },
];

const campusLifeRoutes: CampusLifeRoute[] = [
  {
    id: 'arrival',
    title: 'Arrival day path',
    time: '20-30 min buffer',
    detail: 'Transit link -> official Housing/key collection -> main campus admin desk.',
    stops: 'Bus / MRT link -> Housing cluster -> Main campus',
  },
  {
    id: 'breakfast',
    title: '8 AM lecture breakfast',
    time: '15 min',
    detail: 'Meet at a common campus waypoint, grab food, then head to the lecture block together.',
    stops: 'Housing cluster -> Food loop -> Main campus',
  },
  {
    id: 'study',
    title: 'Night study route',
    time: '10 min',
    detail: 'Broad group movement from housing to Building 5 without exposing individual rooms.',
    stops: 'Housing cluster -> Building 5',
  },
];

function PeopleView({ userEmail, onMessage }: { userEmail?: string; onMessage?: (name: string) => void }) {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'y1' | 'y2' | 'y3plus' | 'modules'>('all');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Firestore connections listener
  useEffect(() => {
    if (!db || !userEmail) return;
    const unsub = onSnapshot(
      collection(db, 'connections', userEmail, 'people'),
      (snap) => setConnected(new Set(snap.docs.map((d) => d.id))),
      (err) => console.warn('[cohortly] connections snapshot error', err),
    );
    return unsub;
  }, [userEmail]);

  const connect = (name: string) => {
    if (db && userEmail) {
      setDoc(doc(db, 'connections', userEmail, 'people', name), { connectedAt: new Date() });
    } else {
      setConnected((prev) => new Set([...prev, name]));
    }
  };

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'all', label: 'Everyone' },
    { id: 'y1', label: 'Year 1' },
    { id: 'y2', label: 'Year 2' },
    { id: 'y3plus', label: 'Year 3+' },
    { id: 'modules', label: 'My Modules' },
  ];

  const filtered = useMemo(() => {
    let result = people;
    if (activeTab === 'y1') result = result.filter((p) => /freshmore|year 1|incoming|exchange/i.test(p.role));
    if (activeTab === 'y2') result = result.filter((p) => /year 2/i.test(p.role));
    if (activeTab === 'y3plus') result = result.filter((p) => /year [34]/i.test(p.role));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [activeTab, searchQuery]);

  return (
    <>
    {selectedPerson && (
      <PersonProfileModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onMessage={onMessage}
        onConnect={() => connect(selectedPerson.name)}
        isConnected={connected.has(selectedPerson.name)}
      />
    )}
    <div className="screen-stack">
      <div className="people-header">
        <div>
          <span className="eyebrow">Verified network</span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>
            {filtered.length} {filtered.length === 1 ? 'person' : 'people'} · sorted by compatibility
          </h2>
        </div>
        <div className="people-search-bar">
          <Search size={15} />
          <input
            placeholder="Search by name, module, or interest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="people-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'people-tab active' : 'people-tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="people-grid">
        {filtered.map((person) => {
          const isConnected = connected.has(person.name);
          const cardHighlight = personCardHighlight(person);
          return (
            <article
              className="person-card"
              key={person.name}
              onClick={() => setSelectedPerson(person)}
              style={{ cursor: 'pointer' }}
            >
              <div className="person-card-top">
                <Avatar name={person.name} color={person.color} />
                <span className={`compat-badge ${compatClass(person.match)}`}>{person.match} match</span>
              </div>
              <div className="person-card-main">
                <h3>{person.name}</h3>
                <span className="person-card-role-line">{person.role}</span>
              </div>
              <div className="person-card-highlight">
                <Sparkles size={14} />
                <span>{cardHighlight}</span>
              </div>
              <div className="tag-row person-card-tags">
                {person.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="person-card-actions">
                <button
                  className={isConnected ? 'primary-button joined' : 'secondary-button'}
                  onClick={(e) => { e.stopPropagation(); connect(person.name); }}
                  disabled={isConnected}
                >
                  {isConnected ? <><Check size={14} /> Connected</> : 'Request intro'}
                </button>
                <span className="person-card-open">
                  Details <ArrowRight size={14} />
                </span>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
            <Search size={22} style={{ marginBottom: 10, opacity: 0.4 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>No results for "{searchQuery}"</div>
            <div style={{ fontSize: '0.84rem' }}>Try a module code, interest, or first name</div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

type QAThread = { id: string; text: string; author: string; time: string; answered: boolean; answer?: string; answerer?: string; anonymous?: boolean; upvotes?: number; upvotedBy?: string[] };

const seedQA: Record<string, QAThread[]> = {
  '10.014': [
    { id: 'q1', text: 'Do we need to know recursion before Lab 2?', author: 'Vanika', time: '2h ago', answered: true, answer: 'Yes — trace through the factorial example in the notes first. Head to Building 5 Level 3 study area this week if you want to walk through it live.', answerer: 'Aarav (Y3 ISTD)' },
    { id: 'q2', text: 'Is Python or Java used in this module?', author: 'Jerome', time: '4h ago', answered: true, answer: 'Python throughout. The first lab uses Jupyter notebooks — install Anaconda or use the lab machines.', answerer: 'Sara (Y2 DAI)' },
    { id: 'q3', text: 'Where do we submit Lab 1?', author: 'Sofia', time: '6h ago', answered: false },
  ],
  '10.009': [
    { id: 'q4', text: 'When is the 2D project brief released?', author: 'Kai', time: '3h ago', answered: true, answer: 'It\'s pinned in the module room — Friday Week 2. Start thinking about your team now.', answerer: 'Wei Jian (Y3 ISTD)' },
    { id: 'q5', text: 'Do we need to buy the textbook?', author: 'Priya', time: '1d ago', answered: false },
  ],
  '50.007': [
    { id: 'q6', text: 'Assignment 1 gradient descent — my loss is going up. Is the learning rate wrong?', author: 'Kai', time: '4h ago', answered: true, answer: 'Almost certainly yes — try 0.01 or 0.001 first. Also check you\'re subtracting, not adding, the gradient update.', answerer: 'Aarav (Y3 ISTD)' },
  ],
  'iDeA-1': [
    { id: 'dai1', text: 'How specific should the problem statement be for our Week 3 brief?', author: 'Sofia', time: '1h ago', answered: true, answer: 'Very specific. "Students waste food" is too broad — "SUTD Freshmore students throw away ~40% of each Koufu tray on weeknights" is a real problem statement. The more specific, the more actionable your design can be.', answerer: 'Sara (Y2 DAI)' },
    { id: 'dai2', text: 'Can I use ChatGPT to help with ideation or is that considered plagiarism?', author: 'Rohan', time: '3h ago', answered: true, answer: 'AI is a tool in iDeA — you\'re encouraged to use it. The rule is: document how you used it, what it gave you, and what you changed/rejected. Your thinking process is what\'s assessed, not the raw output.', answerer: 'Aarav (Y3 ISTD)' },
    { id: 'dai3', text: 'What\'s the difference between user research and just guessing what users want?', author: 'Mei', time: '5h ago', answered: false },
  ],
  'iDeA-2': [
    { id: 'dai4', text: 'Our prototype broke during user testing — do we include that in the report?', author: 'Jerome', time: '2h ago', answered: true, answer: 'Yes — absolutely. Failed tests are data. Write what broke, what you learned, and what you changed. Profs value honesty about iteration over a polished story that hides problems.', answerer: 'Wei Jian (Y3 ISTD)' },
    { id: 'dai5', text: 'Is there a word limit on the design reflection?', author: 'Aisha', time: '4h ago', answered: false },
  ],
  'iDeA-3': [
    { id: 'dai6', text: 'How do we sign up for a Design Week showcase slot?', author: 'Kai', time: '30m ago', answered: true, answer: 'Check Canvas — there\'s a Google Form linked in the iDeA-3 announcement. Slots fill fast, especially the Saturday ones. Book this week.', answerer: 'Aarav (Y3 ISTD)' },
    { id: 'dai7', text: 'Does our final build need to be fully functional or can it be a high-fidelity prototype?', author: 'Priya', time: '2h ago', answered: false },
  ],
};

const seedPrompts: PromptPost[] = [
  { id: 'p1', author: 'Rohan', time: '2h ago', category: 'Research', prompt: 'You are a human-centred design researcher. Given this problem: [PROBLEM], generate 8 distinct user personas with different pain points, motivations, and contexts. Include one persona who might not benefit from the obvious solution.', use: 'Great for Week 2 persona generation. Paste your problem statement in [PROBLEM].', upvotes: 18 },
  { id: 'p2', author: 'Mei Lin', time: '5h ago', category: 'Ideation', prompt: 'Generate 20 "How Might We" questions for this user insight: [INSIGHT]. Make them range from narrow and incremental to wild and speculative. Include at least 3 that challenge the assumptions in the insight.', use: 'Use after your user interviews when you have a key insight but don\'t know where to take it.', upvotes: 24 },
  { id: 'p3', author: 'Sofia', time: '1d ago', category: 'Critique', prompt: 'Act as a critical design reviewer. Here is our proposed solution: [SOLUTION]. List 10 ways this could fail or cause unintended harm. For each failure mode, suggest one design principle that would address it.', use: 'Run this before a critique session so you can pre-empt the hard questions.', upvotes: 31 },
  { id: 'p4', author: 'Jerome', time: '1d ago', category: 'Prototyping', prompt: 'We want to build a low-fidelity prototype of [CONCEPT] in under 2 hours using only: paper, tape, markers, and one everyday object. Give us 5 prototype ideas that could test [CORE ASSUMPTION]. For each, describe what user reaction would validate or invalidate the assumption.', use: 'For rapid prototyping sessions in FabLab when you just need something testable, not beautiful.', upvotes: 14 },
  { id: 'p5', author: 'Aisha', time: '2d ago', category: 'Reflection', prompt: 'Read this design journal entry: [JOURNAL ENTRY]. Identify 3 moments where my thinking shifted and explain what triggered each shift. Then suggest what question I should explore next based on the pattern you see.', use: 'Perfect for writing your iDeA reflection — helps you find the narrative arc in your messy process notes.', upvotes: 27 },
];

const seedTeams: TeamPost[] = [
  { id: 't1', name: 'Campus Food Waste Reducers', looking: 'Looking for: 1 designer + 1 coder', members: ['Rohan K.', 'Sofia T.'], slots: 2, desc: 'Tackling the ~40% food waste per tray at Koufu. Interviewing dining staff this week. We have a scrappy prototype idea.', tags: ['Sustainability', 'Behaviour change', 'Hardware'] },
  { id: 't2', name: 'Freshmore Navigation System', looking: 'Looking for: 1 UX researcher', members: ['Kai W.', 'Priya N.', 'Mei Lin'], slots: 1, desc: 'Building a Cohortly-integrated campus wayfinding tool specifically for Week 0 confusion. Two pilots done, positive signal.', tags: ['UX', 'ISTD', 'App design'] },
  { id: 't3', name: 'Study Buddy Matcher', looking: 'Looking for: 2 members any background', members: ['Jerome A.'], slots: 3, desc: 'Matching algorithm for module-specific study partners. Building on the Cohortly matching model. ML experience a plus but not required.', tags: ['ML', 'Social', 'ISTD'] },
  { id: 't4', name: 'Hostel Quiet Hours Nudge', looking: 'Looking for: 1 hardware person', members: ['Aisha B.', 'Noah R.'], slots: 1, desc: 'Ambient noise feedback system for hostel corridors that reminds without policing. IoT + behaviour design mashup.', tags: ['IoT', 'Hardware', 'Wellbeing'] },
];

const seedShowcase: ShowcasePost[] = [
  { id: 's1', author: 'Rohan K. + Sofia T.', time: '1d ago', title: 'TrayTrack — real-time food waste sensor for Koufu', desc: 'We built a load-cell based tray sensor that logs food waste by weight and shows a live dashboard to the kitchen staff. Tested with Koufu staff this week — they loved it. Next step: add predictive ordering recommendations.', tags: ['IoT', 'Sustainability', 'Data'], likes: 23 },
  { id: 's2', author: 'Kai W. team', time: '2d ago', title: 'CampusFlow — AR campus wayfinding for Week 0', desc: 'A mobile AR overlay that highlights key campus locations during orientation week. Built with React Native + ARKit. 12 Freshmore testers, 9 said they would have used it on Day 1.', tags: ['AR', 'UX', 'App'], likes: 31 },
  { id: 's3', author: 'Aisha B. + Noah R.', time: '3d ago', title: 'HushPulse — ambient noise nudge for hostel corridors', desc: 'A Raspberry Pi + LED strip system that shifts from green to red as corridor noise increases past quiet hours. Installed in a test corridor — noise violations down 60% in the first week.', tags: ['Hardware', 'IoT', 'Wellbeing'], likes: 41 },
  { id: 's4', author: 'Jerome A. + 2 others', time: '4d ago', title: 'MatchMind — study partner matching with preference learning', desc: 'A matching algorithm that learns your study style from 5 questions and improves over time based on feedback. Integrated into Cohortly\'s People tab. 47 matches made, 34 resulted in actual study sessions.', tags: ['ML', 'Social', 'ISTD'], likes: 18 },
];

function ClassesView({
  enrolledClasses = [], onEnroll,
}: {
  enrolledClasses?: string[]; onEnroll?: (c: string[]) => void;
}) {
  const isMentor = false;
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [askAnonymous, setAskAnonymous] = useState(false);
  const [sortByUpvotes, setSortByUpvotes] = useState(false);
  const [localQA, setLocalQA] = useState<Record<string, QAThread[]>>(seedQA);
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importDetected, setImportDetected] = useState<ClassRoom[]>([]);

  // Derive enrolled room codes from profile.classes (match by module code prefix)
  const enrolledCodes = useMemo(() => {
    return classRooms.filter((r) =>
      enrolledClasses.some((c) => c.startsWith(r.code) || r.code === c.split(' ')[0])
    ).map((r) => r.code);
  }, [enrolledClasses]);

  const myRooms = classRooms.filter((r) => enrolledCodes.includes(r.code));
  const otherRooms = classRooms.filter((r) => !enrolledCodes.includes(r.code));

  useEffect(() => {
    if (selectedCode === null && myRooms.length > 0) setSelectedCode(myRooms[0].code);
  }, [myRooms.length]);

  const handleImportParse = (text: string) => {
    setImportText(text);
    const modulePattern = /\b(\d{2,3}\.\d{3})\b/g;
    const codes = [...new Set(Array.from(text.matchAll(modulePattern)).map((m) => m[1]))];
    const matched = classRooms.filter((r) => codes.some((code) => r.code === code || r.code.startsWith(code)));
    setImportDetected(matched);
  };

  const confirmImport = () => {
    if (!onEnroll || importDetected.length === 0) return;
    const newClassStrings = importDetected.map((r) => `${r.code} ${r.title}`);
    const merged = [...new Set([...enrolledClasses, ...newClassStrings])];
    onEnroll(merged);
    setShowImport(false);
    setImportText('');
    setImportDetected([]);
  };

  const leaveRoom = (code: string) => {
    if (!onEnroll) return;
    const updated = enrolledClasses.filter((c) => !c.startsWith(code));
    onEnroll(updated);
  };

  const joinRoom = (room: ClassRoom) => {
    if (!onEnroll) return;
    const entry = `${room.code} ${room.title}`;
    if (!enrolledClasses.includes(entry)) onEnroll([...enrolledClasses, entry]);
    setSelectedCode(room.code);
  };

  const selectedRoom = classRooms.find((r) => r.code === selectedCode) ?? null;
  const rawThreads = selectedCode ? (localQA[selectedCode] ?? []) : [];
  const threads = sortByUpvotes ? [...rawThreads].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0)) : rawThreads;

  // Firestore Q&A listener — loads and seeds per-class threads
  useEffect(() => {
    const firestore = db;
    if (!firestore || !selectedCode) return;
    const colRef = collection(firestore, 'qa', selectedCode, 'threads');
    const unsub = onSnapshot(
      query(colRef, orderBy('createdAt', 'desc')),
      (snap) => {
        if (snap.empty && seedQA[selectedCode]) {
          const batch = writeBatch(firestore);
          (seedQA[selectedCode] ?? []).forEach((t) =>
            batch.set(doc(colRef, t.id), { ...t, createdAt: new Date() }),
          );
          batch.commit();
        } else {
          const loaded = snap.docs.map((d) => {
            const { createdAt, ...rest } = d.data();
            return rest as QAThread;
          });
          setLocalQA((prev) => ({ ...prev, [selectedCode]: loaded }));
        }
      },
      (err) => console.warn('[cohortly] Q&A snapshot error', err),
    );
    return unsub;
  }, [selectedCode]);

  const postQuestion = () => {
    const text = questionText.trim();
    if (!text || !selectedCode) return;
    const newQ: QAThread = { id: `q-${Date.now()}`, text, author: askAnonymous ? 'Anonymous Freshmore' : 'You', time: 'just now', answered: false, anonymous: askAnonymous, upvotes: 0, upvotedBy: [] };
    if (db) {
      setDoc(doc(db, 'qa', selectedCode, 'threads', newQ.id), { ...newQ, createdAt: new Date() });
    } else {
      setLocalQA((prev) => ({ ...prev, [selectedCode]: [newQ, ...(prev[selectedCode] ?? [])] }));
    }
    setQuestionText('');
  };

  const upvoteQuestion = (threadId: string) => {
    if (!selectedCode) return;
    const updated = (localQA[selectedCode] ?? []).map((q) => {
      if (q.id !== threadId) return q;
      const alreadyVoted = (q.upvotedBy ?? []).includes('me');
      if (alreadyVoted) return q;
      return { ...q, upvotes: (q.upvotes ?? 0) + 1, upvotedBy: [...(q.upvotedBy ?? []), 'me'] };
    });
    if (db) {
      const q = updated.find((t) => t.id === threadId);
      if (q) setDoc(doc(db, 'qa', selectedCode, 'threads', threadId), { upvotes: q.upvotes, upvotedBy: q.upvotedBy }, { merge: true });
    }
    setLocalQA((prev) => ({ ...prev, [selectedCode]: updated }));
  };

  const submitAnswer = (threadId: string) => {
    const text = answerText.trim();
    if (!text || !selectedCode) return;
    const displayName = 'Returning Student';
    const updated = (localQA[selectedCode] ?? []).map((q) =>
      q.id === threadId ? { ...q, answered: true, answer: text, answerer: displayName } : q,
    );
    if (db) {
      const colRef = collection(db, 'qa', selectedCode, 'threads');
      setDoc(doc(colRef, threadId), { answered: true, answer: text, answerer: displayName }, { merge: true });
    }
    setLocalQA((prev) => ({ ...prev, [selectedCode]: updated }));
    setClaimedId(null);
    setAnswerText('');
  };

  return (
    <div className="classes-layout">
      {/* Left panel — class list */}
      <div className="class-list-panel">
        <div className="class-list-panel-head">
          <span className="eyebrow">My rooms {myRooms.length > 0 && `· ${myRooms.length}`}</span>
          {!isMentor && (
            <button className="class-import-btn" onClick={() => setShowImport((v) => !v)} title="Import timetable">
              <FileSpreadsheet size={14} /> Import
            </button>
          )}
        </div>

        {/* Timetable import widget */}
        {showImport && (
          <div className="class-import-widget">
            <p>Paste your ModTrek or Canvas timetable — we'll detect your modules and add the rooms.</p>
            <textarea
              className="class-import-textarea"
              rows={4}
              placeholder="Paste timetable text here…"
              value={importText}
              onChange={(e) => handleImportParse(e.target.value)}
            />
            {importDetected.length > 0 && (
              <div className="class-import-detected">
                {importDetected.map((r) => (
                  <span key={r.code} className="class-import-chip">{r.code}</span>
                ))}
                <button className="primary-button" style={{ marginLeft: 'auto', padding: '5px 12px', fontSize: '0.78rem' }} onClick={confirmImport}>
                  <Check size={12} /> Add {importDetected.length} room{importDetected.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
            {importText.length > 10 && importDetected.length === 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '4px 0 0' }}>No module codes detected — make sure your timetable includes codes like 10.014, 50.007 etc.</p>
            )}
          </div>
        )}

        {/* Enrolled rooms */}
        {myRooms.length > 0 ? myRooms.map((room) => (
          <div key={room.code} className="class-list-item-wrap">
            <button
              className={`class-list-item enrolled${selectedCode === room.code ? ' active' : ''}`}
              onClick={() => setSelectedCode(room.code)}
            >
              <span className="item-code">{room.code}</span>
              <strong>{room.title}</strong>
              <span>{room.activity}</span>
            </button>
            {!isMentor && (
              <button className="class-leave-btn" onClick={() => leaveRoom(room.code)} title="Leave room">
                <X size={11} />
              </button>
            )}
          </div>
        )) : (
          !isMentor && (
            <p className="class-empty-hint">No rooms yet — import your timetable or join a room below.</p>
          )
        )}

        {/* Browse other rooms */}
        {otherRooms.length > 0 && (
          <>
            <div style={{ margin: '14px 0 6px' }}>
              <span className="eyebrow">Browse rooms</span>
            </div>
            {otherRooms.map((room) => (
              <div key={room.code} className="class-list-item-wrap">
                <button
                  className={`class-list-item${selectedCode === room.code ? ' active' : ''}`}
                  onClick={() => setSelectedCode(room.code)}
                >
                  <span className="item-code">{room.code}</span>
                  <strong>{room.title}</strong>
                  <span>{room.activity}</span>
                </button>
                {!isMentor && (
                  <button className="class-join-btn" onClick={() => joinRoom(room)} title="Join room">
                    <Plus size={11} />
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Right panel — Q&A room or Design·AI room */}
      {selectedRoom ? (
        selectedRoom.isDesignAI ? (
          <DesignAIRoomPanel
            room={selectedRoom}
            threads={threads}
            isMentor={isMentor}
            claimedId={claimedId}
            answerText={answerText}
            questionText={questionText}
            setQuestionText={setQuestionText}
            setClaimedId={setClaimedId}
            setAnswerText={setAnswerText}
            postQuestion={postQuestion}
            submitAnswer={submitAnswer}
          />
        ) : (
        <div className="panel class-room-panel" style={{ padding: 0 }}>
          <div className="class-room-header">
            <div className="class-room-meta">
              <span className="item-code">{selectedRoom.code}</span>
              <span>{selectedRoom.mentors}</span>
            </div>
            <h2>{selectedRoom.title}</h2>
            <div className="class-room-meta">
              <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.78rem' }}>● {selectedRoom.status}</span>
            </div>
          </div>

          <div className="qa-section">
            <div className="qa-section-head-row">
              <span className="qa-section-head">{threads.length} question{threads.length !== 1 ? 's' : ''} in this room</span>
              <button
                className={`qa-sort-btn${sortByUpvotes ? ' active' : ''}`}
                onClick={() => setSortByUpvotes((v) => !v)}
                title="Sort by most upvoted"
              >
                <ArrowUpDown size={13} /> {sortByUpvotes ? 'Top' : 'Recent'}
              </button>
            </div>
            <div className="qa-list">
              {threads.map((q) => {
                const hasUpvoted = (q.upvotedBy ?? []).includes('me');
                return (
                  <div key={q.id} className="qa-item">
                    <div className="qa-question-row">
                      <Avatar name={q.author} color={q.anonymous ? 'indigo' : q.author === 'You' ? 'blue' : 'teal'} />
                      <div className="qa-question-body">
                        <div className="qa-meta">
                          {q.anonymous ? <span className="qa-anon-badge">Anonymous</span> : q.author} · {q.time}
                        </div>
                        <p>{q.text}</p>
                      </div>
                      <button
                        className={`qa-upvote-btn${hasUpvoted ? ' voted' : ''}`}
                        onClick={() => upvoteQuestion(q.id)}
                        disabled={hasUpvoted}
                        title="Upvote this question"
                      >
                        <ThumbsUp size={12} />
                        <span>{q.upvotes ?? 0}</span>
                      </button>
                    </div>
                    {q.answered && q.answer ? (
                      <div className="qa-answer">
                        <div className="qa-answer-header">
                          <Check size={12} className="qa-answer-check" />
                          <span className="qa-answerer">{q.answerer}</span>
                        </div>
                        <p>{q.answer}</p>
                      </div>
                    ) : isMentor ? (
                      claimedId === q.id ? (
                        <div className="qa-answer-composer">
                          <textarea
                            placeholder="Write your answer — be specific, helpful, and friendly…"
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                          />
                          <div className="qa-answer-composer-actions">
                            <button className="secondary-button" onClick={() => { setClaimedId(null); setAnswerText(''); }}>Cancel</button>
                            <button className="primary-button" onClick={() => submitAnswer(q.id)} disabled={!answerText.trim()}>
                              <Send size={14} /> Post answer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="qa-claim-btn" onClick={() => { setClaimedId(q.id); setAnswerText(''); }}>
                          <ThumbsUp size={13} /> Claim & answer this
                        </button>
                      )
                    ) : (
                      <span className="qa-waiting">Waiting for a classmate or returning student…</span>
                    )}
                  </div>
                );
              })}
              {threads.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: '0.875rem', padding: '8px 0' }}>No questions yet — be the first to ask.</div>
              )}
            </div>
          </div>

          {!isMentor && (
            <div className="qa-compose">
              <textarea
                placeholder={`Ask a question in ${selectedRoom.code}…`}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <div className="qa-compose-actions">
                <label className="qa-anon-toggle">
                  <input type="checkbox" checked={askAnonymous} onChange={(e) => setAskAnonymous(e.target.checked)} />
                  Ask anonymously
                </label>
                <button className="primary-button" onClick={postQuestion} disabled={!questionText.trim()}>
                  <Send size={15} /> Post question
                </button>
              </div>
            </div>
          )}
        </div>
        )
      ) : (
        <div className="panel class-empty-state">
          <BookOpen size={28} style={{ opacity: 0.25 }} />
          <strong>Select a module room</strong>
          <span>Open Q&amp;As, see what classmates are answering, and post your own questions.</span>
        </div>
      )}
    </div>
  );
}

function DesignAIRoomPanel({
  room, threads, isMentor, claimedId, answerText, questionText,
  setQuestionText, setClaimedId, setAnswerText, postQuestion, submitAnswer,
}: {
  room: ClassRoom;
  threads: QAThread[];
  isMentor: boolean;
  claimedId: string | null;
  answerText: string;
  questionText: string;
  setQuestionText: (v: string) => void;
  setClaimedId: (v: string | null) => void;
  setAnswerText: (v: string) => void;
  postQuestion: () => void;
  submitAnswer: (id: string) => void;
}) {
  type DAITab = 'qa' | 'teams' | 'prompts' | 'showcase';
  const [activeTab, setActiveTab] = useState<DAITab>('qa');
  const [prompts, setPrompts] = useState<PromptPost[]>(seedPrompts);
  const [teams, setTeams] = useState<TeamPost[]>(seedTeams);
  const [showcase, setShowcase] = useState<ShowcasePost[]>(seedShowcase);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptUse, setNewPromptUse] = useState('');
  const [newPromptCat, setNewPromptCat] = useState('Ideation');
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [showShowcaseForm, setShowShowcaseForm] = useState(false);
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseDesc, setNewShowcaseDesc] = useState('');

  const upvotePrompt = (id: string) => {
    if (upvoted.has(id)) return;
    setUpvoted((p) => new Set([...p, id]));
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const likeShowcase = (id: string) => {
    if (liked.has(id)) return;
    setLiked((p) => new Set([...p, id]));
    setShowcase((prev) => prev.map((s) => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  const joinTeam = (id: string) => {
    if (joined.has(id)) return;
    setJoined((p) => new Set([...p, id]));
    setTeams((prev) => prev.map((t) => t.id === id ? { ...t, slots: Math.max(0, t.slots - 1), members: [...t.members, 'You'] } : t));
  };

  const postPrompt = () => {
    if (!newPromptText.trim()) return;
    const p: PromptPost = {
      id: `p-${Date.now()}`, author: 'You', time: 'just now',
      category: newPromptCat, prompt: newPromptText, use: newPromptUse, upvotes: 0,
    };
    setPrompts((prev) => [p, ...prev]);
    setNewPromptText(''); setNewPromptUse(''); setShowPromptForm(false);
  };

  const postShowcase = () => {
    if (!newShowcaseTitle.trim()) return;
    const s: ShowcasePost = {
      id: `s-${Date.now()}`, author: 'You', time: 'just now',
      title: newShowcaseTitle, desc: newShowcaseDesc, tags: ['Student work'], likes: 0,
    };
    setShowcase((prev) => [s, ...prev]);
    setNewShowcaseTitle(''); setNewShowcaseDesc(''); setShowShowcaseForm(false);
  };

  const tabs: Array<{ id: DAITab; label: string }> = [
    { id: 'qa', label: 'Q&A' },
    { id: 'teams', label: 'Team Formation' },
    { id: 'prompts', label: 'Prompt Board' },
    { id: 'showcase', label: 'Showcase' },
  ];

  const catColors: Record<string, string> = { Research: '#6366f1', Ideation: '#059669', Critique: '#d97706', Prototyping: '#0891b2', Reflection: '#7c3aed' };

  return (
    <div className="panel class-room-panel" style={{ padding: 0 }}>
      <div className="class-room-header" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="class-room-meta">
          <span className="item-code" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{room.code}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{room.mentors}</span>
        </div>
        <h2 style={{ color: '#fff' }}>{room.title}</h2>
        <div className="class-room-meta">
          <span style={{ color: '#a5f3fc', fontWeight: 600, fontSize: '0.78rem' }}>● {room.status}</span>
        </div>
        <div className="dai-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`dai-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dai-tab-content">
        {/* ── Q&A TAB ── */}
        {activeTab === 'qa' && (
          <div className="qa-section" style={{ padding: 0 }}>
            <span className="qa-section-head">{threads.length} design questions in this room</span>
            <div className="qa-list">
              {threads.map((q) => (
                <div key={q.id} className="qa-item">
                  <div className="qa-question-row">
                    <Avatar name={q.author} color={q.author === 'You' ? 'blue' : 'violet'} />
                    <div className="qa-question-body">
                      <div className="qa-meta">{q.author} · {q.time}</div>
                      <p>{q.text}</p>
                    </div>
                  </div>
                  {q.answered && q.answer ? (
                    <div className="qa-answer">
                      <span className="qa-answerer">{q.answerer}</span>
                      <p>{q.answer}</p>
                    </div>
                  ) : isMentor ? (
                    claimedId === q.id ? (
                      <div className="qa-answer-composer">
                        <textarea placeholder="Write your answer…" value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
                        <div className="qa-answer-composer-actions">
                          <button className="secondary-button" onClick={() => { setClaimedId(null); setAnswerText(''); }}>Cancel</button>
                          <button className="primary-button" onClick={() => submitAnswer(q.id)} disabled={!answerText.trim()}><Send size={14} /> Post answer</button>
                        </div>
                      </div>
                    ) : (
                      <button className="qa-claim-btn" onClick={() => { setClaimedId(q.id); setAnswerText(''); }}><ThumbsUp size={13} /> Claim & answer</button>
                    )
                  ) : (
                    <span className="qa-waiting">Waiting for a classmate or returning student…</span>
                  )}
                </div>
              ))}
            </div>
            {!isMentor && (
              <div className="qa-compose">
                <textarea placeholder={`Ask a design or process question in ${room.code}…`} value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                <div className="qa-compose-actions">
                  <span>Visible to all verified iDeA students</span>
                  <button className="primary-button" onClick={postQuestion} disabled={!questionText.trim()}><Send size={15} /> Post question</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TEAM FORMATION TAB ── */}
        {activeTab === 'teams' && (
          <div className="dai-teams-section">
            <div className="dai-section-head">
              <div>
                <strong>{teams.length} active teams looking for members</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 2 }}>Join a team or post your own. Most project teams have 3–4 members.</p>
              </div>
            </div>
            <div className="dai-teams-grid">
              {teams.map((team) => {
                const isJoined = joined.has(team.id);
                return (
                  <div key={team.id} className="dai-team-card">
                    <div className="dai-team-card-top">
                      <h3>{team.name}</h3>
                      <span className={`dai-slots-badge${team.slots === 0 ? ' full' : ''}`}>
                        {team.slots === 0 ? 'Full' : `${team.slots} slot${team.slots !== 1 ? 's' : ''} open`}
                      </span>
                    </div>
                    <p className="dai-team-looking">{team.looking}</p>
                    <p style={{ fontSize: '0.84rem', color: 'var(--ink)', lineHeight: 1.5, margin: '8px 0' }}>{team.desc}</p>
                    <div className="dai-team-members">
                      {team.members.map((m) => (
                        <span key={m} className="dai-member-chip">{m}</span>
                      ))}
                    </div>
                    <div className="tag-row" style={{ marginTop: 6 }}>
                      {team.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                    <button
                      className={isJoined ? 'primary-button wide joined' : 'primary-button wide'}
                      style={{ marginTop: 12 }}
                      disabled={isJoined || team.slots === 0}
                      onClick={() => joinTeam(team.id)}
                    >
                      {isJoined ? <><Check size={14} /> Joined team</> : team.slots === 0 ? 'Team full' : 'Request to join'}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="dai-post-team-banner">
              <div>
                <strong>Looking for teammates?</strong>
                <p>Post your project idea and the kind of people you're looking for.</p>
              </div>
              <button className="primary-button" onClick={() => {
                const name = window.prompt('Team / project name?');
                const desc = window.prompt('What are you working on?');
                const slots = parseInt(window.prompt('How many members do you need?') ?? '2');
                if (name && desc) {
                  setTeams((prev) => [{
                    id: `t-${Date.now()}`, name, looking: `Looking for: ${slots} member${slots !== 1 ? 's' : ''}`,
                    members: ['You'], slots, desc, tags: ['New team'],
                  }, ...prev]);
                }
              }}>
                <Plus size={14} /> Post a team
              </button>
            </div>
          </div>
        )}

        {/* ── PROMPT BOARD TAB ── */}
        {activeTab === 'prompts' && (
          <div className="dai-prompts-section">
            <div className="dai-section-head">
              <div>
                <strong>{prompts.length} prompts shared by students</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 2 }}>Battle-tested AI prompts for every stage of the design process.</p>
              </div>
              <button className="primary-button" onClick={() => setShowPromptForm((v) => !v)}>
                <Plus size={14} /> Share a prompt
              </button>
            </div>

            {showPromptForm && (
              <div className="dai-prompt-form">
                <label className="field">Category
                  <select value={newPromptCat} onChange={(e) => setNewPromptCat(e.target.value)}>
                    {['Research', 'Ideation', 'Critique', 'Prototyping', 'Reflection'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="field">The prompt
                  <textarea placeholder="Paste your full prompt here. Use [PLACEHOLDERS] for the parts you swap out." value={newPromptText} onChange={(e) => setNewPromptText(e.target.value)} rows={4} />
                </label>
                <label className="field">When to use it
                  <input placeholder="e.g. Use after your user interviews when you have a key insight…" value={newPromptUse} onChange={(e) => setNewPromptUse(e.target.value)} />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="secondary-button" onClick={() => setShowPromptForm(false)}>Cancel</button>
                  <button className="primary-button" onClick={postPrompt} disabled={!newPromptText.trim()}><Send size={14} /> Share prompt</button>
                </div>
              </div>
            )}

            <div className="dai-prompts-list">
              {prompts.map((p) => (
                <div key={p.id} className="dai-prompt-card">
                  <div className="dai-prompt-card-top">
                    <span className="dai-prompt-category" style={{ background: catColors[p.category] ?? '#6366f1' }}>{p.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.author} · {p.time}</span>
                  </div>
                  <div className="dai-prompt-text">
                    <code>{p.prompt}</code>
                  </div>
                  <div className="dai-prompt-use">
                    <Sparkles size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{p.use}</span>
                  </div>
                  <button
                    className={`dai-upvote-btn${upvoted.has(p.id) ? ' voted' : ''}`}
                    onClick={() => upvotePrompt(p.id)}
                  >
                    <ThumbsUp size={13} /> {p.upvotes} useful
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SHOWCASE TAB ── */}
        {activeTab === 'showcase' && (
          <div className="dai-showcase-section">
            <div className="dai-section-head">
              <div>
                <strong>{showcase.length} prototypes in the showcase</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 2 }}>Share your work — even if it's rough. The best projects started as something unpolished.</p>
              </div>
              <button className="primary-button" onClick={() => setShowShowcaseForm((v) => !v)}>
                <Plus size={14} /> Share work
              </button>
            </div>

            {showShowcaseForm && (
              <div className="dai-prompt-form">
                <label className="field">Project title
                  <input placeholder="What did you build?" value={newShowcaseTitle} onChange={(e) => setNewShowcaseTitle(e.target.value)} />
                </label>
                <label className="field">Description
                  <textarea placeholder="What problem does it solve? What did you learn building it? What would you do differently?" value={newShowcaseDesc} onChange={(e) => setNewShowcaseDesc(e.target.value)} rows={3} />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="secondary-button" onClick={() => setShowShowcaseForm(false)}>Cancel</button>
                  <button className="primary-button" onClick={postShowcase} disabled={!newShowcaseTitle.trim()}><Send size={14} /> Share</button>
                </div>
              </div>
            )}

            <div className="dai-showcase-grid">
              {showcase.map((s) => (
                <div key={s.id} className="dai-showcase-card">
                  <div className="dai-showcase-card-visual">
                    <span className="dai-showcase-icon"><Sparkles size={22} /></span>
                  </div>
                  <div className="dai-showcase-card-body">
                    <h3>{s.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.author} · {s.time}</span>
                    <p>{s.desc}</p>
                    <div className="tag-row" style={{ marginTop: 6 }}>
                      {s.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                    <button
                      className={`dai-upvote-btn${liked.has(s.id) ? ' voted' : ''}`}
                      style={{ marginTop: 10 }}
                      onClick={() => likeShowcase(s.id)}
                    >
                      <ThumbsUp size={13} /> {s.likes} {liked.has(s.id) ? 'liked' : 'likes'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MessagesView({ isMentor = false, openWith, onClearTarget }: { isMentor?: boolean; openWith?: string | null; onClearTarget?: () => void }) {
  const defaultThreads = isMentor
    ? ['Vanika · 10.014 help request', 'Kai · CTD prep session', '10.014 study group', 'ISTD freshmores circle']
    : ['Aarav · 10.014 prep', 'Food crawl group', 'SUTD exchange arrivals', 'ASD design studio warmup'];

  type ChatMsg = { author: string; text: string; tone: 'student' | 'mentor' | 'system' };
  const threadKey = (thread: string) => `messages_${thread.replace(/\s+/g, '_').toLowerCase()}`;
  const loadThreadMessages = (thread: string): ChatMsg[] => {
    try { return JSON.parse(localStorage.getItem(threadKey(thread)) ?? '[]'); } catch { return []; }
  };

  const [threads, setThreads] = useState(defaultThreads);
  const [activeThread, setActiveThread] = useState(defaultThreads[0]);
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState<ChatMsg[]>(() => loadThreadMessages(defaultThreads[0]));

  const selectThread = (thread: string) => {
    setActiveThread(thread);
    setLocalMessages(loadThreadMessages(thread));
  };

  // When navigated here from People tab, inject or select the thread
  useEffect(() => {
    if (!openWith) return;
    const matchingThread = threads.find((t) => t.toLowerCase().startsWith(openWith.toLowerCase().split(' ')[0]));
    if (matchingThread) {
      selectThread(matchingThread);
    } else {
      const newThread = `${openWith} · new conversation`;
      setThreads((prev) => [newThread, ...prev]);
      setActiveThread(newThread);
      setLocalMessages(loadThreadMessages(newThread));
    }
    onClearTarget?.();
  }, [openWith]);

  const isNewConv = activeThread.endsWith('· new conversation');
  const threadName = activeThread.split(' · ')[0];

  const send = () => {
    if (!input.trim()) return;
    const next: ChatMsg[] = [...localMessages, { author: 'You', text: input.trim(), tone: 'student' }];
    setLocalMessages(next);
    try { localStorage.setItem(threadKey(activeThread), JSON.stringify(next)); } catch {}
    setInput('');
  };

  const defaultMessages = isMentor ? (
    <>
      <Message tone="system" author="Cohortly" text="Matched via 10.014 Computational Thinking · Weekday evenings · SUTD verified" />
      <Message tone="student" author="Vanika" text="Hi, I'm struggling with the recursion exercises in 10.014 lab 2. The tree traversal part is confusing me." />
      <Message tone="mentor" author="Aarav" text="No worries — this trips most people up. I'll run a walkthrough session tonight in Building 5, Room 3. Come at 8:30 PM." />
      <Message tone="student" author="Vanika" text="That sounds great, I'll be there. Should I review anything specific before coming?" />
    </>
  ) : (
    <>
      <Message tone="system" author="Cohortly" text="Matched on 10.014, Startups & iCube, Badminton, and weekday evening availability." />
      <Message tone="mentor" author="Aarav" text="Hey! Saw you joined the 10.014 room. I run weekly coding prep sessions for Freshmores — happy to help." />
      <Message tone="student" author="Vanika" text="I am nervous about coding because everyone sounds ahead already." />
      <Message tone="mentor" author="Aarav" text="That is exactly why the prep room exists. Drop by Building 5 Level 3 this week and we will start with tracing code by hand." />
    </>
  );

  const chatListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatListRef.current) chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [localMessages, activeThread]);

  const headerAv = (s: string) => s.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="messages-layout">
      <aside className="panel thread-panel">
        <span className="eyebrow">{isMentor ? 'Student threads' : 'Circles'}</span>
        {threads.map((thread) => {
          const parts = thread.split(' · ');
          const displayName = parts[0];
          const subtitle = parts[1] || 'Group conversation';
          const av = headerAv(displayName);
          return (
            <button
              className={`thread-row${activeThread === thread ? ' active' : ''}`}
              key={thread}
              onClick={() => selectThread(thread)}
            >
              <span className="thread-avatar">{av}</span>
              <span className="thread-info">
                <span className="thread-name">{displayName}</span>
                <span className="thread-sub">{subtitle}</span>
              </span>
            </button>
          );
        })}
      </aside>
      <section className="panel chat-card">
        <div className="chat-header">
          <div className="chat-header-avatar">{headerAv(threadName)}</div>
          <div className="chat-header-info">
            <h2>{activeThread.replace(' · new conversation', '')}</h2>
            <span className="eyebrow">{isNewConv ? 'New conversation' : (isMentor ? 'Student thread' : 'Direct message')}</span>
          </div>
        </div>
        <div className="chat-list" ref={chatListRef}>
          {isNewConv ? (
            localMessages.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '32px 20px', color: 'var(--muted)', textAlign: 'center', marginTop: 'auto' }}>
                <MessageCircle size={28} style={{ opacity: 0.25 }} />
                <strong style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Start a conversation with {threadName}</strong>
                <span style={{ fontSize: '0.8rem' }}>Send a message below to connect.</span>
              </div>
            ) : localMessages.map((m, i) => <Message key={i} tone={m.tone} author={m.author} text={m.text} />)
          ) : (
            <>
              {defaultMessages}
              {localMessages.map((m, i) => <Message key={i} tone={m.tone} author={m.author} text={m.text} />)}
            </>
          )}
        </div>
        <div className="message-composer">
          <input
            placeholder={isNewConv ? `Message ${threadName}…` : (isMentor ? `Reply to ${threadName}…` : 'Ask a question or suggest a meetup')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="primary-button icon-only" aria-label="Send" onClick={send} disabled={!input.trim()}><Send size={18} /></button>
        </div>
      </section>
    </div>
  );
}

const mentorHelpRequests = [
  { module: '10.014 Computational Thinking', question: 'Stuck on lab 2 tree traversal — recursion is still not clicking for me.', student: 'Vanika', time: '2h ago', urgent: true },
  { module: '50.007 Machine Learning', question: 'Assignment 1 gradient descent — my loss is going up instead of down. Code shared below.', student: 'Kai', time: '4h ago', urgent: false },
  { module: '10.009 The Digital World', question: '2D project scope feels too big. How did you scope yours in Year 1?', student: 'Mei', time: '6h ago', urgent: false },
  { module: '10.014 Computational Thinking', question: 'Struggling to understand memoisation vs. tabulation — which should I learn first?', student: 'Jerome', time: '1d ago', urgent: false },
];

const mentorStats = [
  { value: '12', label: 'students helped', change: 'this term' },
  { value: '34', label: 'questions answered', change: '91% in <24h' },
  { value: '3', label: 'sessions hosted', change: '+2 scheduled' },
  { value: '4.9', label: 'mentor rating', change: 'out of 5.0' },
];

function MentorDashboardView({
  user,
  profile,
  setActiveView,
}: {
  user: VerifiedUser;
  profile: StudentProfile;
  setActiveView: (view: View) => void;
}) {
  const modules = profile.mentorModules ?? profile.classes;
  return (
    <div className="today-stack">
      <section className="mentor-hero panel">
        <div>
          <span className="eyebrow">Mentor dashboard</span>
          <h2>Welcome back, {user.name.split(' ')[0]}.</h2>
          <p>
            {mentorHelpRequests.filter((r) => r.urgent).length} students are waiting on your modules right now.
            Your answers help the whole cohort — not just one person.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setActiveView('mentor-help')}>
              <BookOpen size={18} />
              See help requests
            </button>
            <button className="secondary-button" onClick={() => setActiveView('events')}>
              <CalendarCheck size={18} />
              Post a study session
            </button>
          </div>
        </div>
        <div className="mentor-stats-grid">
          {mentorStats.map((stat) => (
            <div className="mentor-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <em>{stat.change}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="priority-grid">
        <article className="panel next-best-card">
          <span className="eyebrow">Most urgent</span>
          {mentorHelpRequests.filter((r) => r.urgent).map((req) => (
            <div key={req.student}>
              <span className="event-type study">{req.module}</span>
              <h2 style={{ marginTop: 12 }}>{req.student}</h2>
              <p style={{ marginTop: 8 }}>{req.question}</p>
              <div className="featured-meta" style={{ marginTop: 12 }}>
                <span><Clock3 size={17} /> {req.time}</span>
              </div>
              <button className="primary-button" style={{ marginTop: 16 }} onClick={() => setActiveView('messages')}>
                <MessageCircle size={18} />
                Reply now
              </button>
            </div>
          ))}
        </article>

        <article className="panel campus-zones-card">
          <div className="section-heading compact-heading">
            <div>
              <span className="eyebrow">Your active modules</span>
              <h2>Rooms you're covering</h2>
            </div>
          </div>
          <div className="class-list">
            {classRooms.filter((r) => modules.some((m) => m.includes(r.code))).slice(0, 3).map((room) => (
              <article className="class-card" key={room.code}>
                <span>{room.code}</span>
                <div>
                  <h3>{room.title}</h3>
                  <p>{room.activity}</p>
                </div>
                <strong>{room.status}</strong>
              </article>
            ))}
            {classRooms.filter((r) => modules.some((m) => m.includes(r.code))).length === 0 && (
              <div style={{ padding: 16, color: 'var(--muted)' }}>Your module rooms appear here once active.</div>
            )}
          </div>
        </article>

        <article className="panel live-feed-card">
          <span className="eyebrow">Recent activity</span>
          <div className="activity-timeline">
            <div>
              <span />
              <strong>Vanika asked about recursion in 10.014</strong>
              <small>2 hours ago · awaiting your reply</small>
            </div>
            <div>
              <span />
              <strong>Your session last Friday helped 12 students</strong>
              <small>Building 5, Room 3 · 10.014 prep</small>
            </div>
            <div>
              <span />
              <strong>Kai joined your 50.007 ML study room</strong>
              <small>6 hours ago</small>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function MentorHelpView({ profile }: { profile: StudentProfile }) {
  const modules = profile.mentorModules ?? profile.classes;
  const filtered = modules.length > 0
    ? mentorHelpRequests.filter((r) => modules.some((m) => r.module.includes(m.split(' ')[0])))
    : mentorHelpRequests;
  const displayed = filtered.length > 0 ? filtered : mentorHelpRequests;

  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Help requests</span>
            <h2>Students waiting on your modules</h2>
          </div>
          <span className="soft-pill dark">{displayed.length} open</span>
        </div>
        <div className="class-list">
          {displayed.map((req) => (
            <article key={req.student + req.module} className="class-card" style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'start', paddingTop: 16, paddingBottom: 16 }}>
              <Avatar name={req.student} color="teal" />
              <div>
                <span style={{ color: 'var(--teal-dark)', fontSize: '0.76rem', fontWeight: 900, textTransform: 'uppercase' }}>{req.module}</span>
                <h3 style={{ marginTop: 4, fontSize: '0.98rem' }}>{req.question}</h3>
                <p style={{ marginTop: 4, color: 'var(--muted)', fontSize: '0.84rem' }}>{req.student} · {req.time}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                {req.urgent && <span className="event-type study" style={{ fontSize: '0.7rem' }}>Urgent</span>}
                <button className="secondary-button">Reply</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


function EventList({ events, compact = false }: { events: EventItem[]; compact?: boolean }) {
  return (
    <div className={compact ? 'event-list compact' : 'event-list'}>
      {events.map((event) => {
        const goingMatch = event.meta.match(/(\d[\d,]*)\s*going/);
        const goingCount = goingMatch?.[1];
        return (
          <article className={`event-card ${event.tone}`} key={event.id}>
            <div className="date-chip">
              <strong>{formatDateParts(event.date).day}</strong>
              <span>{formatDateParts(event.date).weekday}</span>
            </div>
            <div>
              <span>{toneName(event.tone)}</span>
              <h3>{event.title}</h3>
              <p>{event.host} · {event.audience}</p>
            </div>
            <div className="event-meta">
              <strong>{event.time}</strong>
              {goingCount && <span className="event-going-badge">{goingCount} going</span>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PulseMetric({
  icon: Icon,
  value,
  label,
  change,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  change: string;
}) {
  return (
    <article className="pulse-metric">
      <span><Icon size={18} /></span>
      <strong>{value}</strong>
      <small>{label}</small>
      <em>{change}</em>
    </article>
  );
}

function ActionItem({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="action-item">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

function Message({ tone, author, text }: { tone: 'student' | 'mentor' | 'system'; author: string; text: string }) {
  if (tone === 'system') {
    return (
      <div className="message system">
        <p>{text}</p>
      </div>
    );
  }
  const av = author.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`message ${tone}`}>
      <span className="msg-avatar">{av}</span>
      <div className="msg-bubble-wrap">
        <strong>{author}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function Avatar({ name, color, pfpUrl, size = 38 }: { name: string; color: string; pfpUrl?: string; size?: number }) {
  if (pfpUrl) {
    return (
      <img
        src={pfpUrl}
        alt={name}
        className="pfp-avatar"
        style={{ width: size, height: size, borderRadius: '50%' }}
      />
    );
  }
  const sizeStyle = size !== 38 ? { width: size, height: size, fontSize: Math.round(size * 0.36) } : undefined;
  return <span className={`avatar ${color}`} style={sizeStyle}>{initials(name)}</span>;
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminApp({ onClose, onResetDemo }: { onClose: () => void; onResetDemo: () => void }) {
  const [view, setView] = useState<AdminView>('overview');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  const adminNav: Array<{ id: AdminView; label: string; icon: LucideIcon; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'outcomes', label: 'Outcomes', icon: TrendingUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'classes', label: 'Class Rooms', icon: BookOpen },
    { id: 'events', label: 'Events', icon: CalendarCheck },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: adminAlerts.filter((a) => a.type === 'urgent' || a.type === 'warning').length },
    { id: 'invites', label: 'Invite Manager', icon: Key },
    { id: 'roster', label: 'Roster Import', icon: FileSpreadsheet },
    { id: 'isolation', label: 'Isolation Risk', icon: AlertOctagon, badge: riskStudents.filter((s) => s.riskLevel === 'critical').length },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-rail">
        <div className="admin-rail-brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>Cohortly</strong>
            <small>SUTD Admin</small>
          </div>
        </div>
        <nav className="admin-nav">
          {adminNav.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}>
              <Icon size={18} />
              <span>{label}</span>
              {badge != null && <span className="admin-nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>
        <button className="admin-exit" onClick={onClose}>
          <ChevronLeft size={16} /> Exit preview
        </button>
        <button className="admin-exit demo-reset-btn" onClick={onResetDemo} style={{ marginTop: 6, color: '#d97706', borderColor: 'rgba(217,119,6,0.3)' }}>
          <RotateCcw size={14} /> Reset demo
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <span className="admin-institution-badge">
              <Building2 size={15} /> SUTD
            </span>
            <div>
              <h1>Student Life Dashboard</h1>
              <p>Singapore University of Technology and Design · Cohort 2026</p>
            </div>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-live-indicator">Live</span>
            <span className="admin-timestamp">Updated just now</span>
          </div>
        </header>

        <main className="admin-content">
          <div key={view} className="view-wrapper">
            {view === 'overview' && <AdminOverview />}
            {view === 'outcomes' && <AdminOutcomesView />}
            {view === 'students' && <AdminStudentsView />}
            {view === 'classes' && <AdminClassesView />}
            {view === 'events' && <AdminEventsSubView />}
            {view === 'alerts' && <AdminAlertsView />}
            {view === 'invites' && <AdminInvitesView />}
            {view === 'roster' && <AdminRosterView />}
            {view === 'isolation' && <AdminIsolationView />}
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminClassTable() {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Students</th>
            <th>Questions</th>
            <th>Response rate</th>
            <th>Returning students</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {adminClassHealth.map((row) => {
            const rate = Math.round((row.answered / row.questions) * 100);
            return (
              <tr key={row.code}>
                <td>
                  <span className="admin-module-code">{row.code}</span>
                  <span className="admin-module-title">{row.title}</span>
                </td>
                <td>{row.students}</td>
                <td>{row.questions}</td>
                <td>
                  <div className="admin-rate-cell">
                    <div className="admin-rate-track">
                      <div className="admin-rate-fill" style={{ width: `${rate}%` }} />
                    </div>
                    <span>{rate}%</span>
                  </div>
                </td>
                <td>{row.mentors} returning student{row.mentors !== 1 ? 's' : ''}</td>
                <td>
                  <span className={`admin-status ${row.status}`}>
                    {row.status === 'healthy' ? '✓ Active' : '⚠ Needs attention'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AdminStudentTable({ students }: { students: typeof adminStudents }) {
  return (
    <div className="admin-student-list">
      {students.map((s) => (
        <div key={s.name} className="admin-student-row">
          <Avatar name={s.name} color={s.connections === 0 ? 'coral' : 'teal'} />
          <div className="admin-student-info">
            <strong>{s.name}</strong>
            <span>{s.pillar} · joined {s.joined}</span>
          </div>
          <span className="admin-student-meta">{s.connections} connections</span>
          <span className="admin-student-meta">{s.events} event{s.events !== 1 ? 's' : ''}</span>
          <span className={`admin-badge ${s.connections === 0 ? 'danger' : 'success'}`}>
            {s.connections === 0 ? 'At risk' : 'Active'}
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminOverview() {
  return (
      <div className="admin-overview">
        <div className="admin-preview-banner">
          <Zap size={16} />
        Admin preview: this view is for SUTD Student Life staff. Track cohort adoption, class health, and student wellbeing signals in one place.
      </div>

      <div className="admin-health-card">
        <div className="admin-health-score">
          <span className="admin-health-number">74</span>
          <span className="admin-health-max">/100</span>
        </div>
        <div className="admin-health-divider" />
        <div className="admin-health-info">
          <strong>Cohort Health Score</strong>
          <p>Based on connection rate, Q&amp;A response rate, event participation, and isolation risk. A score above 80 means the cohort is self-sustaining.</p>
          <span className="admin-health-trend">↑ +8 points from last week</span>
          <div className="admin-health-factors">
            <span className="admin-health-factor">Connections 36%</span>
            <span className="admin-health-factor">Q&amp;A 91%</span>
            <span className="admin-health-factor">Events 22%</span>
            <span className="admin-health-factor">At-risk 14 students</span>
          </div>
        </div>
      </div>

      <div className="admin-metrics">
        <div className="admin-metric">
          <span className="admin-metric-value">812</span>
          <span className="admin-metric-label">Students verified</span>
          <span className="admin-metric-change">↑ +184 this week</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">58%</span>
          <span className="admin-metric-label">Cohort adoption rate</span>
          <span className="admin-metric-change">↑ vs 1,400 invited</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">91%</span>
          <span className="admin-metric-label">Question response rate</span>
          <span className="admin-metric-change neutral">2,480 total answered</span>
        </div>
        <div className="admin-metric at-risk">
          <span className="admin-metric-value">14</span>
          <span className="admin-metric-label">At-risk students</span>
          <span className="admin-metric-change neutral" style={{ color: 'var(--warning)' }}>0 connections, 0 events</span>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel-head">
            <span className="eyebrow">Cohort funnel</span>
            <h2>Adoption this term</h2>
          </div>
          <div className="admin-funnel">
            {adoptionSteps.map((step) => (
              <div key={step.label} className="admin-funnel-row">
                <span className="admin-funnel-label">{step.label}</span>
                <div className="admin-funnel-track">
                  <div className="admin-funnel-bar" style={{ width: `${step.pct}%` }} />
                </div>
                <span className="admin-funnel-count">{step.count.toLocaleString()}</span>
                <span className="admin-funnel-pct">{step.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-head">
            <span className="eyebrow">Action needed</span>
            <h2>Attention items</h2>
            <span className="admin-badge warning">{adminAlerts.length} open</span>
          </div>
          <div className="admin-alert-list">
            {adminAlerts.map((alert, i) => (
              <div key={i} className={`admin-alert ${alert.type}`}>
                <AlertTriangle size={16} />
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.detail}</p>
                </div>
                <button className="secondary-button">{alert.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">Module health</span>
          <h2>Class room coverage</h2>
        </div>
        <AdminClassTable />
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">Recently verified</span>
          <h2>New students · last 24–48 hours</h2>
        </div>
        <AdminStudentTable students={adminStudents} />
      </div>
    </div>
  );
}

function AdminStudentsView() {
  return (
    <div className="admin-overview">
      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value">812</span>
          <span className="admin-metric-label">Verified students</span>
          <span className="admin-metric-change">↑ +184 this week</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">14</span>
          <span className="admin-metric-label">At-risk (0 connections)</span>
          <span className="admin-metric-change neutral">Need a nudge</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">6.8</span>
          <span className="admin-metric-label">Avg connections / student</span>
          <span className="admin-metric-change">↑ target was 5</span>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">All students</span>
          <h2>812 verified · 58% of incoming cohort</h2>
        </div>
        <AdminStudentTable students={adminStudents} />
      </div>
    </div>
  );
}

function AdminClassesView() {
  return (
    <div className="admin-overview">
      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value">6</span>
          <span className="admin-metric-label">Active class rooms</span>
          <span className="admin-metric-change">↑ 2 added this week</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">104</span>
          <span className="admin-metric-label">Questions this week</span>
          <span className="admin-metric-change neutral">across all rooms</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">96</span>
          <span className="admin-metric-label">Answered</span>
          <span className="admin-metric-change">92% rate</span>
        </div>
      </div>
      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">Module health</span>
          <h2>All class rooms this term</h2>
        </div>
        <AdminClassTable />
      </div>
    </div>
  );
}

function AdminEventsSubView() {
  const [approvalEvents, setApprovalEvents] = useState<EventApproval[]>(initialPendingEvents);

  const decide = (id: string, status: 'approved' | 'rejected') => {
    setApprovalEvents((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  };

  const pendingCount = approvalEvents.filter((e) => e.status === 'pending').length;

  return (
    <div className="admin-overview">
      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value">126</span>
          <span className="admin-metric-label">Events created</span>
          <span className="admin-metric-change">↑ 38 before orientation</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">2.8k</span>
          <span className="admin-metric-label">Total RSVPs</span>
          <span className="admin-metric-change neutral">avg 22 per event</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: pendingCount > 0 ? '#d97706' : 'var(--ink)' }}>{pendingCount}</span>
          <span className="admin-metric-label">Pending approval</span>
          <span className="admin-metric-change neutral">Review required</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">Social</span>
          <span className="admin-metric-label">Most popular type</span>
          <span className="admin-metric-change neutral">42% of all events</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Approval queue</span>
            <h2>Student-created events · review &amp; approve</h2>
          </div>
        </div>
        <div className="event-approval-list">
          {approvalEvents.map((event) => (
            <div key={event.id} className={`event-approval-row ${event.status}`}>
              <div className="event-approval-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h4>{event.title}</h4>
                  <span className={`event-status-chip ${event.status}`}>{event.status}</span>
                </div>
                <p>{event.host} · {event.audience} · {formatShortDate(event.date)}, {event.time}</p>
                <div className="tag-row" style={{ marginTop: 4 }}>
                  <span>{toneName(event.tone)}</span>
                </div>
              </div>
              {event.status === 'pending' && (
                <div className="event-approval-actions">
                  <button className="secondary-button" onClick={() => decide(event.id, 'rejected')} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                    <XCircle size={14} /> Reject
                  </button>
                  <button className="primary-button" onClick={() => decide(event.id, 'approved')}>
                    <CheckCircle2 size={14} /> Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">Live feed</span>
          <h2>Approved events this term</h2>
        </div>
        <div className="event-list">
          {starterEvents.slice(0, 5).map((event) => (
            <article className={`event-card ${event.tone}`} key={event.id}>
              <div className="date-chip">
                <strong>{formatDateParts(event.date).day}</strong>
                <span>{formatDateParts(event.date).weekday}</span>
              </div>
              <div>
                <span>{toneName(event.tone)}</span>
                <h3>{event.title}</h3>
                <p>{event.host} · {event.audience}</p>
              </div>
              <div className="event-meta">
                <strong>{formatShortDate(event.date)} · {event.time}</strong>
                <em>{event.meta}</em>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminAlertsView() {
  return (
    <div className="admin-overview">
      <div className="admin-panel">
        <div className="admin-panel-head">
          <span className="eyebrow">Attention needed</span>
          <h2>All alerts · {adminAlerts.length} open</h2>
        </div>
        <div className="admin-alert-list">
          {adminAlerts.map((alert, i) => (
            <div key={i} className={`admin-alert ${alert.type}`}>
              <AlertTriangle size={16} />
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.detail}</p>
              </div>
              <button className="secondary-button">{alert.action}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminInvitesView() {
  const [invites, setInvites] = useState<Invite[]>(initialInvites);
  const [cohort, setCohort] = useState('Freshmore AY2026');
  const [emailDomain, setEmailDomain] = useState('@mymail.sutd.edu.sg');
  const [copied, setCopied] = useState<string | null>(null);

  // Roster invite manager (named recipients, CSV import, status tracking)
  const [records, setRecords] = useState<InviteRecord[]>(() => seedInviteRecords());
  const [csvText, setCsvText] = useState(inviteDemoCsv);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [recFilter, setRecFilter] = useState<'all' | InviteRecord['status']>('all');
  const [linkCopied, setLinkCopied] = useState<string | null>(null);

  const persistRecords = (next: InviteRecord[]) => { setRecords(next); saveInviteRecords(next); };
  const importCsv = () => {
    const parsed = parseInviteCsv(csvText, cohort);
    if (parsed.length === 0) return;
    const existingEmails = new Set(records.map((r) => r.email.toLowerCase()));
    const fresh = parsed.filter((r) => !existingEmails.has(r.email.toLowerCase()));
    persistRecords([...fresh, ...records]);
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const markSelectedSent = () => {
    if (selected.size === 0) return;
    persistRecords(records.map((r) => selected.has(r.id) && r.status === 'not_sent' ? { ...r, status: 'sent' as const } : r));
    setSelected(new Set());
  };
  const copyInviteLink = (rec: InviteRecord) => {
    const link = `https://cohortly.app/join?email=${encodeURIComponent(rec.email)}&cohort=${encodeURIComponent(rec.cohort)}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setLinkCopied(rec.id);
    setTimeout(() => setLinkCopied(null), 2000);
  };
  const filteredRecords = recFilter === 'all' ? records : records.filter((r) => r.status === recFilter);
  const recStats = {
    total: records.length,
    verified: records.filter((r) => r.status === 'verified' || r.status === 'onboarded').length,
    onboarded: records.filter((r) => r.status === 'onboarded').length,
    needsReminder: records.filter((r) => r.status === 'sent' || r.status === 'opened').length,
  };
  const recStatusLabel: Record<InviteRecord['status'], string> = {
    not_sent: 'Not sent', sent: 'Sent', opened: 'Opened', verified: 'Verified', onboarded: 'Onboarded',
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const part = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const code = `SUTD-${part(2)}${new Date().getFullYear().toString().slice(2)}-${part(3)}`;
    const newInvite: Invite = {
      code, cohort, emailDomain,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'unused',
    };
    setInvites((prev) => [newInvite, ...prev]);
  };

  const revoke = (code: string) => {
    setInvites((prev) => prev.map((i) => i.code === code ? { ...i, status: 'revoked' } : i));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(`https://cohortly.app/join?code=${code}`).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const stats = { unused: invites.filter((i) => i.status === 'unused').length, used: invites.filter((i) => i.status === 'used').length, revoked: invites.filter((i) => i.status === 'revoked').length };

  return (
    <div className="admin-overview">
      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value">{recStats.total}</span>
          <span className="admin-metric-label">Total invited</span>
          <span className="admin-metric-change">Named recipients</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: '#059669' }}>{recStats.verified}</span>
          <span className="admin-metric-label">Verified</span>
          <span className="admin-metric-change">Account confirmed</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: 'var(--accent)' }}>{recStats.onboarded}</span>
          <span className="admin-metric-label">Onboarded</span>
          <span className="admin-metric-change">Completed setup</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: '#d97706' }}>{recStats.needsReminder}</span>
          <span className="admin-metric-label">Needs reminder</span>
          <span className="admin-metric-change neutral">Sent, not verified</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Roster import</span>
            <h2>Invite recipients by CSV</h2>
          </div>
        </div>
        <div className="invite-gen-card">
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 8px' }}>Paste one per line: <code>name,email,role,pillar</code></p>
          <textarea
            className="class-import-textarea"
            style={{ width: '100%', minHeight: 120 }}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button className="primary-button" onClick={importCsv}><Upload size={15} /> Import {parseInviteCsv(csvText, cohort).length || ''} rows</button>
            <button className="secondary-button" onClick={markSelectedSent} disabled={selected.size === 0}><MailCheck size={14} /> Mark selected as sent ({selected.size})</button>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head" style={{ marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Recipients</span>
            <h2>{records.length} invited</h2>
          </div>
          <div className="risk-filter-tabs">
            {(['all', 'not_sent', 'sent', 'opened', 'verified', 'onboarded'] as const).map((f) => (
              <button key={f} className={`risk-filter-tab${recFilter === f ? ' active-all' : ''}`} onClick={() => setRecFilter(f)}>
                {f === 'all' ? `All (${records.length})` : `${recStatusLabel[f]} (${records.filter((r) => r.status === f).length})`}
              </button>
            ))}
          </div>
        </div>
        <div className="invite-table-wrap">
          <table className="invite-table">
            <thead>
              <tr><th></th><th>Name</th><th>Email</th><th>Role</th><th>Pillar</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td><input type="checkbox" checked={selected.has(rec.id)} onChange={() => toggleSelect(rec.id)} /></td>
                  <td><strong style={{ fontSize: '0.82rem' }}>{rec.name}</strong></td>
                  <td style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{rec.email}</td>
                  <td style={{ fontSize: '0.76rem' }}>{rec.role}</td>
                  <td style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{rec.pillar}</td>
                  <td><span className={`invite-status-badge ${rec.status === 'not_sent' ? 'unused' : rec.status === 'verified' || rec.status === 'onboarded' ? 'used' : 'unused'}`}>{recStatusLabel[rec.status]}</span></td>
                  <td>
                    <button className="secondary-button" onClick={() => copyInviteLink(rec)}>
                      {linkCopied === rec.id ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy invite link</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value">{stats.unused}</span>
          <span className="admin-metric-label">Unused codes</span>
          <span className="admin-metric-change">Ready to send</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">{stats.used}</span>
          <span className="admin-metric-label">Codes used</span>
          <span className="admin-metric-change">{stats.used} students joined</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value">{stats.revoked}</span>
          <span className="admin-metric-label">Revoked</span>
          <span className="admin-metric-change neutral">No longer valid</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Generate</span>
            <h2>Create new invite codes</h2>
          </div>
        </div>
        <div className="invite-gen-card">
          <div className="invite-gen-row">
            <div className="invite-gen-field">
              <label>Cohort</label>
              <select value={cohort} onChange={(e) => setCohort(e.target.value)}>
                <option>Freshmore AY2026</option>
                <option>Exchange AY2026</option>
                <option>Transfer AY2026</option>
                <option>Staff / OSA</option>
              </select>
            </div>
            <div className="invite-gen-field">
              <label>Email domain restriction</label>
              <select value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)}>
                <option>@mymail.sutd.edu.sg</option>
                <option>@sutd.edu.sg</option>
                <option>Any verified domain</option>
              </select>
            </div>
            <button className="primary-button" onClick={generateCode} style={{ alignSelf: 'flex-end' }}>
              <Plus size={15} /> Generate code
            </button>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">All codes</span>
            <h2>{invites.length} invite codes</h2>
          </div>
        </div>
        <div className="invite-table-wrap">
          <table className="invite-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Cohort</th>
                <th>Email domain</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.code}>
                  <td><span className="invite-code-chip">{inv.code}</span></td>
                  <td>{inv.cohort}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{inv.emailDomain}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{inv.createdAt}</td>
                  <td>
                    <span className={`invite-status-badge ${inv.status}`}>
                      {inv.status === 'unused' ? '● Unused' : inv.status === 'used' ? `✓ Used${inv.usedBy ? ` · ${inv.usedBy.split('@')[0]}` : ''}` : '✕ Revoked'}
                    </span>
                  </td>
                  <td>
                    <div className="invite-row-actions">
                      {inv.status === 'unused' && (
                        <>
                          <button className="secondary-button" onClick={() => copyCode(inv.code)}>
                            {copied === inv.code ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy link</>}
                          </button>
                          <button className="secondary-button" onClick={() => revoke(inv.code)} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                            <Trash2 size={12} /> Revoke
                          </button>
                        </>
                      )}
                      {inv.status !== 'unused' && <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>No actions</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type InterventionRecord = { action: string; note: string; time: string; stage: InterventionStage };

function AdminIsolationView() {
  const [filterLevel, setFilterLevel] = useState<RiskLevel | 'all'>('all');
  const [stages, setStages] = useState<Record<string, InterventionStage>>({});
  const [interventionLog, setInterventionLog] = useState<Array<{ student: string; action: string; time: string }>>([
    { student: 'Yusuf A.', action: 'Returning-student buddy assigned: Aarav Menon (Y3 ISTD)', time: '2 days ago' },
    { student: 'Aisha M.', action: 'OSA nudge sent via email', time: '1 day ago' },
  ]);
  const [studentRecords, setStudentRecords] = useState<Record<string, InterventionRecord[]>>({});
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Student self-reported cases (from Launchpad "Need help", Campus Life "settling in", etc.)
  const [cases, setCases] = useState<InterventionCase[]>(() => loadInterventionCases());
  const [caseFilter, setCaseFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');

  const updateCase = (id: string, updates: Partial<InterventionCase>) => {
    const updated = cases.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
    setCases(updated);
    saveInterventionCases(updated);
  };
  const filteredCases = caseFilter === 'all' ? cases : cases.filter((c) => c.status === caseFilter);
  const caseStatusColor: Record<InterventionCase['status'], string> = {
    new: '#ef4444', contacted: '#d97706', monitoring: '#6366f1', resolved: '#059669', escalated: '#dc2626',
  };

  const filtered = filterLevel === 'all' ? riskStudents : riskStudents.filter((s) => s.riskLevel === filterLevel);

  const stageOrder: InterventionStage[] = ['flagged', 'contacted', 're-measured', 'resolved', 'escalated'];
  const stageColors: Record<InterventionStage, string> = {
    flagged: '#ef4444', contacted: '#d97706', 're-measured': '#6366f1', resolved: '#059669', escalated: '#dc2626',
  };
  const stageLabels: Record<InterventionStage, string> = {
    flagged: 'Flagged', contacted: 'Contacted', 're-measured': 'Re-measured', resolved: 'Resolved', escalated: 'Escalated',
  };

  const doIntervention = (studentId: string, studentName: string, action: string) => {
    const nextStage: InterventionStage = action.includes('buddy') ? 'contacted' : action.includes('OSA') ? 'escalated' : action.includes('Mark') ? 'resolved' : 'contacted';
    const note = noteInput[studentId]?.trim() ?? '';
    const record: InterventionRecord = { action, note, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), stage: nextStage };
    setStudentRecords((prev) => ({ ...prev, [studentId]: [record, ...(prev[studentId] ?? [])] }));
    setStages((prev) => ({ ...prev, [studentId]: nextStage }));
    setNoteInput((prev) => ({ ...prev, [studentId]: '' }));
    setInterventionLog((prev) => [{ student: studentName, action: note ? `${action} — "${note}"` : action, time: 'just now' }, ...prev]);
  };

  const remeasure = (studentId: string, studentName: string) => {
    const score = Math.floor(Math.random() * 30) + 45;
    const action = `Re-measure: Belonging score ${score}/100`;
    const record: InterventionRecord = { action, note: '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), stage: 're-measured' };
    setStudentRecords((prev) => ({ ...prev, [studentId]: [record, ...(prev[studentId] ?? [])] }));
    setStages((prev) => ({ ...prev, [studentId]: 're-measured' }));
    setInterventionLog((prev) => [{ student: studentName, action, time: 'just now' }, ...prev]);
  };

  const riskCount = (level: RiskLevel) => riskStudents.filter((s) => s.riskLevel === level).length;

  const filterLabels: Array<{ id: RiskLevel | 'all'; label: string }> = [
    { id: 'all', label: `All (${riskStudents.length})` },
    { id: 'critical', label: `Critical (${riskCount('critical')})` },
    { id: 'warning', label: `Warning (${riskCount('warning')})` },
    { id: 'watch', label: `Watch (${riskCount('watch')})` },
  ];

  return (
    <div className="admin-overview">
      <div className="admin-metrics" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: '#ef4444' }}>{riskCount('critical')}</span>
          <span className="admin-metric-label">Critical — act now</span>
          <span className="admin-metric-change danger">10+ days inactive</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: '#d97706' }}>{riskCount('warning')}</span>
          <span className="admin-metric-label">Warning — follow up</span>
          <span className="admin-metric-change neutral">Low engagement signals</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: 'var(--accent)' }}>{riskCount('watch')}</span>
          <span className="admin-metric-label">Watch — monitor</span>
          <span className="admin-metric-change neutral">Mild concern detected</span>
        </div>
        <div className="admin-metric">
          <span className="admin-metric-value" style={{ color: '#059669' }}>{812 - riskStudents.length}</span>
          <span className="admin-metric-label">Clear — healthy</span>
          <span className="admin-metric-change">Active &amp; connected</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">Student-reported</span>
            <h2>Help requests · {cases.length} case{cases.length !== 1 ? 's' : ''}</h2>
          </div>
          <div className="risk-filter-tabs">
            {(['all', 'new', 'contacted', 'resolved'] as const).map((f) => (
              <button
                key={f}
                className={`risk-filter-tab${caseFilter === f ? ' active-all' : ''}`}
                onClick={() => setCaseFilter(f)}
              >
                {f === 'all' ? `All (${cases.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${cases.filter((c) => c.status === f).length})`}
              </button>
            ))}
          </div>
        </div>
        {filteredCases.length === 0 ? (
          <div className="empty-state-wrapper">
            <div className="empty-state-icon"><HeartHandshake size={22} /></div>
            <div className="empty-state-title">No open help requests</div>
            <p className="empty-state-body">When a student taps "Need help" on their Launchpad or asks for settling-in support, a privacy-safe case appears here.</p>
          </div>
        ) : (
          <div className="case-list">
            {filteredCases.map((c) => (
              <div key={c.id} className="case-row">
                <div className="case-row-main">
                  <span className="intervention-stage-badge" style={{ background: caseStatusColor[c.status] }}>{c.status}</span>
                  <div className="case-row-body">
                    <strong>{c.studentName}</strong>
                    <span>{c.reason}</span>
                    <small>Source: {c.source} · {new Date(c.createdAt).toLocaleDateString()} · Suggested: {c.suggestedAction}</small>
                  </div>
                </div>
                <div className="case-row-actions">
                  <button className="risk-action-btn" disabled={c.status === 'contacted'} onClick={() => updateCase(c.id, { status: 'contacted' })}>Mark contacted</button>
                  <button className="risk-action-btn" disabled={c.status === 'monitoring'} onClick={() => updateCase(c.id, { status: 'monitoring' })}>Monitoring</button>
                  <button className="risk-action-btn" disabled={c.status === 'resolved'} onClick={() => updateCase(c.id, { status: 'resolved' })}>Resolve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">Risk matrix</span>
            <h2>Students needing attention · Cohort AY2026</h2>
          </div>
          <div className="risk-filter-tabs">
            {filterLabels.map((f) => (
              <button
                key={f.id}
                className={`risk-filter-tab${filterLevel === f.id ? ` active-${f.id}` : ''}`}
                onClick={() => setFilterLevel(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="risk-grid">
          {filtered.map((student) => {
            const currentStage = stages[student.id] ?? 'flagged';
            const records = studentRecords[student.id] ?? [];
            const isExpanded = expandedCard === student.id;
            return (
              <div key={student.id} className={`risk-card ${student.riskLevel}${currentStage === 'resolved' ? ' resolved' : ''}`}>
                <div className="risk-card-top">
                  <Avatar name={student.name} color={student.riskLevel === 'critical' ? 'red' : student.riskLevel === 'warning' ? 'amber' : 'indigo'} size={36} />
                  <div style={{ flex: 1 }}>
                    <div className="risk-person-name">{student.name}</div>
                    <div className="risk-person-sub">{student.pillar} · Last active {student.daysInactive}d ago</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={`risk-level-badge ${student.riskLevel}`}>{student.riskLevel}</span>
                    <span className="intervention-stage-badge" style={{ background: stageColors[currentStage] }}>{stageLabels[currentStage]}</span>
                  </div>
                </div>

                {/* Stage pipeline */}
                <div className="intervention-pipeline">
                  {stageOrder.filter((s) => s !== 'escalated').map((s, i) => {
                    const idx = stageOrder.indexOf(currentStage);
                    const thisIdx = stageOrder.indexOf(s);
                    const done = thisIdx <= idx && currentStage !== 'escalated';
                    return (
                      <React.Fragment key={s}>
                        <div className={`pipeline-node${done ? ' done' : ''}`} style={{ background: done ? stageColors[s] : undefined }}>
                          {done ? <Check size={10} /> : <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>{i + 1}</span>}
                        </div>
                        {i < 3 && <div className={`pipeline-line${done ? ' done' : ''}`} />}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="risk-signals">
                  {student.signals.map((sig) => (
                    <div key={sig.text} className="risk-signal">
                      <div className={`risk-dot ${sig.severity}`} />
                      {sig.text}
                    </div>
                  ))}
                </div>

                <div className="risk-card-actions">
                  {[
                    { label: 'Assign buddy', action: 'Returning-student buddy assigned by admin' },
                    { label: 'Send nudge', action: 'Wellbeing nudge sent via email' },
                    { label: 'OSA referral', action: 'Referred to OSA for follow-up' },
                    { label: 'Mark resolved', action: 'Marked as OK — no action needed' },
                  ].map(({ label, action }) => (
                    <button
                      key={label}
                      className={`risk-action-btn${currentStage === 'resolved' ? ' done' : ''}`}
                      onClick={() => doIntervention(student.id, student.name, action)}
                      disabled={currentStage === 'resolved' || currentStage === 'escalated'}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    className="risk-action-btn remeasure"
                    onClick={() => remeasure(student.id, student.name)}
                    disabled={currentStage === 'resolved'}
                  >
                    <RotateCcw size={11} /> Re-measure
                  </button>
                </div>

                {/* Notes + expand timeline */}
                <div className="risk-note-row">
                  <input
                    className="risk-note-input"
                    placeholder="Add a note (e.g. 'called, left message')…"
                    value={noteInput[student.id] ?? ''}
                    onChange={(e) => setNoteInput((prev) => ({ ...prev, [student.id]: e.target.value }))}
                  />
                </div>

                {records.length > 0 && (
                  <button className="risk-timeline-toggle" onClick={() => setExpandedCard(isExpanded ? null : student.id)}>
                    {isExpanded ? 'Hide' : `Show ${records.length} intervention${records.length !== 1 ? 's' : ''}`}
                  </button>
                )}
                {isExpanded && records.length > 0 && (
                  <div className="risk-timeline">
                    {records.map((r, i) => (
                      <div key={i} className="risk-timeline-entry">
                        <div className="risk-timeline-dot" style={{ background: stageColors[r.stage] }} />
                        <div>
                          <strong>{r.action}</strong>
                          {r.note && <span className="risk-timeline-note">"{r.note}"</span>}
                          <span className="risk-timeline-time">{r.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Audit trail</span>
            <h2>Intervention log — closed-loop outcomes</h2>
          </div>
        </div>
        <div className="risk-log-list">
          {interventionLog.map((entry, i) => (
            <div key={i} className="risk-log-row">
              <ClipboardList size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
              <div className="risk-log-row-body">
                <strong>{entry.student}</strong>
                <span>{entry.action} · {entry.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacySettingsView({
  userEmail, userName, onBack, onLogout,
}: { userEmail: string; userName: string; onBack: () => void; onLogout: () => void }) {
  const [visibilityProfile, setVisibilityProfile] = useState<'everyone' | 'verified' | 'returning'>('verified');
  const [visibilityPulse, setVisibilityPulse] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [exported, setExported] = useState(false);

  const activityLog = [
    { action: 'Signed in', time: 'Just now', icon: 'key' },
    { action: 'Profile updated', time: '2 days ago', icon: 'edit' },
    { action: 'Completed Weekly Pulse', time: '4 days ago', icon: 'pulse' },
    { action: 'RSVP\'d to First Friday food crawl', time: '5 days ago', icon: 'event' },
    { action: 'Connected with Aarav Menon', time: '6 days ago', icon: 'connect' },
    { action: 'Asked a question in 10.014 room', time: '1 week ago', icon: 'qa' },
    { action: 'Joined Cohortly', time: '1 week ago', icon: 'join' },
  ];

  const dataInventory = [
    { category: 'Profile data', items: ['Full name', 'SUTD email', 'Pillar', 'Year', 'Bio', 'Interests', 'Goals'], stored: 'Firebase (Singapore region)' },
    { category: 'Profile photo', items: ['Stored on your device only'], stored: 'Local only — never uploaded' },
    { category: 'Connections', items: ['Names of students you\'ve connected with', 'Connection timestamp'], stored: 'Firebase' },
    { category: 'Event activity', items: ['Events you\'ve RSVP\'d to', 'Events you\'ve created'], stored: 'Firebase' },
    { category: 'Weekly Pulse', items: ['Anonymous weekly check-in scores', 'Never linked to your name in reports'], stored: 'Firebase (anonymised)' },
    { category: 'Q&A activity', items: ['Questions you\'ve posted', 'Answers received'], stored: 'Firebase' },
    { category: 'Local preferences', items: ['App settings', 'Profile photo'], stored: 'Your device only' },
  ];

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: { name: userName, email: userEmail },
      note: 'Full data export. Contact privacy@cohortly.app for a complete Firestore export including all historical activity.',
      yourRights: 'Under Singapore PDPA, you may request access, correction, or deletion of your personal data at any time.',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'cohortly-my-data.json'; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (deleteInput.toLowerCase() !== 'delete my account') return;
    // Clear all local data
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('cohortly.')).forEach((k) => localStorage.removeItem(k));
    } catch {}
    onLogout();
  };

  return (
    <div className="privacy-view">
      <div className="privacy-back-bar">
        <button className="secondary-button" onClick={onBack} style={{ gap: 6 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <span className="eyebrow" style={{ marginLeft: 'auto' }}>PDPA compliant · Singapore</span>
      </div>

      <div className="privacy-sections">
        {/* ── WHAT WE HOLD ── */}
        <div className="privacy-card">
          <div className="privacy-card-head">
            <Database size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong>What data Cohortly holds about you</strong>
              <p>A complete inventory of every category of data linked to your account.</p>
            </div>
          </div>
          <div className="privacy-data-table">
            {dataInventory.map((row) => (
              <div key={row.category} className="privacy-data-row">
                <div className="privacy-data-category">{row.category}</div>
                <div className="privacy-data-items">
                  {row.items.map((item) => <span key={item} className="privacy-data-chip">{item}</span>)}
                </div>
                <div className="privacy-data-stored">{row.stored}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VISIBILITY CONTROLS ── */}
        <div className="privacy-card">
          <div className="privacy-card-head">
            <Eye size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong>Visibility controls</strong>
              <p>Choose who can see your profile and activity.</p>
            </div>
          </div>
          <div className="privacy-control-row">
            <div>
              <strong>Profile visibility</strong>
              <p>Who can find and view your profile card</p>
            </div>
            <select
              className="privacy-select"
              value={visibilityProfile}
              onChange={(e) => setVisibilityProfile(e.target.value as typeof visibilityProfile)}
            >
              <option value="everyone">All verified SUTD members</option>
              <option value="verified">Freshmen &amp; returning students</option>
              <option value="returning">Returning students only</option>
            </select>
          </div>
          <div className="privacy-control-row">
            <div>
              <strong>Weekly Pulse contribution</strong>
              <p>Your anonymous pulse scores help SUTD detect cohort wellbeing trends. Already anonymised — disable if preferred.</p>
            </div>
            <button
              className={`privacy-toggle${visibilityPulse ? ' on' : ''}`}
              onClick={() => setVisibilityPulse((v) => !v)}
            >
              <span className="privacy-toggle-knob" />
            </button>
          </div>
          <div className="privacy-control-row">
            <div>
              <strong>Who can message you</strong>
              <p>All verified Cohortly students. You can block any user from a message thread.</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>Verified members</span>
          </div>
        </div>

        {/* ── ACTIVITY LOG ── */}
        <div className="privacy-card">
          <div className="privacy-card-head">
            <ClipboardList size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong>Your activity log</strong>
              <p>A trail of actions taken in your account. Only you can see this.</p>
            </div>
          </div>
          <div className="privacy-activity-log">
            {activityLog.map((entry, i) => (
              <div key={i} className="privacy-log-row">
                <span className={`privacy-log-icon privacy-log-icon--${entry.icon}`} />
                <div>
                  <strong>{entry.action}</strong>
                  <span>{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPORT & RIGHTS ── */}
        <div className="privacy-card">
          <div className="privacy-card-head">
            <Download size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong>Export your data</strong>
              <p>Under Singapore's PDPA, you have the right to access a copy of all personal data we hold about you.</p>
            </div>
          </div>
          <div className="privacy-export-row">
            <div className="privacy-export-info">
              <p>The download includes your profile data, connections, event activity, and Q&A history in JSON format. For a full Firestore export, email <strong>privacy@cohortly.app</strong> — we respond within 14 days.</p>
            </div>
            <button className={`primary-button${exported ? ' joined' : ''}`} onClick={handleExport} style={{ flexShrink: 0 }}>
              {exported ? <><Check size={14} /> Downloaded</> : <><Download size={14} /> Download my data</>}
            </button>
          </div>
          <div className="privacy-rights-grid">
            {[
              { right: 'Access', desc: 'Request a copy of all data we hold about you' },
              { right: 'Correction', desc: 'Ask us to correct inaccurate personal data' },
              { right: 'Deletion', desc: 'Request deletion of your account and data within 14 days' },
              { right: 'Portability', desc: 'Receive your data in a machine-readable format' },
            ].map((r) => (
              <div key={r.right} className="privacy-right-item">
                <strong>{r.right}</strong>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DELETE ACCOUNT ── */}
        <div className="privacy-card danger-card">
          <div className="privacy-card-head">
            <Trash2 size={18} style={{ color: '#ef4444' }} />
            <div>
              <strong style={{ color: '#ef4444' }}>Delete account</strong>
              <p>Permanently delete your Cohortly account and all associated data. This cannot be undone.</p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button className="privacy-delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={14} /> Delete my account
            </button>
          ) : (
            <div className="privacy-delete-confirm">
              <p>Type <strong>delete my account</strong> below to confirm. Your profile, connections, and all activity will be permanently removed from Cohortly within 14 days.</p>
              <input
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder='Type "delete my account" to confirm'
                className="privacy-delete-input"
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="secondary-button" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}>Cancel</button>
                <button
                  className="privacy-delete-confirm-btn"
                  disabled={deleteInput.toLowerCase() !== 'delete my account'}
                  onClick={handleDeleteAccount}
                >
                  <Trash2 size={14} /> Permanently delete account
                </button>
              </div>
            </div>
          )}
          <p className="privacy-fine-print">
            Data stored in Firebase will be purged within 14 days of deletion. Local device storage is cleared immediately. This action is irreversible.
          </p>
        </div>

        <div className="privacy-footer">
          <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
          <p>Cohortly is compliant with the Singapore Personal Data Protection Act (PDPA). For questions, contact <strong>privacy@cohortly.app</strong>. Data Processing Agreement available on request for institutions.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications & Bot Connection ─────────────────────────────────────────

function NotificationsView({ userEmail }: { userEmail: string }) {
  const [prefs, setPrefs] = useState<NotifPrefs>(() => loadNotifPrefs(userEmail));
  const [telegramInput, setTelegramInput] = useState(prefs.telegramHandle);
  const [whatsappInput, setWhatsappInput] = useState(prefs.whatsappNumber);
  const [status, setStatus] = useState<NotificationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [tgVerifying, setTgVerifying] = useState(false);
  const [waVerifying, setWaVerifying] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);
  const [channelNotice, setChannelNotice] = useState('');

  const refreshStatus = async () => {
    setStatusLoading(true);
    try {
      const payload = await notificationJson<NotificationStatus>(`/api/notifications/status?email=${encodeURIComponent(userEmail)}`);
      setStatus(payload);
      const updated: NotifPrefs = {
        ...prefs,
        telegramHandle: payload.telegram.username || prefs.telegramHandle,
        whatsappNumber: payload.whatsapp.phone || prefs.whatsappNumber,
        botConnected: payload.telegram.connected,
        whatsappConnected: payload.whatsapp.connected,
        ...payload.preferences,
      };
      setPrefs(updated);
      setTelegramInput(updated.telegramHandle);
      setWhatsappInput(updated.whatsappNumber);
      saveNotifPrefs(userEmail, updated);
      if (!payload.telegram.configured || !payload.whatsapp.configured) {
        setChannelNotice('Notification server is online, but one or more provider credentials are missing.');
      }
    } catch (error) {
      setStatus(null);
      setChannelNotice(error instanceof Error ? error.message : 'Notification server is not reachable.');
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const tgConnected = Boolean(status?.telegram.connected);
  const waConnected = Boolean(status?.whatsapp.connected);
  const apiLabel = notificationApiBase || 'same-origin /api';
  const botName = status?.telegram.botUsername || 'CohortlyBot';
  const startToken = status?.startToken || notificationStartToken(userEmail);
  const tgDeepLink = `https://t.me/${botName}?start=${startToken}`;
  const waBusinessPhone = status?.whatsapp.businessPhone || '';
  const waOptInLink = waBusinessPhone
    ? `https://wa.me/${waBusinessPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`start ${startToken}`)}`
    : '';

  const connectTelegram = async () => {
    const handle = telegramInput.trim().replace(/^@/, '');
    setTgVerifying(true);
    try {
      const payload = await notificationJson<{ connected: boolean; message?: string }>('/api/notifications/telegram/connect', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, username: handle }),
      });
      const updated: NotifPrefs = { ...prefs, telegramHandle: handle ? `@${handle}` : prefs.telegramHandle, botConnected: payload.connected };
      setPrefs(updated);
      saveNotifPrefs(userEmail, updated);
      setChannelNotice(payload.message || 'Telegram connected. Confirmation message sent.');
      await refreshStatus();
    } catch (error) {
      const updated: NotifPrefs = { ...prefs, telegramHandle: handle ? `@${handle}` : prefs.telegramHandle, botConnected: false };
      setPrefs(updated);
      saveNotifPrefs(userEmail, updated);
      setChannelNotice(error instanceof Error ? error.message : 'Telegram connection failed.');
    } finally {
      setTgVerifying(false);
    }
  };

  const connectWhatsApp = async () => {
    const num = whatsappInput.trim();
    if (!num || num.length < 6) return;
    setWaVerifying(true);
    try {
      const payload = await notificationJson<{ connected: boolean; message?: string }>('/api/notifications/whatsapp/connect', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, phone: num }),
      });
      const updated: NotifPrefs = { ...prefs, whatsappNumber: num, whatsappConnected: payload.connected };
      setPrefs(updated);
      saveNotifPrefs(userEmail, updated);
      setChannelNotice(payload.message || 'WhatsApp connected. Confirmation message sent.');
      await refreshStatus();
    } catch (error) {
      const updated: NotifPrefs = { ...prefs, whatsappNumber: num, whatsappConnected: false };
      setPrefs(updated);
      saveNotifPrefs(userEmail, updated);
      setChannelNotice(error instanceof Error ? error.message : 'WhatsApp connection failed.');
    } finally {
      setWaVerifying(false);
    }
  };

  const disconnectTelegram = async () => {
    const updated: NotifPrefs = { ...prefs, telegramHandle: '', botConnected: false };
    setPrefs(updated);
    setTelegramInput('');
    saveNotifPrefs(userEmail, updated);
    setChannelNotice('Telegram disconnected.');
    try {
      await notificationJson('/api/notifications/disconnect', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, channel: 'telegram' }),
      });
      await refreshStatus();
    } catch (error) {
      setChannelNotice(error instanceof Error ? error.message : 'Telegram disconnected locally.');
    }
  };

  const disconnectWhatsApp = async () => {
    const updated: NotifPrefs = { ...prefs, whatsappNumber: '', whatsappConnected: false };
    setPrefs(updated);
    setWhatsappInput('');
    saveNotifPrefs(userEmail, updated);
    setChannelNotice('WhatsApp disconnected.');
    try {
      await notificationJson('/api/notifications/disconnect', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, channel: 'whatsapp' }),
      });
      await refreshStatus();
    } catch (error) {
      setChannelNotice(error instanceof Error ? error.message : 'WhatsApp disconnected locally.');
    }
  };

  const togglePref = async (key: keyof NotifPrefs) => {
    const updated = { ...prefs, [key]: !prefs[key as keyof typeof prefs] } as NotifPrefs;
    setPrefs(updated);
    saveNotifPrefs(userEmail, updated);
    try {
      await notificationJson('/api/notifications/preferences', {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail,
          onAnswer: updated.onAnswer,
          onEvent: updated.onEvent,
          onConnection: updated.onConnection,
        }),
      });
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 1800);
    } catch (error) {
      setChannelNotice(error instanceof Error ? error.message : 'Preference update did not reach the notification server.');
    }
  };

  const sendTestAlert = async () => {
    setTestSending(true);
    try {
      const payload = await notificationJson<{ message?: string; results?: Record<string, { ok?: boolean; reason?: string }> }>('/api/notifications/test', {
        method: 'POST',
        body: JSON.stringify({
          email: userEmail,
          text: 'Cohortly test alert. Telegram and WhatsApp delivery are working.',
        }),
      });
      const delivered = Object.entries(payload.results || {})
        .filter(([, result]) => result?.ok)
        .map(([name]) => name)
        .join(' + ');
      setChannelNotice(delivered ? `Test alert accepted by ${delivered}.` : (payload.message || 'Test alert sent.'));
      await refreshStatus();
    } catch (error) {
      setChannelNotice(error instanceof Error ? error.message : 'Test alert failed.');
    } finally {
      setTestSending(false);
    }
  };

  const setupItems = [
    { label: 'API server', ok: Boolean(status), detail: apiLabel },
    { label: 'Telegram token', ok: Boolean(status?.telegram.configured), detail: status?.telegram.configured ? `@${botName}` : 'Missing TELEGRAM_BOT_TOKEN' },
    { label: 'Telegram webhook', ok: Boolean(status?.telegram.webhookUrlConfigured), detail: status?.telegram.webhookUrlConfigured ? 'Webhook URL configured' : 'Set webhook to /api/notifications/telegram/webhook' },
    { label: 'Telegram secret', ok: Boolean(status?.telegram.webhookSecretConfigured), detail: status?.telegram.webhookSecretConfigured ? 'Webhook secret token enforced' : 'Add TELEGRAM_WEBHOOK_SECRET' },
    { label: 'WhatsApp Cloud API', ok: Boolean(status?.whatsapp.configured), detail: status?.whatsapp.configured ? 'Token and phone number ID configured' : 'Missing WHATSAPP_CLOUD_TOKEN / WHATSAPP_PHONE_NUMBER_ID' },
    { label: 'WhatsApp webhook', ok: Boolean(status?.whatsapp.verifyTokenConfigured), detail: status?.whatsapp.verifyTokenConfigured ? 'Verify token configured' : 'Missing WHATSAPP_VERIFY_TOKEN' },
    { label: 'WhatsApp signature', ok: Boolean(status?.whatsapp.appSecretConfigured), detail: status?.whatsapp.appSecretConfigured ? 'Meta signature validation enforced' : 'Add WHATSAPP_APP_SECRET' },
    { label: 'WhatsApp template', ok: Boolean(status?.whatsapp.templateConfigured), detail: status?.whatsapp.templateConfigured ? 'Approved template configured' : 'Add approved WHATSAPP_TEMPLATE_NAME' },
    { label: 'Alert dispatch', ok: Boolean(status?.dispatch?.configured), detail: status?.dispatch?.configured ? 'Server dispatch token configured' : 'Add COHORTLY_NOTIFICATIONS_ADMIN_TOKEN' },
  ];

  return (
    <div className="privacy-view">
      <div className="privacy-sections">
        <div className="privacy-card notif-ops-card">
          <div className="privacy-card-head" style={{ marginBottom: 0 }}>
            <Bot size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong>Live notification delivery</strong>
              <p>
                {statusLoading
                  ? 'Checking Telegram and WhatsApp provider setup...'
                  : status
                    ? 'Notification server is reachable. Connected channels can receive real test alerts.'
                    : 'Notification server is not reachable from this deployment.'}
              </p>
            </div>
            <button className="secondary-button" onClick={refreshStatus} disabled={statusLoading}>
              {statusLoading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
          <div className="notif-setup-grid">
            {setupItems.map((item) => (
              <div key={item.label} className={item.ok ? 'notif-setup-item ok' : 'notif-setup-item'}>
                {item.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="notif-test-row">
            <div>
              <strong>End-to-end test</strong>
              <span>{tgConnected || waConnected ? 'Send a real alert to every connected channel.' : 'Connect Telegram or WhatsApp first.'}</span>
            </div>
            <button className="primary-button" onClick={sendTestAlert} disabled={testSending || (!tgConnected && !waConnected)}>
              {testSending ? <><span className="notif-spinner" /> Sending...</> : <><Send size={14} /> Send test alert</>}
            </button>
          </div>
        </div>

        {channelNotice && (
          <div className="privacy-card notif-status-card">
            <div className="privacy-card-head" style={{ marginBottom: 0 }}>
              {status ? <BellRing size={18} style={{ color: 'var(--accent)' }} /> : <AlertTriangle size={18} style={{ color: '#d97706' }} />}
              <div>
                <strong>Channel status</strong>
                <p>{channelNotice}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Telegram ── */}
        <div className="privacy-card notif-channel-card">
          <div className="notif-channel-header">
            <div className="notif-channel-icon notif-channel-telegram">
              <Send size={17} />
            </div>
            <div className="notif-channel-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>Telegram Bot</strong>
                {tgConnected && <span className="notif-connected-chip">Connected</span>}
              </div>
              <span>Instant DMs when your Q&A is answered, an event starts, or someone connects.</span>
            </div>
          </div>

          {tgConnected ? (
            <div className="notif-connected-state">
              <div className="notif-connected-detail">
                <div className="notif-connected-avatar notif-connected-avatar--tg">
                  <Send size={13} />
                </div>
                <div>
                  <strong>{prefs.telegramHandle || 'Telegram chat linked'}</strong>
                  <span>Receiving alerts via Telegram</span>
                </div>
              </div>
              <button className="secondary-button" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={disconnectTelegram}>
                Disconnect
              </button>
            </div>
          ) : (
            <div className="notif-bot-steps">
              <div className="notif-step">
                <span className="notif-step-num">1</span>
                <div>
                  <strong>Start the bot</strong>
                  <p>Open Telegram and press Start. The deep link includes your Cohortly email token so the server can match your chat.</p>
                  <a className="notif-bot-link" href={tgDeepLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} /> Open @{botName}
                  </a>
                </div>
              </div>
              <div className="notif-step">
                <span className="notif-step-num">2</span>
                <div>
                  <strong>Telegram username optional</strong>
                  <input
                    className="notif-input"
                    placeholder="@yourusername if you have one"
                    value={telegramInput}
                    onChange={(e) => setTelegramInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && connectTelegram()}
                  />
                </div>
              </div>
              <div className="notif-step">
                <span className="notif-step-num">3</span>
                <div>
                  <strong>Verify connection</strong>
                  <p>We confirm the chat ID and send a real Telegram confirmation message.</p>
                  <button
                    className="primary-button"
                    style={{ marginTop: 8, padding: '7px 20px', fontSize: '0.84rem' }}
                    onClick={connectTelegram}
                    disabled={tgVerifying}
                  >
                    {tgVerifying
                      ? <><span className="notif-spinner" /> Verifying…</>
                      : <><Check size={14} /> Connect Telegram</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── WhatsApp ── */}
        <div className="privacy-card notif-channel-card">
          <div className="notif-channel-header">
            <div className="notif-channel-icon notif-channel-whatsapp">
              <MessageCircle size={17} />
            </div>
            <div className="notif-channel-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>WhatsApp Alerts</strong>
                {waConnected && <span className="notif-connected-chip notif-connected-chip--wa">Connected</span>}
              </div>
              <span>Same alerts as Telegram, delivered directly to your WhatsApp.</span>
            </div>
          </div>

          {waConnected ? (
            <div className="notif-connected-state notif-connected-state--wa">
              <div className="notif-connected-detail">
                <div className="notif-connected-avatar notif-connected-avatar--wa">
                  <MessageCircle size={13} />
                </div>
                <div>
                  <strong>{prefs.whatsappNumber}</strong>
                  <span>Receiving alerts via WhatsApp</span>
                </div>
              </div>
              <button className="secondary-button" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={disconnectWhatsApp}>
                Disconnect
              </button>
            </div>
          ) : (
            <div className="notif-bot-steps">
              <div className="notif-step">
                <span className="notif-step-num">1</span>
                <div>
                  <strong>Your WhatsApp number</strong>
                  <input
                    className="notif-input"
                    placeholder="+65 9123 4567"
                    type="tel"
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && connectWhatsApp()}
                  />
                </div>
              </div>
              <div className="notif-step">
                <span className="notif-step-num">2</span>
                <div>
                  <strong>Send a message to opt in</strong>
                  <p>WhatsApp requires you to message the business number first. Send the pre-filled start text, then return here.</p>
                  {waOptInLink ? (
                    <a className="notif-bot-link notif-bot-link--wa" href={waOptInLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={13} /> Open Cohortly WhatsApp
                    </a>
                  ) : (
                    <span className="notif-missing-inline">Set WHATSAPP_BUSINESS_PHONE to enable this link.</span>
                  )}
                </div>
              </div>
              <div className="notif-step">
                <span className="notif-step-num">3</span>
                <div>
                  <strong>Save and confirm your number</strong>
                  <p>We send a real WhatsApp confirmation message before marking this connected.</p>
                  <button
                    className="primary-button"
                    style={{ marginTop: 8, padding: '7px 20px', fontSize: '0.84rem', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
                    onClick={connectWhatsApp}
                    disabled={!whatsappInput.trim() || whatsappInput.trim().length < 6 || waVerifying}
                  >
                    {waVerifying
                      ? <><span className="notif-spinner" /> Connecting…</>
                      : <><Check size={14} /> Connect WhatsApp</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Alert preferences ── */}
        <div className="privacy-card">
          <div className="privacy-card-head">
            <BellRing size={18} style={{ color: 'var(--accent)' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700 }}>Alert preferences</strong>
              {prefSaved && <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>Saved</span>}
            </div>
          </div>
          <div className="notif-pref-list">
            {([
              { key: 'onAnswer', label: 'My Q&A question gets answered', desc: 'When someone answers in your module room' },
              { key: 'onEvent', label: 'Event starting in 1 hour', desc: "For events you've RSVPd to" },
              { key: 'onConnection', label: 'New connection request', desc: 'When someone connects with you on Cohortly' },
            ] as Array<{ key: keyof NotifPrefs; label: string; desc: string }>).map(({ key, label, desc }) => (
              <div key={key} className="notif-pref-row">
                <div>
                  <strong>{label}</strong>
                  <span>{desc}</span>
                </div>
                <button
                  className={`privacy-toggle${prefs[key] ? ' on' : ''}`}
                  onClick={() => togglePref(key)}
                  aria-label={label}
                >
                  <span className="privacy-toggle-knob" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Admin Outcome Dashboard ─────────────────────────────────────────────────

const mockBelongingTrend = [52, 58, 61, 67, 65, 71, 74, 74];
const mockOnboarded = [312, 487, 623, 718, 783, 812];
const mockAtRisk = [24, 21, 19, 17, 15, 14];
const mockFifthRow = [88, 143, 220, 298, 381, 445];
const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

function AdminSparkline({ data, color, width = 180, height = 48 }: { data: number[]; color: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  const lastX = (data.length - 1) / Math.max(data.length - 1, 1) * width;
  const lastY = height - ((data[data.length - 1] - min) / range) * (height - 8) - 4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
    </svg>
  );
}

function OutcomeMetricCard({ title, current, previous, unit, data, color, desc }: {
  title: string; current: number; previous: number; unit: string; data: number[]; color: string; desc: string;
}) {
  const delta = current - previous;
  const pct = Math.round((delta / previous) * 100);
  return (
    <div className="outcome-metric-card">
      <div className="outcome-metric-head">
        <strong>{title}</strong>
        <span className="outcome-metric-desc">{desc}</span>
      </div>
      <div className="outcome-metric-body">
        <div>
          <span className="outcome-metric-value">{current.toLocaleString()}</span>
          <span className="outcome-metric-unit">{unit}</span>
          <span className={`outcome-delta${delta >= 0 ? ' up' : ' down'}`}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(pct)}% vs last week
          </span>
        </div>
        <AdminSparkline data={data} color={color} />
      </div>
    </div>
  );
}

function AdminOutcomesView() {
  const repeatedQuestions = [
    { question: 'How does the GPA calculation work?', count: 47, modules: ['10.014', '10.001'] },
    { question: 'What time does the hostel kitchen close?', count: 38, modules: ['Hostel'] },
    { question: 'How do I book a FabLab slot?', count: 31, modules: ['ASD', 'EPD'] },
    { question: 'Can I change my hostel room in Term 2?', count: 29, modules: ['Hostel'] },
    { question: 'What is the late submission penalty for 10.014?', count: 24, modules: ['10.014'] },
  ];
  return (
    <div className="admin-overview">
      <div className="admin-preview-banner">
        <TrendingUp size={16} />
        Outcome metrics — the numbers your office reports to senior leadership. Updated weekly.
      </div>

      <div className="outcome-metrics-grid">
        <OutcomeMetricCard
          title="Cohort Belonging Score"
          current={74} previous={71} unit="/ 100"
          data={mockBelongingTrend} color="#6366f1"
          desc="Average Weekly Pulse score across all students. The key metric."
        />
        <OutcomeMetricCard
          title="Students Onboarded"
          current={812} previous={783} unit="students"
          data={mockOnboarded} color="#059669"
          desc="Verified + completed profile."
        />
        <OutcomeMetricCard
          title="At-Risk Students"
          current={14} previous={15} unit="students"
          data={mockAtRisk} color="#ef4444"
          desc="Isolation risk flagged. Decreasing = interventions working."
        />
        <OutcomeMetricCard
          title="Fifth Row Signups"
          current={445} previous={381} unit="students"
          data={mockFifthRow} color="#d97706"
          desc="CCA engagement — strongly correlated with belonging score."
        />
      </div>

      <div className="admin-panel" style={{ marginTop: 24 }}>
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Q&amp;A intelligence</span>
            <h2>Most repeated questions this cohort</h2>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>High count = onboarding gap. Address these in KB or orientation content.</span>
        </div>
        <div className="repeated-q-list">
          {repeatedQuestions.map((q, i) => (
            <div key={q.question} className="repeated-q-row">
              <span className="repeated-q-rank">#{i + 1}</span>
              <div className="repeated-q-body">
                <strong>{q.question}</strong>
                <div className="repeated-q-tags">
                  {q.modules.map((m) => <span key={m} className="admin-badge">{m}</span>)}
                </div>
              </div>
              <span className="repeated-q-count">{q.count}×</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panel" style={{ marginTop: 24 }}>
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Belonging trend</span>
            <h2>8-week belonging score — cohort average</h2>
          </div>
        </div>
        <div style={{ padding: '12px 0', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: 480 }}>
            {mockBelongingTrend.map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1' }}>{v}</span>
                <div style={{ width: '100%', height: v * 1.5, background: `hsl(239,${30 + v * 0.4}%,${70 - v * 0.2}%)`, borderRadius: 4, minHeight: 8 }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{weekLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Roster Auto-Provisioning ────────────────────────────────────────────────

type RosterRow = { name: string; email: string; pillar: string; floor: string; modules: string };

function AdminRosterView() {
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<RosterRow[]>([]);
  const [provisioned, setProvisioned] = useState(false);
  const [provisionLog, setProvisionLog] = useState<string[]>([]);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [provisioning, setProvisioning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n').slice(1);
    return lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      return { name: parts[0] ?? '', email: parts[1] ?? '', pillar: parts[2] ?? '', floor: parts[3] ?? '', modules: parts[4] ?? '' } as RosterRow;
    }).filter((r) => r.name && r.email);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setRows(parseCSV(text));
      setProvisioned(false);
      setProvisionLog([]);
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    const sample = `name,email,pillar,floor,modules\nAisha Binte Rahman,1006001@mymail.sutd.edu.sg,ISTD,H2-Floor-3,10.014|10.009|10.001\nYusuf Ahmad,1006002@mymail.sutd.edu.sg,EPD,H2-Floor-3,10.014|10.009|10.002\nPriya Nair,1006003@mymail.sutd.edu.sg,ESD,H1-Floor-2,10.014|10.001|10.003\nWei Jian Lim,1006004@mymail.sutd.edu.sg,ISTD,H1-Floor-2,10.014|10.009|10.001\nSofia Chen,1006005@mymail.sutd.edu.sg,ASD,H2-Floor-4,10.014|10.003|10.009\nRohan Mehta,1006006@mymail.sutd.edu.sg,DAI,H2-Floor-4,10.014|10.001|10.009\nNoah Richter,1006007@mymail.sutd.edu.sg,EPD,H1-Floor-3,10.014|10.002|10.003`;
    setRows(parseCSV(sample));
    setProvisioned(false);
    setProvisionLog([]);
  };

  const provision = async () => {
    if (rows.length === 0) return;
    setProvisioning(true);
    setProvisionLog([]);
    setProvisionProgress(0);
    const log: string[] = [];
    const pillars = [...new Set(rows.map((r) => r.pillar).filter(Boolean))];
    const floors = [...new Set(rows.map((r) => r.floor).filter(Boolean))];
    const allModules = [...new Set(rows.flatMap((r) => r.modules.split('|').map((m) => m.trim())).filter(Boolean))];

    const steps = [
      `✓ Imported ${rows.length} student profiles`,
      ...pillars.map((p) => `✓ Created pillar channel: ${p} (${rows.filter((r) => r.pillar === p).length} students)`),
      ...floors.map((f) => `✓ Created floor group: ${f} (${rows.filter((r) => r.floor === f).length} students)`),
      ...allModules.map((m) => `✓ Created module room: ${m} — students auto-enrolled`),
      `✓ Sent welcome emails to ${rows.length} students`,
      `✓ Provisioning complete — ${rows.length} students, ${pillars.length} pillars, ${floors.length} floors, ${allModules.length} module rooms`,
    ];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 220));
      log.push(steps[i]);
      setProvisionLog([...log]);
      setProvisionProgress(Math.round(((i + 1) / steps.length) * 100));
    }
    setProvisioning(false);
    setProvisioned(true);
  };

  return (
    <div className="admin-overview">
      <div className="admin-preview-banner">
        <FileSpreadsheet size={16} />
        One-click roster import — upload your cohort CSV and every floor group, module room, and pillar channel is created automatically. Students are pre-placed; nobody joins anything manually.
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="eyebrow">Step 1</span>
            <h2>Upload cohort roster (CSV)</h2>
          </div>
          <button className="secondary-button" onClick={loadSample}>Load sample data</button>
        </div>
        <div
          className={`roster-dropzone${dragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
          <strong>Drop CSV here or click to browse</strong>
          <span>Columns: name, email, pillar, floor, modules (pipe-separated)</span>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
        <div className="roster-csv-hint">
          <code>name,email,pillar,floor,modules</code><br />
          <code>Aisha Rahman,1006001@mymail.sutd.edu.sg,ISTD,H2-Floor-3,10.014|10.009|10.001</code>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="admin-panel" style={{ marginTop: 20 }}>
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">Step 2</span>
              <h2>Preview — {rows.length} students</h2>
            </div>
            <button className="primary-button" onClick={provision} disabled={provisioning || provisioned}>
              {provisioning ? 'Provisioning…' : provisioned ? <><Check size={14} /> Done</> : <><Zap size={14} /> One-click provision</>}
            </button>
          </div>

          {provisioning && (
            <div className="roster-progress-bar">
              <div className="roster-progress-fill" style={{ width: `${provisionProgress}%` }} />
            </div>
          )}

          {provisionLog.length > 0 && (
            <div className="roster-provision-log">
              {provisionLog.map((line, i) => <div key={i} className="roster-log-line">{line}</div>)}
            </div>
          )}

          <div className="admin-table-wrap" style={{ marginTop: 16 }}>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Pillar</th><th>Floor</th><th>Modules</th></tr>
              </thead>
              <tbody>
                {rows.slice(0, 50).map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.name}</strong></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{row.email}</td>
                    <td><span className="admin-badge">{row.pillar}</span></td>
                    <td>{row.floor}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{row.modules.replace(/\|/g, ' · ')}</td>
                  </tr>
                ))}
                {rows.length > 50 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>… and {rows.length - 50} more</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Campus Life View ────────────────────────────────────────────────────────

function CampusLifeView({
  profile,
  onProfileUpdate,
  userEmail = '',
  userName = 'Student',
}: {
  profile: StudentProfile;
  onProfileUpdate: (p: StudentProfile) => void;
  userEmail?: string;
  userName?: string;
}) {
  const currentCommunity = profile.campusCommunity ?? 'freshmore-arrival';
  const [selectedCommunity, setSelectedCommunity] = useState(currentCommunity);
  const [selectedStopId, setSelectedStopId] = useState('housing');
  const [selectedRouteId, setSelectedRouteId] = useState('arrival');
  const [joinedJios, setJoinedJios] = useState<Set<string>>(new Set());
  const [settlingHelpRequested, setSettlingHelpRequested] = useState(false);

  const selected = campusLifeCommunities.find((community) => community.id === selectedCommunity) ?? campusLifeCommunities[0];
  const selectedStop = campusLifeMapStops.find((stop) => stop.id === selectedStopId) ?? campusLifeMapStops[0];
  const selectedRoute = campusLifeRoutes.find((route) => route.id === selectedRouteId) ?? campusLifeRoutes[0];
  const homeBase = profile.campusHomeBase ?? profile.homeBase ?? selected.label;

  const saveCommunity = (community: CampusLifeCommunity) => {
    setSelectedCommunity(community.id);
    onProfileUpdate({
      ...profile,
      homeBase: community.label,
      campusHomeBase: community.label,
      campusCommunity: community.id,
    });
  };

  const requestSettlingHelp = () => {
    addInterventionCase(userEmail || 'self', userName, 'Requested help settling into campus life', 'campus-life');
    setSettlingHelpRequested(true);
  };

  const renderJioIcon = (icon: CampusLifeIcon) => {
    if (icon === 'food') return <Utensils size={16} />;
    if (icon === 'study') return <BookOpen size={16} />;
    if (icon === 'sports') return <Dumbbell size={16} />;
    if (icon === 'support') return <LifeBuoy size={16} />;
    return <MapPinned size={16} />;
  };

  return (
    <div className="campus-life-view">
      <section className="campus-life-hero">
        <div>
          <span className="eyebrow">Campus Life</span>
          <h2>Settle into SUTD without exposing private room details.</h2>
          <p>
            Cohortly now treats housing as a broad community layer: Freshmore arrival circles,
            returning-student guides, commuter groups, jios, official housing guidance, and private support routes.
          </p>
          <div className="campus-life-hero-actions">
            <button className="primary-button" onClick={() => saveCommunity(selected)}>
              <Check size={15} /> Save home base
            </button>
            <button className="secondary-button" onClick={requestSettlingHelp} disabled={settlingHelpRequested}>
              <LifeBuoy size={15} /> {settlingHelpRequested ? 'Support requested' : 'I need settling-in help'}
            </button>
          </div>
        </div>
        <div className="campus-life-privacy-card">
          <ShieldCheck size={22} />
          <strong>No room directory. No floor map. No live occupancy.</strong>
          <span>Exact room, floor, resident, and occupancy data stay outside Cohortly. Students connect by year, module, interest, and broad campus-life community.</span>
        </div>
      </section>

      <div className="campus-life-overview-grid">
        <article className="campus-life-home-card">
          <span className="eyebrow">Your home base</span>
          <h3>{homeBase}</h3>
          <p>{selected.focus}</p>
          <div className="campus-life-home-meta">
            <span>{selected.scope}</span>
            <span>{selected.count}</span>
          </div>
        </article>
        <article className="campus-life-home-card muted">
          <span className="eyebrow">Official source of truth</span>
          <h3>SUTD Housing handles exact assignments.</h3>
          <p>Use official housing portals and staff guidance for key collection, room changes, maintenance, safety rules, and emergency procedures.</p>
        </article>
      </div>

      <section className="campus-life-section campus-life-map-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Housing & campus map</span>
            <h3>Move around without a room directory</h3>
          </div>
          <p>Useful first-week routes, with no room, floor, resident, or occupancy display.</p>
        </div>
        <div className="campus-life-map-layout">
          <div className="campus-life-map-card" aria-label="SUTD campus wayfinding map">
            <div className="campus-life-map-toolbar">
              <div>
                <span>Live orientation board</span>
                <strong>{selectedRoute.title}</strong>
              </div>
              <div className="campus-life-map-legend" aria-label="Map legend">
                <span><i className="legend-route" />Active route</span>
                <span><i className="legend-stop" />Waypoint</span>
              </div>
            </div>
            <div className="campus-life-map-canvas">
              <svg viewBox="0 0 100 100" role="img" aria-label="Schematic campus routes from housing to main campus, food, sports, and transit">
                <defs>
                  <linearGradient id="mapRouteGradient" x1="16" y1="74" x2="76" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#3d93d8" />
                    <stop offset="0.55" stopColor="#2846d8" />
                    <stop offset="1" stopColor="#8bd8c1" />
                  </linearGradient>
                  <filter id="mapSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#102033" floodOpacity="0.16" />
                  </filter>
                </defs>
                <path className="map-road perimeter" d="M13 77 C22 63 28 55 33 48 C42 36 52 27 72 25 C82 24 88 29 87 40 C86 53 78 66 68 74 C56 84 35 86 18 80" />
                <path className="map-road covered" d="M22 72 C31 61 39 49 37 38 C47 34 57 32 72 28" />
                <path className="map-road covered secondary" d="M31 47 C42 50 48 51 56 52 C62 57 64 65 66 72" />
                <path className={'map-route route-arrival ' + (selectedRouteId === 'arrival' ? 'active' : '')} d="M18 74 C27 62 34 54 30 46 C38 36 47 29 72 28" />
                <path className={'map-route route-breakfast ' + (selectedRouteId === 'breakfast' ? 'active' : '')} d="M72 28 C66 37 61 45 56 52 C47 51 38 49 30 46" />
                <path className={'map-route route-study ' + (selectedRouteId === 'study' ? 'active' : '')} d="M72 28 C61 27 50 26 38 26" />
                <g className="map-building main-campus" filter="url(#mapSoftShadow)">
                  <path d="M20 39 L34 34 L37 49 L23 54 Z" />
                  <path d="M36 30 L49 28 L51 41 L39 43 Z" />
                  <path d="M25 57 L43 54 L45 65 L27 68 Z" />
                </g>
                <g className="map-building building-five" filter="url(#mapSoftShadow)">
                  <path d="M34 19 L49 18 L49 26 L34 27 Z" />
                  <path d="M37 22 L46 22" />
                  <path d="M37 25 L46 25" />
                </g>
                <g className="map-building housing" filter="url(#mapSoftShadow)">
                  <path d="M64 12 L69 13 L68 33 L63 32 Z" />
                  <path d="M71 11 L76 12 L76 33 L70 32 Z" />
                  <path d="M78 14 L83 15 L82 34 L77 33 Z" />
                  <path d="M62 36 L84 38" />
                </g>
                <g className="map-building food" filter="url(#mapSoftShadow)">
                  <path d="M50 46 L60 44 L63 52 L53 55 Z" />
                </g>
                <g className="map-building sports" filter="url(#mapSoftShadow)">
                  <ellipse cx="66" cy="74" rx="15" ry="8" />
                  <path d="M56 74 L76 74" />
                  <path d="M66 66 L66 82" />
                </g>
                <g className="map-building transit" filter="url(#mapSoftShadow)">
                  <path d="M10 69 L22 69 L24 75 L13 78 Z" />
                </g>
                <text className="map-text main" x="24" y="62">MAIN CAMPUS</text>
                <text className="map-text housing" x="62" y="42">HOUSING</text>
                <text className="map-text b5" x="34" y="16">B5</text>
                <text className="map-text sports" x="57" y="88">SPORTS</text>
              </svg>
              <span className="campus-life-map-compass">N</span>
              {campusLifeMapStops.map((stop) => (
                <button
                  key={stop.id}
                  className={'campus-life-map-pin stop-' + stop.id + ' ' + stop.kind + (selectedStopId === stop.id ? ' active' : '')}
                  style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
                  onClick={() => setSelectedStopId(stop.id)}
                  aria-label={stop.label}
                >
                  <span className="campus-life-map-pin-dot" />
                  <span className="campus-life-map-pin-label">{stop.label}</span>
                </button>
              ))}
            </div>
            <div className="campus-life-map-focus">
              <MapPinned size={17} />
              <div>
                <span>Selected waypoint</span>
                <strong>{selectedStop.label}</strong>
                <p>{selectedStop.detail}</p>
                <div className="campus-life-map-focus-meta">
                  <small>{selectedRoute.title}</small>
                  <small>{selectedRoute.time}</small>
                </div>
              </div>
            </div>
          </div>
          <div className="campus-life-route-list">
            {campusLifeRoutes.map((route) => (
              <button
                key={route.id}
                type="button"
                className={'campus-life-route-card ' + (selectedRouteId === route.id ? 'active' : '')}
                onClick={() => setSelectedRouteId(route.id)}
                aria-pressed={selectedRouteId === route.id}
              >
                <div>
                  <strong>{route.title}</strong>
                  <span>{route.time}</span>
                </div>
                <p>{route.detail}</p>
                <small>{route.stops}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="campus-life-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Communities</span>
            <h3>Pick a broad campus-life circle</h3>
          </div>
          <p>These are intentionally not room-level groups.</p>
        </div>
        <div className="campus-life-community-grid">
          {campusLifeCommunities.map((community) => (
            <button
              key={community.id}
              className={'campus-life-community-card ' + (selectedCommunity === community.id ? 'active' : '')}
              onClick={() => saveCommunity(community)}
            >
              <span className={'community-dot ' + community.tone} />
              <strong>{community.label}</strong>
              <small>{community.scope}</small>
              <p>{community.focus}</p>
              <span>{community.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="campus-life-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">First-week jios</span>
            <h3>Join useful plans without needing a room feed</h3>
          </div>
          <p>Meal, study, sports, and campus-walk plans are grouped by broad student context.</p>
        </div>
        <div className="campus-life-jio-grid">
          {campusLifeJios.map((jio) => (
            <article key={jio.id} className="campus-life-jio-card">
              <div className="jio-card-top">
                <div className={'jio-icon ' + jio.icon}>{renderJioIcon(jio.icon)}</div>
                <div>
                  <h4>{jio.title}</h4>
                  <span className="jio-card-meta">{jio.time}</span>
                </div>
              </div>
              <p>{jio.desc}</p>
              <div className="campus-life-jio-meta">
                <span>by {jio.host}</span>
                <span>{jio.scope}</span>
              </div>
              <button
                className={joinedJios.has(jio.id) ? 'primary-button wide joined' : 'secondary-button wide'}
                onClick={() => setJoinedJios((previous) => new Set([...previous, jio.id]))}
                disabled={joinedJios.has(jio.id)}
              >
                {joinedJios.has(jio.id) ? <><Check size={14} /> Joined</> : <><Users size={14} /> Join jio</>}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="campus-life-section campus-life-guide-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">Move-in guidance</span>
            <h3>What students actually need before Week 1</h3>
          </div>
        </div>
        <div className="campus-life-guide-grid">
          {campusLifeGuides.map((guide) => (
            <article key={guide.title} className="campus-life-guide-card">
              <CheckCircle2 size={18} />
              <strong>{guide.title}</strong>
              <p>{guide.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {settlingHelpRequested && (
        <div className="campus-life-support-banner">
          <HeartHandshake size={16} />
          <span>A support signal was created for {userName}. Staff see only that help was requested from Campus Life, not any room-level location.</span>
        </div>
      )}
    </div>
  );
}

export default App;
