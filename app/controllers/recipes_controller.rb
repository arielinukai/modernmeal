class RecipesController < ApplicationController
	def new
		#@recipe = Recipe.new
	end

	def destroy
		@recipe = Recipe.find(params[:id])
		@recipe.destroy
		respond_to do |i|
			i.html["/recipes/new"]
		end
	end

	def create

		#static
		@name = params[:name]
		@directions = params[:directions]
		@preparationTime = params[:preparationTime]
		@preparationTimeText = params[:preparationTimeText]
		@servings = params[:servingSize]
		@servingsComments = params[:servingsComments]
		@totalTime = params[:totalTime]
		@totalTimeText = params[:totalTimeText]
		@cookTime = params[:cookTime]
		@cookTimeText = params[:cookTimeText]
		@costOfIngredientsDollars = params[:costOfIngredientsDollars]
		@costOfIngredientsCents = params[:costOfIngredientsCents]
		@costOfIngredientsText = params[:costOfIngredientsText]
		@nutritionalInformation = params[:nutritionalInformation]
		@text = params[:text]
		@comment = params[:comment]
		@category = params[:category]
		@keyIngredients = params[:keyIngredients]
		@servingSize = params[:servingSize]
		@cuisineType = params[:cuisineType]
		@mealType = params[:mealType]
		@addWine = params[:addWine]
		@source = params[:source]

		@superRecipe = Recipe.new
		@superRecipe.name = @name
		@superRecipe.directions = @directions
		@superRecipe.preparationTime = @preparationTime
		@superRecipe.preparationTimeText = @preparationTimeText
		@superRecipe.servings = @servings
		@superRecipe.servingsComments = @servingsComments
		@superRecipe.totalTime = @totalTime
		@superRecipe.totalTimeText = @totalTimeText
		@superRecipe.cookTime = @cookTimeText
		@superRecipe.cookTimeText = @cookTimeText
		@superRecipe.costOfIngredientsDollars = @costOfIngredientsDollars
		@superRecipe.costOfIngredientsCents = @costOfIngredientsCents
		@superRecipe.costOfIngredientsText = @costOfIngredientsText
		@superRecipe.nutritionalInformation = @nutritionalInformation
		@superRecipe.text = @text
		@superRecipe.comment = @comment
		@superRecipe.category = @category
		@superRecipe.keyIngredients = @keyIngredients
		@superRecipe.servingSize = @servingSize
		@superRecipe.cuisineType = @cuisineType
		@superRecipe.mealType = @mealType
		@superRecipe.addWine = @addWine
		@superRecipe.source = @source

		@superRecipe.save

		#quantity_i
		#ingredient_i
		#comment_i

		$rows = params[:numIngredients].to_i
		$i = 0;
		while $i <= $rows do
			if !params['ingredient_'+$i.to_s].to_s.empty?
				@superIngredient = @superRecipe.ingredients.new
				@superIngredient.name = params['ingredient_'+$i.to_s].to_s
      			@superIngredient.comment = params['comments_'+$i.to_s].to_s
      			@superIngredient.quantityMin = params['quantityMin_'+$i.to_s].to_s
      			@superIngredient.quantityMinText = params['quantityMinText_'+$i.to_s].to_s
      			@superIngredient.score = params['score_'+$i.to_s].to_s
     			@superIngredient.text = params['ingtext_'+$i.to_s].to_s
				@superIngredient.save

      			@superMeasurement = @superIngredient.build_measurement()
      			@superMeasurement.name = params['measurementName_'+$i.to_s].to_s
      			@superMeasurement.metricEquivalent = params['metricEquivalent_'+$i.to_s].to_s
      			@superMeasurement.save
			end
			$i +=1;
		end

		redirect_to :action => "show", :id => @superRecipe.id
	end

	def review
		 @recipe = params[:recipeData]
	end

	def show
    	@recipe = Recipe.find(params[:id])
  	end

  def index
  	#@recipes = Recipe.find(:all, :order => "created_at")
  	@recipes = Recipe.order("created_at").page(params[:page]).per(5)   
  end

  def destroy
  	Recipe.find(params[:id]).destroy
  	redirect_to recipes_path
  end
end
