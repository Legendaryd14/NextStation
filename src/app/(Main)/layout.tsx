import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { SparklesCore } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-h-full flex flex-col">
      <div className="w-screen h-screen relative ">
        <SparklesCore
          id="tsparticlesfullpage"
          background="#000000"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={10}
          className="w-full h-full fixed z-[-1] overflow-x-hidden"
          particleColor={cn()}
        />
        {children}
      </div>
    </section>
  );
}
