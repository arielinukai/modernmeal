class Ingredient < ActiveRecord::Base
  belongs_to :recipe
  has_one :measurement, :dependent => :destroy
  
  attr_accessible :comment, 
  				  :name, 
  				  :quantityMin, 
  				  :quantityMinText, 
  				  :recipe_id, 
  				  :score, 
  				  :text


  def new
  	@ingredient = Ingredient.new
  end		
end
