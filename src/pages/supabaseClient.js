import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ciwhwgrmmdaayssjbnaq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpd2h3Z3JtbWRhYXlzc2pibmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNDU3MDEsImV4cCI6MjA1MjYyMTcwMX0.l4-UPtj-aq5NH8kdY6HV3hLzleNvgnhWmUPzhEA_Qjo";
export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;