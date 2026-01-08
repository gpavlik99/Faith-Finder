import { Helmet } from "react-helmet-async";
import { absoluteUrl, normalizePath, siteConfig, type SeoInput } from "@/lib/seo";

export default function Seo({
  title,
  description,
  path,
  image,
  noindex,
  jsonLd,
}: SeoInput) {
  const finalDescription = description ?? siteConfig.defaultDescription;
  const finalPath = normalizePath(path);
  const canonical = absoluteUrl(finalPath);
  const ogImage = absoluteUrl(image ?? siteConfig.defaultImagePath);
  const fullTitle = `${title} | ${siteConfig.name}`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />

      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLdArray.map((obj, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          // Helmet renders this safely as text
        >
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
