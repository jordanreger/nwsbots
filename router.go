package main

import (
	"jordanreger.com/nwsbots/social"
	"os"
)

var warnings_path = "/usr/local/lib/warnings"

func last_warning(warning_type string) string {
	// check if directory exists
	if _, err := os.Stat(warnings_path); os.IsNotExist(err) {
		err := os.Mkdir(warnings_path, 0777)
		if err != nil {
			panic(err)
		}
	}

	// check if files exist
	if _, err := os.Stat(warnings_path + "/" + warning_type); os.IsNotExist(err) {
		err := os.WriteFile(warnings_path+"/"+warning_type, []byte(""), 0777)
		if err != nil {
			panic(err)
		}
	}
	w, err := os.ReadFile(warnings_path + "/" + warning_type)
	if err != nil {
		panic(err)
	}
	return string(w)
}

func update_last_warning(warning_type string, warning_text string) {
	err := os.WriteFile(warnings_path+"/"+warning_type, []byte(warning_text), 0777)
	if err != nil {
		panic(err)
	}
}

func router() {
	for {
		select {
		case w := <-t_chan:
			lw := last_warning("tornado")
			if w != lw {
				update_last_warning("tornado", w)
				if w != "No current tornado warnings" {
					social.PostToBluesky("nwstornado.bsky.social", w)
				}
			}
		case w := <-tstm_chan:
			lw := last_warning("severetstorm")
			if w != lw {
				update_last_warning("severetstorm", w)
				if w != "No current severe thunderstorm warnings" {
					social.PostToBluesky("nwsseveretstorm.bsky.social", w)
				}
			}
		case w := <-ff_chan:
			lw := last_warning("flashflood")
			if w != lw {
				update_last_warning("flashflood", w)
				if w != "No current flash flood warnings" {
					social.PostToBluesky("nwsflashflood.bsky.social", w)
				}
			}

		case p := <-post_chan:
			lp := last_warning("repost")
			if p.URI != lp {
				update_last_warning("repost", p.URI)
				social.Repost("nwstornado.bsky.social", p.CID, p.URI)
				social.Repost("nwsseveretstorm.bsky.social", p.CID, p.URI)
				social.Repost("nwsflashflood.bsky.social", p.CID, p.URI)
			}
		}
	}
}
