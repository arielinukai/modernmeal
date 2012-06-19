class CreateRecipes < ActiveRecord::Migration
  def change
    create_table :recipes do |t|
      t.string :name
      t.string :directions
      t.string :preparationTime
      t.string :preparationTimeText
      t.string :servings
      t.string :servingsComments
      t.string :totalTime
      t.string :totalTimeText
      t.string :cookTime
      t.string :cookTimeText
      t.string :costOfIngredientsDollars
      t.string :costOfIngredientsCents
      t.string :costOfIngredientsText
      t.string :nutritionalInformation
      t.string :text
      t.string :comment
      t.string :category
      t.string :keyIngredients
      t.string :servingSize
      t.string :cuisineType
      t.string :mealType
      t.string :addWine
      t.string :source

      t.timestamps
    end
  end
end
