from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product
from django.db import transaction

class OrderItemSchema(serializers.Serializer):
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
        # Make total_amount read-only so the frontend can't dictate the price
        read_only_fields = ['total_amount', 'user', 'status', 'is_paid']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # 1. Calculate total price securely on the backend
        calculated_total = 0
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'])
                calculated_total += product.price * item['quantity']
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product {item['product_id']} does not exist")

        # 2. Create Order Atomically (All or Nothing)
        with transaction.atomic():
            order = Order.objects.create(
                user=user, 
                total_amount=calculated_total, 
                **validated_data
            )

            for item in items_data:
                product = Product.objects.get(id=item['product_id'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    price=product.price,
                    quantity=item['quantity'],
                    variations=item.get('variations', '')
                )
        
        return order