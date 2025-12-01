from .cosine_engine import CosineRecommender
from .usercf_engine import UserCFRecommender

class HybridRecommender:
    def __init__(self, db=None):
        self.cosine = CosineRecommender(db=db)
        self.cf = UserCFRecommender(db=db)
        self.products = self.cosine.products

    def recommend(self, user_id, cart_ids, top_n=5, alpha=0.6):
        cos_recs = self.cosine.recommend(cart_ids, top_n=top_n * 2)
        cf_recs = self.cf.recommend(user_id, top_k_users=5, top_n_items=top_n * 2)

        cos_lookup = {rec["_id"]: rec for rec in cos_recs}
        cf_lookup = {rec["_id"]: rec["score"] for rec in cf_recs}
        all_ids = set(cos_lookup.keys()) | set(cf_lookup.keys())

        hybrid_scores = []
        for pid in all_ids:
            cos_score = cos_lookup.get(pid, {}).get("cosine_score", 0.0)
            cf_score = cf_lookup.get(pid, 0.0)
            final_score = alpha * cos_score + (1 - alpha) * cf_score
            product = self.products[self.products["_id"] == pid].iloc[0].to_dict()
            hybrid_scores.append({
                "_id": product["_id"],
                "name": product["name"],
                "brand": product["brand"],
                "category": product["category"],
                "description": product.get("description", ""),
                "price": product["price"],
                "img": product["img"],
                "cosine_score": round(float(cos_score), 4),
                "cf_score": round(float(cf_score), 4),
                "final_score": round(float(final_score), 4)
            })
        return sorted(hybrid_scores, key=lambda x: x["final_score"], reverse=True)[:top_n]
