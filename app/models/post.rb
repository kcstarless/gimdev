class Post < ApplicationRecord
  belongs_to :author, class_name: "User"
  has_and_belongs_to_many :categories
  has_and_belongs_to_may :keywords

  validates :title, presence: true
  validates :author, presence: true
end
