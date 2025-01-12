class Post < ApplicationRecord
  belongs_to :author, class_name: "User"
  has_and_belongs_to_many :categories, dependent: :destroy
  has_and_belongs_to_many :keywords
  has_many :sections, dependent: :destroy
  has_one_attached :cover_image

  accepts_nested_attributes_for :sections, allow_destroy: true, reject_if: :all_blank

  validates :title, presence: true
  validates :author, presence: true
  validates :difficulty, inclusion: { in: %w[Beginner Intermediate Advanced] }
end
