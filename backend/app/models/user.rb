class User < ActiveRecord::Base

  attr_accessor :password
  attr_protected :password_digest

  validates :firstname, :presence => true
  validates :lastname, :presence => true
  validates :email, :presence => true, :uniqueness => true, :email => true
  validates :password, :presence => true, :confirmation => true
  validates :password_confirmation, :presence => { :if => :password }

  def password=(pass)
    return if pass.blank?
    @password = pass
    self.password_digest = BCrypt::Password.create(pass)
  end

end
