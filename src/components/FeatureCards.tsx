import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, FileVideo, Globe, Download } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "Extract videos in under 5 seconds" },
  { icon: Shield, title: "100% Safe", desc: "No login, no data stored permanently" },
  { icon: Smartphone, title: "Mobile Ready", desc: "Optimized for all devices" },
  { icon: FileVideo, title: "Original Quality", desc: "Download in full HD, no watermark" },
  { icon: Globe, title: "All Formats", desc: "Reels, Posts, and IGTV supported" },
  { icon: Download, title: "Instant Download", desc: "Stream directly — no waiting" },
];

const FeatureCards = () => (
  <section className="container py-20">
    <h2 className="mb-2 text-center font-display text-3xl font-bold">
      Why <span className="gradient-text">snapInsta</span>?
    </h2>
    <p className="mb-12 text-center text-muted-foreground">Everything you need, nothing you don't.</p>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-soft"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:gradient-instagram">
            <f.icon className="h-6 w-6 text-foreground transition-colors group-hover:text-primary-foreground" />
          </div>
          <h3 className="mb-1 font-display text-lg font-semibold">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureCards;
