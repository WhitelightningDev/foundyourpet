import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { setLastPushMessage } from "@/lib/pushInbox";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/push-sw.js")
      .then((registration) => {
        const tryActivateUpdate = () => {
          const waiting = registration.waiting;
          if (waiting) {
            waiting.postMessage({ type: "SKIP_WAITING" });
          }
        };

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed") {
              tryActivateUpdate();
            }
          });
        });

        // Proactively check for SW updates when the app is opened.
        registration.update().catch(() => null);

        // If there's already an update waiting (e.g. from a previous visit), activate it.
        tryActivateUpdate();

        let reloading = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloading) return;
          reloading = true;
          window.location.reload();
        });

        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event?.data?.type !== "PUSH_RECEIVED") return;
          setLastPushMessage(event.data);
        });
      })
      .catch(() => {
        // no-op
      });
  });
}
