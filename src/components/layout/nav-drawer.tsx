import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideMenu } from "lucide-react";
import { ABOUT, PROGRAMS, type NavGroup, EVENTS } from "./nav-links";
import { cn } from "@/lib/utils";

function DrawerItem({
  title,
  navGroup,
}: {
  title: string;
  navGroup: NavGroup;
}) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {navGroup.map((link) => (
          <a
            href={link.href}
            key={link.title}
            className={cn(
              buttonVariants({
                variant: "link",
                size: "lg",
                font: "unset",
              }),
            )}
          >
            {link.icon}
            {link.title}
          </a>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function PowerKidsNavDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="absolute right-2 top-1 inline-flex fl-px-xs fl-py-2xs md:hidden"
          variant="outline"
          size="unset"
          aria-label="Open Navigation Menu"
        >
          <LucideMenu className="mr-2" /> Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(100%,400px)] overflow-auto md:hidden [&_a>svg]:mr-2 [&_svg]:inline-block">
        <SheetHeader>
          <SheetTitle className="inline-flex gap-x-3 fl-text-step-2">
            <LucideMenu className="place-self-center" />
            Navigation Menu
          </SheetTitle>
        </SheetHeader>
        <Accordion
          type="single"
          collapsible
          className="grid gap-4 pb-8 pt-4 [&_a]:block"
        >
          <DrawerItem title="about" navGroup={ABOUT} />
          <DrawerItem title="programs" navGroup={PROGRAMS} />
          <DrawerItem title="events" navGroup={EVENTS} />
        </Accordion>
        <SheetFooter>
          <div className="flex w-full justify-around">
            <a
              href="/"
              className={buttonVariants({ variant: "red", size: "xl" })}
            >
              register
            </a>
            <a
              href="/"
              className={buttonVariants({ size: "xl", variant: "blue" })}
            >
              contact
            </a>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
