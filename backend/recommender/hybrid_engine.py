from recommender.cosine_engine import CosineRecommender
from recommender.usercf_engine import UserCFRecommender

class HybridRecommender:
    def __init__(self, db=None):
        self.cosine = CosineRecommender(db=db)
        self.cf = UserCFRecommender(db=db)
        self.products = self.cosine.products  # shared product source

    def recommend(self, user_id, cart_ids, top_n=5, alpha=0.6):
        # Step 1: Get recommendations from both engines
        cos_recs = self.cosine.recommend(cart_ids, top_n=top_n * 2)
        cf_recs = self.cf.recommend(user_id, top_k_users=5, top_n_items=top_n * 2)

        # Step 2: Create lookups
        cos_lookup = {rec["id"]: rec for rec in cos_recs}
        cf_lookup = {rec["id"]: rec["score"] for rec in cf_recs}

        # Step 3: Union of product IDs
        all_ids = set(cos_lookup.keys()) | set(cf_lookup.keys())

        # Step 4: Merge scores
        hybrid_scores = []
        for pid in all_ids:
            cos_score = cos_lookup.get(pid, {}).get("cosine_score", 0.0)
            cf_score = cf_lookup.get(pid, 0.0)
            final_score = alpha * cos_score + (1 - alpha) * cf_score

            name = cos_lookup.get(pid, {}).get("name") or self.products[self.products['_id'] == pid]["name"].values[0]

            hybrid_scores.append({
                "id": pid,
                "name": name,
                "cosine_score": cos_score,
                "cf_score": cf_score,
                "final_score": final_score
            })

        # Step 5: Sort by final score
        sorted_recs = sorted(hybrid_scores, key=lambda x: x["final_score"], reverse=True)
        return sorted_recs[:top_n]

hybrid = HybridRecommender()
cart = ["p101", "p102"]  # products added by user
user_id = "u008"

recs = hybrid.recommend(user_id, cart_ids=cart, top_n=5)
for r in recs:
    print(r)