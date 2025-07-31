"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ClipboardCheck } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={`${
                  pathname === "/" ? "bg-blue-600 text-white" : ""
                } text-xs sm:text-sm`}
              >
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Application Form</span>
                <span className="sm:hidden">Apply</span>
              </Button>
            </Link>

            <Link href="/psw-assessment">
              <Button
                variant={pathname === "/psw-assessment" ? "default" : "ghost"}
                size="sm"
                className={`${
                  pathname === "/psw-assessment" ? "bg-blue-600 text-white" : ""
                } text-xs sm:text-sm`}
              >
                <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">PSW Assessment</span>
                <span className="sm:hidden">Assessment</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
