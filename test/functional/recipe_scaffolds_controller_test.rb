require 'test_helper'

class RecipeScaffoldsControllerTest < ActionController::TestCase
  setup do
    @recipe_scaffold = recipe_scaffolds(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:recipe_scaffolds)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create recipe_scaffold" do
    assert_difference('RecipeScaffold.count') do
      post :create, recipe_scaffold: { addWine: @recipe_scaffold.addWine, category: @recipe_scaffold.category, comment: @recipe_scaffold.comment, cookTime: @recipe_scaffold.cookTime, cookTimeText: @recipe_scaffold.cookTimeText, costOfIngredientsCents: @recipe_scaffold.costOfIngredientsCents, costOfIngredientsDollars: @recipe_scaffold.costOfIngredientsDollars, costOfIngredientsText: @recipe_scaffold.costOfIngredientsText, cuisineType: @recipe_scaffold.cuisineType, directions: @recipe_scaffold.directions, keyIngredients: @recipe_scaffold.keyIngredients, mealType: @recipe_scaffold.mealType, name: @recipe_scaffold.name, nutritionalInformation: @recipe_scaffold.nutritionalInformation, preparationTime: @recipe_scaffold.preparationTime, preparationTimeText: @recipe_scaffold.preparationTimeText, servings: @recipe_scaffold.servings, servingsComments: @recipe_scaffold.servingsComments, source: @recipe_scaffold.source, text: @recipe_scaffold.text, totalTime: @recipe_scaffold.totalTime, totalTimeText: @recipe_scaffold.totalTimeText }
    end

    assert_redirected_to recipe_scaffold_path(assigns(:recipe_scaffold))
  end

  test "should show recipe_scaffold" do
    get :show, id: @recipe_scaffold
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @recipe_scaffold
    assert_response :success
  end

  test "should update recipe_scaffold" do
    put :update, id: @recipe_scaffold, recipe_scaffold: { addWine: @recipe_scaffold.addWine, category: @recipe_scaffold.category, comment: @recipe_scaffold.comment, cookTime: @recipe_scaffold.cookTime, cookTimeText: @recipe_scaffold.cookTimeText, costOfIngredientsCents: @recipe_scaffold.costOfIngredientsCents, costOfIngredientsDollars: @recipe_scaffold.costOfIngredientsDollars, costOfIngredientsText: @recipe_scaffold.costOfIngredientsText, cuisineType: @recipe_scaffold.cuisineType, directions: @recipe_scaffold.directions, keyIngredients: @recipe_scaffold.keyIngredients, mealType: @recipe_scaffold.mealType, name: @recipe_scaffold.name, nutritionalInformation: @recipe_scaffold.nutritionalInformation, preparationTime: @recipe_scaffold.preparationTime, preparationTimeText: @recipe_scaffold.preparationTimeText, servings: @recipe_scaffold.servings, servingsComments: @recipe_scaffold.servingsComments, source: @recipe_scaffold.source, text: @recipe_scaffold.text, totalTime: @recipe_scaffold.totalTime, totalTimeText: @recipe_scaffold.totalTimeText }
    assert_redirected_to recipe_scaffold_path(assigns(:recipe_scaffold))
  end

  test "should destroy recipe_scaffold" do
    assert_difference('RecipeScaffold.count', -1) do
      delete :destroy, id: @recipe_scaffold
    end

    assert_redirected_to recipe_scaffolds_path
  end
end
