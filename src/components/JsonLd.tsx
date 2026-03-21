const JsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Visionyx Informática",
    "description": "Manutenção de computadores, formatação, limpeza, montagem de PC e suporte técnico em Curitiba. Atendimento para empresas.",
    "url": "https://visonyxinformatica.com.br",
    "telephone": "+5541995236952",
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
    "openingHours": "Mo-Fr 08:00-18:00, Sa 08:00-12:00",
    "priceRange": "$$",
    "sameAs": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Informática",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formatação de Computador" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Limpeza de Computador" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Manutenção de Notebook" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Montagem de PC" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Suporte Técnico para Empresas" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Backup e Recuperação de Dados" } }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;
