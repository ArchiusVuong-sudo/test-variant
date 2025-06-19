(() => {
  /*──────────── 1. CONFIG  ────────────*/
  const SUPA_URL    = 'https://qvuufcgcjiafybzvlemu.supabase.co';
  const SUPA_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dXVmY2djamlhZnlienZsZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODMxMjIsImV4cCI6MjA2NTM1OTEyMn0.7Ch1gyeGkQufkLW1SQzeW-7sYrIDrsz_mwKw0wL2hfA';

  /*──────────── 2. GET VARIANT FROM URL PARAMS OR LOCALSTORAGE ────────────*/
  function getVariantInfo() {
    // First try to get from URL parameters (if passed from main site)
    const urlParams = new URLSearchParams(window.location.search);
    const variantFromUrl = urlParams.get('ab_variant');
    const testKeyFromUrl = urlParams.get('ab_test');
    
    if (variantFromUrl && testKeyFromUrl) {
      return { variant: variantFromUrl, test: testKeyFromUrl };
    }
    
    // Fallback to localStorage (if user came from main site)
    const testKey = 'ab_hero_cta_v1'; // should match the test key from main site
    const variant = localStorage.getItem(testKey);
    
    if (variant) {
      return { variant, test: testKey };
    }
    
    return null;
  }

  /*──────────── 3. TRACKER  ────────────*/
  function trackConversion(variant, testKey) {
    fetch(`${SUPA_URL}/rest/v1/ab_events`, {
      method: 'POST',
      headers: {
        apikey: SUPA_ANON,
        Authorization: `Bearer ${SUPA_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ 
        test: testKey, 
        variant, 
        type: 'conversion',
        page_url: window.location.href,
        referrer: document.referrer
      }),
      keepalive: true
    }).catch(() => {});
  }

  /*──────────── 4. TRACK CONVERSION ON PAGE LOAD ────────────*/
  const variantInfo = getVariantInfo();
  if (variantInfo) {
    // Track conversion immediately when page loads
    trackConversion(variantInfo.variant, variantInfo.test);
    
    // Also track on page visibility change (in case user comes back to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        trackConversion(variantInfo.variant, variantInfo.test);
      }
    });
  }

  /*──────────── 5. EXPOSE TRACKING FUNCTION GLOBALLY ────────────*/
  window.trackABConversion = function(customData = {}) {
    const variantInfo = getVariantInfo();
    if (variantInfo) {
      fetch(`${SUPA_URL}/rest/v1/ab_events`, {
        method: 'POST',
        headers: {
          apikey: SUPA_ANON,
          Authorization: `Bearer ${SUPA_ANON}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({ 
          test: variantInfo.test, 
          variant: variantInfo.variant, 
          type: 'conversion',
          page_url: window.location.href,
          referrer: document.referrer,
          ...customData
        }),
        keepalive: true
      }).catch(() => {});
    }
  };
})(); 
