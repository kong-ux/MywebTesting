import { ModeToggle } from "./themes-toggle";
import { ButtonLogOut } from "./Login-outButton";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-card">
      <nav className="flex flex-wrap items-center justify-between px-4 py-2 w-full">

        <div className="flex items-center space-x-4">
          <SidebarTrigger />
        </div>

        <div className="flex items-center space-x-4">
          <ButtonLogOut />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};
