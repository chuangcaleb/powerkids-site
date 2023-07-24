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
import { LucideSchool } from "lucide-react";
import { ABOUT, EVENTS, PROGRAMS } from "./nav-links";

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
                    href="/"
                  >
                    <LucideSchool className="block h-10 w-10 max-lg:row-span-2" />
                    <div className="text-lg font-medium">Our Schools</div>
                    <ul className="text-primary-foreground/70 fl-text-step-0">
                      <li>Sri Petaling</li>
                      <li>Salak South Garden</li>
                      <li>Bukit Jalil</li>
                      <li>Puchong Utama</li>
                      <li>Parkane OUG</li>
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
        {/* <NavigationMenuItem className="flex-grow basis-full">
          <NavigationMenuLink>
            <Button variant="red">register</Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <Button variant="blue">contact</Button>
          </NavigationMenuLink>
        </NavigationMenuItem> */}
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
          <div className="row-span-full space-y-1">
            <div className="text-md flex font-medium leading-normal">
              {title}
              {pill ? (
                <span className="ml-auto self-center rounded-sm bg-muted px-1 py-0.5 text-xs font-bold text-muted-foreground">
                  {pill}
                </span>
              ) : null}
            </div>
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
