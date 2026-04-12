import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Airbase. Booking inquiries and general contact.",
};

export default function ContactPage() {
  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
        Contact
      </h1>
      <p className="font-body text-[15px] text-text-muted mb-12">
        For booking inquiries, press, or just to say hello.
      </p>
      <ContactForm />
    </div>
  );
}
