import { useLocation } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

function CheckoutPage() {
  const { state } = useLocation();
  const { package: pkg, total, membership } = state;

  return (
    <Container className="my-5 text-center">
      <Card className="p-4 shadow-sm">
        <h3>Checkout Summary</h3>
        <p><strong>Package:</strong> {pkg}</p>
        <p><strong>Support Membership:</strong> {membership ? "Yes (R49.99/month)" : "No"}</p>
        <h4>Total: R{total.toFixed(2)}</h4>
        <p className="text-muted">[Payment Integration Coming Soon]</p>
      </Card>
    </Container>
  );
}

export default CheckoutPage;
