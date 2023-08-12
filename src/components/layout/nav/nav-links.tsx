import {
  LucideBookOpenCheck,
  LucideCamera,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideHome,
  LucideRocket,
  LucideSchool,
  LucideTarget,
  LucideTrophy,
  LucideUsers,
  LucideWarehouse,
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
    title: "Our Facilities",
    href: "/about#our-facilities",
    children: "Modern apparatus and technology to inspire learning.",
    icon: <LucideWarehouse />,
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
    image:
      "v1690805202/powerkids/programs/morning/IMG_20210116_0004_yowtwg.jpg",
    pill: "08:30AM - 12:00noon",
  },
  {
    title: "After School Program",
    href: "/programs/after-school-program",
    children:
      "A variety of enrichment classes after lunch and homework coaching!",
    icon: <LucideRocket />,
    image: "v1690805202/powerkids/programs/after/IMG_20210116_0001_qgyuoz.jpg",
    pill: "12:30PM - 03:00PM",
  },
  {
    title: "Evening Daycare",
    href: "/programs/daycare",
    children:
      "Care and activities for your child, while they wait for you to finish your day's work!",
    image: "v1691417629/powerkids/programs/daycare/Prog_daycare2_tbpzb0.jpg",
    icon: <LucideHome />,
    pill: "03:00PM - 06:00PM",
  },
];

export const EVENTS: ImageNavLink[] = [
  {
    title: "Graduation",
    href: "/events/graduation",
    image: "v1691851196/powerkids/events/graduation/graduation_y0hytv.jpg",
    children:
      "A stage-performance celebration of our children who've completed their pre-school learning, showcasing the discipline and training of our children over the years!",
    icon: <LucideGraduationCap />,
  },
  {
    title: "Sports Day",
    href: "/events/sports-day",
    image: "v1691827903/powerkids/events/sports-day/Event_sports3_n8rzbf.jpg",
    children:
      "Championship, sportsmanship, winning, competing, participation — a family day-out.",
    icon: <LucideTrophy />,
  },
  {
    title: "Field Trips",
    href: "/events/field-trips",
    image:
      "v1691830563/powerkids/events/field-trips/field_trip_bird_e1csw1.jpg",
    children:
      "Learning beyond the classroom walls, bringing perspective to boost cognitive development.",
    icon: <LucideCamera />,
  },
  {
    title: "Community Service",
    href: "/events/community-service",
    image:
      "v1691832615/powerkids/events/community-service/Event_FSF2_quzj04.jpg",
    children:
      "A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation. See how we serve!",
    icon: <LucideHeartHandshake />,
  },
];

export const LINKS = {
  about: FULL_ABOUT,
  programs: PROGRAMS,
  events: EVENTS,
};
