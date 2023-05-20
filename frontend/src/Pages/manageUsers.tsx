import React, { useState } from "react";
import { Container, Button, ListGroup, Row } from "react-bootstrap";
import DeleteModal from "../Component/deleteModal";

function ManageUsers({ navigate }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {};

  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const handleDelete = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div
      className="container justify-content-center"
      style={{ padding: "20px" }}
    >
      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <Container>
          <ListGroup>
            {items.map((item, index) => (
              <ListGroup.Item className="d-flex" key={index}>
                <div
                  className="ms-2 me-auto"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {item}
                </div>
                <Button
                  variant="outline-danger"
                  onClick={() => setDeleteModalShow(true)}
                  //   onClick={() => handleDelete(1)}
                >
                  Delete
                </Button>

                {/* <DeleteModal
                  show={deleteModalShow}
                  onHide={() => setDeleteModalShow(false)}
                /> */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
        <DeleteModal
          show={deleteModalShow}
          onHide={() => setDeleteModalShow(false)}
        />
      </div>
    </div>
  );
}

export default ManageUsers;
