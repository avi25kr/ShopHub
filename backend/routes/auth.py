from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from database import users
from middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if users.find_one({"email": data["email"]}):
        return jsonify({"message": "User already exists"}), 400
    
    hashed_pw = generate_password_hash(data["password"], method="pbkdf2:sha256", salt_length=8)
    users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_pw,
        "cart": [],  # empty cart at start
        "wishlist": [],  # empty wishlist at start
        "orders": []  # empty orders at start
    })
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = users.find_one({"email": data["email"]})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    from flask import current_app
    token = jwt.encode({
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, current_app.config["SECRET_KEY"], algorithm="HS256")

    user_cart = user.get("cart", [])
    user_wishlist = user.get("wishlist", [])
    user_orders = user.get("orders", [])    
    if not user_cart:
        user_cart = []

    print("user cart", user_cart)  
    return jsonify({
        "token": token,
        "user": {
            "email": user["email"],
            "name": user.get("name", ""),
            "cart": user_cart,
            "wishlist": user_wishlist,
            "orders": user_orders
        }
    })

@auth_bp.route("/protected", methods=["GET"])
@token_required
def protected(current_user):
    return jsonify({"message": f"Welcome {current_user['name']}!"})


@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    return jsonify({
        "user": {
            "email": current_user["email"],
            "name": current_user.get("name", "")
        }
    })

@auth_bp.route("/profile", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Update user data
    update_data = {}
    if "name" in data:
        update_data["name"] = data["name"]
    
    if update_data:
        users.update_one(
            {"email": current_user["email"]}, 
            {"$set": update_data}
        )
        
    return jsonify({"message": "Profile updated successfully"})

@auth_bp.route('/cart', methods=['POST'])
@token_required
def save_cart(current_user):
    data = request.get_json()
    cart = data.get('cart', [])
    users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"cart": cart}}
    )
    print("cart details", cart)
    return jsonify({"message": "Cart saved"}), 200


@auth_bp.route('/wishlist', methods=['POST'])
@token_required
def save_wishlist(current_user):
    data = request.get_json()
    wishlist = data.get('wishlist', [])
    users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"wishlist": wishlist}}
    )
    print("wishlist details", wishlist)
    return jsonify({"message": "Wishlist saved"}), 200
        

@auth_bp.route('/orders', methods=['POST'])
@token_required
def save_orders(current_user):
    data = request.get_json()
    orders = data.get('orders', [])
    users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"orders": orders}}
    )
    print("orders details", orders)
    return jsonify({"message": "Orders saved"}), 200
        



@auth_bp.route('/cart', methods=['GET'])
@token_required
def get_cart(current_user):
    user = users.find_one({"_id": current_user["_id"]})
    return jsonify(user.get("cart", [])), 200

