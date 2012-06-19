class UsersController < ApplicationController
  def new
    @user  = User.new
    @error = @user.errors
  end
  
  def create
    @user = User.new(params[:user])
    @error = @user.errors
    if @user.save && verify_recaptcha()
      sign_in @user
      redirect_to profile_path
    else
      if verify_recaptcha() == false
        @user.errors[:recaptcha] = "is invalid"
      end
      render :new
    end
  end
end
