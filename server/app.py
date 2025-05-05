#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, jsonify, make_response, session, Blueprint
from flask_restful import Resource
from sqlalchemy.exc import NoResultFound
from datetime import datetime
from flask_cors import CORS 
import logging

# Local imports
from config import app, db, api
from models import Tree, User, FruitType, ForumPost
from flask_restful import Api
api = Api(app)

# Enable CORS
CORS(app, supports_credentials=True)

# Setup basic logging
logging.basicConfig(level=logging.DEBUG)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class UserResource(Resource):
    def get(self):
        users = db.session.execute(db.select(User)).scalars().all()
        users_list = [user.to_dict() for user in users]
        return make_response({'User': users_list}, 200)

    def post(self):
        data = request.get_json()
        try:
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not all([username, email, password]):
                return {'error': 'Missing required fields'}, 400

            new_user = User(username=username, email=email)
            new_user.password_hash = password  # Uses the setter to hash the password
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)

        except Exception as e:
            logging.error(f"Error in creating user: {str(e)}")
            return {'error': str(e)}, 400
        
class CurrentUser(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        user = User.query.get(user_id)
        if not user:
            return make_response({'error': 'User not found'}, 404)
        return make_response(user.to_dict(), 200)
        
class Login(Resource):
    def post(self):
        params = request.json
        user = User.query.filter_by(username=params.get('username')).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        if user.authenticate(params.get('password')):
            session['user_id'] = user.id
            return make_response(user.to_dict())
        else:
            return make_response({'error': 'Invalid username or password'}, 401)

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return make_response({}, 204)

class TreeListResource(Resource):
    def get(self):
        trees = Tree.query.all()
        return make_response([tree.to_dict() for tree in trees], 200)

    def post(self):
        params = request.get_json()
        if not params:
            return make_response({'error': 'Invalid JSON'}, 400)

        try:
            # Ensure required fields are present
            required_fields = ['lat', 'lng', 'user_id', 'fruit_type_id']
            for field in required_fields:
                if not params.get(field):
                    return make_response({'error': f'Missing {field}'}, 400)

            tree = Tree(
                lat=params['lat'],
                lng=params['lng'],
                user_id=params['user_id'],
                fruit_type_id=params['fruit_type_id'],
                notes=params.get('notes', ''),
                address=params.get('address', '')  # Address is optional
            )
            db.session.add(tree)
            db.session.commit()

            # Return tree data with a 201 status
            return jsonify(tree.to_dict()), 201  # Use jsonify for proper JSON response
        except Exception as e:
            logging.error(f"Error creating tree: {str(e)}")
            return make_response({'error': f"Failed to add tree: {str(e)}"}, 500)


class TreeByIdResource(Resource):
    def get(self, id):
        try:
            tree = Tree.query.get(id)
            if not tree:
                return make_response({'error': 'Tree not found'}, 404)
            return make_response(tree.to_dict(), 200)
        except Exception as e:
            logging.error(f"Error fetching tree by ID: {str(e)}")
            return make_response({'error': str(e)}, 400)

    def put(self, id):
        try:
            tree = Tree.query.get(id)
            if not tree:
                return make_response({'error': 'Tree not found'}, 404)
            params = request.json
            for key, value in params.items():
                setattr(tree, key, value)
            db.session.commit()
            return make_response(tree.to_dict(), 200)
        except Exception as e:
            logging.error(f"Error updating tree by ID: {str(e)}")
            return make_response({'errors': [str(e)]}, 400)

    def delete(self, id):
        try:
            tree = Tree.query.get(id)
            if not tree:
                return make_response({'error': 'Tree not found'}, 404)
            db.session.delete(tree)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            logging.error(f"Error deleting tree: {str(e)}")
            return make_response({'errors': [str(e)]}, 400)

class FruitTypeList(Resource):
    def get(self):
        fruit_types = db.session.execute(db.select(FruitType)).scalars().all()
        return [fruit.to_dict() for fruit in fruit_types], 200

    def post(self):
        data = request.get_json()
        try:
            fruit_name = data.get('fruit_name')
            image_url = data.get('image_url')
            info = data.get('info')
            season = data.get('season')

            if not all([fruit_name, image_url, info, season]):
                return {'error': 'All fields are required.'}, 400

            new_fruit = FruitType(
                fruit_name=fruit_name,
                image_url=image_url,
                info=info,
                season=season
            )
            db.session.add(new_fruit)
            db.session.commit()
            return new_fruit.to_dict(), 201

        except Exception as e:
            return {'error': str(e)}, 400
class FruitTypeById(Resource):
    def delete(self, id):
        fruit = FruitType.query.get(id)
        if not fruit:
            return {'error': 'Fruit type not found'}, 404

        db.session.delete(fruit)
        db.session.commit()
        return {}, 204

class ForumPostResource(Resource):
    def get(self):
        try:
            posts = ForumPost.query.order_by(ForumPost.created_at.desc()).all()
            return [post.to_dict() for post in posts], 200
        except Exception as e:
            print("Error fetching posts:", e)
            return {"error": "Internal Server Error"}, 500

    def post(self):
        try:
            data = request.get_json()
            new_post = ForumPost(
                user_id=data.get('user_id'),
                title=data['title'],
                content=data['content']
            )
            db.session.add(new_post)
            db.session.commit()
            return new_post.to_dict(), 201
        except Exception as e:
            print("Error creating post:", e)
            return {"error": "Failed to create post"}, 400

api.add_resource(ForumPostResource, '/forum_posts')
api.add_resource(FruitTypeList, '/fruit-type')
api.add_resource(FruitTypeById, '/fruit-type/<int:id>')
api.add_resource(UserResource, '/users')
api.add_resource(CurrentUser, '/current-user')
api.add_resource(Login, '/users/login')
api.add_resource(Logout, '/users/logout')
api.add_resource(TreeListResource, '/trees')
api.add_resource(TreeByIdResource, '/trees/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

