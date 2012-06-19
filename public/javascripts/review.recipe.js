
var rows = 0;
var newRowNumbers = new Array();

jQuery('#form-columns').ready(function(){
	var xmlRecipe = jQuery("#recipeData").val();

	var jsonRecipe = jQuery.xml2json(xmlRecipe);
	
	jQuery('#category').val(' '); //category
	jQuery('#keyIngredients').val(' '); //key ingredients
	jQuery('#cost').val(' '); //cost of ingredients
	jQuery('#cuisineType').val(' '); //cuisine type
	jQuery('#mealType').val(' '); //meal type
	jQuery('#addWine').val(' '); //add wine
	jQuery('#source').val(' '); //source
	
	jsonRecipe.costOfIngredientsText ? jQuery('#costOfIngredientsText').val("$ "+jsonRecipe.costOfIngredientsText) : jQuery('#costOfIngredientsText').val(' ');
	jsonRecipe.name ? jQuery('#name').val(jsonRecipe.name) : jQuery('#name').val(' ');
	jsonRecipe.servings ? jQuery('#servingSize').val(jsonRecipe.servings) : jQuery('#servingSize').val(' ');
	jsonRecipe.preparationTimeText ? jQuery('#preparationTimeText').val(jsonRecipe.preparationTimeText) : jQuery('#preparationTimeText').val(' ');
	jsonRecipe.totalTimeText ? jQuery('#totalTimeText').val(jsonRecipe.totalTimeText) : jQuery('#totalTimeText').val(' ');
	jsonRecipe.nutritionalInformation ? jQuery('#nutrition').text(jsonRecipe.nutritionalInformation) : jQuery('#nutrition').text(' ');

	jsonRecipe.directions ? jQuery('#description-box').text(jsonRecipe.directions) : jQuery('#description-box').text(' ');

	var note;
	if(jsonRecipe.comments){
		note = jQuery('#description-box').text()
		note += "<h4>Notes:</h4>"+jsonRecipe.comments;
	}
	
	//Set all non viewable fields
	jsonRecipe.ingredient_descriptor.length ? jQuery("#numIngredients").val(jsonRecipe.ingredient_descriptor.length) : jQuery("#numIngredients").val(' ');
	
	jsonRecipe.preparationTime ? jQuery("#preparationTime").val(jsonRecipe.preparationTime) : jQuery("#preparationTime").val(' ');
	jsonRecipe.servingsComments ? jQuery("#servingsComments").val(jsonRecipe.servingsComments): jQuery("#servingsComments").val(' ');
	jQuery("#totalTimeText").val(' ');
	jsonRecipe.cookTime ? jQuery("#cookTime").val(jsonRecipe.cookTime) : jQuery("#cookTime").val(' ');
	jsonRecipe.cookTimeText ? jQuery("#cookTimeText").val(jsonRecipe.cookTimeText) : jQuery("#cookTimeText").val(' ');
	jsonRecipe.costOfIngredients ? jQuery("#costOfIngredientsDollars").val(jsonRecipe.costOfIngredients.dollars) : jQuery("#costOfIngredientsDollars").val(' ');
	jsonRecipe.costOfIngredients ? jQuery("#costOfIngredientsCents").val(jsonRecipe.costOfIngredients.cents) : jQuery("#costOfIngredientsCents").val(' ');
	jsonRecipe.costOfIngredientsText ? jQuery("#costOfIngredientsText").val(jsonRecipe.costOfIngredientsText) : jQuery("#costOfIngredientsText").val(' ');
	jsonRecipe.nutritionalInformation ? jQuery("#nutritionalInformation").val(jsonRecipe.nutritionalInformation) : jQuery("#nutritionalInformation").val(' ');
	jsonRecipe.comments ? jQuery("#comments").val(jsonRecipe.comments) : jQuery("#comments").val(' ');
	jsonRecipe.directions ? jQuery("#directions").val(jsonRecipe.directions) : jQuery("#directions").val(' ');
	jsonRecipe.text ? jQuery("#text").val(jsonRecipe.text) : jQuery("#text").val(' ');

	fillColumns(jsonRecipe.ingredient_descriptor);

	rows = jsonRecipe.ingredient_descriptor.length;
});
 

function fillColumns(ingredients){
	var qty;
	var qtyMin;
	for (var i = ingredients.length - 1; i >= 0; i--) {
		
		qty = ingredients[i].quantityMinText;
		if((ingredients[i].measurement != undefined) && (ingredients[i].measurement.name != undefined) )
			qty = qty + (' ') + ingredients[i].measurement.name;
		jQuery("quantity-column").append(newIngredientElement(i, qty, "quantity-column"));
		jQuery("ingredient-column").append(newIngredientElement(i, ingredients[i].ingredient.name+" ", "ingredient-column"));
		jQuery("comments-column").append(newIngredientElement(i, ingredients[i].comment, "comments-column"));

		ingredients[i].ingredient.score? addExtraFields(i,"score", ingredients[i].ingredient.score) : addExtraFields(i,"score", " ");
		ingredients[i].ingredient.text[0] ? addExtraFields(i,"ingtext", ingredients[i].ingredient.text[0]) : addExtraFields(i,"ingtext", " ");
		ingredients[i].quantityMin ? addExtraFields(i,"quantityMin", ingredients[i].quantityMin) : addExtraFields(i,"quantityMin", " ");
		ingredients[i].quantityMinText ? addExtraFields(i,"quantityMinText", ingredients[i].quantityMinText) : addExtraFields(i,"quantityMinText", " ");

		ingredients[i].measurement ? addExtraFields(i,"metricEquivalent", ingredients[i].measurement.metricEquivalent ) : addExtraFields(i,"metricEquivalent", " ");
		ingredients[i].measurement ? addExtraFields(i,"measurementName", ingredients[i].measurement.name) : addExtraFields(i,"measurementName", " ");
		ingredients[i].measurement ? addExtraFields(i,"measurementType", ingredients[i].measurement.type) : addExtraFields(i,"measurementType", " ");
	}
	
} 


function newIngredientElement (r, text, columnId) {
	//divs
	var rowDiv = jQuery('<div id="div_'+columnId+'_'+r+'"></div>').appendTo('#'+columnId);

	jQuery(rowDiv).attr('class','row'); 
	var inputSection = jQuery('<div></div>').appendTo(rowDiv);
	jQuery(inputSection).attr('class','input-section'); 	

	//spans
	var left = jQuery('<span></span>').appendTo(inputSection);
	jQuery(left).attr('class','left'); 
	var inputHolder = jQuery('<span></span>').appendTo(inputSection);
	jQuery(inputHolder).attr('class','input-holder'); 
	var right = jQuery('<span></span>').appendTo(inputSection);
	jQuery(right).attr('class','right'); 

	//input
	if(text == undefined) text = (' ');

	var id = columnId.split("-")[0] + "_"+r;
	var inputText = jQuery('<input type="text" class="text" value="'+text+'" id="'+id+'"  name="'+id+'"  />').appendTo(inputHolder);

	//remove
	if(columnId == "comments-column"){		
		var rem = jQuery('<a href="#" id="rem_'+r+'"class="aux-delete">&nbsp;&nbsp;&nbsp;&nbsp;</a>');
		rem.click(function(e){		
			e.preventDefault();	
			var idNum = this.id.split("_")[1];						
			jQuery('#div_quantity-column_'+idNum).remove();
			jQuery('#div_ingredient-column_'+idNum).remove();
			jQuery('#div_comments-column_'+idNum).remove();
			jQuery('#ingredient_'+idNum).remove();

			removeAllElse(idNum);
		});
		rowDiv.append(rem);
	}
	return rowDiv;
}

function addExtraFields(r, field, value ){
	var id = field+'_'+r;
	var input = '<input type="hidden" id="'+id+'" name="'+id+'" value="'+value+'"/>';
	var extraField = jQuery(input);
	jQuery('#form-columns').append(extraField);
}

function addNewElement(){	
	var newQuantityMinText = jQuery('#addQty').val(); //ingredient.quantityMinText
	var newMeasurementName = jQuery('#addType').val(); //measurement.name
	var newIngredient = jQuery('#addIngredient').val(); //ingredient.name
	var newComment = jQuery('#addComment').val(); //ingredient.comment

	var qtyColumn = newQuantityMinText+" "+newMeasurementName;
	newIngredientElement(rows, qtyColumn, 'quantity-column');	
	newIngredientElement(rows, newIngredient, 'ingredient-column');	
	newIngredientElement(rows, newComment, 'comments-column');		
	
	addExtraFields(rows,"quantityMinText", newQuantityMinText)
	addExtraFields(rows,"measurementName", newMeasurementName)

	jQuery('#addIngredient').val("");
	jQuery('#addComment').val("")

	jQuery('.selectArea .center').text("");

	jQuery("#numIngredients").val(rows);
	rows++;
}

function removeAllElse(r){
	jQuery('#score_'+r).remove();
	jQuery('#ingtext_'+r).remove();
	jQuery('#quantityMin_'+r).remove();
	jQuery('#quantityMinText_'+r).remove();
	jQuery('#metricEquivalent_'+r).remove();
	jQuery('#measurementName_'+r).remove();
	jQuery('#measurementType_'+r).remove();
}