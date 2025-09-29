import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

console.log("Testing Supabase connection with service role...")
console.log("URL:", supabaseUrl)
console.log("Service key available:", !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
    try {
        // Test 1: Check tables exist
        console.log("\n--- Testing Table Existence ---")
        
        const { data: tables, error: tablesError } = await supabase
            .rpc("exec_sql", { sql: "SELECT tablename FROM pg_tables WHERE schemaname = `public` ORDER BY tablename;" })
        
        if (tablesError) {
            console.log("Using direct table query instead...")
            
            // Test team_members table
            const { data: teamData, error: teamError } = await supabase
                .from("team_members")
                .select("count(*)")
                .single()
            
            if (teamError) {
                console.error("Team members table error:", teamError)
            } else {
                console.log("✅ team_members table exists")
            }
            
            // Test settings table
            const { data: settingsData, error: settingsError } = await supabase
                .from("settings")
                .select("count(*)")
                .single()
            
            if (settingsError) {
                console.error("Settings table error:", settingsError)
            } else {
                console.log("✅ settings table exists")
            }
            
            // Test services table
            const { data: servicesData, error: servicesError } = await supabase
                .from("services")
                .select("count(*)")
                .single()
            
            if (servicesError) {
                console.error("Services table error:", servicesError)
            } else {
                console.log("✅ services table exists")
            }
            
        } else {
            console.log("Database tables:", tables)
        }

        console.log("\n✅ Schema verification completed!")

    } catch (error) {
        console.error("❌ Connection test failed:", error)
    }
}

testConnection()
