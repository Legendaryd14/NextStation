import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Mobile,
  Pen,
  Question,
  ShieldCheck,
  Truck,
} from "@mynaui/icons-react";

export function DropdownComponent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Question className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Truck className="mr-2 size-4" />
          Racing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mobile className="mr-2 size-4" />
          <span>Arcade</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pen className="mr-2 size-4" />
          <span>Action</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShieldCheck className="mr-2 size-4" />
          <span>Stealth</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ArrowUpDown className="mr-2 size-4" />
          <span>Flight</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
