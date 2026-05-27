import { Headphones, MessageSquareText, ShieldCheck } from "lucide-react";

const highlights = [
  {
    label: "Order help",
    icon: <ShieldCheck className="size-4" />,
  },
  {
    label: "Game key support",
    icon: <Headphones className="size-4" />,
  },
  {
    label: "Fast replies",
    icon: <MessageSquareText className="size-4" />,
  },
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,224,255,0.16),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.12),transparent_28%)]" />

      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
          Contact NextStation
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Tell us what you need. We will help you get back in game.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
          Reach out about orders, downloads, account issues, refunds, or anything
          that blocks your next session.
        </p>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-3">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75"
          >
            <span className="text-cyan-300">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}
