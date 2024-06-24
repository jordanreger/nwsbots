import { kv } from "./main.ts";

// Setup Bluesky agents
const tornado = new BskyAgent({ service: "https://bsky.social" });
await tornado.login({
  identifier: "nwstornado.bsky.social",
  password: Deno.env.get("tornado_pass"),
});
const severetstorm = new BskyAgent({ service: "https://bsky.social" });
await severetstorm.login({
  identifier: "nwsseveretstorm.bsky.social",
  password: Deno.env.get("severetstorm_pass"),
});
const flashflood = new BskyAgent({ service: "https://bsky.social" });
await flashflood.login({
  identifier: "nwsflashflood.bsky.social",
  password: Deno.env.get("flashflood_pass"),
});
const jordan = new BskyAgent({ service: "https://bsky.social" });
await jordan.login({
  identifier: "jordanreger.com",
  password: Deno.env.get("jordan_pass"),
});

// postToBluesky(warning_type: string, post: string);
