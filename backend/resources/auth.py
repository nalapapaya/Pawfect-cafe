import bcrypt

from flask import request, jsonify, Blueprint #Schema, req, res
from db.db_pool import get_cursor, release_connection #connectDB
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt #for authentication

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
    cursor.execute(
        'INSERT INTO auth (username, hash) VALUES (%s, %s) RETURNING uuid',
        (username.lower(), hash.decode('utf-8'))
    )

    new_user = cursor.fetchone()  # get uuid of new user
    user_id = new_user['uuid']

    # give new user score
    cursor.execute(
        "INSERT INTO game_scores (user_id, coin_score, total_coins_earned) VALUES (%s, %s, %s)",
        (user_id, 200, 200)  # start with 200 coins
    )

    # give 3 x3 raw ingredients
    starter_raw_ids = [1, 2, 6]
    for raw_id in starter_raw_ids:
        cursor.execute(
            "INSERT INTO inventory (user_id, item_id, quantity) VALUES (%s, %s, %s)",
            (user_id, raw_id, 3)
        )

    # give 1 x combined food
    starter_combined_id = 14
    cursor.execute(
        "INSERT INTO inventory (user_id, item_id, quantity) VALUES (%s, %s, %s)",
        (user_id, starter_combined_id, 1)
    )

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

    cur.execute("SELECT * FROM auth;")
    users = cur.fetchall() #find()
    release_connection(conn)

    return jsonify(users), 200

@auth.route('/refresh') #assumed GET
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity() #the identity set earlier
    claims = {"role_id": get_jwt().get("role_id")} #easier to permission check (no need call DB)

    access_token = create_access_token(identity, additional_claims=claims)
    return jsonify(access=access_token), 200