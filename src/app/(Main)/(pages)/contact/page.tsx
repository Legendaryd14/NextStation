import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | NextStation",
  description: "Get help with orders, game keys, accounts, and support requests.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <ContactHero />

        <section className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)] lg:items-start">
          <ContactForm />
          <ContactInfo />
        </section>
      </div>
    </main>
  );
}
