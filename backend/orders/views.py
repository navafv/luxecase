from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework import generics, permissions, views, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from .models import Order
from .serializers import OrderSerializer
from users.models import User

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

class AdminOrderUpdateView(views.APIView):
    """
    Unified view for Admins to update Status AND Payment Info.
    """
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        
        # Update Status if provided
        if 'status' in request.data:
            order.status = request.data['status']
        
        # Update Payment Info if provided
        if 'amount_paid' in request.data:
            order.amount_paid = request.data['amount_paid']
        if 'payment_method' in request.data:
            order.payment_method = request.data['payment_method']
        if 'payment_note' in request.data:
            order.payment_note = request.data['payment_note']

        order.save()
        return Response({'status': 'success', 'msg': 'Order updated'})

class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # 1. Total Stats
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.count()
        total_users = User.objects.count()

        # 2. Monthly Sales (for the Chart)
        monthly_sales = (
            Order.objects
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(revenue=Sum('total_amount'), count=Count('id'))
            .order_by('month')
        )

        # 3. Recent Orders (Top 5)
        recent_orders = Order.objects.all().order_by('-created_at')[:5].values(
            'id', 'full_name', 'total_amount', 'status'
        )

        return Response({
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_users': total_users,
            'sales_data': [
                {
                    'name': sales['month'].strftime('%b'), # e.g., "Jan"
                    'revenue': sales['revenue'],
                    'orders': sales['count']
                } for sales in monthly_sales
            ],
            'recent_orders': recent_orders
        })