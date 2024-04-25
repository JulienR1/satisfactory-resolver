package main

import (
	"resolver/internal/config"
	"resolver/internal/resolver"
)

func main() {
	c := config.Load()

	resolver := resolver.New(c.Items)
	resolver.Analyze("Desc_IronIngot_C", 60)
}
