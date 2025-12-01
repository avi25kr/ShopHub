import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .mongo_connecter import get_database

class CosineRecommender:
    def __init__(self, db=None):
        self.db = db if db is not None else get_database()
        self.products = pd.DataFrame(list(self.db["products"].find()))
        self._prepare()

    def _prepare(self):
        self.products["_text"] = (
            self.products.get("name", "") + " " +
            self.products.get("brand", "") + " " +
            self.products.get("category", "") + " " +
            self.products.get("description", "")
        )
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.products["_text"])
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

    def recommend(self, cart_ids, top_n=5):
        cart_idx = self.products.index[self.products['_id'].isin(cart_ids)].tolist()
        if not cart_idx:
            return []
        avg_sim = self.similarity_matrix[cart_idx].mean(axis=0)
        ranked_indices = avg_sim.argsort()[::-1]
        recommendations = []
        for idx in ranked_indices:
            pid = self.products.iloc[idx]['_id']
            if pid in cart_ids:
                continue
            recommendations.append({
                '_id': pid,
                'name': self.products.iloc[idx].get('name', ''),
                'cosine_score': float(avg_sim[idx])
            })
            if len(recommendations) >= top_n:
                break
        return recommendations
