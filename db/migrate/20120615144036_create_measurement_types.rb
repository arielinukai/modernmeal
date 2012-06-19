class CreateMeasurementTypes < ActiveRecord::Migration
  def change
    create_table :measurement_types do |t|
      t.string :type

      t.timestamps
    end
  end
end
