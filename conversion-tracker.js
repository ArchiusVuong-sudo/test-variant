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
      console.log('Conversion Tracker - Found variant from URL:', variantFromUrl, testKeyFromUrl);
      return { variant: variantFromUrl, test: testKeyFromUrl };
    }
    
    // Fallback to localStorage (if user came from main site)
    const testKey = 'ab_hero_cta_v1'; // should match the test key from main site
    const variant = localStorage.getItem(testKey);
    
    if (variant) {
      console.log('Conversion Tracker - Found variant from localStorage:', variant, testKey);
      return { variant, test: testKey };
    }
    
    console.log('Conversion Tracker - No variant found');
    return null;
  }

  /*──────────── 3. TRACKER  ────────────*/
  function trackConversion(variant, testKey) {
    const payload = { 
      test: testKey, 
      variant, 
      type: 'conversion',
      page_url: window.location.href,
      referrer: "Khanh's test"
    };
    
    console.log('Conversion Tracker - Sending conversion event:', payload);
    
    fetch(`${SUPA_URL}/rest/v1/ab_events`, {
      method: 'POST',
      headers: {
        apikey: SUPA_ANON,
        Authorization: `Bearer ${SUPA_ANON}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload),
      keepalive: true
    })
    .then(response => {
      if (!response.ok) {
        console.error('Conversion Tracker - Error response:', response.status, response.statusText);
        return response.text().then(text => {
          console.error('Conversion Tracker - Error details:', text);
        });
      }
      console.log('Conversion Tracker - Conversion tracked successfully');
    })
    .catch(error => {
      console.error('Conversion Tracker - Network error:', error);
    });
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
      const payload = { 
        test: variantInfo.test, 
        variant: variantInfo.variant, 
        type: 'conversion',
        page_url: window.location.href,
        referrer: document.referrer,
        ...customData
      };
      
      console.log('Conversion Tracker - Manual conversion tracking:', payload);
      
      fetch(`${SUPA_URL}/rest/v1/ab_events`, {
        method: 'POST',
        headers: {
          apikey: SUPA_ANON,
          Authorization: `Bearer ${SUPA_ANON}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload),
        keepalive: true
      })
      .then(response => {
        if (!response.ok) {
          console.error('Conversion Tracker - Manual tracking error:', response.status, response.statusText);
          return response.text().then(text => {
            console.error('Conversion Tracker - Manual tracking error details:', text);
          });
        }
        console.log('Conversion Tracker - Manual conversion tracked successfully');
      })
      .catch(error => {
        console.error('Conversion Tracker - Manual tracking network error:', error);
      });
    } else {
      console.warn('Conversion Tracker - No variant info available for manual tracking');
    }
  };
})(); 
