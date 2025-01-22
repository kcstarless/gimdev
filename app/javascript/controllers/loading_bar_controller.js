// app/javascript/controllers/loading_bar_controller.js

import { Controller } from "stimulus";
import NProgress from "nprogress";  // Import NProgress

export default class extends Controller {
  static values = { progress: Boolean }

  connect() {
    // Initial setup for the loading bar
    console.log("Loading bar connected!");
    this.configureLoadingBar();
    this.listenForTurboEvents();
  }

  configureLoadingBar() {
    // Set custom NProgress styles
    NProgress.configure({ showSpinner: false });
  }

  listenForTurboEvents() {
    document.addEventListener("turbo:visit", () => {
      console.log("Turbo visit started");
      NProgress.start();  // Start the loading bar when a Turbo visit begins
    });

    document.addEventListener("turbo:load", () => {
      console.log("Turbo load complete");
      NProgress.done();  // Complete the loading bar once the page has loaded
    });

    document.addEventListener("turbo:before-cache", () => {
      NProgress.done();  // Complete the loading bar before Turbo caches the page
    });
  }
}
