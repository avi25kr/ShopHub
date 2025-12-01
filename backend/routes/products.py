from flask import Blueprint, request, jsonify
from database import products
from recom.hybrid_engine import HybridRecommender
from recom.mongo_connecter import get_database
from middleware import token_required



db= get_database()
hybrid= HybridRecommender(db=db)

products_bp = Blueprint('products', __name__)

@products_bp.route("/products", methods=["GET"])
def get_products():
    try:
        category = request.args.get('category')
        brand = request.args.get('brand')
        
        query = {}
        if category:
            query['category'] = category
        if brand:
            query['brand'] = brand
            
        products_list = list(products.find(query))
        return jsonify(products_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@products_bp.route("/products/<product_id>", methods=["GET"])
def get_product(product_id):
    try:
        product = products.find_one({"_id": product_id})
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@products_bp.route("/recommendations", methods=["GET"])
@token_required
def homepage(current_user):
    user_id = current_user.get("_id")
    recommendations = []
    if user_id:
        user = db["users"].find_one({"_id": user_id})
        if user:
            cart_ids = [item["_id"] for item in user.get("cart", [])]
            recommendations = hybrid.recommend(user_id, cart_ids=cart_ids, top_n=5)

    return jsonify({
        "recommendations": recommendations
    })

