import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  Home,
  Music,
  User,
  Mic2,
  Play,
  SquareStack,
  RadioIcon,
  Menu,
  Album,
  PencilRuler,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Menu = {
  label: string;
  name: string;
  icon: React.ReactNode;
  submenu?: Submenu[];
  href?: string;
};

type Submenu = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const menus: Menu[] = [
    {
      label: "Dashboard",
      name: "Home",
      icon: <Home size={15} className="mr-2" />,
      href: "/dashboard/main",
    },
    {
      label:"Tools",
      name:"Exam Analyzer",
      href:"/tool/exam-analyzer",
      icon:<Album  size={15} className="mr-2"/>
    },
    {
      label:"Tools",
      name:"Answer Book",
      href:"/tool/answer-generator",
      icon:<PencilRuler size={15} className="mr-2" />
    }

  ];

  const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <ScrollArea className="border-r-2 border-gray-500 lg:w-[15%] sm:w-full bg-white dark:bg-background lg:block hidden">
        <div className="md:px-4 sm:p-0 mt-5 flex flex-col justify-between">
          <div>
            <p className="pl-4 pb-5 text-blue-700 font-bold">Paperbrock.</p>
            {uniqueLabels.map((label, index) => (
              <React.Fragment key={label}>
                {label && (
                  <p
                    className={`mx-4 mb-3 text-xs text-left tracking-wider font-bold text-slate-300 ${index > 0 ? "mt-10" : ""
                      }`}
                  >
                    {label}
                  </p>
                )}
                {menus
                  .filter((menu) => menu.label === label)
                  .map((menu) => (
                    <React.Fragment key={menu.name}>
                      {menu.submenu && menu.submenu.length > 0 ? (
                        <Accordion
                          key={menu.name}
                          type="single"
                          className="mt-[-10px] mb-[-10px] p-0 font-normal"
                          collapsible
                        >
                          <AccordionItem
                            value="item-1"
                            className="m-0 p-0 font-normal"
                          >
                            <AccordionTrigger>
                              <div className="w-full flex justify-start text-xs font-normal h-10 bg-background my-2 items-center p-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-background rounded-md">
                                <div
                                  className={cn(
                                    "flex justify-between w-full [&[data-state=open]>svg]:rotate-180"
                                  )}
                                >
                                  <div className="flex">
                                    <div className="w-6">{menu.icon}</div>
                                    {menu.name}
                                  </div>
                                  <ChevronDownIcon
                                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                                  />
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {menu.submenu.map((submenu) => (
                                <Link
                                  key={submenu.name}
                                  href={submenu.href}
                                  className="text-gray-400 mt-0 mb-0 flex text-xs h-10 bg-white dark:bg-background dark:hover:bg-primary dark:hover:text-background my-2 items-center p-4 hover:bg-primary hover:text-white rounded-md"
                                >
                                  <div className="w-6">{submenu.icon}</div>
                                  {submenu.name}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <div key={menu.name}>
                          <Link
                            href={menu.href}
                            className="flex text-xs h-10 bg-white dark:bg-background my-2 items-center p-4 hover:bg-primary dark:hover=text-background dark:hover:bg-primary hover:text-white rounded-md"
                          >
                            <div className="w-6">{menu.icon}</div>
                            {menu.name}
                          </Link>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </div>

          <div className="flex p-4">
            sdfsdf
          </div>
        </div>
      </ScrollArea>

      {/* Mobile Navbar with Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger>
            <button className="p-4 text-blue-700 font-bold">
              <Menu />
            </button>
          </SheetTrigger>
          <SheetContent className="w-[300px]" side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            {/* Insert the original sidebar content here */}
            <ScrollArea className="rounded-md bg-white dark:bg-background">
              <div className="md:px-4 sm:p-0 mt-5">
                {uniqueLabels.map((label, index) => (
                  <React.Fragment key={label}>
                    {label && (
                      <p
                        className={`mx-4 mb-3 text-xs text-left tracking-wider font-bold text-slate-300 ${index > 0 ? "mt-10" : ""
                          }`}
                      >
                        {label}
                      </p>
                    )}
                    {menus
                      .filter((menu) => menu.label === label)
                      .map((menu) => (
                        <React.Fragment key={menu.name}>
                          {menu.submenu && menu.submenu.length > 0 ? (
                            <Accordion
                              key={menu.name}
                              type="single"
                              className="mt-[-10px] mb-[-10px] p-0 font-normal"
                              collapsible
                            >
                              <AccordionItem
                                value="item-1"
                                className="m-0 p-0 font-normal"
                              >
                                <AccordionTrigger>
                                  <div
                                    className="w-full flex justify-start text-xs font-normal h-10 bg-background my-2 items-center p-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover=text-background rounded-md"
                                  >
                                    <div
                                      className={cn(
                                        "flex justify-between w-full [&[data-state=open]>svg]:rotate-180"
                                      )}
                                    >
                                      <div className="flex">
                                        <div className="w-6">{menu.icon}</div>
                                        {menu.name}
                                      </div>
                                      <ChevronDownIcon
                                        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
                                      />
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {menu.submenu.map((submenu) => (
                                    <Link
                                      key={submenu.name}
                                      href={submenu.href}
                                      className="text-gray-400 mt-0 mb-0 flex text-xs h-10 bg-white dark:bg-background dark:hover:bg-primary dark:hover:text-background my-2 items-center p-4 hover:bg-primary hover:text-white rounded-md"
                                    >
                                      <div className="w-6">{submenu.icon}</div>
                                      {submenu.name}
                                    </Link>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <div key={menu.name}>
                              <Link
                                href={menu.href}
                                className="flex text-xs h-10 bg-white dark:bg-background my-2 items-center p-4 hover:bg-primary dark:hover=text-background dark:hover:bg-primary hover=text-white rounded-md"
                              >
                                <div className="w-6">{menu.icon}</div>
                                {menu.name}
                              </Link>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* child  */}
      <div className="w-[85%]  h-screen ">
        {children}
      </div>
    </div>
  );
}
