from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from sklearn.neighbors import NearestNeighbors

app = FastAPI()

class OrderItem(BaseModel):
    user_id: int
    product_id: int
    quantity: int

class RecommendationRequest(BaseModel):
    user_id: int
    order_items: list[OrderItem]

@app.post("/recommend")
def recommend(data: RecommendationRequest):
    if not data.order_items:
        return {"recommended_product_ids": []}
    df = pd.DataFrame([item.dict() for item in data.order_items])
    matrix = df.pivot_table(
        index="user_id",
        columns="product_id",
        values="quantity",
        fill_value=0
    )

    if data.user_id not in matrix.index:
        return {"recommended_product_ids": []}
    model = NearestNeighbors(metric="cosine", algorithm="brute")
    model.fit(matrix)

    distances, indices = model.kneighbors(
        [matrix.loc[data.user_id]],
        n_neighbors=min(3, len(matrix))
    )

    similar_users = matrix.iloc[indices[0]]

    scores = similar_users.sum().sort_values(ascending=False)

    bought_products = set(
        df[df["user_id"] == data.user_id]["product_id"]
    )

    recommendations = [
        pid for pid in scores.index
        if pid not in bought_products
    ]

    return {
        "recommended_product_ids": recommendations[:8]
    }
