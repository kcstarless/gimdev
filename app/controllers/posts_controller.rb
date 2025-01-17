class PostsController < ApplicationController
  before_action :authenticated?, except: [ :index, :show ]
  before_action :set_post, only: [ :show, :edit ]
  before_action :increment_views, only: [ :show ]

  def index
    @posts = Post.order(created_at: :asc)
  end

  def show
    # @post = Post.find(params[:id])
    @category = params[:category] if params[:category].present?
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Current.user.posts.build(post_params)

    if @post.save
      add_keywords_to_post(@post) # Adds keywords if post created
      redirect_to post_path(@post)
    else
      render :new
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def increment_views
    @post.increment_views
  end

  def post_params
    params.require(:post).permit(:title, :difficulty, :description, :cover_image, category_ids: [], keywords: [], sections_attributes: [ :body, :_destroy ])
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
