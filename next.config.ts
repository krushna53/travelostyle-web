const nextConfig = {
  // pdfkit (used by lib/generateBookingPdf.js, for the booking confirmation
  // PDF) pulls in fontkit, whose compiled output is incompatible with
  // Turbopack's strict ESM bundling. Keeping it external makes Next.js
  // `require()` it natively at runtime in the API route instead of trying
  // to bundle/transpile it.
  serverExternalPackages: ["pdfkit", "fontkit"],
  // The FAQs page used to live at /general-faqs.
  async redirects() {
    return [{ source: "/general-faqs", destination: "/faqs", permanent: true }];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend.travelostyle.com",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "travelostyle-drupal-backend.ddev.site",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "http",
        hostname: "travelostyle-drupal-backend.ddev.site",
        pathname: "/sites/default/files/**",
      },
    ],
  },
};

export default nextConfig;