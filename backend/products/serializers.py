from rest_framework import serializers
from .models import Product, Category, Variation, ProductImage, Review, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class VariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variation
        fields = ['id', 'category', 'value', 'is_active']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.first_name') # Show name, not ID

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    variations = VariationSerializer(many=True, read_only=True)
    gallery = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    # Custom Field: Average Rating
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'stock', 'is_available', 'image', 'category', 
            'variations', 'gallery', 'created_at', 
            'reviews', 'rating'
        ]

    def get_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)
    
class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True) # Nested to show full product details

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']