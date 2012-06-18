class ChangeDataTypeForChangePasswordFlagToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.change :change_password_flag, :string
    end
  end

  def self.down
    change_table :users do |t|
      t.change :change_password_flag, :boolean
    end
  end
end
