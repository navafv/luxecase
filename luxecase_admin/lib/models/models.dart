class Product {
  final int id;
  final String name;
  final String slug;
  final String description;
  final double price;
  final int stock;
  final String image;
  final bool isAvailable;
  final Category? category;

  Product({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    required this.stock,
    required this.image,
    required this.isAvailable,
    this.category,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      slug: json['slug'],
      description: json['description'],
      price: double.parse(json['price'].toString()),
      stock: json['stock'],
      image: json['image'], // Contains full URL from Django
      isAvailable: json['is_available'],
      category: json['category'] != null ? Category.fromJson(json['category']) : null,
    );
  }
}

class Category {
  final int id;
  final String name;
  final String slug;

  Category({required this.id, required this.name, required this.slug});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(id: json['id'], name: json['name'], slug: json['slug']);
  }
}

class Order {
  final int id;
  final String fullName;
  final double totalAmount;
  final String status;
  final double amountPaid;
  final double balance;
  final String paymentMethod;
  final String paymentStatus;

  Order({
    required this.id,
    required this.fullName,
    required this.totalAmount,
    required this.status,
    required this.amountPaid,
    required this.balance,
    required this.paymentMethod,
    required this.paymentStatus,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      fullName: json['full_name'],
      totalAmount: double.parse(json['total_amount'].toString()),
      status: json['status'],
      amountPaid: double.parse(json['amount_paid'].toString()),
      balance: double.parse(json['balance'].toString()),
      paymentMethod: json['payment_method'],
      paymentStatus: json['payment_status'],
    );
  }
}

class AnalyticsData {
  final double totalRevenue;
  final int totalOrders;
  final int totalUsers;
  final List<SalesData> salesData;

  AnalyticsData({
    required this.totalRevenue,
    required this.totalOrders,
    required this.totalUsers,
    required this.salesData,
  });

  factory AnalyticsData.fromJson(Map<String, dynamic> json) {
    return AnalyticsData(
      totalRevenue: double.parse(json['total_revenue'].toString()),
      totalOrders: json['total_orders'],
      totalUsers: json['total_users'],
      salesData: (json['sales_data'] as List).map((e) => SalesData.fromJson(e)).toList(),
    );
  }
}

class SalesData {
  final String name;
  final double revenue;

  SalesData({required this.name, required this.revenue});

  factory SalesData.fromJson(Map<String, dynamic> json) {
    return SalesData(
      name: json['name'],
      revenue: double.parse(json['revenue'].toString()),
    );
  }
}