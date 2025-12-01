from recommender.mongo_connecter import get_database
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# dbs = get_database()
# pr = pd.DataFrame(list(dbs["products"].find()))
# print(pr)

class CosineRecommender:
    """
    CosineRecommender connects to MongoDB, loads product data,
    vectorizes textual features using TF-IDF, computes a cosine
    similarity matrix, and exposes a recommend method based
    on items in the user's cart.
    """
    
    def __init__(self, db=None):
        # Initialize database connection
        self.db = db if db is not None else get_database()
        # Load products from MongoDB into a DataFrame
        self.products = pd.DataFrame(list(self.db["products"].find()))
        # Prepare TF-IDF and similarity matrix
        self._prepare()

    def _prepare(self):
        # Combine relevant text fields for vectorization
        self.products["_text"] = (
            self.products.get("name", "") + " " +
            self.products.get("brand", "") + " " +
            self.products.get("category", "") + " " +
            self.products.get("description", "")
        )
        # Initialize and fit TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.products["_text"])
        # Compute the pairwise cosine similarity matrix
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

    def recommend(self, cart_ids, top_n=5):
        """
        Recommend top_n products based on the average cosine similarity
        of the products currently in the cart.

        :param cart_ids: list of product _id values in the cart
        :param top_n: number of recommendations to return
        :return: list of dicts with keys 'id', 'name', and 'score'
        """
        
        # Map cart product IDs to DataFrame indices
        cart_idx = self.products.index[self.products['_id'].isin(cart_ids)].tolist()
        if not cart_idx:
            return []
        # Compute average similarity across all items in the cart
        avg_sim = self.similarity_matrix[cart_idx].mean(axis=0)
        # Rank all product indices by similarity (desc)
        ranked_indices = avg_sim.argsort()[::-1]
        # Build recommendation list, excluding items already in cart
        recommendations = []
        for idx in ranked_indices:
            pid = self.products.iloc[idx]['_id']
            if pid in cart_ids:
                continue
            recommendations.append({
                'id': pid,
                'name': self.products.iloc[idx].get('name', ''),
                'cosine_score': float(avg_sim[idx])
            })
            if len(recommendations) >= top_n:
                break
        return recommendations



