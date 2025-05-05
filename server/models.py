from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy import event
from config import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_bcrypt import Bcrypt
# import ipdb

bcrypt = Bcrypt()  



# Models go here!

class Tree(db.Model, SerializerMixin):
    __tablename__ = 'trees'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    fruit_type_id = db.Column(db.Integer, db.ForeignKey('fruit_types.id'), nullable=False)
    notes = db.Column(db.String(200))
    address = db.Column(db.String(255))  # Optional

    fruit_type = db.relationship('FruitType', back_populates='trees')
    user = db.relationship('User', back_populates='trees')

    serialize_rules = ('-user._password_hash', '-user.trees', '-fruit_type.trees')

    def __repr__(self):
        return f"<Tree {self.id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'lat': self.lat,
            'lng': self.lng,
            'user_id': self.user_id,
            'fruit_type_id': self.fruit_type_id,
            'notes': self.notes,
            'address': self.address,
            'fruit_type': self.fruit_type.to_dict() if self.fruit_type else {"fruit_name": "Unknown Fruit"},
            'user': self.user.to_dict() if self.user else None
        }


class FruitType(db.Model, SerializerMixin):
    __tablename__ =  'fruit_types'
    id = db.Column(db.Integer, primary_key=True)
    fruit_name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=False)
    info = db.Column(db.String, nullable=False)
    season = db.Column(db.String, nullable=False)

    trees = db.relationship('Tree', back_populates='fruit_type')


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    trees = db.relationship('Tree', back_populates='user', cascade='all, delete-orphan')

    @validates('email')
    def validate_email(self, key, value):
        if value and '@' not in value:
            raise ValueError('Invalid email address.')
        return value
    
    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Password checking on login
    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)
    
    def __repr__(self):
        return f"<User {self.username}>"

class ForumPost(db.Model, SerializerMixin):
    __tablename__ = 'forum_posts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Nullable for guest posts
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='forum_posts')

    serialize_rules = ('-user._password_hash', '-user.trees',)

    def __repr__(self):
        return f"<ForumPost {self.title[:20]}...>"
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'user': self.user.to_dict() if self.user else None
        }
