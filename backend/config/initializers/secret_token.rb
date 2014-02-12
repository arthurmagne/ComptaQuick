# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Backend::Application.config.secret_key_base = '3c108e86533cdcd139b19c3d5bf46ab1f792d3769af740bcfd2c933b42418947aa6c68dc810cb1a3db6c916273f4ea12e161aecb175e96e22e88caaf378b7fb2'
