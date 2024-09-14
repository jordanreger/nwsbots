package main_test

import (
	"jordanreger.com/wx/bots/social"
	"testing"
)

func TestPost(t *testing.T) {
	wt := "This is a test. Please disregard."

	social.PostToBluesky("nwstornado.bsky.social", wt)
	social.PostToBluesky("nwsseveretstorm.bsky.social", wt)
	social.PostToBluesky("nwsflashflood.bsky.social", wt)
}
