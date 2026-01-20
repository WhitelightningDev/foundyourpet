import React from "react";

function AppleLearn() {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center">
        <img
          className="d-block mx-auto mb-4 img-fluid"
          src="/airtags.jpg"
          alt="Apple AirTag"
          style={{ maxWidth: "700px", height: "auto" }}
        />
        <h1 className="display-5 fw-bold text-body-emphasis">Apple AirTag</h1>
        <div className="col-lg-8 mx-auto">
          <p className="lead mb-4">
            You can register an AirTag to your Apple Account using your iPhone.
            When you attach it to an everyday item, like a keychain or a
            backpack, you can use the Find My app to locate it if it’s lost or
            misplaced. You can also get notified if you leave your AirTag
            behind. Note: Location sharing and finding items aren’t available
            in all countries or regions.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="row justify-content-center py-4">
        <div className="col-lg-8">
          <div className="list-group">
            {/* Step 1 */}
            <div className="list-group-item d-flex gap-3 py-3">
              <i className="fs-3 bi bi-1-circle"></i>
              <div className="d-flex flex-column w-100">
                <h6 className="mb-0">Locate the Find My app</h6>
                <p className="mb-2 opacity-75">
                  on your iPhone or compatible Apple device. The app should be preinstalled, but you'll need to set it up.
                </p>
                <img
                  src="/fidmyappstore.jpg"
                  alt="Find My App Store"
                  className="rounded img-fluid"
                  style={{ maxWidth: "300px", height: "auto" }}
                />
              </div>
              <img
                src="/findmyapp.png"
                alt="Find My App"
                className="rounded-circle"
                width="32"
                height="32"
              />
            </div>

            {/* Step 2 */}
            <div className="list-group-item d-flex gap-3 py-3">
              <i className="fs-3 bi bi-2-circle"></i>
              <div className="d-flex flex-column w-100">
                <h6 className="mb-0">Pair your AirTag with your iPhone</h6>
                <p className="mb-2 opacity-75">
                  All you have to do is bring the AirTag close to your iPhone, and it should connect.
                </p>
                <img
                  src="/connectairtag.jpg"
                  alt="Pair AirTag"
                  className="rounded img-fluid"
                  style={{ maxWidth: "300px", height: "auto" }}
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="list-group-item d-flex gap-3 py-3">
              <i className="fs-3 bi bi-3-circle"></i>
              <div className="d-flex flex-column w-100">
                <h6 className="mb-0">Follow the onscreen steps to name your tagged item</h6>
                <p className="mb-2 opacity-75">
                  (e.g., "My car keys" if you're attaching your AirTag to your keys) and register it to your Apple ID.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="list-group-item d-flex gap-3 py-3">
              <i className="fs-3 bi bi-4-circle"></i>
              <div className="d-flex flex-column w-100">
                <h6 className="mb-0">Once the AirTag is paired</h6>
                <p className="mb-2 opacity-75">
                  You should be able to see it under "Items" in the app, where you'll be able to see its current or last known location on a map.
                </p>
                <img
                  src="/airtagmap.jpg"
                  alt="AirTag Map"
                  className="rounded img-fluid"
                  style={{ maxWidth: "320px", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppleLearn;
