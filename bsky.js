import "jsr:@std/dotenv/load";
import { BskyAgent, RichText } from "npm:@atproto/api";

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
/*
const test = new BskyAgent({ service: "https://bsky.social" });
await test.login({
  identifier: "nwstest.bsky.social",
  password: Deno.env.get("test_pass"),
});
*/

const rt = new BskyAgent({ service: "https://public.api.bsky.app" });

const DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "long",
  timeZone: "UTC",
  hour12: false,
});

export function getPost(warning) {
  const _id = warning.properties.id,
    areaDesc = warning.properties.areaDesc,
    expires = new Date(warning.properties.expires),
    messageType = warning.properties.messageType,
    event = warning.properties.event,
    _senderName = warning.properties.senderName,
    _headline = warning.properties.headline,
    _description = warning.properties.description,
    _WFO = warning.properties.parameters.AWIPSidentifier[0].substring(3);

  const hashtags = [];
  for (const semicolons of areaDesc.split("; ")) {
    const commas = semicolons.split(", ");
    const hashtag = `#${commas[1]}WX`;
    if (!hashtags.includes(hashtag)) hashtags.push(hashtag);
  }

  const post_text = `${event} ${
    messageType === "Update" ? "continues for" : "including"
  } ${areaDesc} until ${DateTimeFormat.format(expires)}\n\n#${
    event.replace(" ", "").toLowerCase().replace("warning", "")
  } ${hashtags.join(" ")}`;

  return post_text;
}

export async function postToBluesky(warning) {
  const post_text = getPost(warning);
  const warning_type = warning.properties.event.toLowerCase().replace(" warning", "");

  const post = new RichText({
    text: post_text,
  });
  await post.detectFacets(rt);

  const postRecord = {
    text: post.text,
    facets: post.facets,
    langs: ["en-US"],
    createdAt: new Date().toISOString(),
  };

  switch (warning_type) {
    case "tornado":
      await tornado.post(postRecord);
      break;
    case "severe thunderstorm":
      await severetstorm.post(postRecord);
      break;
    case "flash flood":
      await flashflood.post(postRecord);
      break;
    //case "test":
    //  await test.post(postRecord);
    //  break;
    default:
      throw new Error("Please use correct warning_type name");
  }
}
