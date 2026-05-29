import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { useStrategyMap } from '../../hooks/useStrategyMap.js'
import { useStrategyStore } from '../../store/strategyStore.js'
import { ObjectiveNode } from './ObjectiveNode.jsx'
import { ObjectiveDetail } from './ObjectiveDetail.jsx'
import { PERSPECTIVES } from '../../constants/bsc.js'

const nodeTypes = { objectiveNode: ObjectiveNode }

const LANE_HEIGHT = 200
const LANE_Y = { financial: 660, customer: 440, internal: 220, learning: 0 }

export function StrategyMapCanvas() {
  const { nodes: initNodes, edges: initEdges } = useStrategyMap()
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes)
  const [edges, , onEdgesChange] = useEdgesState(initEdges)
  const { selectedObjectiveId, selectObjective, clearSelection, updateObjectivePosition } = useStrategyStore()

  function onNodeClick(_, node) {
    selectObjective(node.id)
  }

  function onNodeDragStop(_, node) {
    updateObjectivePosition(node.id, node.position)
  }

  return (
    <div className="w-full h-full relative bg-slate-50">
      {/* Lane labels on left */}
      <div className="absolute left-0 top-0 bottom-0 z-10 w-8 flex flex-col justify-end pointer-events-none" style={{ paddingBottom: 0 }}>
        {PERSPECTIVES.map(p => (
          <div
            key={p.id}
            className="flex items-center justify-center"
            style={{ height: LANE_HEIGHT, backgroundColor: `${p.color}15`, borderRight: `2px solid ${p.color}30` }}
          >
            <span className="text-xs font-bold writing-mode-vertical" style={{ color: p.color, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: 1 }}>
              {p.label}
            </span>
          </div>
        ))}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={clearSelection}
        nodeTypes={nodeTypes}
        fitView
        className="ml-8"
        minZoom={0.3}
        maxZoom={1.5}
      >
        {/* Lane backgrounds */}
        {PERSPECTIVES.map(p => (
          <div
            key={p.id}
            className="absolute w-full pointer-events-none"
            style={{
              top: LANE_Y[p.id],
              height: LANE_HEIGHT,
              backgroundColor: `${p.color}08`,
              borderBottom: `1px dashed ${p.color}30`,
            }}
          />
        ))}
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={node => node.data?.perspective?.color ?? '#94a3b8'}
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
        />
      </ReactFlow>

      {/* Detail panel */}
      {selectedObjectiveId && (
        <ObjectiveDetail objectiveId={selectedObjectiveId} onClose={clearSelection} />
      )}
    </div>
  )
}
