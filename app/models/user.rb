class User < ActiveRecord::Base
  
  attr_accessor   :password
  attr_accessible :avatar,
                  :name,  
                  :lastname, 
                  :gender,
                  :birthday,
                  :password,
                  :password_confirmation, 
                  :change_password_flag,
                  :address, 
                  :city,
                  :state, 
                  :country,
                  :zip_code, 
                  :email,
                  :password,
                  :password_confirmation
    
  has_attached_file :avatar, 
                    :styles => { :thumb => "61x61#" },
                    :default_url => "/images/add-a-picture-template.gif",
                    :whiny => false

  validates_attachment_content_type :avatar, 
                                    :content_type => /^image\/(jpg|jpeg|pjpeg|png|x-png|gif)$/, 
                                    :message => 'file type is not allowed (only jpeg/png/gif images)'
  
  email_regex = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  
  validates       :name,                   :presence     => true,
                                           :length       => { :maximum => 50 }
  validates       :lastname,               :presence     => true,
                                           :length       => { :maximum => 50 }
  validates       :email,                  :presence     => true,
                                           :format       => { :with => email_regex },
                                           :uniqueness   => { :case_sensitive => false }
  validates       :gender,                 :inclusion    => { :in => %w(M F), :message => "is invalid"}
  validates       :password,               :confirmation => true
  validates       :birthday,               :presence     => true
  validates       :address,                :presence     => true
  validates       :state,                  :presence     => true
  validates       :city,                   :presence     => true
  validates       :country,                :presence     => true
  validates       :zip_code,               :length       => { :minimum => 5 }, 
                                           :numericality => { :only_integer => true }
  before_save     :encrypt_password

  def has_password?(submitted_password)
    encrypted_password == encrypt(submitted_password)
  end

  def self.authenticate(email, submitted_password)
    user = find_by_email(email)
    if user.nil?
      nil
    elsif user.has_password?(submitted_password)
      user
    end
  end

  def self.authenticate_with_salt(id, cookie_salt) 
    user = find_by_id(id)
    (user && user.salt == cookie_salt) ? user : nil
  end
  
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
