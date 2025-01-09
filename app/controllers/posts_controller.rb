class PostsController < ApplicationController
  before_action :authenticated?, except: [ :index, :show ]
  def index
    # Check if category param is provided in the URL
    if params[:category].present?
      # Find the category by name
      category = Category.find_by(name: params[:category])

      if category
        # Get all posts associated with this category
        @posts = category.posts
      else
        # If the category doesn't exist, show a message and display all posts
        flash[:alert] = "Category not found"
        @posts = Post.all
      end
    else
      # If no category is provided, show all posts
      @posts = Post.all
    end
  end

  def show
    @post = Post.find(params[:id])
  end

  def new
    @post = Post.new
  end

  def create
    @post = Current.user.posts.build(post_params)

    if @post.save
      add_keywords_to_post(@post) # Adds keywords if post created
      redirect_to @post, notice: "Post created successfully"
    else
      render :new
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :difficulty, :description, category_ids: [], keywords: [], sections_attributes: [ :body, :_destroy ])
  end

  def add_keywords_to_post(post)
    if params[:post][:keywords].present?
      keyword_names = params[:post][:keywords].split(",").map(&:strip).uniq # into array

      keywords = keyword_names.map do |keyword_name|
        Keyword.find_or_create_by(name: keyword_name.downcase) # If not found create new keyword
      end

      post.keywords = keywords # adds keywords to post
    end
  end
end
