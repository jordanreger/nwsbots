package social

import (
	"encoding/json"
	"io"
	"net/http"

	"jordanreger.com/bsky"
)

type taggedposts_res struct {
	Posts []bsky.Post `json:"posts,omitempty"`
}

func LatestTaggedPost() bsky.Post {
	res, _ := http.Get("https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=%23nwsbots&author=jordanreger.com")

	var posts_res taggedposts_res
	b, _ := io.ReadAll(res.Body)
	json.Unmarshal(b, &posts_res)

	posts := posts_res.Posts
	return posts[0]
}
