import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  noindex?: boolean;
}

export const SEO = ({ 
  title, 
  description, 
  image = 'https://lovable.dev/opengraph-image-p98pqg.png', // Default from index.html
  url,
  type = 'website',
  keywords,
  noindex = false
}: SEOProps) => {
  const siteTitle = 'snapInsta — Free Instagram Video Downloader';
  const metaTitle = title ? `${title} | snapInsta` : siteTitle;
  const metaDescription = description || 'Download Instagram Reels, Posts and IGTV videos instantly. No login, original quality, no watermarks.';
  const metaKeywords = keywords || 'instagram downloader, video downloader, reels downloader, igtv downloader, instagram saver, snapinsta';

  return (
    <Helmet>
      {/* Basic */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};
