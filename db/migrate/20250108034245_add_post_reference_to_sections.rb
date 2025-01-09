class AddPostReferenceToSections < ActiveRecord::Migration[8.0]
  def change
    add_reference :sections, :post, null: false, foreign_key: true
  end
end
