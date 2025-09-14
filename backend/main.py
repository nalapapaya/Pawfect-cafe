import os

# import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from resources.auth import auth
from resources.game import game
from resources.manage import manage

# from db.db_pool import get_cursor, release_connection

app = Flask(__name__) #this file name
CORS(app)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') # [go in key]
jwt=JWTManager(app) #distributes JWT related info to whoever needs it

#wrapper
@jwt.expired_token_loader
@jwt.invalid_token_loader
@jwt.unauthorized_loader
@jwt.needs_fresh_token_loader
@jwt.revoked_token_loader
def my_jwt_error_callback(*args): #function called when error occurs
    return jsonify(msg='access denied'), 401 #send a generic error msg

# app.register_blueprint(tools)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(game, url_prefix='/api')
app.register_blueprint(manage, url_prefix='/manage')

if __name__ == '__main__': #name of file in system (called by python)
    app.run(port=5001, debug=os.getenv('DEBUG', False))