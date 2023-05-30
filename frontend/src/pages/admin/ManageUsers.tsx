import React, { useState, useEffect } from "react";
import { Container, Button, ListGroup, Row, Table, Alert } from "react-bootstrap";
import DeleteModal from "../../component/utils/DeleteModal";
import myApi from "../../service/MyApi";
import User, { LoginResponse } from "../../model/Interfaces/User";
import { CurrentUser, currentUser } from "../../model/User.model";

function ManageUsers() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [managedUsers, setManagedUsers] = useState<CurrentUser[]>([]);
  const [userToDelete, setUserToDelete] = useState<CurrentUser | null>(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [variant, setVariant] = useState('');


  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const userResult = await myApi.getUsers();
    if (userResult.success) {
      const filtered = (userResult.data as CurrentUser[]).filter((user) => {
        const u = new CurrentUser();
        u.setUser(user);
        return (u.university.id === currentUser.university.id) && !u.isAdmin;
      });
      console.log("[ManageUser] data:", filtered);
      setManagedUsers(filtered);
    } else {
      // Handle error
      console.log("[ManageUser] getUsers failed: " + userResult.msg);
    }
  }

  const deleteUser = async (userToDelete) => {
    const result = await myApi.deleteUser(userToDelete.id);

    console.log("[ManageUsers] delete user result", result)
    if (result) {
      setVariant("danger")
      setAlertMsg("Failed to delete. " + result.msg)
      setAlertShow(true)
    } else {
      console.log("[Manage User]: deleteUser", userToDelete);
      const updatedUsers = managedUsers.filter((user) => user.id !== userToDelete.id);
      setManagedUsers(updatedUsers);
      setVariant("success")
      setAlertMsg("Delete success!")
      setAlertShow(true)
    }
    setUserToDelete(null);
    setDeleteModalShow(false);
  };

  const alert = () => {
    if (alertShow) {
      return (
        <Alert variant={variant} onClose={() => setAlertShow(true)} dismissible>
          {alertMsg}
        </Alert>);
    }
  }

  return (
    <div
      className="container justify-content-center"
      style={{ padding: "20px" }}>

      {alert()}

      <Container>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th colSpan={5}>Username</th>

              <th>Operater</th>
            </tr>
          </thead>
          {managedUsers.map((user, index) => (
            <tbody className="striped">
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle" colSpan={5}>{user.email}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setUserToDelete(user);
                      setDeleteModalShow(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </Table>
      </Container>
      <DeleteModal
        target={userToDelete}
        targetName={userToDelete?.email}
        shouldShow={deleteModalShow}
        deleteFunc={deleteUser}
        closeModal={() => setDeleteModalShow(false)}
      />

    </div>
  );
}

export default ManageUsers;
