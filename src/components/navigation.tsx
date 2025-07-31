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
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className={pathname === "/" ? "bg-blue-600 text-white" : ""}
              >
                <Home className="h-4 w-4 mr-2" />
                Application Form
              </Button>
            </Link>

            <Link href="/psw-assessment">
              <Button
                variant={pathname === "/psw-assessment" ? "default" : "ghost"}
                className={
                  pathname === "/psw-assessment" ? "bg-blue-600 text-white" : ""
                }
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                PSW Assessment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
