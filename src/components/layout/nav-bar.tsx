import { cn } from "@/lib/utils";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  LucideCamera,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideSchool,
  LucideSun,
  LucideSunrise,
  LucideSunset,
  LucideTarget,
  LucideTrophy,
  LucideUsers,
  LucideWarehouse,
} from "lucide-react";
import { Button } from "../ui/button";

type NavGroup = {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
}[];

const programs: NavGroup = [
  {
    title: "Morning School (8:30am - 12noon)",
    href: "/programs/morning-school",
    description:
      "Early childhood education provided for children from ages 2-6.",
    icon: <LucideSunrise />,
  },
  {
    title: "After School Program (12:30pm - 3:00pm)",
    href: "/programs/after-school",
    description:
      "Lunch, homework coaching, and a variety of enrichment classes!",
    icon: <LucideSun />,
  },
  {
    title: "Daycare (3:00pm - 6:00pm)",
    href: "/programs/daycare",
    description:
      "Care is given to your child while they wait for you to finish your work in a day.",
    icon: <LucideSunset />,
  },
];
const events: NavGroup = [
  {
    title: "Graduation",
    href: "/events/graduation",
    description:
      "A stage-performance celebration of our children who've completed their pre-school learning, showcasing the discipline and training of our children over the years!",
    icon: <LucideGraduationCap />,
  },
  {
    title: "Sports Day",
    href: "/events/sports-day",
    description:
      "Championship, sportsmanship, winning, competing, participation — a family day-out.",
    icon: <LucideTrophy />,
  },
  {
    title: "Field Trips",
    href: "/events/field-trips",
    description:
      "Learning beyond the classroom walls, bringing perspective to boost cognitive development.",
    icon: <LucideCamera />,
  },
  {
    title: "Community Service",
    href: "/events/community-service",
    description:
      "A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation.",
    icon: <LucideHeartHandshake />,
  },
];

export default function PowerKidsNavMenu() {
  return (
    <NavigationMenu className="max-md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>about</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[540px] lg:grid-cols-[.6fr_1fr] [&_svg]:h-8 [&_svg]:w-8">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="grid h-full w-full select-none grid-cols-[min-content_1fr] flex-col gap-x-4 gap-y-2 rounded-md bg-gradient-to-bl from-accent-blue/10 to-accent-red/10 p-4 no-underline outline-none hover:from-accent-red/10 hover:to-accent-blue/5 focus:shadow-md lg:flex lg:justify-end"
                    href="/"
                  >
                    <LucideSchool className="block h-10 w-10 max-lg:row-span-2" />
                    <div className="text-lg font-medium">Our Schools</div>
                    <ul className="text-muted-foreground fl-text-step-0">
                      <li>Sri Petaling</li>
                      <li>Salak South Garden</li>
                      <li>Bukit Jalil</li>
                      <li>Puchong Utama</li>
                      <li>Parkane OUG</li>
                    </ul>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="/docs"
                title="Our Mission / Vision"
                icon={<LucideTarget />}
              >
                To raise a new generation of 21st-Century Children with heart.
              </ListItem>
              <ListItem
                href="/docs/installation"
                title="Our Team"
                icon={<LucideUsers />}
              >
                Trained, qualified teachers who are passionate and dynamic
              </ListItem>
              <ListItem
                href="/docs/primitives/typography"
                title="Our Facilities"
                icon={<LucideWarehouse />}
              >
                Modern apparatus and technology to inspire learning.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>programs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[45ch] space-y-2 p-3 [&_svg]:h-10 [&_svg]:w-10">
              {programs.map((program) => (
                <ListItem key={program.title} {...program}>
                  {program.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>events</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[45ch] space-y-2 p-3 [&_svg]:h-10 [&_svg]:w-10">
              {events.map((event) => (
                <ListItem key={event.title} {...event}>
                  {event.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <Button>register</Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "grid h-full select-none grid-flow-col grid-cols-[min-content_1fr] items-center gap-x-5 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          {icon}
          <div className="row-span-full space-y-1">
            <div className="text-md font-medium leading-none">{title}</div>
            {children ? (
              <p className="line-clamp-2 leading-tight text-muted-foreground fl-text-step-0">
                {children}
              </p>
            ) : null}
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
