import React from "react";
import { Card } from "react-bootstrap";

const ClientCard = ({ client }) => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{client.name}</Card.Title>
      </Card.Body>
      <Card.Footer className="text-center text-muted">"Click here"</Card.Footer>
    </Card>
  );
};

export default ClientCard;
