#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, jsonify, make_response, session, Blueprint
from flask_restful import Resource
from sqlalchemy.exc import NoResultFound
from datetime import datetime
from flask_cors import CORS


# Local imports
from config import app, db, api
from models import Tree, FruitType, User
# Add your model imports

# api = Blueprint('api', __name__)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class User(Resource):
    def get_user(self):
        users = db.session.execute(db.select(User)).scalars().all()
        users_list = [user.to_dict() for user in users]
        print("Session after login:", dict(session))
        return make_response({'User': users_list}, 200)

api.add_resource(User, '/user/<int:id>')

class Login(Resource):
    def post(self):
        params = request.json
        user = User.query.filter_by(username=params.get('username')).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        if user.authenticate(params.get('password')):
            session ['user_id'] = user.id
            return make_response(user.to_dict())
        else:
            return make_response({'error': 'Invalid username or password'}, 401)

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        return make_response({}, 204)

class Tree(Resource):
    def get_trees(self):
        trees = db.sesssion.execute(db.select(Tree)).scalars().all()
        return make_response([tree.to_dict() for tree in trees])

    def add_tree(self):
        params = request.json
        try:
            if not params.get('name'):
             return make_response({'error': ['Missing required field']}, 400)
        
            tree = Tree(name=params['name'])
            db.session.add(tree)
            db.session.commit()
            return jsonify({'success': True, 'id': tree.id})
        except Exception as e:
            return make_response({'errors': [str(e)]}, 400)
    
api.add_resource(Tree, '/trees')

class TreeById(Resource):
    def get_tree_id(self, id):
        try:
            tree = db.session.execute(db.select(Tree).filer_by(id=id)).scalar_one()
            params = request.json
            for key, value in params.items():
                setattr(tree, key, value)
            db.session.commit()
            return make_response(tree.to_dict(), 202)
        except NoResultFound:
            return make_response({'error': 'Tree not found'}, 404)
        except Exception as e:
            return make_response({'errors': [str()]}, 400)
        
api.add_resource(TreeById, '/fruit-type/<int:id>')

class FruitType(Resource):
    def get_fruit_type(self):
        fruit_types = db.session.execute(db.select(FruitType)).scalars().all()
        return make_response([fruit_type.to_dict()for fruit_type in fruit_types])

api.add_resource(FruitType, '/fruit-type')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


