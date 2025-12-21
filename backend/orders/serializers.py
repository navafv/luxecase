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
        # Security: Prevent frontend from editing these
        read_only_fields = ['total_amount', 'user', 'status', 'is_paid']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        calculated_total = 0
        
        # 1. Validation Phase (Check Stock & Price)
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'])
                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}. Only {product.stock} left."
                    )
                calculated_total += product.price * item['quantity']
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product {item['product_id']} does not exist")

        # 2. Creation Phase (Atomic Transaction)
        with transaction.atomic():
            order = Order.objects.create(
                user=user, 
                total_amount=calculated_total, 
                **validated_data
            )

            for item in items_data:
                product = Product.objects.select_for_update().get(id=item['product_id'])
                
                # Double check stock inside transaction
                if product.stock < item['quantity']:
                    raise serializers.ValidationError(f"Stock changed! {product.name} is out of stock.")

                # Deduct Stock
                product.stock -= item['quantity']
                product.save()

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    price=product.price,
                    quantity=item['quantity'],
                    variations=item.get('variations', '')
                )
        
        return order