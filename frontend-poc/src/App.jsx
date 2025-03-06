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



function App() {

  function choseCSV(data) {
    console.log('mike check', data)
    console.log(data.get('prof'))
  }

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>

        <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
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
            <Nav className="me-auto">
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <HorizontalFlow></HorizontalFlow>
      </div>
    </>
  )
}

export default App
