import { Controller } from "@hotwired/stimulus"
import axios from "axios"

// Connects to data-controller="keywords"
export default class extends Controller {
  static targets = ["input", "suggestions", "keywordsList", "hiddenKeywords"];

  keywords = [];

  connect() {
    console.log("KeywordsController connected")
    console.log(this.keywordsListTarget);
  }

  // Search for keywords as the user types
  search() {
    const query = this.inputTarget.value.trim()
    if (query.length < 2) {
      this.suggestionsTarget.innerHTML = ""
      return
    }

    // Fetch existing keywords from the server
    axios(`/keywords/search?query=${query}`)
      .then(response => this.showSuggestions(response.data))
      .catch(error => console.error("Error fetching keywords", error))
  }

  // Show the suggestions for existing keywords
  showSuggestions(keywords) {
    this.suggestionsTarget.innerHTML = keywords.map(keyword => `
      <li class="suggestions-item" data-action="click->keywords#addExistingKeyword" data-keyword="${keyword}">
        ${keyword} <span class="add">+</span>
      </li>
      `).join("")
  }

  // Add an existing keyword from suggestions to the list
  addExistingKeyword(event) {
    const keyword = event.target.dataset.keyword;
    // Check if the keyword already exists in the list
    if (this.keywords.includes(keyword)) {
      alert("Keyword already exists:", keyword);
      return; // Exit early if keyword is already in the list
    }
    console.log(this.keywords);
    this.addKeywordToList(keyword);
    this.keywords.push(keyword);
    this.updateHiddenField();
    this.clearSuggestions();
  }

  // Add a new keyword
  addKeyword(event) {
    const keyword = this.inputTarget.value.trim()
  
    if (!keyword) return;
  
    // Check if the keyword already exists in the list
    if (this.keywords.includes(keyword)) {
      alert("Keyword already exists:", keyword);
      return // Exit early if keyword is already in the list
    }
    // Store the keyword temporarily 
    this.keywords.push(keyword);
  
    // Add new keyword to the list (display only)
    this.addKeywordToList(keyword);
  
    // Clear input field
    this.inputTarget.value = "";

    // Update hidden field with current keywords
    this.updateHiddenField();
    this.clearSuggestions() ;
  }
  
  // Append a keyword to the list
  addKeywordToList(keyword) {
    const keywordElement = document.createElement("div");
    keywordElement.classList.add("keyword-item");
    keywordElement.innerText = keyword;
    
    // Add a click event to the entire keyword item for removal
    keywordElement.dataset.action = "click->keywords#removeKeyword"; 
    
    // Append the keyword item to the list
    this.keywordsListTarget.appendChild(keywordElement);
  }

  // Remove the keyword from the list
  removeKeyword(event) {
    const keywordElement = event.target.closest(".keyword-item"); 
    const keyword = keywordElement.innerText.trim();

    // Remove the keyword from the internal array
    this.keywords = this.keywords.filter(item => item !== keyword);

    // Remove the keyword from the displayed list
    keywordElement.remove();

    // Update the hidden field with the updated list of keywords
    this.updateHiddenField();
  }
  
  // Clear suggestions
  clearSuggestions() {
    this.suggestionsTarget.innerHTML = "";
    this.inputTarget.value = "";
  }

  // Update the hidden input field current list of keywords
  updateHiddenField() {
    this.hiddenKeywordsTarget.value = this.keywords.join(", ");
  }
}
