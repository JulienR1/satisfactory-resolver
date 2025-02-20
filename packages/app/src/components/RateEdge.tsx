import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

type RateEdgeProps = {
  id: string;
  sourceY: number;
  sourceX: number;
  targetX: number;
  targetY: number;
  data?: { rate: number };
};

export function RateEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: RateEdgeProps) {
  const params = { sourceX, sourceY, targetX, targetY };
  const [path, labelX, labelY] = getBezierPath(params);

  return (
    <>
      <BaseEdge id={id} path={path} />
      {data && (
        <EdgeLabelRenderer>
          <p
            className="nodrag nopan bg-white px-2 py-1 border border-slate-300 rounded-sm"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <span>{Math.round(data.rate * 1000) / 1000}</span>
          </p>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
