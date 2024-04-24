package recipe

type Recipe struct {
	Label   string          `json:"label"`
	Machine string          `json:"machine"`
	Inputs  []RecipeElement `json:"intputs"`
	Outputs []RecipeElement `json:"outputs"`
}

type RecipeElement struct {
	ItemId string  `json:"id"`
	Rate   float64 `json:"rate"`
}
