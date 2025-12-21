from django.urls import path
from .views import OrderCreateView, MyOrderListView, AdminOrderListView, AdminOrderStatusUpdateView

urlpatterns = [
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('my-orders/', MyOrderListView.as_view(), name='my-orders'),
    path('all-orders/', AdminOrderListView.as_view(), name='admin-all-orders'), 
    path('<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
]