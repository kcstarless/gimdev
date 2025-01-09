import { Controller } from "@hotwired/stimulus"
import axios from "axios"

// Connects to data-controller="keywords"
export default class extends Controller {
  static targets = ["input", "suggestions", "keywordsList", "hiddenKeywords"]

  keywords = [];

  connect() {
    console.log("KeywordsController connected")
    console.log(this.keywordsListTarget);
  }

  // Search for keywords as the user types
  search() {
    const query = this.inputTarget.value.trim()
    console.log("hello");
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
        ${keyword}
      </li>
      `).join("")
  }

  // Add an existing keyword from suggestions to the list
  addExistingKeyword(event) {
    const keyword = event.target.dataset.keyword
    this.addKeywordToList(keyword)
    this.clearSuggestions()
  }

  // Add a new keyword
  addKeyword(event) {
    const keyword = this.inputTarget.value.trim()
  
    if (!keyword) return
  
    console.log("Adding new keyword:", keyword)

    // Store the keyword temporarily 
    if (!this.keywords.includes(keyword)) {
      this.keywords.push(keyword)
    }
  
    // Add new keyword to the list (display only)
    this.addKeywordToList(keyword)
  
    // Clear input field
    this.inputTarget.value = ""

    // Update hidden field with current keywords
    this.updateHiddenField()
  }
  
  // Append a keyword to the list
  addKeywordToList(keyword) {
    const keywordElement = document.createElement("div")
    keywordElement.classList.add("keyword-item")
    keywordElement.innerText = keyword
    this.keywordsListTarget.appendChild(keywordElement)
  }
  
  // Clear suggestions
  clearSuggestions() {
    this.suggestionsTarget.innerHTML = ""
  }

  // Update the hidden input field current list of keywords
  updateHiddenField() {
    this.hiddenKeywordsTarget.value = this.keywords.join(", ")
  }
}
