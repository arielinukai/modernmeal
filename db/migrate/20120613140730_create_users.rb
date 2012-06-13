class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :lastname
      t.string :gender
      t.date :birthday
      t.string :email
      t.boolean :change_password_flag
      t.string :address
      t.string :city
      t.integer :zip_code
      t.string :country

      t.timestamps
    end
  end
end
