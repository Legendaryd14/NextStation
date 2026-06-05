"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal"; // آدرس فایل مودال خودت
import { GooeyInput } from "../ui/gooey-input";

export function SearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // اگر بخواهی با هر تایپ سرچ کند:
    if (val.trim()) {
      router.push(`/products?search=${encodeURIComponent(val)}`);
    }
  };

  return (
    <Modal>
      {/* دکمه ذره‌بین در هدر */}
      <ModalTrigger className="bg-transparent hover:bg-white/10 p-2 rounded-full transition-colors">
        <SearchIcon className="text-white size-5" />
      </ModalTrigger>

      {/* بدنه مودال که در عکس دیدم */}
      <ModalBody className="bg-black/80 backdrop-blur-2xl border-none max-w-none w-screen h-screen rounded-none m-0 p-0 flex items-center justify-center">
        <ModalContent className="flex flex-col items-center justify-center w-full max-w-3xl">
          <h2 className="text-white text-3xl font-bold mb-8 tracking-tight">
            Search for <span className="text-amber-400">Games</span>
          </h2>

          {/* قرارگیری GooeyInput در مرکز */}
          <div className="relative w-full flex justify-center">
            <GooeyInput
              placeholder="Type game name..."
              value={query}
              onChange={handleSearch}
              // تنظیمات پیشنهادی برای این استایل مودال:
              collapsedWidth={300}
              expandedWidth={500}
              expandedOffset={150}
              gooeyBlur={100}
            />
          </div>

          <p className="text-neutral-500 mt-6 text-sm">
            Press{" "}
            <kbd className="bg-neutral-800 px-2 py-1 rounded text-xs text-neutral-300">
              ESC
            </kbd>{" "}
            to close
          </p>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
