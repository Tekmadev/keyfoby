import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration
// Add these to your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are available
// This prevents build errors during static generation
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Newsletter subscriber type
export interface NewsletterSubscriber {
  id?: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  subscribed: boolean;
  source?: string; // Where they signed up from (e.g., "homepage", "app-page")
  user_agent?: string;
  ip_country?: string;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(
  email: string,
  source: string = "app-page"
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn(
        "Supabase not configured. Newsletter subscription disabled."
      );
      return {
        success: false,
        message:
          "Newsletter signup is temporarily unavailable. Please try again later.",
      };
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from("newsletter_subscribers")
      .select("email, subscribed")
      .eq("email", email.toLowerCase())
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.subscribed) {
        return {
          success: false,
          message:
            "You're already subscribed! We'll notify you when we launch.",
        };
      } else {
        // Re-subscribe if they had unsubscribed
        const { error } = await supabase
          .from("newsletter_subscribers")
          .update({
            subscribed: true,
            updated_at: new Date().toISOString(),
            source,
          })
          .eq("email", email.toLowerCase());

        if (error) throw error;
        return {
          success: true,
          message: "Welcome back! You've been re-subscribed.",
        };
      }
    }

    // Insert new subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      subscribed: true,
      source,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return {
      success: true,
      message: "You're in! We'll notify you when KeyFoby App launches.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn(
        "Supabase not configured. Newsletter unsubscription disabled."
      );
      return {
        success: false,
        message:
          "Unsubscribe is temporarily unavailable. Please try again later.",
      };
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        subscribed: false,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email.toLowerCase());

    if (error) throw error;

    return {
      success: true,
      message: "You've been unsubscribed. We're sorry to see you go!",
    };
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

// Service Type interface
export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
  is_active: boolean;
  created_at?: string;
}

// Fallback services for when Supabase is not available
export const fallbackServiceTypes: ServiceType[] = [
  { id: "1", name: "Add Key", is_active: true, display_order: 1 },
  { id: "2", name: "Program & Key Cut", is_active: true, display_order: 2 },
  { id: "3", name: "Key Cut", is_active: true, display_order: 3 },
  { id: "4", name: "Program", is_active: true, display_order: 4 },
  { id: "5", name: "Lockout", is_active: true, display_order: 5 },
  { id: "6", name: "All Key Lost", is_active: true, display_order: 6 },
  { id: "7", name: "Immobilizer", is_active: true, display_order: 7 },
  { id: "8", name: "Diagnosis & Open", is_active: true, display_order: 8 },
  { id: "9", name: "Shell Replacement", is_active: true, display_order: 9 },
  { id: "10", name: "Transponder Key", is_active: true, display_order: 10 },
  { id: "11", name: "Key Sell", is_active: true, display_order: 11 },
  { id: "12", name: "Other", is_active: true, display_order: 99 },
];

// Fetch service types from Supabase
export async function getServiceTypes(): Promise<ServiceType[]> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      console.warn("Supabase not configured. Using fallback service types.");
      return fallbackServiceTypes;
    }

    const { data, error } = await supabase
      .from("service_types")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn("No service types found. Using fallback.");
      return fallbackServiceTypes;
    }

    return data as ServiceType[];
  } catch (error) {
    console.error("Error fetching service types:", error);
    return fallbackServiceTypes;
  }
}

/*
SQL to create the newsletter_subscribers table in Supabase:

CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscribed BOOLEAN DEFAULT true,
  source VARCHAR(100),
  user_agent TEXT,
  ip_country VARCHAR(100)
);

-- Create an index on email for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Create an index on subscribed status for analytics
CREATE INDEX idx_newsletter_subscribed ON newsletter_subscribers(subscribed);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow updates (for re-subscribing)
CREATE POLICY "Allow anonymous updates" ON newsletter_subscribers
  FOR UPDATE TO anon
  USING (true);
*/

/*
SQL to create the service_types table in Supabase:

CREATE TABLE service_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on display_order for sorting
CREATE INDEX idx_service_types_order ON service_types(display_order);

-- Create an index on is_active for filtering
CREATE INDEX idx_service_types_active ON service_types(is_active);

-- Enable Row Level Security
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reads from anonymous users
CREATE POLICY "Allow anonymous reads" ON service_types
  FOR SELECT TO anon
  USING (is_active = true);

-- Insert default service types
INSERT INTO service_types (name, description, display_order, is_active) VALUES
  ('Add Key', 'Adding a new key to a vehicle', 1, true),
  ('Program & Key Cut', 'Programming and cutting a key', 2, true),
  ('Key Cut', 'Cutting a key only', 3, true),
  ('Program', 'Programming a key/remote (includes Key Program)', 4, true),
  ('Lockout', 'Vehicle lockout service', 5, true),
  ('All Key Lost', 'When all keys are lost', 6, true),
  ('Immobilizer', 'Immobilizer reset/service', 7, true),
  ('Diagnosis & Open', 'Diagnostic and opening service', 8, true),
  ('Shell Replacement', 'Key shell replacement', 9, true),
  ('Transponder Key', 'Transponder key service', 10, true),
  ('Key Sell', 'Selling a key/fob', 11, true),
  ('Other', 'Custom service (specify in message)', 99, true);
*/
