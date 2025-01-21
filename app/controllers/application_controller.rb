class ApplicationController < ActionController::Base
  include Authentication

  # allow_browser versions: :modern
  # before_action -> { sleep 1 }
end
