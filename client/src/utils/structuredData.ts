
// Organization Schema
export const organizationSchema = {
  "@type": "Organization",
  "@id": "https://socialink.app/#organization",
  "name": "SociaLink",
  "url": "https://socialink.app",
  "logo": {
    "@type": "ImageObject",
    "url": "https://socialink.app/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "Professional social media management platform for businesses and creators",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@socialink.app"
  },
  "sameAs": [
    "https://twitter.com/socialink",
    "https://linkedin.com/company/socialink"
  ]
};

// Software Application Schema
export const softwareApplicationSchema = {
  "@type": "SoftwareApplication",
  "@id": "https://socialink.app/#software",
  "name": "SociaLink",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/OnlineOnly"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5"
  },
  "featureList": [
    "Multi-platform social media posting",
    "Content scheduling and automation",
    "Analytics and performance tracking",
    "Team collaboration tools",
    "Content calendar management"
  ]
};

// Website Schema
export const webSiteSchema = {
  "@type": "WebSite",
  "@id": "https://socialink.app/#website",
  "url": "https://socialink.app",
  "name": "SociaLink - Social Media Management Platform",
  "description": "Manage all your social media accounts from one dashboard. Schedule posts, track analytics, and engage with your audience across multiple platforms.",
  "publisher": {
    "@id": "https://socialink.app/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://socialink.app/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// Article Schema for blog posts/content
export const createArticleSchema = (
  title: string,
  description: string,
  publishDate: string,
  author: string = "SociaLink Team",
  image?: string
) => ({
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image || "https://socialink.app/api/og-image",
  "author": {
    "@type": "Person",
    "name": author
  },
  "publisher": {
    "@id": "https://socialink.app/#organization"
  },
  "datePublished": publishDate,
  "dateModified": publishDate,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": typeof window !== 'undefined' ? window.location.href : ''
  }
});

// FAQ Schema
export const createFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Product Schema for premium features
export const createProductSchema = (
  name: string,
  description: string,
  price: string,
  currency: string = "USD"
) => ({
  "@type": "Product",
  "name": name,
  "description": description,
  "offers": {
    "@type": "Offer",
    "price": price,
    "priceCurrency": currency,
    "availability": "https://schema.org/InStock",
    "seller": {
      "@id": "https://socialink.app/#organization"
    }
  }
});
