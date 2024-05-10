package social_test

import (
	"testing"

	"jordanreger.com/nwsbots/social"
)

func TestRepost(t *testing.T) {
	latest := social.LatestTaggedPost()
	social.Repost("nwstornado.bsky.social", latest.CID, latest.URI)
}
