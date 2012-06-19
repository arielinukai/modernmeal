class UsersController < ApplicationController
  
  before_filter :authenticate, :except => [:new, :create, :change]
  before_filter :correct_user, :only => [:show, :edit, :update, :change_picture]
  
  def new
    @user = User.new
    @error = @user.errors
  end
  
  def create
    @user = User.new(params[:user])
    @error = @user.errors
    if @user.save && verify_recaptcha()
      UserMailer.welcome_email(@user).deliver
      sign_in @user
      redirect_to home_path
    else
      if verify_recaptcha() == false
        @user.errors[:recaptcha] = "is invalid"
      end
      render 'new'
    end
  end
  
  def show
    @user = current_user
  end
  
  def change
    if request.post?
       @user = User.find(params[:id])
       @user.change_password_flag = nil
       @password_compare = params[:user][:password] == params[:user][:password_confirmation]
       if @password_compare && !params[:user][:password].empty?
         if @user.update_attributes(params[:user])
           flash[:success] = "User updated."
           redirect_to home_path
         else
           flash[:notice] = "An error ocurred. Please try again."
           render :change
         end
       else
         flash[:notice] = "Please enter your password and confirm it."
         render :change
       end
    else
      @user = User.find(params[:id])
      if @user && @user.change_password_flag == params[:code] || @user == current_user
        @error = @user.errors
        render :change
      else
        flash[:notice] = "Invalid code!"
        redirect_to root_path
      end
    end
  end
  
  def edit
    @user = User.find(params[:id])
    @error = @user.errors
  end
  
  def update
    @user = User.find(params[:id])
    @error = @user.errors
    if @user.update_attributes(params[:user])
      flash[:success] = "Profile updated."
      redirect_to home_path
    else
      render :edit
    end
  end
  
  def change_picture
    @user = User.find(params[:id])
    @error = @user.errors    
  end
  
  private 
    def correct_user
      @user = current_user
      redirect_to(root_path) unless current_user?(@user)
    end
end
