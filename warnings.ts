import { kv } from "./main.ts";
import { postToBluesky } from "./bsky.ts";

const api = (warning: string) =>
  new URL(
    `https://api.weather.gov/alerts/active?status=actual&event=${
      encodeURIComponent(warning.replaceAll("_", " ") + " warning")
    }`,
  );

export async function getFeatures(warning_type: string) {
  let features;
  try {
    features = await fetch(api(warning_type), {
      headers: {
        "User-Agent": `nws.deno.dev: ${warning_type} (nws@jordanreger.com)`,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
  features = await features.json().then((res) => res.features);
  return features;
}

export async function update(warning_type: string) {
  const features = await getFeatures(warning_type);
  let last = await kv.get([warning_type]).then((res) => res.value);
  if (features.length === 0) {
    if (last !== `No current ${warning_type} warnings`) {
      await kv.set([warning_type], `No current ${warning_type} warnings`);
    }
    return;
  }
  const latest = features[0];
  if (!last) await kv.set([warning_type], latest.properties.id);
  last = await kv.get([warning_type]).then((res) => res.value);

  let queueLength = 0;
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (feature.properties.id !== last) queueLength++;
    else break;
  }
  if (queueLength === features.length) queueLength = 1;

  if (last !== latest.properties.id) {
    await kv.set([warning_type], latest.properties.id);

    // TODO: add a rate limit
    for (let i = queueLength; i > 0; i--) {
      postToBluesky(features[i - 1], warning_type);
    }
  }
}
