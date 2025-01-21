import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["navLinks", "hamburger"];

  // Toggle the visibility of the navigation links when the hamburger is clicked
  toggleMenu() {
    this.navLinksTarget.classList.toggle("active");
  }

  // navigate(event) {
  //   event.preventDefault();
  //   const url = event.currentTarget.getAttribute("href");
  //   Turbo.visit(url, { action: "advance" });
  // }
}
