import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  // Let's call a query that lists postgres rpc functions via REST API, or we can see if we can do an alter table via some RPC
  // Usually, Supabase maps functions to /rest/v1/rpc/name
  console.log("Checking RPCs...");
}

main();
