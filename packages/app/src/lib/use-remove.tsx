import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export function useRemove(nodeId: string) {
  const flow = useReactFlow();
  return useCallback(() => {
    flow.setEdges((edges) =>
      edges.filter(
        ({ source, target }) => source !== nodeId && target !== nodeId,
      ),
    );
    flow.setNodes((nodes) => nodes.filter(({ id }) => id !== nodeId));
  }, [flow, nodeId]);
}
