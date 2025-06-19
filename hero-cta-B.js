(() => {
  const el = document.querySelector(
    '#hero-section > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > a:nth-of-type(2) > span:nth-of-type(1)'
  );
  if (el) {
    el.textContent = 'Get Instant Quote';
    
    // Find the parent link and add A/B test parameters
    const parentLink = el.closest('a');
    if (parentLink) {
      const currentUrl = new URL(parentLink.href);
      currentUrl.searchParams.set('ab_variant', 'B');
      currentUrl.searchParams.set('ab_test', 'ab_hero_cta_v1');
      parentLink.href = currentUrl.toString();
    }
  }
})();
