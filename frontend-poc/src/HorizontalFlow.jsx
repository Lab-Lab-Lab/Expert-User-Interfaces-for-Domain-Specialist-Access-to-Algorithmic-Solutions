// https://reactflow.dev/examples/layout/horizontal

import React, { useCallback, useState, useEffect } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  // {
  //   id: 'horizontal-1',
  //   sourcePosition: 'right',
  //   type: 'input',
  //   data: { label: 'Input' },
  //   position: { x: 0, y: 80 },
  // },
  // {
  //   id: 'horizontal-2',
  //   sourcePosition: 'right',
  //   targetPosition: 'left',
  //   data: { label: 'A Node' },
  //   position: { x: 250, y: 0 },
  // },
  // {
  //   id: 'horizontal-3',
  //   sourcePosition: 'right',
  //   targetPosition: 'left',
  //   data: { label: 'Node 3' },
  //   position: { x: 250, y: 160 },
  // },
  // {
  //   id: 'horizontal-4',
  //   sourcePosition: 'right',
  //   targetPosition: 'left',
  //   data: { label: 'Node 4' },
  //   position: { x: 500, y: 0 },
  // },
  // {
  //   id: 'horizontal-5',
  //   sourcePosition: 'top',
  //   targetPosition: 'bottom',
  //   data: { label: 'Node 5' },
  //   position: { x: 500, y: 100 },
  // },
  // {
  //   id: 'horizontal-6',
  //   sourcePosition: 'bottom',
  //   targetPosition: 'top',
  //   data: { label: 'Node 6' },
  //   position: { x: 500, y: 230 },
  // },
  // {
  //   id: 'horizontal-7',
  //   sourcePosition: 'right',
  //   targetPosition: 'left',
  //   data: { label: 'Node 7' },
  //   position: { x: 750, y: 50 },
  // },
  // {
  //   id: 'horizontal-8',
  //   sourcePosition: 'right',
  //   targetPosition: 'left',
  //   data: { label: 'Node 8' },
  //   position: { x: 750, y: 300 },
  // },
];

const initialEdges = [
  // {
  //   id: 'horizontal-e1-2',
  //   source: 'horizontal-1',
  //   type: 'smoothstep',
  //   target: 'horizontal-2',
  //   animated: true,
  // },
  // {
  //   id: 'horizontal-e1-3',
  //   source: 'horizontal-1',
  //   type: 'smoothstep',
  //   target: 'horizontal-3',
  //   animated: true,
  // },
  // {
  //   id: 'horizontal-e1-4',
  //   source: 'horizontal-2',
  //   type: 'smoothstep',
  //   target: 'horizontal-4',
  //   label: 'edge label',
  // },
  // {
  //   id: 'horizontal-e3-5',
  //   source: 'horizontal-3',
  //   type: 'smoothstep',
  //   target: 'horizontal-5',
  //   animated: true,
  // },
  // {
  //   id: 'horizontal-e3-6',
  //   source: 'horizontal-3',
  //   type: 'smoothstep',
  //   target: 'horizontal-6',
  //   animated: true,
  // },
  // {
  //   id: 'horizontal-e5-7',
  //   source: 'horizontal-5',
  //   type: 'smoothstep',
  //   target: 'horizontal-7',
  //   animated: true,
  // },
  // {
  //   id: 'horizontal-e6-8',
  //   source: 'horizontal-6',
  //   type: 'smoothstep',
  //   target: 'horizontal-8',
  //   animated: true,
  // },
];

function solutionToNode(soln, id) {
  console.log(soln, id)
  let solution = {}
  solution.data = {
    label: `Solution with ${soln.nodes.size} keys`,
  }
  solution.id = `solution-${id}`
  solution.position = {
    x: id * 400,
    y: 0
  }

  let children = Array.from(soln.nodes.keys()).map((node, i) => {
    return {
      id: `${solution.id}-${i}`,
      parentId: solution.id,
      data: {
        label: node
      },
      position: {
        x: 0,
        y: i * 80
      }
    }
  })

  console.log('react-flow-ified solution object', solution)
  return [solution, ...children];
}


function solutionMapper(solns) {
  const result = {}
  solns.forEach((sol, i) => {
    result[`solution-${i}`] = sol
  })
  return result;
}

const HorizontalFlow = (solutionTree) => {
  console.log('solutiontree', solutionTree)
  // {
  //   id: 'horizontal-1',
  //   sourcePosition: 'right',
  //   type: 'input',
  //   data: { label: 'Input' },
  //   position: { x: 0, y: 80 },
  // },
  // const initialNode =
  let initialNode = solutionTree?.solutionTree?.root?.[0] ?? {}
  initialNode.data = {
    label: 'first solution',
  }
  initialNode.id = 'solution-0'
  initialNode.position = {
    x: 0, y: 80
  }
  const innerData = solutionTree?.solutionTree?.root?.[0]?.nodes;
  console.log('innerdata', innerData)
  if (innerData) {
    initialNode.solnodes = innerData
  }
  // let testNode = {
  //   id: 'horizontal-2',
  //   // sourcePosition: 'right',
  //   // targetPosition: 'left',
  //   data: { label: 'A Node' },
  //   position: { x: 250, y: 0 },
  // }
  const [dataMap, setDataMap] = useState(solutionMapper(solutionTree?.solutionTree?.root ?? []))

  function flowEdges(solns) {
    const theseEdges =  solns.flatMap((sol, i) => {

      const edges = [];
      const arrayified = Array.from(sol.nodes.keys());
      for (let j =0; j< arrayified.length; j++) {
        const k = arrayified[j]
        console.log('arrayified, i, j, k, soln', arrayified, i, j, k, sol)
        const v = sol.nodes.get(k)
        if (v.size) {
          edges.push({
            // type: 'smoothstep',
            id: `soln-${i}--edge-${j}-${arrayified.findIndex(e => e === Array.from(v.values())[0]) }`,
            source: `solution-${i}-${j}`,
            // animated: true,
            target: `solution-${i}-${arrayified.findIndex(e=>e===Array.from(v.values())[0])}`,
            label: `${k} --> ${Array.from(v.values())[0]}`
          })
        }
      }
      return edges
    })
    console.log('theseEdges', theseEdges)
    return theseEdges
  }

  // const [nodes, _, onNodesChange] = useNodesState([initialNode]);
  const adjustNodes = solutionTree?.solutionTree?.root?.flatMap(solutionToNode)
  console.log('adjustNodes', adjustNodes)
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // Start with an empty array

  console.log('nodes', nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  useEffect(() => {
    if (adjustNodes) {
      setNodes(adjustNodes); // Update the nodes state when adjustNodes changes
    }
    setEdges(flowEdges(solutionTree?.solutionTree?.root ?? []))
  }, [solutionTree]); // Dependency array ensures this runs when adjustNodes changes

const onConnect = useCallback(
  (params) => setEdges((els) => addEdge(params, els)),
  [],
);

  console.log('edges', edges)

return (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onConnect={onConnect}
    fitView
    attributionPosition="bottom-left"
    style={{ backgroundColor: "#F7F9FB", height: "300px" }}
  >
    <Background />
  </ReactFlow>
);
};

export default HorizontalFlow;