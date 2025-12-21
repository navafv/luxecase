from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    """Allows multiple images per product"""
    product = models.ForeignKey(Product, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')

class Variation(models.Model):
    """
    Handles attributes like 'Material: Velvet', 'Color: Red', 'Type: Plastic'
    """
    VARIATION_CATEGORY_CHOICES = (
        ('color', 'Color'),
        ('material', 'Material'),
        ('size', 'Size'),
        ('box_type', 'Box Type'), 
    )
    product = models.ForeignKey(Product, related_name='variations', on_delete=models.CASCADE)
    category = models.CharField(max_length=100, choices=VARIATION_CATEGORY_CHOICES)
    value = models.CharField(max_length=100) # e.g., 'Red', 'Velvet'
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} - {self.value}"