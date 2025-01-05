class PagesController < ApplicationController
  allow_unauthenticated_access only: [ :home ]

  def home
    @posts = Post.all
  end
end
