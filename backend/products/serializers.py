from rest_framework import serializers
from .models import Product, Category, Variation, ProductImage

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

class ProductSerializer(serializers.ModelSerializer):
    """
    Main serializer for listing products.
    Nested serializers allow us to get related data in one API call.
    """
    category = CategorySerializer(read_only=True)
    variations = VariationSerializer(many=True, read_only=True)
    gallery = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'stock', 'is_available', 'image', 'category', 
            'variations', 'gallery', 'created_at'
        ]