(() => {
  /*──────────── 1. CONFIG  ────────────*/
  const TEST_KEY    = 'ab_hero_cta_v1';                 // new key = new test
  const CONVERT_SEL = '#hero-section > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > a:nth-of-type(1)';                  // click = success
  const SUPA_URL    = 'https://qvuufcgcjiafybzvlemu.supabase.co';
  const SUPA_ANON   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dXVmY2djamlhZnlienZsZW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3ODMxMjIsImV4cCI6MjA2NTM1OTEyMn0.7Ch1gyeGkQufkLW1SQzeW-7sYrIDrsz_mwKw0wL2hfA';           // safe to expose

  /*──────────── 2. ASSIGN VARIANT ────────────*/
  let variant = localStorage.getItem(TEST_KEY);
  if (!variant) {
    variant = Math.random() < 0.5 ? 'A' : 'B';          // 50 / 50
    localStorage.setItem(TEST_KEY, variant);
  }

  /*──────────── 3. TRACKER  ────────────*/
  function track(type) {
    navigator.sendBeacon?.(
      `${SUPA_URL}/rest/v1/ab_events`,
      JSON.stringify({ test: TEST_KEY, variant, type }),
      {headers:{apikey:SUPA_ANON, Authorization:`Bearer ${SUPA_ANON}`,
                'Content-Type':'application/json',
                Prefer:'return=minimal'}}
    );
  }

  /*──────────── 4. LOAD VARIANT + IMPRESSION ────────────*/
  const s = document.createElement('script');
  s.src = variant === 'A'
          ? 'https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/hero-cta-A.js'
          : 'https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/hero-cta-B.js';
  s.defer = true;
  s.onload = () => track('impression');
  document.head.appendChild(s);

  /*──────────── 5. CONVERSION LISTENER ────────────*/
  function hook() {
    const el = document.querySelector(CONVERT_SEL);
    if (!el) return;
    if (el.dataset.abHooked) return;          // avoid duplicates
    el.dataset.abHooked = '1';
    el.addEventListener('click', () => track('conversion'), {once:true});
  }
  hook();
  (new MutationObserver(hook))
      .observe(document.documentElement,{subtree:true,childList:true});
})();