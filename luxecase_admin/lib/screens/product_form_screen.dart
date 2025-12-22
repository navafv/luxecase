import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../core/constants.dart';
import '../models/models.dart';
import '../services/api_client.dart';

class ProductFormScreen extends StatefulWidget {
  final Product? product;
  const ProductFormScreen({this.product});

  @override
  _ProductFormScreenState createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends State<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiClient _api = ApiClient();
  final ImagePicker _picker = ImagePicker();
  
  late TextEditingController _nameCtrl;
  late TextEditingController _descCtrl;
  late TextEditingController _priceCtrl;
  late TextEditingController _stockCtrl;
  
  File? _imageFile;
  int? _selectedCategoryId;
  bool _isAvailable = true;
  List<Category> _categories = [];

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.product?.name ?? '');
    _descCtrl = TextEditingController(text: widget.product?.description ?? '');
    _priceCtrl = TextEditingController(text: widget.product?.price.toString() ?? '');
    _stockCtrl = TextEditingController(text: widget.product?.stock.toString() ?? '');
    _selectedCategoryId = widget.product?.category?.id;
    _isAvailable = widget.product?.isAvailable ?? true;
    fetchCategories();
  }

  void fetchCategories() async {
    final res = await _api.client.get('/products/categories/');
    setState(() {
      _categories = (res.data as List).map((e) => Category.fromJson(e)).toList();
    });
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) setState(() => _imageFile = File(picked.path));
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Select a category")));
      return;
    }

    try {
      String url = widget.product == null ? '/products/' : '/products/${widget.product!.slug}/';
      
      // Use FormData for Multipart request
      FormData formData = FormData.fromMap({
        'name': _nameCtrl.text,
        'description': _descCtrl.text,
        'price': _priceCtrl.text,
        'stock': _stockCtrl.text,
        'category': _selectedCategoryId,
        'is_available': _isAvailable,
      });

      if (_imageFile != null) {
        formData.files.add(MapEntry(
          'image',
          await MultipartFile.fromFile(_imageFile!.path, filename: 'product.jpg'),
        ));
      }

      if (widget.product == null) {
        await _api.client.post(url, data: formData);
      } else {
        await _api.client.patch(url, data: formData);
      }

      Navigator.pop(context);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.product == null ? "Add Product" : "Edit Product"), backgroundColor: AppConstants.darkBg, foregroundColor: AppConstants.primaryGold),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 150,
                  width: double.infinity,
                  color: Colors.grey[200],
                  child: _imageFile != null
                      ? Image.file(_imageFile!, fit: BoxFit.cover)
                      : (widget.product != null ? Image.network(widget.product!.image, fit: BoxFit.cover) : const Icon(Icons.add_a_photo, size: 50)),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(controller: _nameCtrl, decoration: const InputDecoration(labelText: "Name"), validator: (v) => v!.isEmpty ? "Required" : null),
              TextFormField(controller: _descCtrl, decoration: const InputDecoration(labelText: "Description"), maxLines: 3),
              Row(
                children: [
                  Expanded(child: TextFormField(controller: _priceCtrl, decoration: const InputDecoration(labelText: "Price"), keyboardType: TextInputType.number)),
                  const SizedBox(width: 10),
                  Expanded(child: TextFormField(controller: _stockCtrl, decoration: const InputDecoration(labelText: "Stock"), keyboardType: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<int>(
                value: _selectedCategoryId,
                items: _categories.map((c) => DropdownMenuItem(value: c.id, child: Text(c.name))).toList(),
                onChanged: (v) => setState(() => _selectedCategoryId = v),
                decoration: const InputDecoration(labelText: "Category"),
              ),
              SwitchListTile(title: const Text("Available for Sale"), value: _isAvailable, onChanged: (v) => setState(() => _isAvailable = v)),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppConstants.primaryGold, foregroundColor: Colors.white),
                  onPressed: _submit,
                  child: const Text("Save Product"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}