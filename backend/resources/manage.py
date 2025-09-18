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

@manage.route('/inventory', methods=['POST'])
@jwt_required()
def update_inventory():
    username = get_jwt_identity()  # get username from JWT
    conn, cursor = get_cursor()    # open DB connection

    try:
        # fetch user uuid
        cursor.execute("SELECT uuid FROM auth WHERE username=%s;", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404

        user_id = user['uuid']
        data = request.get_json()  # body = item_id + qty

        for input in data: # loop object in req.body
            item_id = input.get("item_id") # get item id from input
            qty_change = input.get("qty", 0) # get qty from input

            if not item_id or qty_change == 0: #skip if no changes
                continue

            # fetch item name from items table
            cursor.execute("SELECT name FROM items WHERE id=%s;", (item_id,))
            item = cursor.fetchone()
            item_name = item['name'] if item else f"Item ID {item_id}" #fallback for item name

            # check if item exist in user inv
            cursor.execute(
                "SELECT quantity FROM inventory WHERE user_id=%s AND item_id=%s;",
                (user_id, item_id)
            )
            existing = cursor.fetchone()

            if existing:  # item found
                new_qty = existing['quantity'] + qty_change #change item qty

                if new_qty < 0: #user once owned item but now qty = 0
                    conn.rollback()  #cancel all changes
                    return jsonify(
                        status="error",
                        msg=f"Invalid deduction: You do not have enough {item_name}"
                    ), 400

                cursor.execute(
                    "UPDATE inventory SET quantity=%s WHERE user_id=%s AND item_id=%s;",
                    (new_qty, user_id, item_id)
                )

            else:  # item not found
                if qty_change > 0: #upsert
                    cursor.execute(
                        "INSERT INTO inventory (user_id, item_id, quantity) VALUES (%s, %s, %s);",
                        (user_id, item_id, qty_change)
                    )
                else:  # invalid deduction (does search user inventory or all items?)
                    conn.rollback()  # cancel earlier updates
                    return jsonify(
                        status="error",
                        msg=f"Invalid deduction: {item_name} is not in inventory"
                    ), 400

        conn.commit()  # only save if all updates/inserts succeed
        return jsonify(status="ok", msg="Inventory updated"), 200

    except Exception as e:
        conn.rollback()
        return jsonify(status="error", msg=str(e)), 500

    finally:
        release_connection(conn)

@manage.route('/inventory/combine', methods=['POST'])
@jwt_required()
def combine_food():
    username = get_jwt_identity()
    conn, cursor = get_cursor()
    try:
        # fetch user uuid
        cursor.execute("SELECT uuid FROM auth WHERE username=%s;", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify(status='error', msg='User not found'), 404
        user_id = user['uuid']

        # body = item_id, qty
        data = request.get_json()
        if not data:
            return jsonify(status='error', msg='No ingredients provided'), 400

        # deduct inventory
        for entry in data:
            item_id = entry.get("item_id")
            qty_change = entry.get("qty", 0)

            if not item_id or qty_change == 0:
                continue

            # fetch item name
            cursor.execute("SELECT name FROM items WHERE id=%s;", (item_id,))
            item = cursor.fetchone()
            item_name = item['name'] if item else f"Item ID {item_id}"

            # check inventory
            cursor.execute(
                "SELECT quantity FROM inventory WHERE user_id=%s AND item_id=%s;",
                (user_id, item_id)
            )
            existing = cursor.fetchone()
            if not existing or existing['quantity'] + qty_change < 0:
                conn.rollback()
                return jsonify(status="error", msg=f"Not enough {item_name}"), 400

            # update quantity
            cursor.execute(
                "UPDATE inventory SET quantity=%s WHERE user_id=%s AND item_id=%s;",
                (existing['quantity'] + qty_change, user_id, item_id)
            )

        # determine result (combined item)
        # collect used item_ids
        used_ids = sorted([e["item_id"] for e in data if e.get("qty", 0) < 0]) #get dict with qty -1 for deduction

        cursor.execute("SELECT result_item_id, required_items FROM recipes;")
        recipes = cursor.fetchall()

        result_item_id = 25  # fallback = kibbles (id 25)
        for recipe in recipes:
            required_items = sorted(list(recipe['required_items'])) #convert list to value and arrange in ascending number
            if used_ids == required_items:
                result_item_id = recipe['result_item_id']
                break

        # add combined item to inv
        cursor.execute(
            "INSERT INTO inventory (user_id, item_id, quantity) "
            "VALUES (%s, %s, 1) "
            "ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = inventory.quantity + 1;",
            (user_id, result_item_id)
        )

        # fetch result item name
        cursor.execute("SELECT name FROM items WHERE id=%s;", (result_item_id,))
        result_item = cursor.fetchone()
        item_name = result_item['name'] if result_item else f"Item {result_item_id}"

        conn.commit()

        cursor.execute(
            "SELECT id, name, image_url, item_type, diet_type "
            "FROM items WHERE id = %s",
            (result_item_id,)
        )
        combined_item = cursor.fetchone()

        return jsonify(
            status="ok",
            msg=f"Combined into {item_name}",
            item_id=result_item_id,
            item_name=item_name,
            image_url=combined_item["image_url"],
        ), 200

    except Exception as e:
        conn.rollback()
        return jsonify(status="error", msg=str(e)), 500
    finally:
        release_connection(conn)

