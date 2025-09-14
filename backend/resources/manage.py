from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.db_pool import get_cursor, release_connection

#for item related
manage = Blueprint('manage', __name__)

@manage.route('/catalog', methods=['GET'])
def get_item_catalog():
    conn, cursor = get_cursor()
    cursor.execute("SELECT * FROM items;")
    items = cursor.fetchall()
    release_connection(conn)
    return jsonify(items), 200

@manage.route('/inventory/raw', methods=['GET'])
@jwt_required()
def get_user_raw_inventory():
    username = get_jwt_identity()
    conn, cursor = get_cursor()

    #fetch user
    cursor.execute("SELECT uuid FROM auth WHERE username=%s;", (username,))
    user = cursor.fetchone()
    if not user:
        release_connection(conn)
        return jsonify(status='error', msg='User not found'), 404

    # fetch only raw items
    cursor.execute("SELECT i.id, i.name, i.description, i.image_url, i.item_type, i.diet_type, inv.quantity "
                   "FROM inventory AS inv "
                   "JOIN items AS i ON inv.item_id = i.id " #link both using item id
                   "WHERE inv.user_id = %s AND i.item_type = 'raw';", (user['uuid'],))
    rows = cursor.fetchall()
    release_connection(conn)
    return jsonify(rows), 200

@manage.route('/inventory/menu', methods=['GET'])
@jwt_required()
def get_user_menu_inventory():
    username = get_jwt_identity()
    conn, cursor = get_cursor()

    # fetch user
    cursor.execute("SELECT uuid FROM auth WHERE username=%s;", (username,))
    user = cursor.fetchone()
    if not user:
        release_connection(conn)
        return jsonify(status='error', msg='User not found'), 404

    # fetch only combined items
    cursor.execute("SELECT i.id, i.name, i.description, i.image_url, i.item_type, i.diet_type, inv.quantity "
                   "FROM inventory AS inv "
                   "JOIN items AS i ON inv.item_id = i.id "
                   "WHERE inv.user_id = %s AND i.item_type = 'combined';", (user['uuid'],))
    rows = cursor.fetchall()
    release_connection(conn)
    return jsonify(rows), 200