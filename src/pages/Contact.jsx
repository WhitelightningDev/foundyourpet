import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.subject) errors.subject = "Subject is required.";
    if (!formData.message) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setShowModal(true);
  };

  // Format phone number for WhatsApp (adapted from PublicPetProfile)
  function formatPhoneNumberForWhatsApp(number) {
    if (!number) return "";
    const digits = number.replace(/\D/g, "");
    if (digits.length === 10 && digits.startsWith("0")) {
      return "27" + digits.slice(1);
    }
    if (digits.length >= 11 && digits.startsWith("27")) {
      return digits;
    }
    return digits;
  }

  // Construct WhatsApp message
  const whatsappMessage = `From: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
  const formattedNumber = formatPhoneNumberForWhatsApp("+27746588885"); // Hardcoded number from original code
  const whatsappLink = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleEmailSend = () => {
    setSending(true);
    const encodedSubject = encodeURIComponent(formData.subject);
    const encodedBody = encodeURIComponent(
      `From: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
    );
    const mailtoLink = `mailto:danielmommsen2@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoLink;

    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => {
      setSending(false);
      setShowModal(false);
    }, 1000);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="contact-form bg-white p-5 rounded-5 shadow-lg">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <h2 className="me-3 mb-0">Get in Touch</h2>
              <img
                src="/android-chrome-192x192.png"
                alt="Contact"
                style={{ width: "100px", height: "100px", borderRadius: "20px" }}
              />
            </div>

            {submitted ? (
              <div className="alert alert-success text-center" role="alert">
                Thank you for reaching out. We’ll get back to you soon!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject <span className="text-danger">*</span>
                  </label>
                  <select
                    id="subject"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Pet Adoption">Pet Adoption</option>
                    <option value="Lost Pet">Lost Pet</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                  {formErrors.subject && <div className="text-danger">{formErrors.subject}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Your Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  {formErrors.message && <div className="text-danger">{formErrors.message}</div>}
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-5 py-2">
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sending ? (
            <p className="text-center">Opening application...</p>
          ) : (
            <>
              <h4 className="text-center mb-4">How would you like to send your message?</h4>
              <div className="d-flex justify-content-around">
                <a
                  href={whatsappLink}
                  className="btn btn-outline-success shadow-lg d-flex align-items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    console.log("WhatsApp link clicked:", whatsappLink);
                    setSending(true);
                    setSubmitted(true);
                    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    setTimeout(() => {
                      setSending(false);
                      setShowModal(false);
                    }, 1000);
                  }}
                >
                  <FaWhatsapp className="me-2" /> Send via WhatsApp
                </a>
                <Button
                  variant="outline-primary"
                  className="d-flex align-items-center"
                  onClick={() => {
                    console.log("Email button clicked");
                    handleEmailSend();
                  }}
                >
                  <FaEnvelope className="me-2" /> Send via Email
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Contact;