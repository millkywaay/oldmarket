import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import ProductCard from "../components/common/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

const YourRecommendationsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token || !user) {
        setError("Please log in to see your recommendations.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load recommendations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [user, token]);

  return (
    <div className="pb-16">
      <header className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-black">
            Specially For You{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            These recommendations are generated using our machine learning
            system based on your activity.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12">
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <strong>How this works:</strong> We use a machine learning recommendation
          system (KNN-based collaborative filtering). If your data is still
          limited, we’ll show popular products instead.
        </div>

        {isLoading ? (
          <LoadingSpinner message="Finding recommendations for you..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-10">
            We don’t have enough data yet. Explore our{" "}
            <Link
              to="/products"
              className="text-black font-semibold hover:underline"
            >
              full collection
            </Link>
            .
          </p>
        )}
      </main>
    </div>
  );
};

export default YourRecommendationsPage;
