from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSchema(serializers.Serializer):
    """
    This is a 'helper' serializer to validate the incoming items payload.
    It's not connected directly to a model, just helps input validation.
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    variations = serializers.CharField(required=False, allow_blank=True)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSchema(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'address', 'city', 'phone', 
            'total_amount', 'status', 'is_paid', 'created_at', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # Senior Dev Pattern: Create Order first
        order = Order.objects.create(user=user, **validated_data)

        # Then loop through items and create them
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                price=product.price, # Freeze the price at time of purchase
                quantity=item['quantity'],
                variations=item.get('variations', '')
            )
        
        return order