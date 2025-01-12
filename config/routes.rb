Rails.application.routes.draw do
  root "pages#home"

  # Authentication routes for User model
  resource :session
  resources :passwords, param: :token

  # Keyword search
  get "keywords/search", to: "keywords#search", as: "keyword_search"

  # Posts routes
  resources :posts do
    resources :keywords, only: [ :create ]
  end
end
