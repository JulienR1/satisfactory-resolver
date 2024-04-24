package item

import "resolver/internal/recipe"

type Item struct {
	Id      string          `json:"id"`
	Name    string          `json:"name"`
	Url     string          `json:"url"`
	Img     string          `json:"img"`
	Recipes []recipe.Recipe `json:"recipes"`
}
