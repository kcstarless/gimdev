# keywords_controller.rb

class KeywordsController < ApplicationController
  before_action :find_post, only: [ :create ]

  # For autocomplete suggestions
  def search
    query = params[:query]
    @keywords = Keyword.where("name ILIKE?", "%#{query}%").limit(5)
    render json: @keywords.pluck(:name)
  end

  # Creates keyword
  def create
    keywords = params[:keywords]
    keywords.each do |keyword_name|
      keyword = keyword.find_or_create_by(name: keyword_name)
      @post.keywords << keyword unless @post.keywords.include?(keyword)
    end
    render json: { success: true, message: "Keywords added successfully." }
  end

  private

  def find_post
    @post = Post.find(params[:post_id])
  end
end
