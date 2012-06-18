class UserMailer < ActionMailer::Base
  default :from => "jesus.parra@4thsource.com"
  
  def welcome_email(user)
    @user = user
    @url  = "http://localhost:3000/"
    mail(:to => user.email, :subject => "Welcome to ModernMeal!")
  end
  
  def reminder(user)
    @user = user
    @url = "http://localhost:3000/"
    mail(:to => user.email, :subject => "Login information from ModernMeal account.")
  end
  
  def invite(email)
    mail(:to => email, :subject => "Join us on ModernMeal.com")
  end
end
