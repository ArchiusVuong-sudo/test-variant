(() => {
  const cta = document.querySelector(
    '#hero-section > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > a:nth-of-type(1)'
  );
  if (cta) {
    cta.textContent = 'Design Yours';
    
    // Add A/B test parameters to the link for conversion tracking
    const currentUrl = new URL(cta.href);
    currentUrl.searchParams.set('ab_variant', 'A');
    currentUrl.searchParams.set('ab_test', 'ab_hero_cta_v1');
    cta.href = currentUrl.toString();
  }
})();
