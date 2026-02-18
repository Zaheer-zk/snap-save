import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { SEO } from "@/components/SEO";

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <SEO 
      title="Privacy Policy" 
      description="Read the Privacy Policy for snapInsta. We value your privacy and do not store personal data."
      url="https://snapinsta.app/privacy"
    />
    <Header />
    <main className="container max-w-3xl flex-1 py-20">
      <h1 className="mb-8 font-display text-4xl font-bold">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <section>
          <h2>Data Collection</h2>
          <p>snapInsta does not collect personal data. We do not require any user account, login, or registration. The only data processed is the Instagram URL you submit, which is used solely to extract the requested media.</p>
        </section>
        <section>
          <h2>Temporary Storage</h2>
          <p>Downloaded media files are stored temporarily for a maximum of 15 minutes to facilitate the download. After this period, all files are permanently and automatically deleted from our servers.</p>
        </section>
        <section>
          <h2>Cookies & Tracking</h2>
          <p>We may use essential cookies for rate-limiting and abuse prevention. We do not use tracking cookies or third-party analytics that collect personal information.</p>
        </section>
        <section>
          <h2>Third-Party Ads</h2>
          <p>Our site may display ads served by third-party advertising networks. These networks may use cookies to serve relevant ads. Please refer to their respective privacy policies.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>If you have questions about this privacy policy, please contact us through the website.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Privacy;
