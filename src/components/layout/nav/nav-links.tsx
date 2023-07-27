import {
  LucideCamera,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideSun,
  LucideSunrise,
  LucideSunset,
  LucideTarget,
  LucideTrophy,
  LucideUsers,
  LucideWarehouse,
} from "lucide-react";

export type NavGroup = {
  title: string;
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  pill?: string;
}[];

export const ABOUT: NavGroup = [
  {
    title: "Our Mission / Vision",
    href: "/about#mission-vision",
    children: "To raise a new generation of 21st-Century Children with heart.",
    icon: <LucideTarget />,
  },
  {
    title: "Our Team",
    href: "/about#our-team",
    children: "Trained & qualified teachers who are passionate and dynamic.",
    icon: <LucideUsers />,
  },
  {
    title: "Our Facilities",
    href: "/about#our-facilities",
    children: "Modern apparatus and technology to inspire learning.",
    icon: <LucideWarehouse />,
  },
];
export const PROGRAMS: NavGroup = [
  {
    title: "Morning School",
    href: "/programs/morning-school",
    children:
      "Essential early childhood education (ECE) provided for children from ages 2-6!",
    icon: <LucideSunrise />,
    pill: "08:30AM - 12:00noon",
  },
  {
    title: "After School Program",
    href: "/programs/after-school",
    children: "Lunch, homework coaching, and a variety of enrichment classes!",
    icon: <LucideSun />,
    pill: "12:30PM - 03:00PM",
  },
  {
    title: "Evening Daycare",
    href: "/programs/daycare",
    children:
      "Care and activities for your child, while they wait for you to finish your work in a day!",
    icon: <LucideSunset />,
    pill: "03:00PM - 06:00PM",
  },
];
export const EVENTS: NavGroup = [
  {
    title: "Graduation",
    href: "/events/graduation",
    children:
      "A stage-performance celebration of our children who've completed their pre-school learning, showcasing the discipline and training of our children over the years!",
    icon: <LucideGraduationCap />,
  },
  {
    title: "Sports Day",
    href: "/events/sports-day",
    children:
      "Championship, sportsmanship, winning, competing, participation — a family day-out.",
    icon: <LucideTrophy />,
  },
  {
    title: "Field Trips",
    href: "/events/field-trips",
    children:
      "Learning beyond the classroom walls, bringing perspective to boost cognitive development.",
    icon: <LucideCamera />,
  },
  {
    title: "Community Service",
    href: "/events/community-service",
    children:
      "A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation.",
    icon: <LucideHeartHandshake />,
  },
];
