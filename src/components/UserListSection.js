import React from "react";
import { Row, Col } from "react-bootstrap";
import UserCard from "./UserCard";

function UserListSection({ title, users, badgeVariant, badgeText, onView }) {
  return (
    <>
      <h4 className={`mb-4 text-${badgeVariant} text-center border-bottom pb-2 fw-bold`}>
        {title}
      </h4>
      <Row>
        {users.map((user) => (
          <Col md={4} sm={6} xs={12} key={user._id} className="mb-4">
            <UserCard user={user} badgeVariant={badgeVariant} badgeText={badgeText} onView={onView} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default UserListSection;
