# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# db/seeds.rb
# Removes all records
ActiveRecord::Base.connection.tables.each do |table|
  next if table == 'schema_migrations' || table == 'ar_internal_metadata'
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE #{table} CASCADE")
end

# Add categories
[ "HTML", "JavaScript", "Rails", "Tools" ].each do |category_name|
  Category.find_or_create_by!(name: category_name)
end


# Add user
User.create!(
  email_address: 'jwgim7786@gmail.com',  # Make sure this email is unique
  password: '2die4uOKAY',  # Use a secure password
  password_confirmation: '2die4uOKAY',  # Ensure confirmation matches
  first_name: 'David',  # Optional
  last_name: 'Gim'  # Optional
)

# Add guest user
User.create!(
  email_address: 'guest@guest.com',  # Make sure this email is unique
  password: '121212',  # Use a secure password
  password_confirmation: '121212',  # Ensure confirmation matches
  first_name: 'Guest',  # Optional
  last_name: ''  # Optional
)
