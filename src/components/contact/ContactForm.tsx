"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const topics = [
  "Order support",
  "Game key issue",
  "Refund request",
  "Account help",
  "Partnership",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <section className="rounded-lg border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/25 backdrop-blur-2xl md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Send a message</h2>
        <p className="mt-2 text-sm leading-6 text-white/55">
          Share the details and our support team will follow up with the next
          best step.
        </p>
      </div>

      {sent && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <CheckCircle2 className="size-5 text-emerald-300" />
          Message prepared. We will get back to you shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-white/75">
            Name
            <input
              name="name"
              required
              placeholder="Your name"
              className="h-11 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 focus:bg-white/[0.08]"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-white/75">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 focus:bg-white/[0.08]"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-white/75">
            Topic
            <select
              name="topic"
              defaultValue=""
              required
              className="h-11 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.08]"
            >
              <option value="" disabled>
                Select a topic
              </option>
              {topics.map((topic) => (
                <option key={topic} value={topic} className="bg-neutral-950">
                  {topic}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-white/75">
            Order ID
            <input
              name="orderId"
              placeholder="Optional"
              className="h-11 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 focus:bg-white/[0.08]"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-white/75">
          Message
          <textarea
            name="message"
            required
            rows={6}
            placeholder="Tell us what happened..."
            className="min-h-36 resize-y rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60 focus:bg-white/[0.08]"
          />
        </label>

        <button
          type="submit"
          className="group mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-black transition hover:bg-cyan-200 md:w-fit"
        >
          Send message
          <Send className="size-4 transition group-hover:translate-x-0.5" />
        </button>
      </form>
    </section>
  );
}
