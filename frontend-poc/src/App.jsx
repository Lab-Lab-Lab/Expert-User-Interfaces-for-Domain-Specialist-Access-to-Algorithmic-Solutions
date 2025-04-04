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
    // if (!data.get('prof')){
      const prof_text = await (await fetch("prof_data.csv")).text()
      console.log(prof_text)
    // }

    const profReader = new DataReader(data.get('prof'));
    const stuReader = new DataReader(data.get('students'));

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
          {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Form action={choseCSV}>
              <Row>
                <Col xs="auto">
                  <Form.Label>Prof</Form.Label>
                  <Form.Control
                    type="file"
                    className=" mr-sm-2"
                    name='prof'
                  /></Col>
                <Col xs="auto">
                  <Form.Label>Students</Form.Label>
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
            {/* <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav> */}
          </Navbar.Collapse>
        </Navbar>
        <HorizontalFlow solutionTree={solutionTree}></HorizontalFlow>
      </div>
    </>
  )
}

export default App
