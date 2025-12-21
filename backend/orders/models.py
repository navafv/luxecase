from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    PAYMENT_METHOD_CHOICES = (
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Cheque', 'Cheque'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Credit', 'Credit (Pay Later)'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    
    # Shipping Info
    full_name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    
    # Order Info
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    # B2B Payment Tracking
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, default='Credit', blank=True)
    payment_note = models.TextField(blank=True, help_text="e.g. Cheque No: 123456 or UPI Transaction ID")

    @property
    def balance(self):
        return self.total_amount - self.amount_paid

    @property
    def payment_status(self):
        if self.amount_paid >= self.total_amount:
            return "Paid"
        elif self.amount_paid > 0:
            return "Partial"
        return "Unpaid"

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    variations = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"