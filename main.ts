import { API } from "jsr:@nws/api";
import { BskyAgent } from "npm:@atproto/api";
import "jsr:@std/dotenv/load";

const nws = new API();
const kv = await Deno.openKv();

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

/* TEST POST
flashflood_bsky.post({
  text: "This is a test, please disregard this message.",
  langs: ["en-US"],
  createdAt: new Date().toISOString(),
});
*/

// TODO: implement queue
// Setup listeners
Deno.cron("API Listeners", "*/1 * * * *", async () => {
  const latest_tornado_api = await nws.warnings.latest("tornado")
    .then((res) => res.headline);
  const latest_tornado_kv = await kv.get(["tornado"]).then((res) => res.value);
  if (latest_tornado_api !== latest_tornado_kv) {
    kv.set(["tornado"], latest_tornado_api);
  }
  const latest_severetstorm_api = await nws.warnings.latest(
    "severe thunderstorm",
  )
    .then((res) => res.headline);
  const latest_severetstorm_kv = await kv.get(["severetstorm"]).then((res) =>
    res.value
  );
  if (latest_severetstorm_api !== latest_severetstorm_kv) {
    kv.set(["severetstorm"], latest_severetstorm_api);
  }
  const latest_flashflood_api = await nws.warnings.latest(
    "flash flood",
  )
    .then((res) => res.headline);
  const latest_flashflood_kv = await kv.get(["flashflood"]).then((res) =>
    res.value
  );
  if (latest_flashflood_api !== latest_flashflood_kv) {
    kv.set(["flashflood"], latest_flashflood_api);
  }
});

// Web server
Deno.serve({ port: 8080 }, async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/tornado") {
    const headline = await kv.get(["tornado"]).then((res) => res.value);
    return new Response(headline);
  }
  if (path === "/severetstorm") {
    const headline = await kv.get(["severetstorm"]).then((res) => res.value);
    return new Response(headline);
  }
  if (path === "/flashflood") {
    const headline = await kv.get(["flashflood"]).then((res) => res.value);
    return new Response(headline);
  }

  return new Response(
    `<ul><li><a href="/tornado">tornado</a></li><li><a href="/severetstorm">severetstorm</a></li><li><a href="/flashflood">flashflood</a></li></ul>`,
    { headers: { "Content-Type": "text/html;charset=utf-8" } },
  );
});
