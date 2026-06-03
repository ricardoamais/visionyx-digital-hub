const JsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Visionyx Informática",
    "description": "Manutenção de computadores, formatação, limpeza, montagem de PC, criação de sites e suporte técnico em Curitiba/PR. Atendimento para empresas e pessoas físicas.",
    "url": "https://visionyx.com.br",
    "telephone": "+5541995236952",
    "email": "contato@visionyx.com.br",
    "foundingDate": "2018",
    "legalName": "Visionyx Informática",
    "taxID": "56.666.903/0001-08",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Curitiba",
      "addressRegion": "PR",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -25.4284,
      "longitude": -49.2733
    },
    "areaServed": [
      { "@type": "City", "name": "Curitiba" },
      { "@type": "State", "name": "Paraná" }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "08:00",
        "closes": "12:00"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "BRL",
    "paymentAccepted": "Cash, Credit Card, Pix",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Informática em Curitiba",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Formatação de Computador em Curitiba", "url": "https://visionyx.com.br/formatacao-de-computador" },
          "price": "90.00",
          "priceCurrency": "BRL"
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Limpeza de Computador em Curitiba", "url": "https://visionyx.com.br/limpeza-de-computador" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Manutenção de Notebook em Curitiba", "url": "https://visionyx.com.br/manutencao-de-notebook" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Montagem de PC em Curitiba", "url": "https://visionyx.com.br/montagem-de-pc" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Suporte Técnico para Empresas em Curitiba", "url": "https://visionyx.com.br/suporte-para-empresas" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Backup e Recuperação de Dados em Curitiba", "url": "https://visionyx.com.br/backup-e-recuperacao-de-dados" }
        },
        {
          "@type": "Offer",
          "itemOffered": { "@type": "Service", "name": "Criação de Sites em Curitiba" }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "87",
      "bestRating": "5"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}
    />
  );
};

export default JsonLd;
