<script>
  import { onMount } from "svelte";
  import { consolidate, moveAll, moveToLimit, move } from "./scripts/utils.js";
  import Graph from "./scripts/Graph.js";
  const startingDPV = { D: 0, P: 13, V: 6 };
  let graph = new Graph(startingDPV);
  let returnedHomeWithJuice = false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function Driver() {
    let g = graph;
    if (!g.notEquals(g.currentNode.DPV, g.target)) {
      if (g.passes === 1) {
        returnedHomeWithJuice = true;
      } else {
        let temp = g.startingDPV;
        g.startingDPV = g.target;
        g.target = temp;
        g.passes++;
        graph = g;
        Driver();
      }
    } else {
      let possibleMoves = consolidate(
        moveAll(g.currentNode.DPV),
        moveToLimit(g.currentNode.DPV)
      );
      let updatedEdges = consolidate(g.currentNode.edges, possibleMoves);
      g.currentNode.edges = updatedEdges;

      let nextNode = null;

      // add nonexisting nodes to the network
      for (let i = 0; i < possibleMoves.length; i++) {
        let index = g.checkExist(possibleMoves[i]);
        if (index === null) {
          g.addNode(possibleMoves[i], []);
          nextNode = g.nodes[g.nodes.length - 1];
        }
      }

      if (nextNode == null) {
        // all possibleNodes exist in the network
        let index = g.findUnvisitedNode(possibleMoves);
        if (index !== null) {
          nextNode = g.nodes[index];
        }
      }

      if (nextNode === null) {
        nextNode = move(possibleMoves);
        let index = g.checkExist(nextNode);
        nextNode = g.nodes[index];
      }
      g.currentNode = nextNode;
      g.currentNode.visited = true;
      g.moves++;
			g.shortestPath();
      graph = g;
      await sleep(1000);
      Driver();
    }
  }

  onMount(() => {
    Driver();
  });
</script>

<style>
  td {
    text-align: center;
  }

  table {
    width: 100%;
    border-spacing: 30px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>

<h1>
  Current Node:
  {graph.currentNode.DPV.D}/{graph.currentNode.DPV.P}/{graph.currentNode.DPV.V}
</h1>
<h4>Total Moves: {graph.moves}</h4>
<h4>Total Nodes: {graph.nodes.length}</h4>
<h4>
  Ballon Juice Status:
  {graph.passes === 0 ? 'Da Juice is Loose!' : 'Acquired. Returning Home.'}
</h4>
{#if graph.passes === 1}
  <h4>Home Status: {returnedHomeWithJuice ? "I'm Home!" : 'Searching...'}</h4>
{/if}
<table>
  <thead>
    <tr>
      <th>DPV</th>
      <th>Neighbor #1</th>
      <th>Neighbor #2</th>
      <th>Neighbor #3</th>
      <th>Neighbor #4</th>
    </tr>
  </thead>
  <tbody>
    {#each graph.nodes as node}
      <tr>
        <td>{node.DPV.D}/{node.DPV.P}/{node.DPV.V}</td>
        {#each node.edges as edge}
          <td>{edge.D}/{edge.P}/{edge.V}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<h1>Shortest Path Matrix</h1>
<table>
  <thead>
    <tr>
      <th>DPV</th>
      {#each graph.pathMatrix[0] as ele}
        <th>{ele.DPV.D}/{ele.DPV.P}/{ele.DPV.V}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each graph.pathMatrix as arr, i}
      <tr>
			<td>{arr[i].DPV.D}/{arr[i].DPV.P}/{arr[i].DPV.V}</td>
				{#each arr as dpvAndValue, j}
					<td>{dpvAndValue.Val}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
