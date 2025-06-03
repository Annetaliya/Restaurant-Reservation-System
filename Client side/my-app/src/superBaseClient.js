import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dphtxdvmoaqzelcytofu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaHR4ZHZtb2FxemVsY3l0b2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjUxNzIsImV4cCI6MjA2NDEwMTE3Mn0.MmCftHIWn6BIo6ZSX5-V9T8dG1bXzcmV9GpK9jYbVv0'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
