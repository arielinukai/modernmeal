class PagesController < ApplicationController
  def show
    @session = nil
    render 'show', :layout => false
  end
end