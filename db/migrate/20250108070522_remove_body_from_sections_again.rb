class RemoveBodyFromSectionsAgain < ActiveRecord::Migration[8.0]
  def change
    remove_column :sections, :body, :text
  end
end
