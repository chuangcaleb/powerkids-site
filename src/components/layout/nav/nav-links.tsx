import {
  LucideBookOpenCheck,
  LucideCamera,
  LucideClipboardEdit,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideHome,
  LucideRocket,
  LucideSchool,
  LucideTarget,
  LucideTrophy,
  LucideUsers,
} from "lucide-react";

function insert<T>(arr: T[], el: T, i: number) {
  arr.splice(i, 0, el);
  return arr;
}

export interface NavLink {
  title: string;
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  pill?: string;
}

interface ImageNavLink extends NavLink {
  image: string;
}

export const OUR_SCHOOLS: NavLink = {
  title: "Our Schools",
  href: "/about#our-schools",
  children: null,
  icon: <LucideSchool />,
};

export const ABOUT: NavLink[] = [
  {
    title: "Who We Are",
    href: "/about",
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
    title: "We're Hiring!",
    href: "/careers",
    children: "Want to enter and be a part of the centre with a heart?",
    icon: <LucideClipboardEdit />,
  },
];

export const FULL_ABOUT = insert([...ABOUT], OUR_SCHOOLS, 1);

export const PROGRAMS: ImageNavLink[] = [
  {
    title: "Morning School",
    href: "/programs/morning-school",
    children:
      "Essential early childhood education (ECE) provided for children from Ages 2-6!",
    icon: <LucideBookOpenCheck />,
    image: "v1698409879/powerkids/index/program-morning.jpg",
    pill: "08:30AM - 12:30noon",
  },
  {
    title: "After School Program",
    href: "/programs/after-school-program",
    children:
      "A variety of enrichment classes after lunch and homework coaching!",
    icon: <LucideRocket />,
    image: "v1698409775/powerkids/index/program-after.jpg",
    pill: "12:30PM - 03:00PM",
  },
  {
    title: "Evening Daycare",
    href: "/programs/daycare",
    children:
      "Care and activities for your child, while they wait for you to finish your day's work!",
    image: "v1691417629/powerkids/index/daycare.jpg",
    icon: <LucideHome />,
    pill: "03:00PM - 07:00PM",
  },
];

export const EVENTS: ImageNavLink[] = [
  {
    title: "Graduation",
    href: "/events/graduation",
    image: "v1698409502/powerkids/index/graduation.jpg",
    children:
      "A stage-performance celebration of our children who've completed their pre-school learning, showcasing the discipline and training of our children over the years!",
    icon: <LucideGraduationCap />,
  },
  {
    title: "Sports Day",
    href: "/events/sports-day",
    image: "v1698409423/powerkids/index/sports-day.jpg",
    children:
      "Championship, sportsmanship, winning, competing, participation — a family day-out.",
    icon: <LucideTrophy />,
  },
  {
    title: "Field Trips",
    href: "/events/field-trips",
    image: "v1698409581/powerkids/index/field-trip.jpg",
    children:
      "Learning beyond the classroom walls, bringing perspective to boost cognitive development.",
    icon: <LucideCamera />,
  },
  {
    title: "Community Service",
    href: "/events/community-service",
    image: "v1698409504/powerkids/index/community-service.jpg",
    children:
      "A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation. See how our teachers and students serve!",
    icon: <LucideHeartHandshake />,
  },
];

export const LINKS = {
  about: FULL_ABOUT,
  programs: PROGRAMS,
  events: EVENTS,
};
