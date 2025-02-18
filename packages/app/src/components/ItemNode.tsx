import { Item } from "@/resources";
import { Handle, Position } from "@xyflow/react";

type ItemNodeProps = { data: { item: Item } };

export function ItemNode({ data: { item } }: ItemNodeProps) {
  return (
    <>
      <Handle type="source" position={Position.Top} />
      <div className="flex gap-2 px-4 py-2 items-center bg-white border border-black rounded">
        <img
          className="block w-8 aspect-square"
          src="https://satisfactory.wiki.gg/images/0/0a/Iron_Ingot.png"
          alt={item.name}
        />
        <p>{item.name}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
