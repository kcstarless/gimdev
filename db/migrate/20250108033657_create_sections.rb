class CreateSections < ActiveRecord::Migration[8.0]
  def change
    create_table :sections do |t|
      t.text :body

      t.timestamps
    end
  end
end
