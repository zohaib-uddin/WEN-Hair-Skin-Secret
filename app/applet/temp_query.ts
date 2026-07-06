import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data, error } = await supabaseAdmin.from('cart_items').select('*').limit(1);
  console.log("DATA:", data);
  console.log("ERROR:", error);
}
check();
