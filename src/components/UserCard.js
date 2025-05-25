import React from "react";
import { Card, Badge, Button } from "react-bootstrap";

function UserCard({ user, badgeVariant, badgeText, onView }) {
  return (
    <Card className="h-100 shadow-lg border-0 rounded-4 bg-light-subtle">
      <Card.Body className="d-flex flex-column justify-content-between p-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <div
            className={`bg-${badgeVariant}-subtle rounded-circle d-flex align-items-center justify-content-center me-3`}
            style={{
              width: 52,
              height: 52,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <span className={`fw-semibold text-${badgeVariant} fs-4`}>
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h6 className="mb-1 fw-semibold text-dark">
              {user.name} {user.surname}
            </h6>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center">
          <Badge
            bg={badgeVariant}
            pill
            className="px-3 py-1 text-uppercase"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            {badgeText}
          </Badge>

          <Button
            size="sm"
            variant={`outline-${badgeVariant}`}
            onClick={() => onView(user._id)}
            className="rounded-pill px-3"
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
