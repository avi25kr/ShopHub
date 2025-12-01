import pandas as pd
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
from .mongo_connecter import get_database

class UserCFRecommender:
    def __init__(self, db=None):
        self.db = db if db is not None else get_database()
        self.products = pd.DataFrame(list(self.db["products"].find()))
        self.interactions = self._build_interactions()
        self._prepare()

    def _build_interactions(self):
        users = list(self.db["users"].find())
        interactions = []
        for user in users:
            uid = str(user["_id"])
            for state, collection in [("added", "cart"), ("liked", "wishlist"), ("bought", "orders")]:
                for item in user.get(collection, []):
                    if isinstance(item, dict):
                        # prefer "_id", fallback to "id"
                        pid = str(item.get("_id") or item.get("id"))
                    else:
                        pid = str(item)
                    interactions.append({"user_id": uid, "product_id": pid, "state": state})
        return pd.DataFrame(interactions)

    def _prepare(self):
        interaction_weight = {"bought": 1.0, "added": 0.5, "liked": 0.3}
        self.interactions["weight"] = self.interactions["state"].map(interaction_weight)

        self.user_item_matrix = self.interactions.pivot_table(
            index="user_id", columns="product_id", values="weight", fill_value=0.0
        )
        self.user_ids = self.user_item_matrix.index.tolist()
        self.product_ids = self.user_item_matrix.columns.tolist()

        self.user_sim_matrix = cosine_similarity(self.user_item_matrix.values)
        self.user_sim_df = pd.DataFrame(
            self.user_sim_matrix, index=self.user_ids, columns=self.user_ids
        )

    def recommend(self, target_user_id, top_k_users=5, top_n_items=5):
        if target_user_id not in self.user_ids:
            return []
        similar_users = (
            self.user_sim_df[target_user_id]
            .sort_values(ascending=False)
            .drop(target_user_id)[:top_k_users]
        )
        target_user_vector = self.user_item_matrix.loc[target_user_id]
        already_interacted = target_user_vector[target_user_vector > 0].index.tolist()

        scores = defaultdict(float)
        for sim_user_id, sim_score in similar_users.items():
            sim_user_vector = self.user_item_matrix.loc[sim_user_id]
            for product_id, weight in sim_user_vector.items():
                if product_id not in already_interacted:
                    scores[product_id] += weight * sim_score

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n_items]
        recommendations = []
        for pid, score in ranked:
            product = self.products[self.products["_id"] == pid].iloc[0]
            recommendations.append({
                "_id": product["_id"],
                "name": product["name"],
                "brand": product["brand"],
                "category": product["category"],
                "price": product["price"],
                "img": product["img"],
                "score": round(score, 4)
            })
        return recommendations
