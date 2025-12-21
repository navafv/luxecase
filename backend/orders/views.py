from rest_framework import generics, permissions
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