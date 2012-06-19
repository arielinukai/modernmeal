class CreateMeasurements < ActiveRecord::Migration
  def change
    create_table :measurements do |t|
      t.string :name
      t.string :metricEquivalent
      t.integer :ingredient_id
      t.integer :measurement_type_id

      t.timestamps
    end
  end
end
