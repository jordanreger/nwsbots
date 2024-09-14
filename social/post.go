package social

import (
	"strings"
	"time"

	"jordanreger.com/wx/products/warnings"
)

func GetPost(warning warnings.Warning) string {
	var post string

	if strings.Contains(warning.Properties.Headline, "No current") {
		return warning.Properties.Headline
	}

	latest := warning
	wt := latest.Properties.Event
	messageType := latest.Properties.MessageType
	event := latest.Properties.Event
	area := latest.Properties.Area
	//sender := latest.Properties.Sender
	// headline := latest.Properties.Parameters.NWSheadline[0]
	ends := latest.Properties.Ends.UTC().Format(time.RFC1123)
	wt_s := strings.ReplaceAll(wt, "Warning", "")

	if messageType == "Alert" {
		post = event + " including " + area + " until " + ends + "\n\n#" + strings.ToLower(strings.ReplaceAll(wt_s, " ", "")) + " " + GetHashtags(area)
	} else if messageType == "Update" {
		post = event + " continues for " + area + " until " + ends + "\n\n#" + strings.ToLower(strings.ReplaceAll(wt_s, " ", "")) + " " + GetHashtags(area)
	}

	return post
}
