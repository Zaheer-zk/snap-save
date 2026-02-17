import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ClipboardPaste, Search, Download } from "lucide-react";

const steps = [
  { icon: ClipboardPaste, title: "Paste the Link", desc: "Copy the Instagram video URL from the app or browser and paste it into the input field." },
  { icon: Search, title: "Extract & Preview", desc: "Our system validates the link, fetches the video metadata, and shows you a preview with quality options." },
  { icon: Download, title: "Download Instantly", desc: "Select your preferred quality and download the video directly to your device — no waiting, no signup." },
];

const HowItWorks = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="container flex-1 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center font-display text-4xl font-bold"
      >
        How It <span className="gradient-text">Works</span>
      </motion.h1>
      <p className="mb-16 text-center text-muted-foreground">Three simple steps. That's it.</p>

      <div className="mx-auto max-w-3xl space-y-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-start gap-6"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-instagram">
              <step.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <div className="mb-1 font-display text-sm font-medium text-muted-foreground">Step {i + 1}</div>
              <h3 className="mb-2 font-display text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default HowItWorks;
