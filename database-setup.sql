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
