from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from db.db_pool import get_cursor, release_connection

game = Blueprint('game', __name__)

@game.route('/score', methods=['GET'])
@jwt_required()
def get_scores():
    #get user uuid
    username = get_jwt_identity()
    conn, cursor = get_cursor()
    try:
        cursor.execute("SELECT uuid FROM auth WHERE username=%s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify(status='error', msg='User not found'), 404

        user_id = user['uuid'] # pick user's uuid
        #fetch user score row
        cursor.execute('SELECT * FROM game_scores WHERE user_id=%s', (user_id,))
        score = cursor.fetchone()

        return jsonify(score), 200
    finally:
        release_connection(conn) #give conn back to pool

@game.route('/score', methods=['POST'])
@jwt_required()
def update_score(): #updating and/or adding score
    username = get_jwt_identity()
    heart_score = request.json.get('heart_score') #req.body.heart_score
    coin_score = request.json.get('coin_score')

    conn, cursor = get_cursor()
    try:
        cursor.execute("SELECT uuid FROM auth WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404

        user_id = user['uuid']

        # current row with current score
        cursor.execute("SELECT * FROM game_scores WHERE user_id = %s;", (user_id,))
        results = cursor.fetchone()

        if not results: #if no results, use default 0
            cursor.execute("INSERT INTO game_scores (user_id, heart_score, coin_score, total_hearts_earned, total_coins_earned)"
                           "VALUES (%s, 0, 0, 0, 0)", (user_id,))
            conn.commit()
            cursor.execute("SELECT * FROM game_scores WHERE user_id = %s;", (user_id,))
            results = cursor.fetchone()

        # update where available else keep current
        cursor.execute("UPDATE game_scores SET heart_score = GREATEST(0, heart_score + %s), " #add update, current
                       "coin_score = GREATEST(0, coin_score + %s), "
                       "total_hearts_earned = total_hearts_earned + GREATEST(%s, 0), " #always update score (add only if positive)
                       "total_coins_earned = total_coins_earned + GREATEST(%s, 0), "
                       "last_updated = now() "
                       "WHERE user_id = %s",
                       (heart_score or 0, coin_score or 0, heart_score or 0, coin_score or 0, user_id))
        conn.commit()
        return jsonify(status='ok', msg='Scores added'), 200

    finally:
        release_connection(conn)

@game.route('/admin/score', methods=['POST'])
@jwt_required()
def admin_add_score():
    # only admin can access
    claims = get_jwt()  # get JWT claims
    if claims.get("role_id") != 1:  # 1 = admin
        return jsonify(status="error", msg="Forbidden: Admins only"), 403

    # get input from request body
    username = request.json.get("username")
    heart_score = request.json.get("heart_score")
    coin_score = request.json.get("coin_score")

    if not username:
        return jsonify(status="error", msg="Username is required"), 400

    conn, cursor = get_cursor()
    try:
        # find user by username
        cursor.execute("SELECT uuid FROM auth WHERE username=%s;", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status="error", msg="User not found"), 404

        user_id = user["uuid"]

        # ensure score row exists
        cursor.execute("SELECT * FROM game_scores WHERE user_id=%s;", (user_id,))
        results = cursor.fetchone()
        if not results:
            cursor.execute(
                "INSERT INTO game_scores (user_id, heart_score, coin_score, total_hearts_earned, total_coins_earned) "
                "VALUES (%s, 0, 0, 0, 0);",
                (user_id,),
            )
            conn.commit()

        # increment scores
        cursor.execute(
            "UPDATE game_scores "
            "SET heart_score = GREATEST(0, heart_score + %s), "
            "coin_score = GREATEST(0, coin_score + %s), "
            "total_hearts_earned = total_hearts_earned + GREATEST(%s, 0), "
            "total_coins_earned = total_coins_earned + GREATEST(%s, 0), "
            "last_updated = now() "
            "WHERE user_id = %s",
            (heart_score or 0, coin_score or 0, heart_score or 0, coin_score or 0, user_id),
        )
        conn.commit()

        return jsonify(status="ok", msg=f"Scores updated for {username}"), 200

    finally:
        release_connection(conn)
