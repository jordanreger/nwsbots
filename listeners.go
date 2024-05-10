package main

import (
	"time"

	"jordanreger.com/bsky"
	"jordanreger.com/nwsbots/social"
	"jordanreger.com/wx/warnings"
)

func t_l(warning chan string) {
	for {
		latest := warnings.Latest("Tornado warning")
		post := social.GetPost(latest)
		warning <- post
		time.Sleep(15 * time.Second)
	}
}

func tstm_l(warning chan string) {
	for {
		latest := warnings.Latest("Severe thunderstorm warning")
		post := social.GetPost(latest)
		warning <- post
		time.Sleep(15 * time.Second)
	}
}

func ff_l(warning chan string) {
	for {
		latest := warnings.Latest("Flash flood warning")
		post := social.GetPost(latest)
		warning <- post
		time.Sleep(15 * time.Second)
	}
}

func repost_l(post chan bsky.Post) {
	for {
		latest := social.LatestTaggedPost()
		post <- latest
		time.Sleep(15 * time.Second)
	}
}
