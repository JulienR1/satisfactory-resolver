package recipe

type Recipe struct {
	Label   string    `json:"label"`
	Machine string    `json:"machine"`
	Inputs  []Element `json:"intputs"`
	Outputs []Element `json:"outputs"`
}

type Element struct {
	ItemId string  `json:"id"`
	Rate   float64 `json:"rate"`
}
