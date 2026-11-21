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
import { LucideArrowRight, LucideMenu, LucideSchool } from "lucide-react";
import {
  ABOUT,
  EVENTS,
  OUR_SCHOOLS,
  PROGRAMS,
  type NavLink,
} from "./nav-links";
import { LucideGift } from "lucide-react";
import { useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const pendingHash = useRef<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <a
        className={cn(
          buttonVariants({
            size: "unset",
          }),
          "fixed bottom-10 right-0 bg-green-300 p-3 text-black hover:bg-green-400 md:hidden",
        )}
        href="/promotions"
        aria-label="promotion"
      >
        <LucideGift />
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
      <SheetContent
        onCloseAutoFocus={(e) => {
          const hash = pendingHash.current;
          if (!hash) return;
          // Skip focus return to the Menu trigger, which scrolls back to top.
          e.preventDefault();
          pendingHash.current = null;
          requestAnimationFrame(() => {
            history.pushState(null, "", hash);
            document.querySelector(hash)?.scrollIntoView();
          });
        }}
        className="w-[min(100%,400px)] overflow-auto md:hidden [&_a_svg:first-child]:mr-2 [&_svg]:inline-block">
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
            Our Schools
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
                href="/promotions"
                className={buttonVariants({ variant: "red", size: "lg" })}
              >
                promotion
              </a>
            </SheetClose>
            <a
              href="#contact"
              onClick={(e) => {
                // Defer the in-page jump until the drawer has fully closed,
                // otherwise Radix's scroll lock + focus return cancel it.
                e.preventDefault();
                pendingHash.current = "#contact";
                setOpen(false);
              }}
              className={buttonVariants({ size: "lg", variant: "blue" })}
            >
              contact us
            </a>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
