"use client";

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

type NavGroup = {
  title: string;
  href: string;
  description: string;
}[];

const programs: NavGroup = [
  {
    title: "Morning School (8:30am - 12noon)",
    href: "/programs/morning-school",
    description:
      "Early childhood education provided for children from ages 2-6.",
  },
  {
    title: "After School Program (12:30pm - 3:00pm)",
    href: "/programs/after-school",
    description:
      "Lunch, homework coaching, and a variety of enrichment classes!",
  },
  {
    title: "Daycare (3:00pm - 6:00pm)",
    href: "/programs/daycare",
    description:
      "Care is given to your child while they wait for you to finish your work in a day.",
  },
];
const events: NavGroup = [
  {
    title: "Graduation",
    href: "/events/graduation",
    description:
      "A celebration of our children who completed their pre-school learning. Stage performance is a showcase of discipline and training of children over the years!",
  },
  {
    title: "Sports Day",
    href: "/events/sports-day",
    description:
      "It's about championship, sportsmanship, winning, competing, participation, and most of all: a family day out.",
  },
  {
    title: "Field Trips",
    href: "/events/field-trips",
    description:
      "Bring learning outside the classroom, and give new perspective to boost cognitive development.",
  },
  {
    title: "Community Service",
    href: "/events/community-service",
    description:
      "A portion of your child's monthly school fees is channelled to support FunGates SuperFlow Foundation.",
  },
];

export default function PowerKidsNavMenu() {
  return (
    <NavigationMenu className="max-md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>programs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {programs.map((program) => (
                <ListItem
                  key={program.title}
                  title={program.title}
                  href={program.href}
                >
                  {program.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>events</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {events.map((event) => (
                <ListItem
                  key={event.title}
                  title={event.title}
                  href={event.href}
                >
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
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
