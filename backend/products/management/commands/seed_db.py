import requests
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from products.models import Product, Category, Variation

class Command(BaseCommand):
    help = 'Seeds the database with sample LuxeCase products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # 1. Create Categories
        categories_data = [
            'Necklace Boxes',
            'Ring Boxes',
            'Bangle Boxes',
            'Travel Pouches'
        ]
        
        categories = {}
        for cat_name in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': slugify(cat_name)}
            )
            categories[cat_name] = cat
            if created:
                self.stdout.write(f'Created Category: {cat_name}')

        # 2. Sample Products Data
        products_data = [
            {
                'name': 'Royal Velvet Necklace Box',
                'category': 'Necklace Boxes',
                'price': 450.00,
                'description': 'Premium velvet finish with gold trim. Perfect for engagement gifts.',
                'image_url': 'https://placehold.co/600x600/800020/FFF.png?text=Velvet+Box',
                'variations': [
                    ('color', 'Red'), ('color', 'Blue'), ('material', 'Velvet')
                ]
            },
            {
                'name': 'Classic Leather Ring Case',
                'category': 'Ring Boxes',
                'price': 299.00,
                'description': 'Genuine leather exterior with soft suede interior lining.',
                'image_url': 'https://placehold.co/600x600/3E2723/FFF.png?text=Leather+Ring+Box',
                'variations': [
                    ('color', 'Black'), ('color', 'Brown'), ('material', 'Leather')
                ]
            },
            {
                'name': 'Silk Travel Jewelry Roll',
                'category': 'Travel Pouches',
                'price': 899.00,
                'description': 'Keep your jewelry organized and tangle-free while traveling.',
                'image_url': 'https://placehold.co/600x600/C0C0C0/000.png?text=Silk+Pouch',
                'variations': [
                    ('size', 'Small'), ('size', 'Large'), ('material', 'Silk')
                ]
            },
            {
                'name': 'Transparent Acrylic Bangle Box',
                'category': 'Bangle Boxes',
                'price': 650.00,
                'description': 'Clear acrylic box to showcase your bangle collection.',
                'image_url': 'https://placehold.co/600x600/E0F7FA/000.png?text=Acrylic+Box',
                'variations': [
                    ('box_type', 'Single Row'), ('box_type', 'Double Row')
                ]
            },
            {
                'name': 'Matte Finish Pendant Box',
                'category': 'Necklace Boxes',
                'price': 150.00,
                'description': 'Simple and elegant matte finish box for daily wear pendants.',
                'image_url': 'https://placehold.co/600x600/212121/FFF.png?text=Matte+Box',
                'variations': [
                    ('color', 'Black'), ('color', 'White')
                ]
            }
        ]

        # 3. Create Products
        for p_data in products_data:
            if Product.objects.filter(name=p_data['name']).exists():
                self.stdout.write(f"Skipping {p_data['name']} (Already exists)")
                continue

            category = categories[p_data['category']]
            
            product = Product.objects.create(
                category=category,
                name=p_data['name'],
                slug=slugify(p_data['name']),
                description=p_data['description'],
                price=p_data['price'],
                stock=50, # Default stock
                is_available=True
            )

            # Download and Save Image
            try:
                response = requests.get(p_data['image_url'])
                if response.status_code == 200:
                    file_name = f"{slugify(product.name)}.png"
                    product.image.save(file_name, ContentFile(response.content), save=True)
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to download image for {product.name}: {e}"))

            # Create Variations
            for cat, val in p_data['variations']:
                Variation.objects.create(
                    product=product,
                    category=cat,
                    value=val
                )

            self.stdout.write(self.style.SUCCESS(f"Created Product: {product.name}"))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))