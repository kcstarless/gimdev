# config/puma.rb

# Threads configuration (kept as is)
threads_count = ENV.fetch("RAILS_MAX_THREADS", 3)
threads threads_count, threads_count

# Bind Puma to listen on 0.0.0.0:8080 (required by Fly.io)
bind "tcp://0.0.0.0:8080"

# Specifies the port that Puma will listen on to receive requests; default is 3000.
# This will still fall back to 3000 if the "PORT" environment variable is not set.
port ENV.fetch("PORT", 8080)

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart

# Run the Solid Queue supervisor inside of Puma for single-server deployments
plugin :solid_queue if ENV["SOLID_QUEUE_IN_PUMA"]

# Specify the PID file.
pidfile ENV["PIDFILE"] if ENV["PIDFILE"]
