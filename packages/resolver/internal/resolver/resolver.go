package resolver

import (
	"fmt"
	"resolver/internal/item"
	"resolver/internal/recipe"
)

type Node struct {
	item      item.Item
	junctions []Junction
}

type Junction struct {
	recipe *recipe.Recipe

	nodes      []Node
	multiplier float64
}

type Analyzable interface {
	Analyze(r *Resolver, rate float64) []Analyzable
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
	var analyzables []Analyzable

	node := resolver.nodes[itemId]
	analyzables = append(analyzables, &node)

	for len(analyzables) > 0 {
		element := analyzables[0]
		newElements := element.Analyze(resolver, rate)
		analyzables = append(analyzables[1:], newElements...)
	}
}

func (resolver *Resolver) makeJunction(itemId string, recipe recipe.Recipe, rate float64) Junction {
	var multiplier float64
	nodes := make([]Node, len(recipe.Outputs))

	for i, o := range recipe.Outputs {
		if o.ItemId == itemId {
			multiplier = rate / o.Rate
		}
		nodes[i] = resolver.nodes[o.ItemId]
	}

	if multiplier == 0 {
		panic(fmt.Sprint("resolver: could not make junction for '", itemId, "'"))
	}

	return Junction{recipe: &recipe, nodes: nodes, multiplier: multiplier}
}

func (n *Node) End() bool {
	return len(n.item.Recipes) == 0
}

func (n *Node) Analyze(resolver *Resolver, rate float64) []Analyzable {
	if n.End() {
		return []Analyzable{}
	}

	var analyzables []Analyzable
	for _, recipe := range n.item.Recipes {
		junction := resolver.makeJunction(n.item.Id, recipe, rate)
		n.junctions = append(n.junctions, junction)
		analyzables = append(analyzables, &junction)
	}

	return analyzables
}

func (j *Junction) Analyze(resolver *Resolver, rate float64) []Analyzable {
	return []Analyzable{}
}
