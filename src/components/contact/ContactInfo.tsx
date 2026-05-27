import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

const contactMethods = [
  {
    label: "Email",
    value: "support@nextstation.store",
    href: "mailto:support@nextstation.store",
    icon: <Mail className="size-5" />,
    accent: "text-cyan-300 bg-cyan-400/10",
  },
  {
    label: "Phone",
    value: "+1 (555) 018-2048",
    href: "tel:+15550182048",
    icon: <Phone className="size-5" />,
    accent: "text-emerald-300 bg-emerald-400/10",
  },
  {
    label: "Discord",
    value: "NextStation Support",
    href: "#",
    icon: <MessageCircle className="size-5" />,
    accent: "text-violet-300 bg-violet-400/10",
  },
];

const details = [
  {
    label: "Response time",
    value: "Usually under 2 hours",
    icon: <Clock3 className="size-4" />,
  },
  {
    label: "Support hours",
    value: "Every day, 9 AM - 11 PM",
    icon: <Sparkles className="size-4" />,
  },
  {
    label: "Location",
    value: "Digital store, worldwide support",
    icon: <MapPin className="size-4" />,
  },
];

export default function ContactInfo() {
  return (
    <aside className="space-y-4">
      <div className="rounded-lg border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/25 backdrop-blur-2xl">
        <h2 className="text-xl font-semibold">Support channels</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Choose the fastest path for your request. Order IDs help us move
          quicker.
        </p>

        <div className="mt-5 grid gap-3">
          {contactMethods.map((method) => (
            <a
              key={method.label}
              href={method.href}
              className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${method.accent}`}
              >
                {method.icon}
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-white/35">
                  {method.label}
                </span>
                <span className="mt-1 block text-sm font-medium text-white transition group-hover:text-cyan-200">
                  {method.value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/25 p-5 backdrop-blur-2xl">
        <div className="grid gap-4">
          {details.map((detail) => (
            <div key={detail.label} className="flex gap-3">
              <span className="mt-0.5 text-amber-300">{detail.icon}</span>
              <span>
                <span className="block text-sm font-medium text-white">
                  {detail.label}
                </span>
                <span className="mt-1 block text-sm text-white/55">
                  {detail.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
