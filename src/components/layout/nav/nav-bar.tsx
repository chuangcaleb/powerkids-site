import { cn } from "@/lib/utils";
import * as React from "react";

import Pill from "@/components/brand/pill";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SCHOOLS_NAMELIST } from "@/pages/about/schools/_schools";
import { LucideSchool } from "lucide-react";
import { ABOUT, EVENTS, OUR_SCHOOLS, PROGRAMS } from "./nav-links";

export default function PowerKidsNavMenu() {
  return (
    <NavigationMenu className="flex-grow max-md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>about</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[510px] lg:grid-cols-[.6fr_1fr] [&_svg]:h-8 [&_svg]:w-8">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="grid h-full w-full select-none grid-cols-[min-content_1fr] flex-col gap-x-4 gap-y-2 rounded-md bg-gradient-to-bl from-accent-blue/70 to-accent-red/80 p-4 text-primary-foreground no-underline outline-none hover:animate-pulse hover:from-accent-red/70 hover:to-accent-blue/80 focus:shadow-md lg:flex lg:justify-end"
                    href={OUR_SCHOOLS.href}
                  >
                    <LucideSchool className="block h-10 w-10 max-lg:row-span-2" />
                    <div className="text-lg font-medium">
                      {OUR_SCHOOLS.title}
                    </div>
                    <ul className="text-primary-foreground/70 fl-text-step--1">
                      {SCHOOLS_NAMELIST.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </a>
                </NavigationMenuLink>
              </li>
              {ABOUT.map((a) => (
                <ListItem key={a.title} {...a} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>programs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[45ch] space-y-2 p-3 [&_svg]:h-10 [&_svg]:w-10">
              {PROGRAMS.map((program) => (
                <ListItem key={program.title} {...program} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>events</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[45ch] space-y-2 p-3 [&_svg]:h-10 [&_svg]:w-10">
              {EVENTS.map((event) => (
                <ListItem key={event.title} {...event} />
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon: React.ReactNode;
    pill?: string;
  }
>(({ className, title, icon, children, pill, ...props }, ref) => {
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
          <div className="fl-space-s row-span-full">
            <div className="flex font-medium leading-normal">
              {title}
              {pill ? (
                <Pill
                  size="xs"
                  color="muted"
                  className="ml-auto self-center tracking-wider"
                >
                  {pill}
                </Pill>
              ) : null}
            </div>
            {children ? (
              <p className="line-clamp-2 leading-tight text-muted-foreground fl-text-step--1">
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
