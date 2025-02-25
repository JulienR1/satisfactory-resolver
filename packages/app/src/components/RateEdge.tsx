import { getSpline } from "@/lib/bezier";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useRef, useEffect } from "react";
import { Node, Edge } from "./../lib/constants";

type RateEdgeProps = {
  id: string;
  source: string;
  target: string;
  sourceY: number;
  sourceX: number;
  targetX: number;
  targetY: number;
  data?: { rate: number; midpoint?: XYPosition; handleIndex?: number };
};

export function RateEdge({ id, source, target, sourceY, sourceX, targetX, targetY, data }: RateEdgeProps) {
  const flow = useReactFlow<Node, Edge>();
  const activeRef = useRef(false);

  const params = { sourceX, sourceY, targetX, targetY };
  const type = flow.getNode(source)!.type === "recipe" ? "source" : "target";

  const recipe = flow.getInternalNode(type === "source" ? source : target)!;
  const handles = recipe.internals.handleBounds?.[type];
  const handle = handles?.[data?.handleIndex ?? 0] ?? { type, x: 0, y: 0, width: 0, height: 0 };
  params[`${type}X`] = handle.x + recipe.internals.positionAbsolute.x + handle.width / 2;
  params[`${type}Y`] = handle.y + recipe.internals.positionAbsolute.y + handle.height / 2;

  const [path, labelX, labelY] = getBezierPath(params);

  const labelPosition = data?.midpoint ?? { x: labelX, y: labelY };
  const manualPath = getSpline([
    { x: params.sourceX, y: params.sourceY },
    labelPosition,
    { x: params.targetX, y: params.targetY },
  ]);

  const handleMouseDown = useCallback(() => (activeRef.current = true), []);
  const handleMouseUp = useCallback(() => (activeRef.current = false), []);

  const handleMouseMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (activeRef.current) {
        const position = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
        flow.updateEdgeData(id, (edge) => ({ ...edge, midpoint: position }));
      }
    },
    [flow, id],
  );

  const handleResetDrag = useCallback(() => {
    activeRef.current = false;
    flow.updateEdgeData(id, (edge) => ({ ...edge, midpoint: undefined }));
  }, [flow, id]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseup", handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  return (
    <>
      <BaseEdge id={id + "-a"} path={data?.midpoint ? manualPath : path} />
      {typeof data?.rate === "number" && (
        <EdgeLabelRenderer>
          <p
            onMouseDown={handleMouseDown}
            onDoubleClick={handleResetDrag}
            className="nopan bg-white px-2 py-1 border border-slate-300 rounded-sm"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelPosition.x}px, ${labelPosition.y}px)`,
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
