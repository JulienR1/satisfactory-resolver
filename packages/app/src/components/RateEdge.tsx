import { getSpline } from "@/lib/bezier";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useRef, useEffect, useMemo } from "react";
import { Node, Edge } from "./../lib/constants";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuItem,
} from "./ui/context-menu";
import { Locate, ShieldMinus, ShieldPlus } from "lucide-react";
import { throttle } from "@/lib/utils";

type RateEdgeProps = {
  id: string;
  source: string;
  target: string;
  sourceY: number;
  sourceX: number;
  targetX: number;
  targetY: number;
  data?: { rate: number; midpoint?: XYPosition; handleIndex?: number; consumeOverflow?: boolean };
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

  const handleMouseDown = useCallback((e: { button: number }) => {
    if (e.button === 0) {
      activeRef.current = true;
    }
  }, []);
  const handleMouseUp = useCallback(() => (activeRef.current = false), []);

  const handleMouseMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (activeRef.current) {
        throttle(
          "rate-edge-mouse-move",
          function () {
            const position = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
            flow.updateEdgeData(id, (edge) => ({ ...edge, midpoint: position }));
          },
          25,
        );
      }
    },
    [flow, id],
  );

  const handleResetDrag = useCallback(() => {
    activeRef.current = false;
    flow.updateEdgeData(id, (edge) => ({ ...edge, midpoint: undefined }));
  }, [flow, id]);

  const canBeOverflowed = useMemo(() => flow.getNode(target)?.type === "recipe", [flow, target]);

  const handleOverflowToggle = useCallback(() => {
    if (canBeOverflowed) {
      flow.updateEdgeData(id, (prev) => ({ consumeOverflow: !prev.data?.consumeOverflow }));
    }
  }, [id, flow, canBeOverflowed]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseup", handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  const sourceNode = flow.getNode(source)!;
  const overflowRate = sourceNode.data.production.available - sourceNode.data.production.requested;

  return (
    <>
      <BaseEdge
        id={id + "-a"}
        path={data?.midpoint ? manualPath : path}
        style={{ strokeWidth: data?.consumeOverflow ? 2 : 1 }}
      />
      {typeof data?.rate === "number" && (
        <EdgeLabelRenderer>
          <ContextMenu>
            <ContextMenuTrigger>
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
                {data?.consumeOverflow && (
                  <ShieldPlus
                    size="16"
                    className="absolute top-0 right-0 translate-x-1/2 fill-white -translate-y-1/3 stroke-indigo-800"
                  />
                )}
              </p>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem
                  className="flex items-center gap-2"
                  onSelect={handleOverflowToggle}
                  disabled={!canBeOverflowed || (overflowRate <= 0 && !data.consumeOverflow)}
                >
                  {data?.consumeOverflow ? (
                    <>
                      <ShieldMinus size="20" />
                      <span>Release overflow</span>
                    </>
                  ) : (
                    <>
                      <ShieldPlus size="20" />
                      <span>Consume overflow</span>
                      {overflowRate > 0 && <span className="text-xs">({overflowRate}/min)</span>}
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  className="flex items-center gap-2"
                  onSelect={handleResetDrag}
                  disabled={!data.midpoint}
                >
                  <Locate size="20" />
                  <span>Reset handle position</span>
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
