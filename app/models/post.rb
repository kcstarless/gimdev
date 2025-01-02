class Post < ApplicationRecord
  belongs_to :author
  has_and_belongs_to_many :categories

  validates :title, presence: true
  validates :author, presence: true
end
