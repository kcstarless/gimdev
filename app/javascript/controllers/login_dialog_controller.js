import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="login-dialog"
export default class extends Controller {
  static targets = ["loginDialog"];
  
  connect() {
    console.log("Login dialog stimulus", this.element);
    this.overlay = document.getElementById("overlay");
  }

  toggleDialog() {
    console.log("Dialog toggle triggered!");
    const dialog = this.loginDialogTarget;
    if (dialog) {
      if (dialog.open) {
        dialog.close();
        console.log("closing...");
        this.overlay.style.display = "none";
      } else {
        dialog.showModal();
        console.log("opening...");
        this.overlay.style.display = "block";
      }
    } else {
      console.error("Dialog not found!");
    }
  }
  
}
