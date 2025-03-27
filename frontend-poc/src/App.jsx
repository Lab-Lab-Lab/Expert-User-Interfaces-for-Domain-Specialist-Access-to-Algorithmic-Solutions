import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HorizontalFlow from './HorizontalFlow'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataReader from '../../algorithm-testing/src/data/io/data-reader'
import LinkedGraph from '../../algorithm-testing/src/dataStructures/LinkedGraph'
import SimulatedAnnealing from '../../algorithm-testing/src/solvers/simulated_annealing'



function App() {

  function choseCSV(data) {
    console.log(data)
    const profReader = new DataReader(data.get('prof'));
    const stuReader = new DataReader(data.get('students'));
    

    // Wait for the file to be parsed asynchronously
    setTimeout(() => {
      console.log('Parsed Prof Data:', profReader.parsedData);
      console.log('Parsed Student Data:', stuReader.parsedData);
    }, 1000); // Adjust the timeout as needed

    const fullGraph = new LinkedGraph()
    const solGraph = new LinkedGraph()

    // Load data into the graph data structure
    profReader.parsedData.forEach((entry) => {
      fullGraph.addNode(entry.get('"What times are you available to meet with Dr. Stewart? (please select all times that you are available)"'))
      solGraph.addNode(entry.get('"What times are you available to meet with Dr. Stewart? (please select all times that you are available)"'))
    })

    numStudents = 0
    stuReader.parsedData.forEach((entry) => {
      const id = entry.get('id')
      fullGraph.addNode(id)
      solGraph.addNode(id)
      numStudents++

      const times = entry.get('"What times are you available to meet with Dr. Stewart? (please select all times that you are available)"').split(';')
      times.forEach((time) => {
        fullGraph.addEdge(id, time)
      })
    })

    function score(graph) {
      score = 0
      for (let i = 0; i < numStudents; i++) {
        if (graph.getNeighbors(i).length > 0) {
          score += 100
        }
      }
      return score
    }

    function neighbor(graph) {
      randomStudent = Math.floor(Math.random() * (numStudents));
      connection = graph.getNeighbors(randomStudent)
      if (connection.length > 0) {
        connection = graph.connection[0]
        // Delete the edge
        graph.removeEdge(randomStudent, connection)

        // Try to find an alternate edge to connect to, if not do nothing
        potentialConnections = fullGraph.getNeighbors(randomStudent)
        potentialConnections.some((node) => {
          if (node != connection && graph.getNeighbors(node).length == 0) {
            graph.addEdge(randomStudent, node)
            return true;
          }
        })
      } else {
        success = false
        // Try to find an open node, if one exists and add an edge
        potentialConnections = fullGraph.getNeighbors(randomStudent)
        potentialConnections.some((node) => {
          if (graph.getNeighbors(node).length == 0) {
            graph.addEdge(randomStudent, node)
            success = true
            return true
          }
        })
        // Otherwise try again
        if (!success) {
          neighbor(graph)
        }
      } 

      return graph
    }

    function temperature(percentCompleted) {
      return 10000 * 0.95^percentCompleted;
    }

    const solver = new SimulatedAnnealing(solGraph, 100, temperature, neighbor, score)
    solver.optimize()
    console.log(solver.best_solution)
  }

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>

        <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
          {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Form inline action={choseCSV}>
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
        <HorizontalFlow></HorizontalFlow>
      </div>
    </>
  )
}

export default App
