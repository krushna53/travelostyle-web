const nextConfig = {
  // The FAQs page used to live at /general-faqs.
  async redirects() {
    return [{ source: "/general-faqs", destination: "/faqs", permanent: true }];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
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