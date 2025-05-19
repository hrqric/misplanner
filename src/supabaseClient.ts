import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://shafstvwmoivpnzxcagz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYWZzdHZ3bW9pdnBuenhjYWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MTQzNjcsImV4cCI6MjA2Mjk5MDM2N30.lxB1KHDrjDsEdrdoJqc3Wh8_fowtH0D3VKpZf1rHa8A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)