import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex min-h-[18rem] flex-col justify-between gap-4 rounded-lg border p-4 transition duration-200",
        "border-slate-200 bg-white shadow-sm shadow-slate-200/70 hover:border-slate-300 hover:bg-slate-50",
        "dark:border-white/[0.07] dark:bg-[#05070d] dark:shadow-xl dark:shadow-black/30 dark:hover:border-white/15 dark:hover:bg-[#080b13]",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-slate-950 dark:text-white">
          {title}
        </div>
        <div className="font-sans text-xs font-normal leading-5 text-slate-500 dark:text-zinc-400">
          {description}
        </div>
      </div>
    </div>
  );
};
