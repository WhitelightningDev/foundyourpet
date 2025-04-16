import { useLocation } from "react-router-dom";
import { Container, Card, ListGroup, Row, Col } from "react-bootstrap";

function CheckoutPage() {
  const { state } = useLocation();
  const { package: pkg, total, membership = [], selectedPets = [] } = state;

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0">
        <h3 className="text-center mb-4">Checkout Summary</h3>

        {/* Package Summary */}
        <h5><strong>Selected Package:</strong> {pkg}</h5>
        <p><strong>Membership:</strong> {membership ? "Included (R70/month)" : "Not Included"}</p>

        {/* Pets Section */}
        <h5 className="mt-4">Pets Receiving Tags:</h5>
        {selectedPets.length > 0 ? (
          <ListGroup className="mb-3">
          {selectedPets.map((pet, idx) => (
            <ListGroup.Item key={idx}>
              <strong>{pet.name}</strong> — {pet.breed || "Unknown Breed"},{" "}
              {pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : "Species not selected"},{" "}
              {pet.size ? pet.size.charAt(0).toUpperCase() + pet.size.slice(1) : "Size not selected"}
            </ListGroup.Item>
          ))}
        </ListGroup>        
        ) : (
          <p>No pets selected.</p>
        )}


        {/* Total Price */}
        <Row className="mt-4">
          <Col className="text-end">
            <h4 className="text-success"><strong>Total:</strong> R{total.toFixed(2)}</h4>
            <p className="text-muted">[Payment Integration Coming Soon]</p>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default CheckoutPage;
