import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div
      className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5"
      tabindex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <img
              classNameName="rounded"
              src="/android-chrome-192x192.png"
              width="50px"
              alt=""
            />
            <h1 className="fw-bold m-3 mb-0 fs-2">Sign up for free</h1>
          </div>

          <div className="modal-body p-5 pt-0">
            <form className="">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label for="floatingInput">First Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label for="floatingInput">Last Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="name@example.com"
                />
                <label for="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <label for="floatingPassword">Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="floatingPassword"
                  placeholder="Password"
                />
                <label for="floatingPassword">Confirm Passowrd</label>
              </div>
              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                type="submit"
              >
                Sign up
              </button>
              <small className="text-body-secondary">
                By clicking Sign up, you agree to the terms of use.
              </small>
              <hr className="my-4" />
              <div className="d-flex justify-content-between">
              <small className="text-body-secondary">
               Already have an account?
              </small>
              <Link to="/Login" className="btn btn-outline-secondary">
                Login
              </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
