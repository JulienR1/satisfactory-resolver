package config

import (
	"encoding/json"
	"fmt"
	"os"
	"resolver/internal/item"
	"resolver/internal/machine"

	"github.com/joho/godotenv"
)

type Config struct {
	Items    []item.Item
	Machines []machine.Machine
}

func Load() Config {
	godotenv.Load()

	itemsPath := os.Getenv("ITEMS_PATH")
	machinesPath := os.Getenv("MACHINES_PATH")

	itemsData, err := os.ReadFile(itemsPath)
	if err != nil {
		panic(fmt.Sprint("config: ", err))
	}

	machinesData, err := os.ReadFile(machinesPath)
	if err != nil {
		panic(fmt.Sprint("config: ", err))
	}

	return Config{
		Items:    UnmarshalItems(itemsData),
		Machines: UnmarshalMachines(machinesData),
	}
}

func UnmarshalItems(data []byte) []item.Item {
	var items []item.Item
	err := json.Unmarshal(data, &items)
	if err != nil {
		panic(fmt.Sprint("config: ", err))
	}
	return items
}

func UnmarshalMachines(data []byte) []machine.Machine {
	var machines []machine.Machine
	err := json.Unmarshal(data, &machines)
	if err != nil {
		panic(fmt.Sprint("config: ", err))
	}
	return machines
}
