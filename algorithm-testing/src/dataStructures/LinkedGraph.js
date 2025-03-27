export default class LinkedGraph {
    constructor() {
        this.nodes = new Map(); // Map to store nodes by their unique identifiers
    }

    addNode(id) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, new Set()); // Each node points to a set of connected nodes
        }
    }

    addEdge(fromId, toId) {
        if (!this.nodes.has(fromId) || !this.nodes.has(toId)) {
            throw new Error("Both nodes must exist before adding an edge.");
        }
        this.nodes.get(fromId).add(toId); // Add a directed edge from 'fromId' to 'toId'
        this.nodes.get(toId).add(toId); // Add a directed edge from 'toId' to 'fromId'
    }

    removeEdge(fromId, toId) {
        if (this.nodes.has(fromId)) {
            this.nodes.get(fromId).delete(toId); // Remove the directed edge
        }
        
        if (this.nodes.has(toId)) {
            this.nodes.get(toId).delete(fromId); // Remove the directed edge
        }
    }

    removeNode(id) {
        if (this.nodes.has(id)) {
            this.nodes.delete(id); // Remove the node itself
            for (const [nodeId, edges] of this.nodes) {
                edges.delete(id); // Remove all edges pointing to this node
            }
        }
    }

    getNeighbors(id) {
        if (!this.nodes.has(id)) {
            throw new Error("Node does not exist.");
        }
        return Array.from(this.nodes.get(id)); // Return neighbors as an array
    }

    hasEdge(fromId, toId) {
        return this.nodes.has(fromId) && this.nodes.get(fromId).has(toId);
    }
}
