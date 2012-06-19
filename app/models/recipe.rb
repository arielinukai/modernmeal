class Recipe < ActiveRecord::Base

  has_many :ingredients, :dependent => :destroy

  attr_accessible :comment, 
  				  :constOfIngredientsDollars, 
  				  :cookTime, 
  				  :cookTimeText, 
  				  :costOfIngredientsCents, 
  				  :costOfIngredientsText, 
  				  :directions, 
  				  :name, 
  				  :nutritionalInformation, 
  				  :preparationTime, 
  				  :preparationTimeText, 
  				  :servingComments, 
  				  :servings, 
  				  :text, 
  				  :totalTime, 
  				  :totalTimeText,
  				  :category,
  				  :keyIngredients,
  				  :servingSize,
  				  :cuisineType,
  			    :mealType,
  				  :addWine,
  				  :source

  def new
  	@recipe = Recipe.new
  end				  
end
