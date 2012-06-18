class SessionsController < ApplicationController

  def create
    user = User.authenticate(params[:session][:email],
                             params[:session][:password])
    if user.nil?
      flash[:error] = "Invalid email/password combination."
      redirect_to root_path
    else
      sign_in user
      redirect_back_or home_path
    end
  end

  def destroy
    sign_out
    redirect_to root_path
  end
end