class AddDifficultyAndDescriptionToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :difficulty, :string
    add_column :posts, :description, :text
  end
end
