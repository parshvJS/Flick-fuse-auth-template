'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronDownIcon,
  Home,
  Menu,
  Album,
  PencilRuler,
  CircleUserRound,
  Loader2,
  LogOut,
  UserCircle
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type Menu = {
  label: string
  name: string
  icon: React.ReactNode
  submenu?: Submenu[]
  href: string
}

type Submenu = {
  name: string
  icon: React.ReactNode
  href: string
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function checkLoadingSesstion() {
      if (status === 'loading') {
        setIsLoading(true)
      }
      if (status === "authenticated") {
        setIsLoading(false)
      }
    }
    checkLoadingSesstion()
  }, [status])


  const menus: Menu[] = [
    {
      label: "Dashboard",
      name: "Home",
      icon: <Home size={15} className="mr-2" />,
      href: "/dashboard/main",
    },
    {
      label: "Tools",
      name: "Exam Analyzer",
      href: "/tool/exam-analyzer",
      icon: <Album size={15} className="mr-2" />
    },
    {
      label: "Tools",
      name: "Answer Book",
      href: "/tool/answer-generator",
      icon: <PencilRuler size={15} className="mr-2" />
    }

  ];

  const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar for desktop */}
      <ScrollArea className="border-r-2 border-gray-500 md:w-[30%] lg:w-[20%] sm:w-full bg-white dark:bg-background lg:block hidden">
        <div className="md:px-4 sm:p-0 flex flex-col justify-between  h-screen">
          <div>
            <p className="pl-4 pb-5 text-blue-700 font-bold mt-5">Paperbrock.</p>
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
                  .map((menu) => {
                    const isActive = pathname === menu.href;

                    return (
                      <React.Fragment key={menu.name}>
                        {menu.submenu && menu.submenu.length > 0 ? (
                          <Accordion
                            type="single"
                            className="mt-[-10px] mb-[-10px] p-0 font-normal"
                            collapsible
                          >
                            <AccordionItem value="item-1" className="m-0 p-0 font-normal">
                              <AccordionTrigger>
                                <div
                                  className={cn(
                                    'flex text-xs h-10 my-2 p-4 rounded-md',
                                    isActive ? 'bg-primary text-white' : 'bg-white dark:bg-background hover:bg-primary dark:hover:bg-primary hover:text-white'
                                  )}
                                >
                                  <div className="flex justify-between w-full [&[data-state=open]>svg]:rotate-180">
                                    <div className="flex">
                                      <div className="w-6">{menu.icon}</div>
                                      {menu.name}
                                    </div>
                                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {menu.submenu.map((submenu) => (
                                  <Link
                                    key={submenu.name}
                                    href={submenu.href}
                                    className={cn(
                                      'flex text-xs h-10 my-2 p-4 rounded-md',
                                      pathname === submenu.href ? 'bg-primary text-white' : 'bg-white dark:bg-background hover:bg-primary hover:text-white'
                                    )}
                                  >
                                    <div className="w-6">{submenu.icon}</div>
                                    {submenu.name}
                                  </Link>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <Link
                            href={menu.href}
                            className={cn(
                              'flex items-center text-xs h-10 my-2 p-4 rounded-md',
                              isActive ? 'bg-primary text-white' : 'bg-white dark:bg-background hover:bg-primary hover:text-white'
                            )}
                          >
                            <div className="flex gap-2 items-center">
                              <div className="w-6">{menu.icon}</div>
                              {menu.name}
                            </div>
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            ))}

          </div>

          <div className="flex items-start justify-start w-full ">
            {
              isLoading ?
                <div className="flex gap-4">
                  <Loader2 className="animate-spin" />
                  Loading Details
                </div>
                : (
                  <div className="flex gap-4 p-4 items-center justify-between w-full">
                    <CircleUserRound size={15} />
                    <p className="text-sm">{session?.user?.username}</p>
                    <Button onClick={() => signOut()} variant={"ghost"} className="hover:bg-red-100">
                      <LogOut size={15} />
                    </Button>
                  </div>
                )
            }
          </div>
        </div>
      </ScrollArea>

      {/* Mobile Navbar with Sheet */}
      <div className="lg:hidden flex gap-1 items-center">
        <Sheet>
          <SheetTrigger className="sticky p-4 text-blue-700 font-bold">
            <div className="w-10 h-10 bg-gray-200 flex justify-center items-center rounded-full">
              <Menu />
            </div>
          </SheetTrigger>
          <SheetContent className="w-[300px]" side="left">
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
              <div className="flex items-start justify-start w-full ">
                {
                  isLoading ?
                    <div className="flex gap-4">
                      <Loader2 className="animate-spin" />
                      Loading Details
                    </div>
                    : (
                      <div className="flex gap-4 p-4 w-full items-center justify-between">
                        <CircleUserRound size={15} />
                        <p className="text-sm">{session?.user?.username}</p>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button onClick={() => signOut()} variant={"ghost"} className="hover:bg-red-100">
                                <LogOut size={15} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Logout</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>


                      </div>
                    )
                }
              </div>

            </ScrollArea>
          </SheetContent>
        </Sheet>
        <p className="pl-4 pb-5 text-blue-700 font-bold mt-5 text-xl">Paperbrock.</p>
      </div>

      {/* child  */}
      <ScrollArea className="w-full h-screen">

      <div className="w-full h-screen md:p-0 px-4">
        {children}
      </div>
      </ScrollArea>

    </div>
  );
}
