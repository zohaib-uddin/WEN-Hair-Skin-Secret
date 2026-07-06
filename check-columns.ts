import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data: catData, error: catError } = await supabase.from("categories").select("*").limit(1);
  if (catError) {
    console.error("Categories Error:", catError);
  } else {
    console.log("Categories Columns:", catData ? Object.keys(catData[0] || {}) : "No data");
  }

  const { data: prodData, error: prodError } = await supabase.from("products").select("*").limit(1);
  if (prodError) {
    console.error("Products Error:", prodError);
  } else {
    console.log("Products Columns:", prodData ? Object.keys(prodData[0] || {}) : "No data");
  }
}

main();
