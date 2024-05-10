package social_test

import (
	"testing"

	"jordanreger.com/wx/bots/social"
)

func TestRepost(t *testing.T) {
	latest := social.LatestTaggedPost()
	social.Repost("nwstornado.bsky.social", latest.CID, latest.URI)
}
