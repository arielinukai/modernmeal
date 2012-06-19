require 'test_helper'

class EmailControllerTest < ActionController::TestCase
  test "should get remind" do
    get :remind
    assert_response :success
  end

end
