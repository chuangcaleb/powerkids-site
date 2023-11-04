import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { LucideArrowRight, LucideMenu, LucideSchool } from "lucide-react";
import {
  ABOUT,
  EVENTS,
  OUR_SCHOOLS,
  PROGRAMS,
  type NavLink,
} from "./nav-links";
import { LucidePhoneOutgoing } from "lucide-react";

function DrawerItem({
  title,
  navGroup,
}: {
  title: string;
  navGroup: NavLink[];
}) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="fl-text-step-0">{title}</AccordionTrigger>
      <AccordionContent>
        {navGroup.map((link) => (
          <a
            href={link.href}
            key={link.title}
            className={cn(
              buttonVariants({ variant: "link", size: "unset", font: "unset" }),
              "p-3 fl-text-step-0",
            )}
          >
            {link.icon}
            {link.title}
            <LucideArrowRight className="float-right" />
          </a>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function PowerKidsNavDrawer() {
  return (
    <Sheet>
      <a
        className={cn(
          buttonVariants({
            size: "unset",
          }),
          "p-3 bg-green-300 text-black fixed right-0 bottom-10 hover:bg-green-400 md:hidden",
        )}
        href="#contact"
        aria-label='contact information and social links'
      >
        <LucidePhoneOutgoing />
      </a>
      <SheetTrigger asChild>
        <Button
          className="absolute right-3 top-1 fl-px-2xs fl-py-3xs md:hidden"
          variant="outline"
          size="unset"
          aria-label="Open Navigation Menu"
        >
          <LucideMenu className="mr-2" /> Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(100%,400px)] overflow-auto md:hidden [&_a_svg:first-child]:mr-2 [&_svg]:inline-block">
        <SheetHeader>
          <SheetTitle className="inline-flex gap-x-3 fl-text-step-1">
            <LucideMenu className="place-self-center" />
            Navigation Menu
          </SheetTitle>
        </SheetHeader>
        <Accordion
          type="single"
          collapsible
          className="grid gap-4 py-8 [&_a]:block"
        >
          <a
            href={OUR_SCHOOLS.href}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "unset",
                font: "unset",
              }),
              "p-3 leading-normal underline fl-text-step-0",
            )}
          >
            <LucideSchool />
            Our Five Schools
            <LucideArrowRight className="float-right" />
          </a>
          <DrawerItem title="about" navGroup={ABOUT} />
          <DrawerItem title="programs" navGroup={PROGRAMS} />
          <DrawerItem title="events" navGroup={EVENTS} />
        </Accordion>
        <SheetFooter>
          <div className="flex w-full justify-around">
            <SheetClose asChild>
              <a
                href="#register"
                className={buttonVariants({ variant: "red", size: "lg" })}
              >
                register
              </a>
            </SheetClose>
            <SheetPrimitive.Close asChild>
              <a
                href="#contact"
                className={buttonVariants({ size: "lg", variant: "blue" })}
              >
                contact
              </a>
            </SheetPrimitive.Close>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
