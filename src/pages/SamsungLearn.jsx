import React from "react";

function SamsungLearn() {
  return (
    <div>
      <div class="px-4 py-5 my-5 text-center">
        <img
          class="rounded shadow-lg d-block mx-auto mb-4"
          src="/samsung-smarttag-2-1-700x394.jpg"
          alt=""
          width="700"
          height="400"
        />
        <h1 class="display-5 fw-bold text-body-emphasis">
          How do I connect my SmartTag to my phone or tablet?
        </h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">
            To connect your SmartTag with your smartphone or tablet, the
            SmartThings app should be installed on your phone or tablet. Before
            connecting your SmartTag, please make sure that the SmartThings app
            has been updated to the latest version.
          </p>
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
        <div class="list-group">
          <a
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <image>
              <i class="fs-3 bi bi-1-circle"></i>
            </image>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">
                  Open the SmartThings app on your phone or tablet
                </h6>
                <p class="mb-0 opacity-75">
                  The SmartThings app is usually located in the Samsung folder
                  on the Apps screen of most Galaxy devices. It can also be
                  found by swiping up or down on the Home screen to access apps.{" "}
                </p>
              </div>
            </div>
          </a>
          <a
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <image>
              <i class="fs-3 bi bi-2-circle"></i>
            </image>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">
                  Press the button (a) on your SmartTag. The SmartTag will
                  activate and make a sound
                </h6>
                <img src="/smarttagbutton.JPG" class="mb-0 opacity-75" />
              </div>
            </div>
          </a>
          <a
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <image>
              <i class="fs-3 bi bi-3-circle"></i>
            </image>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mt-2">
                  A window will appear on your phone or tablet. Tap Add Now
                </h6>
              </div>
            </div>
          </a>

          <a
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <image>
              <i class="fs-3 bi bi-4-circle"></i>
            </image>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mt-2">
                  Follow the on-screen instructions to finish setting up your
                  SmartTag
                </h6>
              </div>
            </div>
          </a>
        </div>
      </div>
      <h1 className="text-center mb-4 ">Types of Samsung Smart Tags</h1>
      <img className="d-block mx-auto mt-4" src="/samsungsmarttagrebg.png" alt="" />
    </div>
  );
}

export default SamsungLearn;
