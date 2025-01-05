class User < ApplicationRecord
  has_secure_password
  has_many :posts, foreign_key: "author_id"
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  # Returns the full name of the user.
  def full_name
    "#{first_name.capitalize} #{last_name.capitalize}"
  end
end
