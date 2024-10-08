import { update } from "./warnings.js";

export const kv = await Deno.openKv();

update("tornado");
update("severe_thunderstorm");
update("flash_flood");

Deno.cron("tornado", "*/1 * * * *", () => update("tornado"));
Deno.cron("severe thunderstorm", "*/1 * * * *", () => update("severe_thunderstorm"));
Deno.cron("flash flood", "*/1 * * * *", () => update("flash_flood"));

Deno.serve(() => Response.redirect("https://bsky.app/profile/nwsbots.bsky.social/lists/3kuold5ugp724"));
