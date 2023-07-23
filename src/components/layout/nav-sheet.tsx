import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideMenu } from "lucide-react";

function DrawerItem({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <Button variant="outline" size="xl" asChild>
        <a href={href}>{label}</a>
      </Button>
    </li>
  );
}

export default function Drawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="absolute right-2 top-2 md:hidden"
          variant="outline"
          size="icon"
          aria-label="Open Navigation Menu"
        >
          <LucideMenu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="inline-flex gap-x-2 fl-text-step-2">
            <LucideMenu className="place-self-center" /> Navigation
          </SheetTitle>
        </SheetHeader>
        <ul className="grid gap-4 py-8">
          <DrawerItem label="home" href="/" />
          <DrawerItem label="programs" href="/" />
          <DrawerItem label="events" href="/" />
          <DrawerItem label="register" href="/" />
          <DrawerItem label="contact" href="/" />
        </ul>
        <SheetFooter>PowerKids</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
