class CreateIngredients < ActiveRecord::Migration
  def change
    create_table :ingredients do |t|
      t.string :name
      t.string :comment
      t.string :quantityMin
      t.string :quantityMinText
      t.string :score
      t.string :text
      t.integer :recipe_id

      t.timestamps
    end
  end
end
