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

# Add your seed data here
