import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../models/models.dart';
import '../core/constants.dart';
import 'product_form_screen.dart';

class ProductsScreen extends StatefulWidget {
  @override
  _ProductsScreenState createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final ApiClient _api = ApiClient();
  List<Product> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  void fetchProducts() async {
    try {
      final response = await _api.client.get('/products/');
      setState(() {
        products = (response.data as List).map((e) => Product.fromJson(e)).toList();
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
    }
  }

  void deleteProduct(String slug) async {
    await _api.client.delete('/products/$slug/');
    fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Products"), backgroundColor: AppConstants.darkBg, foregroundColor: AppConstants.primaryGold),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppConstants.primaryGold,
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProductFormScreen())).then((_) => fetchProducts()),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                final p = products[index];
                return ListTile(
                  leading: Image.network(p.image, width: 50, height: 50, fit: BoxFit.cover, errorBuilder: (context, error, stackTrace) => const Icon(Icons.image_not_supported)),
                  title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("Stock: ${p.stock} | ₹${p.price}"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit, color: Colors.blue),
                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProductFormScreen(product: p))).then((_) => fetchProducts()),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => deleteProduct(p.slug),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}