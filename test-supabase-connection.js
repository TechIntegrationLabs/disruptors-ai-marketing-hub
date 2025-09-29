import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log("Testing Supabase connection...")
console.log("URL:", supabaseUrl)
console.log("Key available:", !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    try {
        // Test 1: Check if we can query the settings table
        console.log("\n--- Testing Settings Table ---")
        const { data: settings, error: settingsError } = await supabase
            .from("settings")
            .select("key, value, is_public")
            .eq("is_public", true)

        if (settingsError) {
            console.error("Settings query error:", settingsError)
        } else {
            console.log("Settings data:", settings)
        }

        // Test 2: Check if we can query team members
        console.log("\n--- Testing Team Members Table ---")
        const { data: teamMembers, error: teamError } = await supabase
            .from("team_members")
            .select("name, title, is_active")
            .eq("is_active", true)

        if (teamError) {
            console.error("Team members query error:", teamError)
        } else {
            console.log("Team members data:", teamMembers)
        }

        console.log("\n✅ Connection test completed!")

    } catch (error) {
        console.error("❌ Connection test failed:", error)
    }
}

testConnection()
