// import { RichText, BskyAgent } from "npm:@atproto/api";
// import "jsr:@std/dotenv/load";
import { kv } from "./main.ts";

const api = (warning: string) =>
  new URL(
    `https://api.weather.gov/alerts/active?status=actual&event=${
      encodeURIComponent(warning.replaceAll("_", " ") + " warning")
    }`,
  );

export async function update(warning_type: string) {
  const features = await fetch(api(warning_type))
    .then((res) => res.json())
    .then((res) => res.features);

  const last = await kv.get([warning_type]).then((res) => res.value);
  const latest = features.length !== 0
    ? features[0]
    : `No current ${warning_type} warnings`;
  if (!last) await kv.set([warning_type], features[0].properties.id);

  let queueLength = 0;
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];

    if (feature.properties.id !== last) queueLength++;
    else break;
  }

  if (latest === `No current ${warning_type} warnings`) {
    await kv.set([warning_type], latest);
    return;
  }

  if (last !== latest.properties.id) {
    await kv.set([warning_type], latest.properties.id);
    for (let i = 0; i < queueLength; i++) {
      console.log(`${warning_type}(${i}): ${latest.properties.id}`);
      //const post = await getPost(warning_type);
      //postToBluesky(warning_type, post);
    }
  }
}
