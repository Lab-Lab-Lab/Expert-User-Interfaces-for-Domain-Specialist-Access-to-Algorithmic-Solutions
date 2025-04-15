import './App.css'
import HorizontalFlow from './HorizontalFlow'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataReader from '../../algorithm-testing/src/data/io/data-reader'
import LinkedGraph from '../../algorithm-testing/src/dataStructures/LinkedGraph'
import SimulatedAnnealing from '../../algorithm-testing/src/solvers/simulated_annealing'
import { useState } from 'react';



function App() {
  const [solutionTree, setSolutionTree] = useState({ root: [] })

  async function choseCSV(data) {
    console.log(data)
    let profReader, stuReader;
    const profFile = data.get('prof');
    const stuFile = data.get('students');

    if (profFile.size === 0) {
      const profResponse = await fetch("prof_data.csv");
      const profText = await profResponse.text();
      profReader = new DataReader(profText);

      const stuResponse = await fetch("fake_data_realistic_0.csv");
      const stuText = await stuResponse.text();
      stuReader = new DataReader(stuText);

      console.log("Default professor data loaded.");
    } else {
      profReader = new DataReader(profFile);
      stuReader = new DataReader(stuFile);
    }

    const profData = (await profReader.ready()).data
    const stuData = (await stuReader.ready()).data

    console.log('Parsed Prof Data:', profData);
    console.log('Parsed Student Data:', stuData);

    const fullGraph = new LinkedGraph()
    const solGraph = new LinkedGraph()

    // Load data into the graph data structure
    profData.forEach((entry) => {
      fullGraph.addNode(entry["What times are you available to meet with Dr. Stewart? (please select all times that you are available)"])
      solGraph.addNode(entry["What times are you available to meet with Dr. Stewart? (please select all times that you are available)"])
    })

    let numStudents = 0
    stuData.forEach((entry) => {
      const id = entry['ID']?.toString(); // Ensure ID is treated as a string, even if it's 0
      if (!id) {
        console.warn('Skipping entry with missing or invalid ID:', entry);
        return;
      }

      fullGraph.addNode(id);
      solGraph.addNode(id);
      numStudents++;

      const times = entry["What times are you available to meet with Dr. Stewart? (please select all times that you are available)"]?.split(';') || [];
      times.forEach((time) => {
        if (!time) return;
        fullGraph.addEdge(id, time);
      });
    })

    // debugger

    console.log(fullGraph)

    function score(graph) {
      score = 0
      for (let i = 0; i < numStudents; i++) {
        if (graph.getNeighbors(i.toString()).length > 0) {
          score += 100
        }
      }
      return score
    }

    function neighbor(graph) {
      const randomStudent = Math.floor(Math.random() * numStudents);
      let connection = graph.getNeighbors(randomStudent.toString());

      if (connection.length > 0) {
        connection = connection[0];
        // Delete the edge
        graph.removeEdge(randomStudent.toString(), connection);

        // Try to find an alternate edge to connect to
        const potentialConnections = fullGraph.getNeighbors(randomStudent.toString());
        for (const node of potentialConnections) {
          if (
            node !== connection &&
            graph.getNeighbors(node).length === 0 // Ensure the target node has no connections
          ) {
            graph.addEdge(randomStudent.toString(), node);
            return graph;
          }
        }
      } else {
        // Try to find an open node and add an edge
        const potentialConnections = fullGraph.getNeighbors(randomStudent.toString());
        for (const node of potentialConnections) {
          if (graph.getNeighbors(node).length === 0) {
            graph.addEdge(randomStudent.toString(), node);
            return graph;
          }
        }
      }

      // If no valid connection is found, do nothing
      return graph;
    }

    function temperature(percentCompleted) {
      return 10000 * 0.95 ^ percentCompleted;
    }

    const solver = new SimulatedAnnealing(solGraph, 1000000, temperature, neighbor, score)
    solver.optimize()
    console.log(solver.best_solution)
    setSolutionTree({
      ...solutionTree,
      root: [
        ...solutionTree.root,
        solver.best_solution
      ]
    })
  }

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>

        <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Form action={choseCSV}>
              <Row>
                <Col xs="auto">
                  <h4>Professor Data</h4>
                </Col>
                <Col xs="auto">
                  <Form.Control
                    type="file"
                    className=" mr-sm-2"
                    name='prof'
                  />
                </Col>
                <Col xs="auto">
                  <h4>Student Data</h4>
                </Col>
                <Col xs="auto">
                  <Form.Control
                    type="file"
                    className=" mr-sm-2"
                    name='students'
                  />
                </Col>
                <Col xs="auto">
                  <Button type="submit">Submit</Button>
                </Col>
              </Row>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <div style={{ height: 'calc(100vh - 54px)' }}>
          <HorizontalFlow solutionTree={solutionTree}></HorizontalFlow>
        </div>
      </div>
    </>
  )
}

export default App
