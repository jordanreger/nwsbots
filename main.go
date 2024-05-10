package main

import "jordanreger.com/bsky"

var t_chan = make(chan string)
var tstm_chan = make(chan string)
var ff_chan = make(chan string)
var post_chan = make(chan bsky.Post)

func main() {
	go t_l(t_chan)
	go tstm_l(tstm_chan)
	go ff_l(ff_chan)
	go repost_l(post_chan)

	router()
}
