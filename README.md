# A/B Testing Scripts

This repository contains two separate scripts for implementing A/B testing:

## 1. A/B Test Script (`ab-test-script.js`)

**Purpose**: Embed on the main site to create A/B variants and track impressions.

**Features**:
- Assigns users to variant A or B (50/50 split)
- Stores variant assignment in localStorage
- Loads appropriate variant content (hero-cta-A.js or hero-cta-B.js)
- Tracks impression events
- Exposes variant information globally (`window.AB_TEST_VARIANT`)

**Usage**:
```html
<script src="https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/ab-test-script.js"></script>
```

## 2. Conversion Tracker Script (`conversion-tracker.js`)

**Purpose**: Embed on destination pages to capture which variant led to conversion.

**Features**:
- Detects variant from URL parameters or localStorage
- Tracks conversion events automatically on page load
- Provides global function for manual conversion tracking
- Includes page URL and referrer information

**Usage**:
```html
<script src="https://cdn.jsdelivr.net/gh/ArchiusVuong-sudo/test-variant/conversion-tracker.js"></script>
```

**Manual Conversion Tracking**:
```javascript
// Track additional conversion data
window.trackABConversion({
  conversion_type: 'purchase',
  value: 99.99
});
```

## Variant Scripts

- `hero-cta-A.js` - Variant A: Changes CTA text to "Design Yours"
- `hero-cta-B.js` - Variant B: Changes CTA text to "Get Instant Quote"

Both variant scripts automatically add A/B test parameters to links for conversion tracking.

## Data Flow

1. **Main Site**: `ab-test-script.js` assigns variant and tracks impression
2. **User Clicks**: Variant scripts add URL parameters to links
3. **Destination Page**: `conversion-tracker.js` detects variant and tracks conversion

## Database Schema

Events are stored in the `ab_events` table with fields:
- `test`: Test identifier (e.g., 'ab_hero_cta_v1')
- `variant`: Variant (A or B)
- `type`: Event type ('impression' or 'conversion')
- `page_url`: Current page URL (conversion events only)
- `referrer`: Referrer URL (conversion events only)

## Configuration

Update the following constants in both scripts:
- `TEST_KEY`: Unique identifier for your test
- `SUPA_URL`: Your Supabase project URL
- `SUPA_ANON`: Your Supabase anonymous key
