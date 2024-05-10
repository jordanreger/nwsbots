package social_test

import (
	"testing"

	"jordanreger.com/nwsbots/social"
)

func Test_GetHashtags(t *testing.T) {
	hashtags := social.GetHashtags("Los Angeles, CA; Columbus, OH; Cleveland, OH; Columbus, OH; Columbus, SC")
	t.Log(hashtags)
	if hashtags != "#CAWX #OHWX #SCWX" {
		t.Fatal("Had " + hashtags + ", wanted '#CAWX #OHWX #SCWX'")
	}
}
