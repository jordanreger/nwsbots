import { update } from "./router.ts";

//export const kv = await Deno.openKv(":memory:");
export const kv = await Deno.openKv();

update("tornado");
update("severe_thunderstorm");
update("flash_flood");

Deno.cron("tornado", "*/1 * * * *", () => update("tornado"));
Deno.cron(
  "severe thunderstorm",
  "*/1 * * * *",
  () => update("severe_thunderstorm"),
);
Deno.cron("flash flood", "*/1 * * * *", () => update("flash_flood"));

Deno.serve({ port: 8080 }, async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path === "/tornado") {
    const headline = await kv.get(["tornado"]).then((res) => res.value);
    return new Response(headline);
  }
  if (path === "/severe_thunderstorm") {
    const headline = await kv.get(["severe_thunderstorm"]).then((res) =>
      res.value
    );
    return new Response(headline);
  }
  if (path === "/flash_flood") {
    const headline = await kv.get(["flash_flood"]).then((res) => res.value);
    return new Response(headline);
  }

  return new Response(
    `<meta name="color-scheme" content="light dark"><ul><li><a href="/tornado">tornado</a></li><li><a href="/severe_thunderstorm">severe thunderstorm</a></li><li><a href="/flash_flood">flash flood</a></li></ul>`,
    { headers: { "Content-Type": "text/html;charset=utf-8" } },
  );
});
