import bcrypt

from flask import request, jsonify, Blueprint
from db.db_pool import get_cursor, release_connection
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['PUT'])
def register():
    inputs = request.get_json() #req.body
    username = inputs['username']
    password = inputs['password']

    # no empty fills
    if not username or not password: # if !username || !password
        return jsonify(status='error', msg='Username and password are required'), 400
    # password length min 12
    if len(password) < 12:
        return jsonify(status='error', msg='Password must be at least 12 characters.'), 400

    conn, cursor = get_cursor() #query tool
    # if username exists
    cursor.execute('SELECT uuid FROM auth WHERE username=%s', (username,))
    results = cursor.fetchone() #fetch 1 row from query
    if results:
        return jsonify(status='error', msg='Username already exist.'), 400

    hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()) #hashes password, gensalt = 12 times

    #insert new user
    cursor.execute('INSERT INTO auth (username, hash)'
                   'VALUES (%s, %s)', ( username.lower(), hash.decode('utf-8'))) #save username in lowercase

    conn.commit() #save transaction in SQL
    release_connection(conn) #give db connection back to pool

    return jsonify(status='ok', msg='Registration successful. Please login now.'), 200

@auth.route('/login', methods=['POST'])
def login():
    inputs = request.get_json()
    username = inputs['username']
    password = inputs['password']

    conn, cursor = get_cursor()
    cursor.execute('SELECT * FROM auth WHERE username=%s', (username,))
    results = cursor.fetchone() #findOne()

    release_connection(conn)

    if not results:
        return jsonify(status='error', msg='Incorrect username or password'), 401

    access = bcrypt.checkpw(password.encode('utf-8'), results['hash'].encode('utf-8'))

    if not access:
        return jsonify(status='error', msg='Incorrect username or password'), 401

    claims = {'role_id': results['role_id']} #store info in payload (read without DB query)
    access_token = create_access_token(results['username'], additional_claims=claims)  # jwt identity = username
    refresh_token = create_refresh_token(results['username'], additional_claims=claims)

    return jsonify(success=True, username=results['username'], joined_since=results['joined_since'], access=access_token, refresh=refresh_token), 200
@auth.route('/', methods=['GET'])
@jwt_required()
def get_all_user():
    # allowed for admin only
    # identity = get_jwt_identity() # grab username
    claims = get_jwt()  # full JWT payload, including role_id
    role_id = claims.get("role_id")
    if role_id != 1:  # 1 = admin
        return jsonify({"error": "Unauthorized"}), 403

    conn, cur = get_cursor()
    # cur.execute("SELECT role_id FROM auth WHERE username=%s", (identity,)) #grab logged in role by username
    # role = cur.fetchone()["role_id"] #findOne()

    # if role != 1:  # 1 = admin
    #     return jsonify({"error": "Unauthorized"}), 403

    cur.execute("SELECT * FROM auth;")
    users = cur.fetchall() #find()
    release_connection(conn)

    return jsonify(users), 200

@auth.route('/refresh') #assumed GET
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity() #the identity set earlier
    claims = get_jwt()

    access_token = create_access_token(identity, additional_claims=claims)

    return jsonify(access=access_token), 200