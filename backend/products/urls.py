from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ReviewCreateView, WishlistToggleView, WishlistListView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'', ProductViewSet)

urlpatterns = [
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'), # Must be before router
    path('wishlist/<int:product_id>/', WishlistToggleView.as_view(), name='wishlist-toggle'),
    path('<int:product_id>/review/', ReviewCreateView.as_view(), name='review-create'),
    path('', include(router.urls)),
]