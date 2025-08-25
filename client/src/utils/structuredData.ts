
// Structured Data Schemas for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SociaLink",
  "description": "Social Media Management Platform",
  "url": "https://your-domain.com",
  "logo": "https://your-domain.com/logo.png",
  "sameAs": [
    "https://twitter.com/socialink",
    "https://linkedin.com/company/socialink"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service",
    "availableLanguage": "English"
  }
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SociaLink",
  "applicationCategory": "BusinessApplication",
  "description": "Comprehensive social media management platform for scheduling posts, analytics, and multi-platform publishing.",
  "operatingSystem": "Web Browser",
  "url": "https://your-domain.com",
  "screenshot": "https://your-domain.com/screenshot.png",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  },
  "featureList": [
    "Multi-platform posting",
    "Post scheduling",
    "Analytics dashboard",
    "Content management",
    "Team collaboration"
  ]
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SociaLink",
  "url": "https://your-domain.com",
  "description": "Social Media Management Platform",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://your-domain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Schedule Social Media Posts",
  "description": "Learn how to schedule posts across multiple social media platforms using SociaLink",
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Social media accounts"
    },
    {
      "@type": "HowToSupply", 
      "name": "Content to post"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Create post",
      "text": "Compose your social media post content in the post composer."
    },
    {
      "@type": "HowToStep",
      "name": "Select platforms",
      "text": "Choose which social media platforms you want to post to."
    },
    {
      "@type": "HowToStep",
      "name": "Schedule time",
      "text": "Select your preferred posting date and time."
    },
    {
      "@type": "HowToStep",
      "name": "Publish",
      "text": "Click schedule to queue your post for automatic publishing."
    }
  ]
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What social media platforms does SociaLink support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SociaLink supports major platforms including Facebook, Twitter, Instagram, LinkedIn, and more through our API integrations."
      }
    },
    {
      "@type": "Question", 
      "name": "Can I schedule posts in advance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can schedule posts days, weeks, or months in advance using our scheduling feature."
      }
    },
    {
      "@type": "Question",
      "name": "Does SociaLink provide analytics?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we provide comprehensive analytics including engagement metrics, reach, and performance tracking across all connected platforms."
      }
    }
  ]
};
