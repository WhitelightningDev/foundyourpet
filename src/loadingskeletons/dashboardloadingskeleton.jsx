import React from "react";
import { Container, ListGroup } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardLoadingSkeleton = () => {
  const petSkeletons = Array.from({ length: 2 });

  return (
    <Container className="my-5">
      {/* Welcome Header */}
      <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
        <h3 className="text-dark fw-bold m-0">
          <Skeleton width={250} height={30} />
        </h3>
        <Skeleton width={130} height={30} />
      </div>

      {/* Add Pet Button */}
      <div className="d-flex justify-content-center mb-4">
        <Skeleton width={160} height={40} />
      </div>

      {/* Dogs Section */}
      <h4 className="mb-3 text-primary">Your Dogs</h4>
      <ListGroup className="mb-5">
        {petSkeletons.map((_, index) => (
          <ListGroup.Item
            key={`dog-${index}`} // unique key
            className="mb-3 shadow-sm rounded p-3 bg-light"
          >
            <div className="d-flex justify-content-between align-items-center gap-3">
              <Skeleton circle width={50} height={50} />

              <div className="flex-grow-1">
                <Skeleton height={20} width="80%" className="mb-1" />
                <Skeleton height={15} width="60%" />
              </div>

              <div className="d-flex flex-wrap gap-1">
                <Skeleton width={60} height={30} />
                <Skeleton width={60} height={30} />
                <Skeleton width={60} height={30} />
                <Skeleton width={80} height={30} />
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Cats Section */}
      <h4 className="mb-3 text-primary">Your Cats</h4>
      <ListGroup className="mb-5">
        {petSkeletons.map((_, index) => (
          <ListGroup.Item
            key={`cat-${index}`} // unique key
            className="mb-3 shadow-sm rounded p-3 bg-light"
          >
            <div className="d-flex justify-content-between align-items-center gap-3">
              <Skeleton circle width={50} height={50} />

              <div className="flex-grow-1">
                <Skeleton height={20} width="80%" className="mb-1" />
                <Skeleton height={15} width="60%" />
              </div>

              <div className="d-flex flex-wrap gap-1">
                <Skeleton width={60} height={30} />
                <Skeleton width={60} height={30} />
                <Skeleton width={60} height={30} />
                <Skeleton width={80} height={30} />
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default DashboardLoadingSkeleton;
