from recommender.usercf_engine import UserCFRecommender

cf = UserCFRecommender()
recommendations = cf.recommend(target_user_id="u002", top_k_users=3, top_n_items=5)

for rec in recommendations:
    print(rec)