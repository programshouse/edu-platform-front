import { ContactHero } from "./components/contact-hero";
import { ContactForm } from "./components/contact-form";
import { ContactInfo } from "./components/contact-info";
import { ContactFaq } from "./components/contact-faq";
import { Footer } from "@/features/landing/components/footer";

export function ContactPage() {
  return (
    <>
      <ContactHero />

      {/* Form + Info Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      <ContactFaq />
      <Footer />
    </>
  );
}
