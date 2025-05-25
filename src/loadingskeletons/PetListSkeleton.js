import React from "react";
import { ListGroup, Placeholder } from "react-bootstrap";

const PetListSkeleton = ({ count = 3 }) => {
  return (
    <ListGroup>
      {Array.from({ length: count }).map((_, index) => (
        <ListGroup.Item
          key={index}
          className="mb-3 shadow-sm rounded p-3 bg-light"
        >
          <div className="d-flex justify-content-between align-items-center gap-3">
            {/* Circular Skeleton Image */}
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#dee2e6",
              }}
            />

            {/* Info Skeleton */}
            <div className="flex-grow-1">
              <Placeholder as="h5" animation="wave" className="mb-1">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as="p" animation="wave" className="mb-0">
                <Placeholder xs={4} />
              </Placeholder>
            </div>

            {/* Buttons Skeleton */}
            <div className="d-flex gap-1 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="btn btn-secondary btn-sm disabled placeholder col-3"
                  style={{ width: "70px", height: "32px" }}
                />
              ))}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PetListSkeleton;
