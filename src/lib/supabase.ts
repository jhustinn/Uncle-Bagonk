import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxhnhzgibgzutbrffgon.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aG5oemdpYmd6dXRicmZmZ29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Njg2NTUsImV4cCI6MjA2NjA0NDY1NX0.dbZ8JvLNHnoMct_9bjKnjrW2qHAjWY28PQZCh1pKMWg"

export const supabase = createClient(supabaseUrl, supabaseKey)