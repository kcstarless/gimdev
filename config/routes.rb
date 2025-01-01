Rails.application.routes.draw do
  root "pages#home"

  # Authentication routes for User model
  resource :session
  resources :passwords, param: :token
end
