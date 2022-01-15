import React from "react";
import { Table } from "react-bootstrap";

const ClientTable = ({ clients }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Forename</th>
          <th>Middle names</th>
          <th>Surname</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, i) => (
        <tr key={i}>
          <td>{client.id}</td>
          <td>{client.forename}</td>
          <td>{client.middle_names}</td>
          <td>{client.surname}</td>
          <td>{client.gender}</td>
          <a href={'/dashboard/' + client.id}>View</a>
        </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ClientTable;
