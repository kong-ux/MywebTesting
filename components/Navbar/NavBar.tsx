import { ModeToggle } from "./themes-toggle";
import { ButtonState } from "./Login-outButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataRepairButton } from "./DataRepairButton";

export const Navbar = () => {
  return (
    <header className="absolute top-0 z-40 w-full ">
      <nav className="flex flex-wrap items-center justify-between px-4 py-2 w-full">

        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          {/* <DataRepairButton /> */}
        </div>

        <div className="flex items-center space-x-4">

          <ButtonState />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};
