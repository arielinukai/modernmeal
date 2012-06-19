class Measurement < ActiveRecord::Base
  belongs_to	:ingredient

  attr_accessible :ingredient_id, 
  				  :measurementtype, 
  				  :metricEquivalent, 
  				  :name

  def new
  	@measurement = Measurement.new
  end	
end
