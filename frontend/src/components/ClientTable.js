import React from "react";
import { Table } from "react-bootstrap";

const ClientTable = ({ clients }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client, i) => (
        <tr key={i}>
          <td>{client.id}</td>
          <td>{client.name}</td>
        </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ClientTable;
