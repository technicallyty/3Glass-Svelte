// const D_MAX = 19;
// const P_MAX = 13;
// const V_MAX = 7;

class Graph {
  constructor(DPV) {
    this.startingDPV = { D: 0, P: 13, V: 6 };
    this.nodes = [
      {
        DPV,
        edges: [],
        visited: true,
      },
    ];
    this.currentNode = this.nodes[0];
    this.target = {D: 3, P: 13, V: 3}
    this.pathMatrix = [[]];
    this.moves = 0;
    this.passes = 0;
    this.shortestPath();
  }

  addNode(DPV, edges) {
    this.nodes.push({
      DPV,
      edges,
      visited: false
    });
  }

  checkExist(dpv) {
    // check if node exists, returning its index otherwise returning null
    for (let i = 0; i < this.nodes.length; ++i) {
      let node = this.nodes[i].DPV;
      if (node.D === dpv.D && node.P === dpv.P && node.V === dpv.V) {
        return i;
      }
    }
    return null;
  }

  addEdge(dpv) {
    let index = this.checkExist(dpv);
    if (index !== null) {
      this.nodes[index].edges.push(dpv);
    }
  }

  notEquals(dpv1, dpv2) {
    if (dpv1.D === dpv2.D && dpv1.P === dpv2.P && dpv1.V === dpv2.V) {
      return false;
    }
    return true;
  }

  // finds an unvisited node and returns its index, otherwise null
  findUnvisitedNode(nodeSet) { 
    for(let i = 0; i < nodeSet.length; i++) {
      let index = this.checkExist(nodeSet[i]);
      if(index !== null) {  // it exists in the set
        if(this.nodes[index].visited === false) {
          return index;
        }
      }
    }
    return null;
  }

  checkequal(node1, node2) {
    if (node1.D === node2.D && node1.P === node2.P && node1.V === node2.V) {
      return true;
    }
    return false;
  }

  shortestPath() {
    var adjacencymatrix = [];
    var node_list = [];
    for (let i = 0; i < this.nodes.length; i++) {
      node_list.push({ DPV: this.nodes[i].DPV, Val: 9999 });
    }

    for (let i = 0; i < this.nodes.length; i++) {
      let nodes_ajacent = JSON.parse(JSON.stringify(node_list));

      for (let j = 0; j < nodes_ajacent.length; j++) {
        if (this.checkequal(this.nodes[i].DPV, nodes_ajacent[j].DPV)) {
          // console.log("true");
          nodes_ajacent[j].Val = 0; // index is current node so set distance to 0
        }
        for (let x = 0; x < this.nodes[i].edges.length; x++) {
          if (this.checkequal(this.nodes[i].edges[x], nodes_ajacent[j].DPV)) {
            nodes_ajacent[j].Val = 1; // it is 1 from the current node
          }
        }
      }

      adjacencymatrix.push(nodes_ajacent);
    }

    var path = JSON.parse(JSON.stringify(adjacencymatrix));
    var cost = JSON.parse(JSON.stringify(adjacencymatrix));

    let adjacencymatrix_length = adjacencymatrix.length;

    for (let k = 0; k < adjacencymatrix_length; k++) {
      for (let v = 0; v < adjacencymatrix_length; v++) {
        for (let u = 0; u < adjacencymatrix_length; u++) {
          if (
            cost[v][k].Val !== 9999 &&
            cost[k][u].Val !== 9999 &&
            cost[v][k].Val + cost[k][u].Val < cost[v][u].Val
          ) {
            cost[v][u].Val = cost[v][k].Val + cost[k][u].Val;
            path[v][u].Val = path[k][u].Val;
          }
        }
      }
    }

    this.pathMatrix = cost;
  }
}

export default Graph;
