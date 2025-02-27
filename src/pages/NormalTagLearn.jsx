import React from "react";

function NormalTagLearn() {
  return (
    <div>
      <div class="px-4 py-5 my-5 text-center">
        <img
          class="d-block mx-auto mb-4"
          src="/scanqrcode.jpg"
          alt=""
          width="240"
          height="240"
        />
        <h1 class="display-5 fw-bold text-body-emphasis">Normal Tags</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">
            To scan a dog tag, use your smartphone's camera app to scan the QR
            code on the tag; most modern phones have built-in QR scanning
            capabilities, simply point the camera at the code and it will
            automatically read the information linked to it, which usually leads
            to the owner's contact details on a website.{" "}
          </p>
        </div>
      </div>
      <div class="container col-xxl-8 px-4 py-5">
        <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div class="col-10 col-sm-8 col-lg-6">
            <img
              src="/scannedphone.jpg"
              class="d-block rounded shadow-lg mx-lg-auto img-fluid"
              alt="Bootstrap Themes"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
          <div class="col-lg-6">
            <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              QR code is key
            </h1>
            <p class="lead">
              {" "}
              Most modern dog tags have a QR code that can be scanned with a
              smartphone camera.
            </p>
          </div>
        </div>
      </div>

      <div class="container px-4 py-5" id="hanging-icons">
        <h2 class="pb-2 border-bottom">Hanging icons</h2>
        <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div class="col d-flex align-items-start">
            <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <image class="bi" style={{ width: "40px", height: "60px" }}>
                <i class="fs-1 bi bi-phone"></i>
              </image>
            </div>
            <div>
              <h3 class="fs-2 text-body-emphasis">Open camera app</h3>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </div>
          </div>
          <div class="col d-flex align-items-start">
            <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <image class="bi" style={{ width: "40px", height: "60px" }}>
                <i class="fs-1 bi bi-qr-code"></i>
              </image>
            </div>
            <div>
              <h3 class="fs-2 text-body-emphasis">Point at the code</h3>
              <p>Open the camera app on your phone.</p>
            </div>
          </div>
          <div class="col d-flex align-items-start">
            <div class="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <image class="bi" width="1em" height="1em">
                <i class="fs-1 bi bi-eyeglasses"></i>
              </image>
            </div>
            <div>
              <h3 class="fs-2 text-body-emphasis">Automatic reading</h3>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1 class="text-center display-5  text-body-emphasis">Scan the QR code with your camera</h1>
      <img
        alt=""
        width="240"
        height="240"
        class="d-block mx-auto mb-4"
        src="/qrcode_personal.png"
      />
    </div>
  );
}

export default NormalTagLearn;
