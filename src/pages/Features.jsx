import React from "react";
import { Link } from "react-router-dom";

function Features() {
  return (
    <div>
      <div class="px-4 py-5 my-5 text-center">
        <img
          class="d-block mx-auto mb-4 rounded"
          src="/android-chrome-192x192.png"
          width="100"
          height="100"
        />
        <h1 class="display-5 text-body-emphasis">Features</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">
            At Find Your Pet, we believe in providing pet owners with versatile
            and reliable options to keep their pets safe. Whether you're looking
            for a simple, traditional pet identification tag or a more advanced
            smart tracking solution, we have the perfect option for your needs.
            Below, we explain why we offer three distinct types of tags: the
            Standard Tag, Samsung Smart Tag, and Apple Air Tag.
          </p>
        </div>
      </div>

      <div class="container px-4 py-5">
      <h2 class="pb-2 border-bottom">Standard Tag</h2>
        <div class="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
          <div class="col d-flex flex-column align-items-start gap-2">
            <h2 class="fw-bold text-body-emphasis">
              Traditional and Reliable
            </h2>
            <img className="card card-cover h-100 rounded shadow-lg" src="/NormalDogTag.png"  style={{width: "200px"}} />
            <p class="text-body-secondary">
              Our Standard Tag is the perfect choice for pet owners looking for
              a classic, simple solution. Designed with durability in mind, this
              tag features a clear QR code and a unique ID that can easily be
              scanned by anyone who finds your pet. The information contained on
              the tag can include your contact details, your pet’s medical
              information, and any special instructions.
            </p>
            <a  class="btn btn-primary btn-lg">
              Purchase
            </a>
            <Link to="/NormalLearn" className="btn btn-secondary btn-lg">
            Learn More
            </Link>
          </div>

          <div class="col">
            <div class="row row-cols-1 row-cols-sm-2 g-4">
              <div class="col d-flex flex-column gap-2">
                <div class="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                  <image class="bi" width="1em" height="1em">
                  <i class="bi bi-lightbulb"></i>
                  </image>
                </div>
                <h4 class="fw-semibold mb-0 text-body-emphasis">
                  Simplicity
                </h4>
                <p class="text-body-secondary">
                Perfect for those who want a straightforward, low-tech solution for pet identification
                </p>
              </div>

              <div class="col d-flex flex-column gap-2">
                <div class="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                  <image class="bi" width="1em" height="1em">
                  <i class="bi bi-box-seam"></i>
                  </image>
                </div>
                <h4 class="fw-semibold mb-0 text-body-emphasis">
                  Durable Design
                </h4>
                <p class="text-body-secondary">
                  PMade from high-quality materials, this tag is built to withstand everyday wear and tear.
                </p>
              </div>

              <div class="col d-flex flex-column gap-2">
                <div class="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                  <image class="bi" width="1em" height="1em">
                  <i class="bi bi-cash-stack"></i>
                  </image>
                </div>
                <h4 class="fw-semibold mb-0 text-body-emphasis">
                Affordable
                </h4>
                <p class="text-body-secondary">
                A cost-effective solution to keep your pet safe without the need for complex technology.
                </p>
              </div>

              <div class="col d-flex flex-column gap-2">
                <div class="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-4 rounded-3">
                  <image class="bi" width="1em" height="1em">
                  <i class="bi bi-battery-full"></i>
                  </image>
                </div>
                <h4 class="fw-semibold mb-0 text-body-emphasis">
                No Battery Required
                </h4>
                <p class="text-body-secondary">
                This tag works with just a QR code and NFC chip, so you never have to worry about charging it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Features;
