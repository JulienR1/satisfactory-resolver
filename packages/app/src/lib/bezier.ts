import { Position, XYPosition } from "@xyflow/react";

export function getSpline(
  points: [XYPosition, XYPosition, XYPosition],
  sourceOrientation: Position = Position.Bottom,
  targetOrientation: Position = Position.Top,
) {
  const deltaSource = 0.25 * norm(diff(points[0], points[1]));
  const deltaTarget = 0.25 * norm(diff(points[1], points[2]));

  const sourceControl = { x: points[0].x, y: points[0].y };
  switch (sourceOrientation) {
    case Position.Top:
      sourceControl.y -= deltaSource;
      break;
    case Position.Bottom:
      sourceControl.y += deltaSource;
      break;
    case Position.Left:
      sourceControl.x -= deltaSource;
      break;
    case Position.Right:
      sourceControl.x += deltaSource;
      break;
  }

  const targetControl = { x: points[2].x, y: points[2].y };
  switch (targetOrientation) {
    case Position.Top:
      targetControl.y -= deltaTarget;
      break;
    case Position.Bottom:
      targetControl.y += deltaTarget;
      break;
    case Position.Left:
      targetControl.x -= deltaTarget;
      break;
    case Position.Right:
      targetControl.x += deltaTarget;
      break;
  }

  const u = normalize(diff(points[0], points[1]));
  const v = normalize(diff(points[2], points[1]));

  const firstControl = add(points[1], mult(0.25 * distance(points[0], points[1]), diff(u, v)));
  const secondControl = diff(points[1], mult(0.25 * distance(points[1], points[2]), diff(u, v)));

  return `M ${points[0].x} ${points[0].y} C ${sourceControl.x} ${sourceControl.y}, ${firstControl.x} ${firstControl.y}, ${points[1].x} ${points[1].y} C ${secondControl.x} ${secondControl.y}, ${targetControl.x} ${targetControl.y}, ${points[2].x} ${points[2].y}`;
}

function norm({ x, y }: XYPosition) {
  return Math.sqrt(x * x + y * y);
}

function add(a: XYPosition, b: XYPosition) {
  return { x: a.x + b.x, y: a.y + b.y };
}

function diff(a: XYPosition, b: XYPosition) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function distance(a: XYPosition, b: XYPosition) {
  return norm(diff(a, b));
}

function mult(s: number, { x, y }: XYPosition) {
  return { x: s * x, y: s * y };
}

function normalize(v: XYPosition) {
  const n = norm(v);
  return { x: v.x / n, y: v.y / n };
}
