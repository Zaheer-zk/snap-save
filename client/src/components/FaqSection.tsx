import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is snapInsta free?",
    a: "Yes, snapInsta is completely free to use. No hidden fees, no subscriptions.",
  },
  {
    q: "Do I need an account?",
    a: "No. Just paste the link and download — no login or signup required.",
  },
  {
    q: "What content can I download?",
    a: "You can download publicly available Instagram Reels, Posts, and IGTV videos. Private content cannot be accessed.",
  },
  {
    q: "Is it legal?",
    a: "snapInsta only allows downloading of publicly accessible content. You are responsible for respecting intellectual property rights and Instagram's terms of service.",
  },
  {
    q: "How long are files stored?",
    a: "Downloaded files are stored temporarily and automatically deleted within 15 minutes. We do not keep any permanent copies.",
  },
  {
    q: "Does it work on mobile?",
    a: "Absolutely. snapInsta is fully optimized for mobile browsers with large tap targets and fast download speeds.",
  },
];

const FaqSection = () => (
  <section className="container max-w-3xl py-20">
    <h2 className="mb-2 text-center font-display text-3xl font-bold">
      Frequently Asked <span className="gradient-text">Questions</span>
    </h2>
    <p className="mb-10 text-center text-muted-foreground">Got questions? We've got answers.</p>
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left font-display text-base font-semibold">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FaqSection;
