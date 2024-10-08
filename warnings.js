import { kv } from "./main.js";
import { postToBluesky, getPost } from "./bsky.js";

const api = (warning) => new URL(`https://api.weather.gov/alerts/active?status=actual&event=${encodeURIComponent(warning.replaceAll("_", " ") + " warning")}`);

export async function getFeatures(warning_type) {
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

export async function update(warning_type) {
  const features = await getFeatures(warning_type);
  let last = await kv.get([warning_type]).then((res) => res.value);
  if (features.length === 0) {
    if (last !== `No current ${warning_type} warnings`) {
      await kv.set([warning_type], `No current ${warning_type} warnings`);
    }
    return;
  }
  const latest = features[0];
  const latestPost = getPost(latest);
  if (!last) await kv.set([warning_type], latestPost);
  last = await kv.get([warning_type]).then((res) => res.value);

  let queueLength = 0;
  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const featurePost = getPost(feature);
    if (featurePost !== last) queueLength++;
    else break;
  }
  if (queueLength === features.length) queueLength = 1;

  if (last !== latestPost) {
    await kv.set([warning_type], latestPost);

    // TODO: add a rate limit
    for (let i = queueLength; i > 0; i--) {
      postToBluesky(features[i - 1]);
    }
  }
}
