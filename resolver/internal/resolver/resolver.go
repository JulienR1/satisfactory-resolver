package resolver

import (
	"fmt"
	"resolver/internal/item"
	"resolver/internal/recipe"
)

type Junction struct {
	recipe     *recipe.Recipe
	multiplier float64
}

type Resolver struct {
	nodes map[string]Node
}

func New(items []item.Item) Resolver {
	r := Resolver{nodes: map[string]Node{}}
	for _, item := range items {
		r.nodes[item.Id] = Node{item: item}
	}
	return r
}

func (resolver *Resolver) Analyze(itemId string, rate float64) {
	node := resolver.nodes[itemId]

	if node.End() {
		// TODO: manage end node
		return
	}

	for _, recipe := range node.item.Recipes {
		junction := makeJunction(itemId, recipe, rate)
		fmt.Println(junction.multiplier, junction.recipe)
	}
}

func makeJunction(itemId string, recipe recipe.Recipe, rate float64) Junction {
	for _, o := range recipe.Outputs {
		if o.ItemId == itemId {
			return Junction{recipe: &recipe, multiplier: rate / o.Rate}
		}
	}
	panic(fmt.Sprint("resolver: could not make junction for '", itemId, "'"))
}
