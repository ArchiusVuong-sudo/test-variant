(() => {
  /*──────────── 1. CONFIG  ────────────*/
  const TEST_KEY    = 'ab_hero_cta_v1';                 // new key = new test
  const SUPA_URL    = 'https://qvuufcgcjiafybzvlemu.supabase.co';
  const SUPA_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dXVmY2djamlhZnlienZsZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODMxMjIsImV4cCI6MjA2NTM1OTEyMn0.7Ch1gyeGkQufkLW1SQzeW-7sYrIDrsz_mwKw0wL2hfA';

  /*──────────── 2. ASSIGN VARIANT ────────────*/
  let variant = localStorage.getItem(TEST_KEY);
  if (!variant) {
    variant = Math.random() < 0.5 ? 'A' : 'B';          // 50 / 50
    localStorage.setItem(TEST_KEY, variant);
  }

  /*──────────── 3. TRACKER  ────────────*/
  function track(type) {
    const payload = { test: TEST_KEY, variant, type };
    
    console.log('A/B Test - Sending event:', payload);
    
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
        console.error('A/B Test - Error response:', response.status, response.statusText);
        return response.text().then(text => {
          console.error('A/B Test - Error details:', text);
        });
      }
      console.log('A/B Test - Event tracked successfully:', type);
    })
    .catch(error => {
      console.error('A/B Test - Network error:', error);
    });
  }

  /*──────────── 4. LOAD VARIANT + IMPRESSION ────────────*/
  const s = document.createElement('script');
  s.src = variant === 'A'
          ? 'https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/hero-cta-A.js'
          : 'https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/hero-cta-B.js';
  s.defer = true;
  s.onload = () => track('impression');
  document.head.appendChild(s);

  /*──────────── 5. EXPOSE VARIANT TO GLOBAL SCOPE ────────────*/
  window.AB_TEST_VARIANT = variant;
  window.AB_TEST_KEY = TEST_KEY;
})(); 
