class Post < ApplicationRecord
  belongs_to :author, class_name: "User"
  has_and_belongs_to_many :categories
  has_and_belongs_to_many :keywords
  has_many :sections, dependent: :destroy
  has_one_attached :cover_image, dependent: :destroy

  accepts_nested_attributes_for :sections, allow_destroy: true, reject_if: :all_blank

  validates :title, presence: true
  validates :author, presence: true
  validates :difficulty, inclusion: { in: %w[Beginner Intermediate Advanced] }

  def increment_views
    update(views_count: views_count + 1)
  end

  def self.popular_posts
    Post.order(views_count: :desc).limit(5)
  end

  def self.featured_posts
    Post.order(created_at: :desc).limit(1)
  end
end
