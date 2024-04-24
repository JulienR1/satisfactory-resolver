package machine

type Machine struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Url   string `json:"url"`
	Img   string `json:"img"`
	Power Power  `json:"power"`
}

type Power struct {
	Value int    `json:"value"`
	Type  string `json:"type"`
}

const (
	POWER_CONSUMER  string = "consumer"
	POWER_GENERATOR        = "generator"
)
