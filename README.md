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

## Database Setup

Before using the scripts, you need to set up the database table. Run the SQL commands in `database-setup.sql` in your Supabase SQL editor:

```sql
-- Create the ab_events table for A/B testing
CREATE TABLE IF NOT EXISTS ab_events (
    id BIGSERIAL PRIMARY KEY,
    test VARCHAR(100) NOT NULL,
    variant VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    page_url TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ab_events_test ON ab_events(test);
CREATE INDEX IF NOT EXISTS idx_ab_events_variant ON ab_events(variant);
CREATE INDEX IF NOT EXISTS idx_ab_events_type ON ab_events(type);
CREATE INDEX IF NOT EXISTS idx_ab_events_created_at ON ab_events(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE ab_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON ab_events
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anonymous reads (if needed for analytics)
CREATE POLICY "Allow anonymous reads" ON ab_events
    FOR SELECT USING (true);
```

## Database Schema

Events are stored in the `ab_events` table with fields:
- `id`: Auto-incrementing primary key
- `test`: Test identifier (e.g., 'ab_hero_cta_v1')
- `variant`: Variant (A or B)
- `type`: Event type ('impression' or 'conversion')
- `page_url`: Current page URL (conversion events only)
- `referrer`: Referrer URL (conversion events only)
- `created_at`: Timestamp when event was created

## Configuration

Update the following constants in both scripts:
- `TEST_KEY`: Unique identifier for your test
- `SUPA_URL`: Your Supabase project URL
- `SUPA_ANON`: Your Supabase anonymous key

## Troubleshooting

### 400 Bad Request Error
If you see a 400 error when posting to `ab_events`, check:
1. The `ab_events` table exists in your Supabase database
2. Row Level Security (RLS) policies are set up correctly
3. The table schema matches the expected fields

### Debug Mode
Both scripts now include console logging for debugging:
- Check browser console for detailed error messages
- Look for "A/B Test" and "Conversion Tracker" prefixed logs
- Error responses will show the exact database error message

### Common Issues
- **Table doesn't exist**: Run the database setup SQL
- **Permission denied**: Check RLS policies
- **Invalid column**: Ensure table schema matches the expected fields
