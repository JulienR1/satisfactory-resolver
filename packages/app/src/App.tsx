import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from "@xyflow/react"
import { recipes } from "./resources";

import '@xyflow/react/dist/style.css'

console.log(recipes)

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function App() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow nodes={initialNodes} edges={initialEdges} >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    )
}

export default App
