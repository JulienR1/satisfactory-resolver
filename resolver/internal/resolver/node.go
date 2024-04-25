package resolver

import "resolver/internal/item"

type Node struct {
	item item.Item
}

func (n *Node) End() bool {
	return len(n.item.Recipes) == 0
}
