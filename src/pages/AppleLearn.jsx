import React from "react";

function AppleLearn() {
  return (
    <div>
      <div class="px-4 py-5 my-5 text-center">
        <img
          class="d-block mx-auto mb-4"
          src="/airtags.jpg"
          alt=""
          width="700"
          height="400"
        />
        <h1 class="display-5 fw-bold text-body-emphasis">Apple Air Tag</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">
            You can register an AirTag to your Apple Account using your iPhone.
            When you attach it to an everyday item, like a keychain or a
            backpack, you can use the Find My app to locate it if it’s lost or
            misplaced. You can also get notified if you leave your AirTag
            behind. See Set separation alerts in case you leave an AirTag or
            item behind. You can also share an AirTag with other users. You can
            also add supported third-party products to Find My. See Add or
            update a third-party item. Note: Location sharing and finding items
            aren’t available in all countries or regions.
          </p>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
        <div class="list-group">
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <i class="fs-3 bi bi-1-circle"></i>

            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0"> Locate the Find My app</h6>
                <p class="mb-0 opacity-75">
                  on your iPhone or compatible Apple device. The app should be
                  preinstalled, but you'll need to set it up.{" "}
                </p>
                <img
                  src="/fidmyappstore.jpg"
                  alt="twbs"
                  width="300"
                  height="270"
                  class="rounded flex-shrink-0"
                />
              </div>
            </div>
            <img
              src="/findmyapp.png"
              alt="twbs"
              width="32"
              height="32"
              class="rounded-circle flex-shrink-0"
            />
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <image>
              <i class="fs-3 bi bi-2-circle"></i>
            </image>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Pair your AirTag with your iPhone</h6>
                <p class="mb-0 opacity-75">
                  All you have to do is bring the AirTag close to your iPhone,
                  and it should connect.
                </p>
                <img
                  src="/connectairtag.jpg"
                  alt="twbs"
                  width="300"
                  height="270"
                  class="rounded flex-shrink-0"
                />
              </div>
            </div>
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <i class="fs-3 bi bi-3-circle"></i>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">
                  Follow the onscreen steps to name your tagged item
                </h6>
                <p class="mb-0 opacity-75">
                  (e.g., "My car keys" if you're attaching your AirTag to your
                  keys) and register it to your Apple ID.
                </p>
              </div>
              <small class="opacity-50 text-nowrap">1w</small>
            </div>
          </a>
          <a
            href="#"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <i class="fs-3 bi bi-4-circle"></i>
            <div class="d-flex gap-2 w-100 justify-content-between">
              <div>
                <h6 class="mb-0">Once the AirTag is paired</h6>
                <p class="mb-0 opacity-75">
                  you should be able to see it under Items in the app, where
                  you'll be able to see its current or last known location on a
                  map.
                </p>
                <img
                  src="/airtagmap.jpg"
                  alt="twbs"
                  width="320"
                  height="420"
                  class="rounded flex-shrink-0"
                />
              </div>
              <small class="opacity-50 text-nowrap">1w</small>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AppleLearn;
