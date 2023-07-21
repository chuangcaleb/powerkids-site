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
    <Button variant="outline" size="xl" asChild>
      <a href={href}>{label}</a>
    </Button>
  );
}

export default function Drawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" variant="outline" size="icon">
          <LucideMenu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="fl-text-step-2">Navigation</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-8">
          <DrawerItem label="home" href="/" />
          <DrawerItem label="programs" href="/" />
          <DrawerItem label="events" href="/" />
          <DrawerItem label="register" href="/" />
          <DrawerItem label="contact" href="/" />
        </div>
        <SheetFooter>PowerKids</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
