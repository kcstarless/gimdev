Rails.application.routes.draw do
  root "pages#home"

  # Authentication routes for User model
  resource :session, only: [ :new, :create, :destroy ]
  resources :passwords, param: :token

  # Guest login route
  post "session/guest_login", to: "sessions#guest_login", as: "guest_login"

  # Keyword search
  get "keywords/search", to: "keywords#search", as: "keyword_search"
  get "keywords", to: "keywords#index", as: "keywords"
  get "/posts_by_keyword", to: "posts#show_by_keyword", as: "posts_by_keyword"

  # Posts routes
  resources :posts do
    resources :keywords, only: [ :create ]
  end
end
