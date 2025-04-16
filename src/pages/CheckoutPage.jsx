import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";

function CheckoutPage() {
  const { state } = useLocation();
  const {
    package: pkg,
    total = 0,
    membership = false,
    selectedPets = [],
  } = state || {};

  const membershipCost = membership ? 50 : 0;
  const subtotal = total + membershipCost;

  return (
    <Container className="my-5">
      <div className="row g-5">
        {/* Cart Summary */}
        <div className="col-md-5 col-lg-4 order-md-last">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary">Your cart</span>
            <span className="badge bg-primary rounded-pill">
              {selectedPets.length}
            </span>
          </h4>

          <ul className="list-group mb-3">
            {selectedPets.map((pet, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between lh-sm"
              >
                <div>
                  <h6 className="my-0">{pet.name}</h6>
                  <small className="text-muted">
                    {pet.breed || "Unknown Breed"}, {pet.species},{" "}
                    {pet.size || "Unknown Size"}
                  </small>
                </div>
                <span className="text-muted">
                  R{(total / selectedPets.length).toFixed(2)}
                </span>
              </li>
            ))}

            {membership && (
              <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
                <div className="text-success">
                  <h6 className="my-0">Membership</h6>
                  <small>Support package</small>
                </div>
                <span className="text-success">+R50</span>
              </li>
            )}

            <li className="list-group-item d-flex justify-content-between">
              <span>
                <strong>Subtotal</strong>
              </span>
              <strong>R{subtotal.toFixed(2)}</strong>
            </li>
          </ul>
        </div>

        {/* Checkout Form */}
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" noValidate>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  required
                />
                <div className="invalid-feedback">
                  Valid first name is required.
                </div>
              </div>

              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  required
                />
                <div className="invalid-feedback">
                  Valid last name is required.
                </div>
              </div>

            

              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                />
                <div className="invalid-feedback">
                  Please enter a valid email address for updates.
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="1234 Main St"
                  required
                />
                <div className="invalid-feedback">
                  Please enter your shipping address.
                </div>
              </div>

              <div className="col-12">
                <label htmlFor="address2" className="form-label">
                  Address 2 <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  placeholder="Apartment or suite"
                />
              </div>

              <div className="col-md-5">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <select className="form-select" id="country" required>
                  <option value="">Choose...</option>
                  <option>South Africa</option>
                </select>
                <div className="invalid-feedback">
                  Please select a valid country.
                </div>
              </div>

              <div className="col-md-4">
                <label htmlFor="province" className="form-label">
                  Province
                </label>
                <select className="form-select" id="province" required>
                  <option value="">Choose...</option>
                  <option>Gauteng</option>
                  <option>Western Cape</option>
                  <option>KwaZulu-Natal</option>
                  <option>Eastern Cape</option>
                  <option>Free State</option>
                  <option>Limpopo</option>
                  <option>Mpumalanga</option>
                  <option>North West</option>
                  <option>Northern Cape</option>
                </select>
                <div className="invalid-feedback">
                  Please provide a valid province.
                </div>
              </div>

              <div className="col-md-3">
                <label htmlFor="zip" className="form-label">
                  Postal Code
                </label>
                <input type="text" className="form-control" id="zip" required />
                <div className="invalid-feedback">Postal code required.</div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="same-address"
              />
              <label className="form-check-label" htmlFor="same-address">
                Shipping address is the same as my billing address
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="save-info"
              />
              <label className="form-check-label" htmlFor="save-info">
                Save this information for next time
              </label>
            </div>

            <hr className="my-4" />
 

            <button className="w-100 btn btn-primary btn-lg" type="submit">
              Continue to checkout
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default CheckoutPage;
