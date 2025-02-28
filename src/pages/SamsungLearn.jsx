import React from "react";

function SamsungLearn() {
  return (
    <div>
      <div className="px-4 py-5 my-5 text-center">
        <img
          className="rounded shadow-lg d-block mx-auto mb-4 img-fluid"
          src="/samsung-smarttag-2-1-700x394.jpg"
          alt=""
          width="700"
          height="400"
        />
        <h1 className="display-5 fw-bold text-body-emphasis">
          How do I connect my SmartTag to my phone or tablet?
        </h1>
        <div className="col-lg-6 col-md-8 mx-auto">
          <p className="lead mb-4">
            To connect your SmartTag with your smartphone or tablet, the
            SmartThings app should be installed on your phone or tablet. Before
            connecting your SmartTag, please make sure that the SmartThings app
            has been updated to the latest version.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col">
            <div className="list-group">
              <a
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
              >
                <i className="fs-3 bi bi-1-circle"></i>
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mb-0">
                      Open the SmartThings app on your phone or tablet
                    </h6>
                    <p className="mb-0 opacity-75">
                      The SmartThings app is usually located in the Samsung
                      folder on the Apps screen of most Galaxy devices. It can
                      also be found by swiping up or down on the Home screen to
                      access apps.
                    </p>
                  </div>
                </div>
              </a>
              <a
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
              >
                <i className="fs-3 bi bi-2-circle"></i>
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mb-0">
                      Press the button (a) on your SmartTag. The SmartTag will
                      activate and make a sound
                    </h6>
                    <img
                      src="/smarttagbutton.JPG"
                      className="img-fluid mt-2 rounded"
                      alt=""
                    />
                  </div>
                </div>
              </a>
              <a
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
              >
                <i className="fs-3 bi bi-3-circle"></i>
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mt-2">
                      A window will appear on your phone or tablet. Tap Add Now
                    </h6>
                  </div>
                </div>
              </a>
              <a
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
              >
                <i className="fs-3 bi bi-4-circle"></i>
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mt-2">
                      Follow the on-screen instructions to finish setting up
                      your SmartTag
                    </h6>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-center mb-4">Types of Samsung Smart Tags</h1>
      <img
        className="d-block mx-auto mt-4 img-fluid"
        src="/samsungsmarttagrebg.png"
        alt=""
      />
    </div>
  );
}

export default SamsungLearn;
