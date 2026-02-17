import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="container max-w-3xl flex-1 py-20">
      <h1 className="mb-8 font-display text-4xl font-bold">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2>Acceptable Use</h2>
          <p>snapInsta allows you to download publicly accessible Instagram content. You are solely responsible for ensuring you have the right to download and use the content. Do not use this tool to infringe on others' intellectual property rights.</p>
        </section>
        <section>
          <h2>Content Responsibility</h2>
          <p>We do not host, own, or claim any rights to the content downloaded through our service. All content belongs to its respective owners. We act solely as a technical tool to facilitate downloads.</p>
        </section>
        <section>
          <h2>Limitations</h2>
          <p>Only publicly accessible content can be downloaded. Private accounts and content behind login walls are not accessible. We reserve the right to rate-limit or block abusive usage.</p>
        </section>
        <section>
          <h2>Disclaimer</h2>
          <p>snapInsta is provided "as is" without warranty of any kind. We are not responsible for any misuse of downloaded content or any damages arising from the use of our service.</p>
        </section>
        <section>
          <h2>Changes</h2>
          <p>We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
