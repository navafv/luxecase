from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    """
    Allows authenticated users to place an order.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class MyOrderListView(generics.ListAPIView):
    """
    Returns only the orders belonging to the logged-in user.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')