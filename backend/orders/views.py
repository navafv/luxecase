from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Order
from .serializers import OrderSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save the order first
        order = serializer.save()

        # Send Confirmation Email
        user = self.request.user
        subject = f"Order Confirmed: #{order.id}"
        message = f"""
        Hi {user.first_name},

        Thank you for shopping with LuxeCase!
        
        Order ID: {order.id}
        Total: ₹{order.total_amount}
        Status: {order.status}

        We will notify you when your items are shipped.
        """
        
        # In production, use Celery for async emails to avoid slowing down the response
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email failed: {e}")

class MyOrderListView(generics.ListAPIView):
    """
    Returns only the orders belonging to the logged-in user.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
class AdminOrderListView(generics.ListAPIView):
    """
    Returns ALL orders (for Admins only).
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser] # Strict Admin check

class AdminOrderStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get('status')
        
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        return Response({'status': 'success', 'new_status': order.status})