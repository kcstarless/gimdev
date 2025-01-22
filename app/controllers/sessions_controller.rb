class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create guest_login]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }
  # skip_before_action :require_authentication, only: :guest_login
  def new
  end

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      respond_to do |format|
        format.html { redirect_to after_authentication_url }
        format.turbo_stream do
          # Send a Turbo Stream that triggers a full-page reload
          render turbo_stream: turbo_stream.append("main_content_frame", "<script>window.location.reload();</script>")
        end
      end
    else
      respond_to do |format|
        format.html { redirect_to new_session_path, alert: "Try another email address or password." }
        format.turbo_stream { render turbo_stream: turbo_stream.replace("login_frame", partial: "sessions/form", locals: { alert: "Try another email address or password." }) }
      end
    end
  end

  def destroy
    terminate_session
    respond_to do |format|
      format.html { redirect_to root_path }
      format.turbo_stream do
        # Send a Turbo Stream that triggers a full-page reload
        render turbo_stream: turbo_stream.append("main_content_frame", "<script>window.location.reload();</script>")
      end
    end
  end

  # Guest Login Action
  def guest_login
    if guest_user = User.authenticate_by(email_address: "guest@guest.com", password: "121212")
      start_new_session_for guest_user
      @post = Post.new
      respond_to do |format|
        format.html { redirect_to after_authentication_url }
        format.turbo_stream do
          # Render a Turbo Stream response that updates both frames
          render turbo_stream: [
            turbo_stream.replace("main_content_frame", template: "posts/new"),
            turbo_stream.replace("login_buttons", partial: "sessions/login_buttons")
          ]
        end
      end
    else
      redirect_to root_path, alert: "Guest login failed. Please try again later."
    end
  end
end
