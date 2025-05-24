import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";

function CheckoutPage() {
  const { state } = useLocation();

  const {
    package: pkg,
    total = 0,
    membership = false, // user intends to buy membership or not
    membershipObjectId,
    selectedPets = [],
  } = state || {};

  // User data state from API
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    address2: "",
    country: "South Africa",
    province: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const [checkingPets, setCheckingPets] = useState(false);

  const [userHasMembership, setUserHasMembership] = useState(null);

  // Assume token stored in localStorage (adjust if your auth flow differs)
  const token = localStorage.getItem("token");

  // Fetch user data on mount if token is present
  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(
          "https://foundyourpet-backend.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data.user;
        console.log("Fetched user from API:", userData);

        setUser(userData);

        // Prefill form data from user info
        setFormData({
          firstName: userData.name || "",
          lastName: userData.surname || "",
          email: userData.email || "",
          address: userData.address?.street || "",
          address2: "", // no field in user schema, leave blank or extend
          country: userData.address?.country || "South Africa",
          province: userData.address?.province || "",
          zip: userData.address?.postalCode || "",
        });

        // Set membership status directly from user data if available
        setUserHasMembership(userData.membershipActive || false);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setUserLoading(false);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // Calculate subtotal dynamically based on membership status once fetched
  const membershipFee = !userHasMembership && membership ? 50 : 0;
  const subtotal = total + membershipFee;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["firstName", "lastName", "address", "province", "zip"];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Postal code validation (assuming SA format)
    if (formData.zip && !/^\d{4}$/.test(formData.zip)) {
      newErrors.zip = "Please enter a valid postal code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const checkPetsEligibility = async (petIds) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/pets/checkActiveTags",
        { petIds }
      );
      return response.data;
    } catch (err) {
      console.error("Error checking pets' tag eligibility:", err);
      return { eligible: false, petsWithTags: [] };
    }
  };

  const fetchUserMembershipStatus = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/users/${userId}/membershipStatus`);
      return response.data?.hasMembership || false;
    } catch (err) {
      console.error("Error fetching user membership status:", err);
      return false;
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form.");
      return;
    }

    if (!user?._id) {
      alert("User not logged in or missing user ID.");
      return;
    }

    setCheckingPets(true);

    // Refresh membership status from backend to ensure up-to-date info
    const hasMembership = await fetchUserMembershipStatus(user._id);
    setUserHasMembership(hasMembership);

    // Check pet eligibility
    const { eligible, petsWithTags } = await checkPetsEligibility(selectedPets.map((p) => p._id));
    if (!eligible) {
      alert(
        `Cannot proceed. The following pets already have active tags: ${petsWithTags.join(", ")}`
      );
      setCheckingPets(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/payment/createCheckout", {
        userId: user._id,
        petIds: selectedPets.map((pet) => pet._id),
        amountInCents: Math.round(subtotal * 100),
        membership: !hasMembership && membership,
        membershipId: membershipObjectId,
        packageType: pkg?.type || "Standard",
        billingDetails: formData,
      });

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert("Checkout URL not received. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert("There was an error initiating checkout. Please try again.");
    } finally {
      setCheckingPets(false);
    }
  };

  // Log the data for debugging
  console.log("CheckoutPage location state:", state);
  console.log("User data in CheckoutPage:", user);
  console.log("Selected Pets:", selectedPets);
  console.log("Package:", pkg);
  console.log("Total:", total);
  console.log("Membership Intent:", membership);
  console.log("Form Data:", formData);

  return (
    <Container className="my-5">
      <div className="row g-5">
        {/* Order Summary */}
        <div className="col-md-5 col-lg-4 order-md-last">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-primary">Your cart</span>
            <span className="badge bg-primary rounded-pill">{selectedPets.length}</span>
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
            {/* Show membership fee only if user intends to buy membership AND does NOT already have membership */}
            {membership && !userHasMembership && (
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

        {/* Billing Form */}
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation" noValidate onSubmit={handleCheckout}>
            <div className="row g-3">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="address2" className="form-label">
                  Address 2 <span className="text-body-secondary">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address2"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-5">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <select
                  className="form-select"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled
                >
                  <option>South Africa</option>
                </select>
              </div>

              <div className="col-md-4">
                <label htmlFor="province" className="form-label">
                  Province
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.province ? "is-invalid" : ""}`}
                  id="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                />
                {errors.province && (
                  <div className="invalid-feedback">{errors.province}</div>
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="zip" className="form-label">
                  Postal code
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.zip ? "is-invalid" : ""}`}
                  id="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
                {errors.zip && (
                  <div className="invalid-feedback">{errors.zip}</div>
                )}
              </div>
            </div>

            <hr className="my-4" />

            <button
              className="w-100 btn btn-primary btn-lg"
              type="submit"
              disabled={checkingPets}
            >
              {checkingPets ? "Processing..." : "Proceed to Checkout"}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default CheckoutPage;
