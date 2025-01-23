class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create guest_login]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }
  # skip_before_action :require_authentication, only: :guest_login
  def new
  end

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for user
      flash[:alert] = "Successfully logged in."
      respond_to do |format|
        format.html { redirect_to after_authentication_url }
        format.turbo_stream do
          # Send a Turbo Stream that triggers a full-page reload
          render turbo_stream: turbo_stream.append("main_content_frame", "<script>window.location.reload();</script>")
        end
      end
    else
      flash.now[:alert] = "Invalid email address or password."
      respond_to do |format|
        format.html { render :new } # Render the login form again
        format.turbo_stream do
          # Update the global flash message area using Turbo Streams
          render turbo_stream: turbo_stream.replace("global_flash_messages", partial: "shared/flash_messages")
        end
      end
    end
  end

  def destroy
    terminate_session
    flash[:alert] = "Successfully logged out."
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
      flash.now[:alert] = "Successfully logged in as a guest user."
      @post = Post.new
      respond_to do |format|
        format.html { redirect_to after_authentication_url }
        format.turbo_stream do
          # Render a Turbo Stream response that updates both frames
          render turbo_stream: [
            turbo_stream.replace("main_content_frame", template: "posts/new"),
            turbo_stream.replace("login_buttons_frame", partial: "sessions/login_buttons"),
            turbo_stream.replace("global_flash_messages", partial: "shared/flash_messages")
          ]
        end
      end
    else
      redirect_to root_path, alert: "Guest login failed. Please try again later."
    end
  end
end
