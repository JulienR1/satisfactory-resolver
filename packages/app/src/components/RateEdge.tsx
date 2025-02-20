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
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.rate}
          </p>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
