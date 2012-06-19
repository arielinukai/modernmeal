class EmailController < ApplicationController
  def remind
    if param_posted?(:user)
      email = params[:user][:email]
      @user  = User.find_by_email(email)
      if @user
        @user.password = @user.password_confirmation = @user.change_password_flag = new_hash(25)
        @user.save!
        UserMailer.reminder(@user).deliver
        flash.now[:notice] = "Login information was sent successfully."
      end 
    end
  end
  
  def invite
    if param_posted?(:email)
      @email = params[:email]
      if validate_email(@email) 
        UserMailer.invite(@email).deliver
        render :json => {:message => "The email was send to #{@email} successfully."}
      else
        render :json => {:message => "This is not a valid email address."}
      end   
    end      
  end
  
  private 
    def validate_email(email)
       email_regex = %r{
         ^ # Start of string
         [0-9a-z] # First character
         [0-9a-z.+]+ # Middle characters
         [0-9a-z] # Last character
         @ # Separating @ character
         [0-9a-z] # Domain name begin
         [0-9a-z.-]+ # Domain name middle
         [0-9a-z] # Domain name end
         $ # End of string
       }xi # Case insensitive

       if email =~ email_regex
         return true
       else
         return false
       end
    end
     
    def param_posted?(sym)
      request.post? and params[sym]
    end
    
    def new_hash(len)
      chars = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
      hash = ""
      1.upto(len) { |i| hash << chars[rand(chars.size-1)] }
      return hash
    end
end
