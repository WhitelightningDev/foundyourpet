import React from "react";

function NormalTagLearn() {
  return (
    <div>
      {/* Hero Section */}
      <div className="px-4 py-5 my-5 text-center">
        <img
          className="d-block mx-auto mb-4 img-fluid"
          src="/scanqrcode.jpg"
          alt="QR Code Scan"
          width="240"
          height="240"
        />
        <h1 className="display-5 fw-bold text-body-emphasis">Normal Tags</h1>
        <div className="col-lg-6 col-md-8 mx-auto">
          <p className="lead mb-4">
            To scan a dog tag, use your smartphone's camera app to scan the QR
            code on the tag. Most modern phones have built-in QR scanning
            capabilities—simply point the camera at the code, and it will
            automatically read the information linked to it, leading to the
            owner's contact details.
          </p>
        </div>
      </div>

      {/* QR Code Info Section */}
      <div className="container col-xxl-8 px-4 py-5">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-12 col-sm-8 col-lg-6">
            <img
              src="/scannedphone.jpg"
              className="d-block rounded shadow-lg mx-lg-auto img-fluid"
              alt="Scanning Phone"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              QR code is key
            </h1>
            <p className="lead">
              Most modern dog tags have a QR code that can be scanned with a
              smartphone camera.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Icons Section */}
      <div className="container px-4 py-5">
        <h2 className="pb-2 border-bottom text-center">How It Works</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-md-2 row-cols-lg-3">
          {/* Step 1 */}
          <div className="col d-flex align-items-start">
            <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 p-3 rounded">
              <i className="fs-1 bi bi-phone"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Open Camera App</h3>
              <p>
                Simply launch your phone's camera—most modern devices have a
                built-in QR scanner.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col d-flex align-items-start">
            <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 p-3 rounded">
              <i className="fs-1 bi bi-qr-code"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Point at the QR Code</h3>
              <p>
                Align your camera with the QR code to start the scanning process.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col d-flex align-items-start">
            <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 p-3 rounded">
              <i className="fs-1 bi bi-eyeglasses"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Automatic Reading</h3>
              <p>
                Your phone will instantly recognize the code and display the
                owner's contact details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="text-center">
        <h1 className="display-5 text-body-emphasis">Scan the QR code with your camera</h1>
        <img
          alt="QR Code Example"
          width="240"
          height="240"
          className="d-block mx-auto mb-4 img-fluid"
          src="/qrcode_personal.png"
        />
      </div>
    </div>
  );
}

export default NormalTagLearn;
