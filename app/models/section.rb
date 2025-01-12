# section model

class Section < ApplicationRecord
  belongs_to :post
  has_rich_text :body

  # include ActionText::Attachable
  # has_one_attached :image

  # def to_attachable_partial_path
  #   "sections/attachable"
  # end
end
