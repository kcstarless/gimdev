class PagesController < ApplicationController
  allow_unauthenticated_access only: [ :home ]

  def home
      # if params[:id].present?
      #   @post = Post.find(params[:id])
      # end
      # Check if category param is provided in the URL
      if params[:category].present?
        # Find the category by name
        @category = Category.find_by(name: params[:category])

        if @category
          # Get all posts associated with this category
          @posts = @category.posts
        else
          # If the category doesn't exist, show a message and display all posts
          flash[:alert] = "Category not found"
          @posts = Post.order(created_at: :asc)
        end
      else
        # If no category is provided, show all posts
        @posts = Post.order(created_at: :asc)
      end

    # respond_to do |format|
    #   format.html  # If you want to return HTML content
    #   format.turbo_stream  # If you want to return JSON content
    # end
  end
end
