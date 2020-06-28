/*
 * Copyright (c) 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EdgeDefinition, ElementsDefinition, NodeDataDefinition, NodeDefinition, Stylesheet } from 'cytoscape'


export namespace SplineLineageGraph {

    export type GraphEdge = EdgeDefinition

    export type GraphNode<TData extends NodeDataDefinition = NodeDataDefinition> =
        & NodeDefinition
        &
        {
            data: TData
        }

    export type GraphData<TNodeData extends NodeDataDefinition = NodeDataDefinition> =
        & ElementsDefinition
        &
        {
            nodes: GraphNode<TNodeData>[]
            edges: GraphEdge[]
        }

    export const LINE_WIDTH_PLANE = 10
    export const LINE_WIDTH_HIGHLIGHTED = 0
    export const LINE_WIDTH_SELECTED = 10
    export const LINE_COLOR_PLANE = '#ccc'
    export const LINE_COLOR_SELECTED = 'orange'
    export const LINE_COLOR_HLT_PRIMARY = 'black'
    export const LINE_COLOR_HLT_LINEAGE = 'magenta'
    export const LINE_COLOR_HLT_IMPACT = 'green'
    export const LINE_COLOR_HLT_NONE = '#7a7a7d'

    export const selectedNodeStyles = {
        'border-color': LINE_COLOR_SELECTED,
        'border-width': LINE_WIDTH_SELECTED,
        padding: 0,
    }

    export const DEFAULT_STYLES: ReadonlyArray<Stylesheet> = [
        {
            selector: 'core',
            style: {
                'active-bg-size': 0,
            },
        } as Stylesheet,
        {

            selector: 'node',
            style: {
                'background-color': '#ffffff',
                'border-color': LINE_COLOR_HLT_NONE,
                'border-width': LINE_WIDTH_HIGHLIGHTED,
                padding: 0, // that settings is not a part of the Stylesheet for now (it is a bug and it will be fixed in the future).
                shape: 'round-rectangle',
                'background-opacity': 0,
                width: '350px',
                height: '80px'
            },
        } as Stylesheet,
        {
            selector: 'node:selected',
            style: {
                ...selectedNodeStyles,
            },
        } as Stylesheet,
        {
            selector: 'node.hlt_prim',
            style: {
                'border-color': LINE_COLOR_HLT_PRIMARY,
                'border-width': LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'node.hlt_prim:selected',
            style: {
                ...selectedNodeStyles,
            },
        },
        {
            selector: 'node.hlt_lin',
            style: {
                'border-color': LINE_COLOR_HLT_LINEAGE,
                'border-width': LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'node.hlt_lin:selected',
            style: {
                ...selectedNodeStyles,
            },
        },
        {
            selector: 'node.hlt_imp',
            style: {
                'border-color': LINE_COLOR_HLT_IMPACT,
                'border-width': LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'node.hlt_imp:selected',
            style: {
                ...selectedNodeStyles,
            },
        },
        {
            selector: 'node.hlt_none',
            style: {
                'border-color': LINE_COLOR_HLT_NONE,
                'border-width': LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'node.hlt_none:selected',
            style: {
                ...selectedNodeStyles,
            },
        },
        {
            selector: 'edge',
            style: {
                'line-color': LINE_COLOR_PLANE,
                'target-arrow-color': LINE_COLOR_PLANE,
                width: LINE_WIDTH_PLANE,
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
            },
            css: {
                label: (el) => el.data('label') || '',
                'curve-style': 'bezier',
            },
        },
        {
            selector: 'edge.hlt_prim',
            style: {
                'line-color': LINE_COLOR_HLT_PRIMARY,
                'target-arrow-color': LINE_COLOR_HLT_PRIMARY,
                width: LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'edge.hlt_lin',
            style: {
                'line-color': LINE_COLOR_HLT_LINEAGE,
                'target-arrow-color': LINE_COLOR_HLT_LINEAGE,
                width: LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'edge.hlt_imp',
            style: {
                'line-color': LINE_COLOR_HLT_IMPACT,
                'target-arrow-color': LINE_COLOR_HLT_IMPACT,
                width: LINE_WIDTH_HIGHLIGHTED,
            },
        },
        {
            selector: 'edge.hlt_none',
            style: {
                'line-color': LINE_COLOR_HLT_NONE,
                'target-arrow-color': LINE_COLOR_HLT_NONE,
                width: LINE_WIDTH_HIGHLIGHTED,
            },
        },
    ]

    export const DEFAULT_LAYOUT: cytoscape.LayoutOptions = {
        name: 'klay',
        nodeDimensionsIncludeLabels: false,
        fit: true, // Whether to fit
        padding: 40, // Padding on fit
        animate: false, // Whether to transition the node positions
        animateFilter: function(node, i) {
            return true
        },
        // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
        animationDuration: 800, // Duration of animation in ms if enabled
        animationEasing: 'cubic-bezier(.85,.19,.07,.58)', // Easing of animation if enabled
        // A function that applies a transform to the final node position
        transform: function(node, pos) {
            return pos
        },
        ready: undefined, // Callback on layoutready
        stop: undefined, // Callback on layoutstop
        klay: {
            // Following descriptions
            // taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
            addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
            aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
            borderSpacing: 20, // Minimal amount of space to be left to the border
            compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
            crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
            /*
                LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers,
                trying to find node orderings that minimize the number of crossings.
                The algorithm uses randomization to increase the odds of finding a good result.
                To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done.
                The Randomization seed also influences results. INTERACTIVE Orders the nodes of each layer by comparing their positions
                before the layout algorithm was started. The idea is that the relative order of nodes as it was before
                layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph
                before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option
                to determine which reference point of nodes are used to compare positions.
            */
            // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break
            // the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will
            // point left if edges usually point right).
            cycleBreaking: 'GREEDY',
            /*
                GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
                INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph.
                This requires node and port coordinates to have been set to sensible values.
            */
            direction: 'DOWN', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
            // direction: 'RIGHT', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
            /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
            edgeRouting: 'SPLINES', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
            edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
            feedbackEdges: true, // Whether feedback edges should be highlighted by routing around the nodes.
            // Tells the BK node placer to use a certain alignment instead of taking the optimal result.
            // This option should usually be left alone.
            fixedAlignment: 'NONE',
            /*
                NONE Chooses the sTmallest layout from the four possible candidates.
                LEFTUP Chooses the left-up candidate from the four possible candidates.
                RIGHTUP Chooses the right-up candidate from the four possible candidates.
                LEFTDOWN Chooses the left-down candidate from the four possible candidates.
                RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
                BALANCED Creates a balanced layout from the four possible candidates.
            */
            inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
            layoutHierarchy: true, // Whether the selected layouter should consider the full hierarchy
            linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
            mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
            // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
            mergeHierarchyCrossingEdges: true,
            nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
            /*
                NETWORK_SIMPLEX This algorithm tries to minimize the length of edges.
                This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a
                result yet can be set with the Maximal Iterations option.
                LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
                INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started.
                The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed.
                This of course requires valid positions for all nodes to have been set on the input graph before calling the layout
                algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which
                reference point of nodes are used to compare positions.
            */
            nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
            /*
                BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are
                usually higher than diagrams drawn with other algorithms.
                LINEAR_SEGMENTS Computes a balanced placement.
                INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to
                infer their coordinates. Requires the other interactive phase implementations to have run as well.
                SIMPLE Minimizes the area at the expense of... well, pretty much everything else.
            */
            // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
            randomizationSeed: 1,
            routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
            separateConnectedComponents: true, // Whether each connected component should be processed separately
            spacing: 150, // Overall setting for the minimal amount of space to be left between objects
            thoroughness: 8, // How much effort should be spent to produce a nice layout..
        },
        priority: function(edge) {
            return null
        }, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
    } as cytoscape.LayoutOptions

    export const DEFAULT_OPTIONS: cytoscape.CytoscapeOptions = Object.freeze<cytoscape.CytoscapeOptions>({
        layout: DEFAULT_LAYOUT,
        style: DEFAULT_STYLES as Stylesheet[],
        minZoom: 0.5,
        maxZoom: 1.5,
    })
}
