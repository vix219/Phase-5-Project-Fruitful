#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, jsonify, make_response, session, Blueprint
from flask_restful import Resource
from sqlalchemy.exc import NoResultFound
from datetime import datetime
from flask_cors import CORS 


# Local imports
from config import app, db, api
from models import Tree, User, FruitType
from flask_restful import Api
api = Api(app)



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
            new_user.password_hash = password  # assumes User model has a setter for this
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)

        except Exception as e:
            return {'error': str(e)}, 400



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
    def get(self):
        trees = db.session.execute(db.select(Tree)).scalars().all()
        return make_response([tree.to_dict() for tree in trees], 200)

    def post(self):
        params = request.json
        try:
            required_fields = ['lat', 'lng', 'user_id', 'fruit_type_id']
            for field in required_fields:
                if not params.get(field):
                    return make_response({'error': f'Missing {field}'}, 400)

            tree = Tree(
                lat=params['lat'],
                lng=params['lng'],
                user_id=params['user_id'],
                fruit_type_id=params['fruit_type_id'],
                notes=params.get('notes', '')
            )
            db.session.add(tree)
            db.session.commit()
            return jsonify({'success': True, 'id': tree.id}), 201
        except Exception as e:
            return make_response({'errors': [str(e)]}, 400)

    

class TreeByIdResource(Resource):
    def get(self, id):
        try:
            tree = db.session.execute(db.select(Tree).filter_by(id=id)).scalar_one()
            return make_response(tree.to_dict(), 200)
        except NoResultFound:
            return make_response({'error': 'Tree not found'}, 404)

    def put(self, id):
        try:
            tree = db.session.execute(db.select(Tree).filter_by(id=id)).scalar_one()
            params = request.json
            for key, value in params.items():
                setattr(tree, key, value)
            db.session.commit()
            return make_response(tree.to_dict(), 200)
        except NoResultFound:
            return make_response({'error': 'Tree not found'}, 404)
        except Exception as e:
            return make_response({'errors': [str(e)]}, 400)

    def delete(self, id):
        try:
            tree = db.session.execute(db.select(Tree).filter_by(id=id)).scalar_one()
            db.session.delete(tree)
            db.session.commit()
            return make_response({}, 204)
        except NoResultFound:
            return make_response({'error': 'Tree not found'}, 404)

    

class FruitTypeList(Resource):
    def get(self):
        fruit_types = db.session.execute(db.select(FruitType)).scalars().all()
        return [fruit.to_dict() for fruit in fruit_types], 200

api.add_resource(FruitTypeList, '/fruit-type')
api.add_resource(UserResource, '/users')
api.add_resource(Login, '/users/login')
api.add_resource(Logout, '/user/logout')
api.add_resource(Tree, '/trees')
api.add_resource(TreeByIdResource, '/trees/<int:id>')







if __name__ == '__main__':
    app.run(port=5555, debug=True)


