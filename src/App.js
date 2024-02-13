import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTableComponent from "./DataTable";
import Plot from "plotly.js";

const Dashboard = () => {
  const [theme, setTheme] = useState("light");

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.className = `theme-${newTheme}`;
  };
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "DOB",
      selector: (row) => row.birthDate,
      sortable: true,
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true,
    },
   
  ];
  const countAgeCategories = (users) =>
    users.reduce(
      (counts, user) => {
        if (user.age <= 12) counts.Kids++;
        else if (user.age <= 19) counts.Teens++;
        else if (user.age <= 40) counts.Adult++;
        else counts.Old++;
        return counts;
      },
      { Kids: 0, Teens: 0, Adult: 0, Old: 0 }
    );
  useEffect(() => {
    const fetchData = async () => {
      if (data.length === 0) {
        const response = await fetch("https://dummyjson.com/users?limit=100");
        const responseData = await response.json();
        const { users } = responseData;
        setData(users);
      }
    };

    fetchData();
  }, [data]);

  const handleRowSelect = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  useEffect(() => {
    const selectedData = countAgeCategories(selectedRows);
    const data = [
      {
        x: Object.keys(selectedData),
        y: Object.values(selectedData),
        type: "bar",
      },
    ];

    const layout = {
      title: "Age Category Distribution",
      xaxis: { title: "Age Category" },
      yaxis: { title: "Count" },
    };

    Plot.newPlot("chart", data, layout);
  }, [selectedRows]);

  return (
    <>
      <Navbar bg={theme} variant={theme} expand="lg">
        <Container>
          <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
            <Nav.Link
              onClick={switchTheme}
              className={theme === "light" ? "text-dark" : "text-light"}
            >
              {theme === "light" ? "Light Theme" : "Dark Theme"}
            </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col sm={12} md={6}>
            <DataTableComponent
              data={data}
              columns={columns}
              selectedRows={selectedRows}
              onSelectRow={handleRowSelect}
            />
          </Col>
          <Col sm={12} md={6}>
            <div as={Col} id="chart"></div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
