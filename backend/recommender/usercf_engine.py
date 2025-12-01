from recommender.mongo_connecter import get_database
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

class UserCFRecommender:
    
    def __init__(self, db=None):
        self.db = db if db is not None else get_database()
        self.products = pd.DataFrame(list(self.db["products"].find()))
        self.interactions = pd.DataFrame(list(self.db["user_interactions"].find()))
        self._prepare()

    def _prepare(self):
        # Build User-Item Interaction Matrix
        # Map interaction types to weights: bought = 1.0, added = 0.5
        interaction_weight = {
            "bought": 1.0,
            "added": 0.5,
            "liked": 0.3  
        }

        # Map interaction weights
        self.interactions["weight"] = self.interactions["state"].map(interaction_weight)

        # Pivot to get matrix: rows = user_id, columns = product_id
        self.user_item_matrix = self.interactions.pivot_table(
            index="user_id", columns="product_id", values="weight", fill_value=0.0
        )

        # Store user-product mapping for lookup
        self.user_ids = self.user_item_matrix.index.tolist()
        self.product_ids = self.user_item_matrix.columns.tolist()

        # Compute cosine similarity between all users
        self.user_sim_matrix = cosine_similarity(self.user_item_matrix.values)
        self.user_sim_df = pd.DataFrame(
            self.user_sim_matrix,
            index=self.user_ids,
            columns=self.user_ids
        )
        # Compute cosine similarity between all users
        self.user_sim_matrix = cosine_similarity(self.user_item_matrix.values)
        self.user_sim_df = pd.DataFrame(
            self.user_sim_matrix,
            index=self.user_ids,
            columns=self.user_ids
        )
        
    def recommend(self, target_user_id, top_k_users=5, top_n_items=5):
        if target_user_id not in self.user_ids:
            print("Unknown user!")
            return []
        
        # Find users most similar to the target user
        similar_users = (
            self.user_sim_df[target_user_id]
            .sort_values(ascending=False)
            .drop(target_user_id)[:top_k_users]
        )
        
        # Products the target user already interacted with
        target_user_vector = self.user_item_matrix.loc[target_user_id]
        already_interacted = target_user_vector[target_user_vector > 0].index.tolist()

        # Weighted product scores from similar users
        scores = defaultdict(float)
        for sim_user_id, sim_score in similar_users.items():
            sim_user_vector = self.user_item_matrix.loc[sim_user_id]
            for product_id, weight in sim_user_vector.items():
                if product_id not in already_interacted:
                    scores[product_id] += weight * sim_score

        # Sort and get top N
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n_items]
        
        # Return product details
        recommendations = []
        for pid, score in ranked:
            product = self.products[self.products["_id"] == pid].iloc[0]
            recommendations.append({
                "id": product["_id"],
                "name": product["name"],
                "category": product["category"],
                "score": round(score, 4)
            })
            
        return recommendations
    
    
    