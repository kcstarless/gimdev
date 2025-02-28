class PostsController  < ApplicationController
  allow_unauthenticated_access only: [ :index, :show, :new, :show_by_keyword ]
  before_action :set_post, only: [ :show, :edit, :update, :destroy ]
  before_action :increment_views, only: [ :show ]

  def index
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
  end

  def show
    @category = params[:category] if params[:category].present?

    # respond_to do |format|
    #   format.html # Renders the show.html.erb template
    #   format.turbo_stream do
    #     render turbo_stream: turbo_stream.replace("post_content", template: "posts/show", locals: { post: @post })
    #   end
    # end
  end

  def new
      @post = Post.new
  end

  def edit
  end

  def create
    if Current.user.nil?
      guest_user = User.find_by(email_address: "guest@guest.com")
      @post = guest_user.posts.build(post_params)
    else
      @post = Current.user.posts.build(post_params)
    end

    if @post.save
      add_keywords_to_post(@post) # Adds keywords if post created
      add_sections_to_post(@post) # Adds sections if post created
      flash.now[:alert] = "Post successfully created."
      respond_to do |format|
        format.html do
          redirect_to post_path(@post), notice: "Post was successfully created."
        end
        format.turbo_stream do
          # Render a Turbo Stream response that updates both frames
          render turbo_stream: [
            turbo_stream.replace("main_content_frame", template: "posts/show"),
            turbo_stream.replace("global_flash_messages", partial: "shared/flash_messages")
          ]
        end
      end
    else
      flash.now[:alert] = "Post could not be created. Please check the errors below."
      render :new
    end
  end

  def update
    if @post.update(post_params)
      add_keywords_to_post(@post) # Updates keywords if necessary
      add_sections_to_post(@post) # Updates sections if necessary
      flash.now[:alert] = "Post successfully updated."
      respond_to do |format|
        format.html do
          redirect_to post_path(@post), notice: "Post was successfully created."
        end
        format.turbo_stream do
          # Render a Turbo Stream response that updates both frames
          render turbo_stream: [
            turbo_stream.replace("main_content_frame", template: "posts/show"),
            turbo_stream.replace("global_flash_messages", partial: "shared/flash_messages")
          ]
        end
      end
    else
      render :edit
    end
  end

  def destroy
    @category = params[:category] if params[:category].present?
    Rails.logger.debug "Category parameter: #{@category}"
    if @post.destroy
      redirect_to posts_path(category: @category), notice: "Post was successfully deleted."
    else
      redirect_to root_path, alert: "There was an error deleting the post."
    end
  end

  def show_by_keyword
    # Retrieve the keyword from the URL parameters
    keyword = params[:keyword]

    @keyword = Keyword.find_by(name: keyword)

    if @keyword
      @posts = @keyword.posts
    else
      flash[:alert] = "No posts found for the keyword '#{keyword}'"
      redirect_to root_path
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
    params.require(:post).permit(:title, :difficulty, :description, :cover_image, category_ids: [], keywords: [], sections_attributes: [ :id, :body, :_destroy ])
  end

  def add_keywords_to_post(post)
    if params[:post][:keywords].present?
      keyword_names = params[:post][:keywords].split(",").map(&:strip).uniq

      keywords = keyword_names.map do |keyword_name|
        Keyword.find_or_create_by(name: keyword_name.downcase)
      end

      post.keywords = keywords # Replaces the current keywords with the provided keywords
    else
      post.keywords.clear # Clears all keywords if no keywords are provided in the form
    end
  end

  def add_sections_to_post(post)
    if params[:post][:sections_attributes].present?
      section_attributes = params[:post][:sections_attributes].values.map do |section|
        if section[:_destroy] == "1" && section[:id].present?
          # Check if the section exists before trying to destroy it
          existing_section = Section.find_by(id: section[:id])
          existing_section.destroy if existing_section.present?
          nil
        else
          Section.find_or_initialize_by(id: section[:id]).tap do |s|
            s.body = section[:body] unless section[:_destroy] == "1" # Use Action Text body
          end
        end
      end

      post.sections = section_attributes.compact
    else
      post.sections.clear # Clears all sections if no sections are provided in the form
    end
  end
end
