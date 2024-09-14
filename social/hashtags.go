package social

import (
	"strings"
)

func GetHashtags(area string) string {
	areas := strings.Split(area, "; ")
	var states = make([]string, 0, len(areas))
	for _, area := range areas {
		states = append(states, strings.Split(area, ", ")[1])
	}

	var m = make(map[string]bool)
	var hashtags = make([]string, 0, len(states))

	for _, state := range states {
		if _, ne := m[state]; !ne {
			m[state] = true
			hashtags = append(hashtags, "#"+state+"WX")
		}
	}

	return strings.Join(hashtags, " ")

}
