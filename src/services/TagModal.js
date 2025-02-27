import React from "react";

const TagModal = ({ show, onClose, title, content, features = [], icons = [] }) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0, 0, 0, 0.6)" }}
      onClick={onClose} // Close modal when clicking on the backdrop
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="modal-content rounded-4 shadow">
          <div className="modal-body p-5">
            <h2 className="fw-bold mb-0">{title}</h2>
            <p>{content}</p>
            <ul className="d-grid gap-4 my-5 list-unstyled small">
              {features.length > 0 ? (
                features.map((feature, index) => (
                  <li className="d-flex gap-4" key={index}>
                    <i className={`bi ${icons[index]} flex-shrink-0`} width="48" height="48"></i>
                    <div>
                      <h5 className="mb-0">{feature.title}</h5>
                      {feature.description}
                    </div>
                  </li>
                ))
              ) : (
                <p>No features available.</p>
              )}
            </ul>
            <button
              type="button"
              className="btn btn-lg btn-primary mt-5 w-100"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Great, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
