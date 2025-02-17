import '@xyflow/react/dist/style.css'

import { Node, Edge, Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from "@xyflow/react"
import { Overlay } from './Overlay'

const nodes: Node[] = []
const edges: Edge[] = []

function App() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Overlay />

            <ReactFlow nodes={nodes} edges={edges} >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    )
}

export default App
