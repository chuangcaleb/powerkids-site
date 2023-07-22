import * as React from "react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  LucideCamera,
  LucideGraduationCap,
  LucideHeartHandshake,
  LucideSun,
  LucideSunrise,
  LucideSunset,
  LucideTrophy,
} from "lucide-react";

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
          <NavigationMenuTrigger>programs</NavigationMenuTrigger>
          <NavigationMenuContent className="flex">
            <img src="after.jpg" alt="after" className="" />
            <ul className="w-[65ch] space-y-2 p-3 [&_svg]:h-10 [&_svg]:w-10">
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
            <ul className="grid w-[45ch] space-y-2 p-3 lg:w-[90ch] lg:grid-cols-2 [&_svg]:h-10 [&_svg]:w-10">
              {events.map((event) => (
                <ListItem key={event.title} {...event}>
                  {event.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    {/* <Icons.logo className="h-6 w-6" /> */}
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Documentation
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
            "grid select-none grid-flow-col place-items-center gap-x-5 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          {icon}
          <div className="row-span-full space-y-1">
            <div className="text-md font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-tight text-muted-foreground">
              {children}
            </p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
