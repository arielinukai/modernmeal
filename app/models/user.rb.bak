class User < ActiveRecord::Base
  
  attr_accessor   :password
  attr_accessible :name,  
                  :lastname, 
                  :gender,
                  :birthday, 
                  :change_password_flag,
                  :address, 
                  :city, 
                  :country,
                  :zip_code, 
                  :email,
                  :password,
                  :password_confirmation
                  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates       :name,                   :presence     => true,
                                           :length       => { :maximum => 50 }
  validates       :lastname,               :presence     => true,
                                           :length       => { :maximum => 50 }
  validates       :email,                  :presence     => true,
                                           :format       => { :with => email_regex },
                                           :uniqueness   => { :case_sensitive => false }
  validates       :gender,                 :inclusion    => { :in => %w(M F), :message => "is invalid"}
  validates       :birthday,               :presence     => true
  validates       :address,                :presence     => true
  validates       :city,                   :presence     => true
  validates       :country,                :presence     => true
  validates       :zip_code,               :length       => { :minimum => 5 }, 
                                           :numericality => { :only_integer => true }
  before_save     :encrypt_password
  
  private 
    def encrypt_password
      self.salt = make_salt if new_record?
      if password!=change_password_flag && password!=""
        self.encrypted_password = encrypt(password)
      end
    end
    
    def encrypt(string)
      secure_hash("#{salt}--#{string}")
    end
    
    def make_salt
      secure_hash("#{Time.now.utc}--#{password}")
    end
    
    def secure_hash(string)
      Digest::SHA2.hexdigest(string)
    end
end
