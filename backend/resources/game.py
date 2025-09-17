from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
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

        if not score: #score no exist
            return jsonify(heart_score=0,coin_score=0,total_hearts_earned=0,total_coins_earned=0), 200

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
