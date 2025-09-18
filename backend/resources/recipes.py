from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.db_pool import get_cursor, release_connection

recipes = Blueprint("recipes", __name__)

# GET all recipes for user
@recipes.route("/", methods=["GET"])
@jwt_required()
def get_recipes():
    username = get_jwt_identity()
    conn, cursor = get_cursor()
    try:
        #find user uuid from username
        cursor.execute("SELECT uuid FROM auth WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404

        user_id = user['uuid']

        #get recipes for user
        cursor.execute("SELECT * FROM user_recipes WHERE user_id=%s", (user_id,))
        recipes = cursor.fetchall()
        return jsonify(recipes), 200

    except Exception as e:
        return jsonify(status='error', msg=str(e)), 500
    finally:
        release_connection(conn)

@recipes.route("/", methods=["POST"])
@jwt_required()
def add_recipe():
    username = get_jwt_identity()
    conn, cursor = get_cursor()
    try:
        # lookup uuid from username
        cursor.execute("SELECT uuid FROM auth WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404
        user_id = user['uuid']

        # parse body
        data = request.get_json()
        ing1, ing2, ing3, combined = ( #extract fills
            data.get("ing1"),
            data.get("ing2"),
            data.get("ing3"),
            data.get("combined"),
        )

        # insert recipe
        cursor.execute(
            "INSERT INTO user_recipes (user_id, ing1, ing2, ing3, combined) VALUES (%s, %s, %s, %s, %s) RETURNING *",
            (user_id, ing1, ing2, ing3, combined),
        )
        recipe = cursor.fetchone()
        conn.commit()

        return jsonify(recipe), 201
    except Exception as e:
        return jsonify(status='error', msg=str(e)), 500
    finally:
        release_connection(conn)

@recipes.route("/<recipe_id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(recipe_id):
    username = get_jwt_identity()
    conn, cursor = get_cursor()
    try:
        # lookup uuid from username
        cursor.execute("SELECT uuid FROM auth WHERE username=%s", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404
        user_id = user['uuid']

        # delete only if owned by user
        cursor.execute(
            "DELETE FROM user_recipes WHERE id=%s AND user_id=%s",
            (recipe_id, user_id),
        )
        conn.commit()
        return jsonify(status="ok", msg="Recipe deleted"), 200
    except Exception as e:
        return jsonify(status='error', msg=str(e)), 500
    finally:
        release_connection(conn)
