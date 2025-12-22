import 'package:flutter/material.dart';
import '../services/api_client.dart';
import '../models/models.dart';
import '../core/constants.dart';

class OrdersScreen extends StatefulWidget {
  @override
  _OrdersScreenState createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final ApiClient _api = ApiClient();
  List<Order> orders = [];

  @override
  void initState() {
    super.initState();
    fetchOrders();
  }

  void fetchOrders() async {
    final response = await _api.client.get('/orders/all-orders/');
    setState(() {
      orders = (response.data as List).map((e) => Order.fromJson(e)).toList();
    });
  }

  void showUpdateDialog(Order order) {
    String status = order.status;
    String paymentMethod = order.paymentMethod;
    TextEditingController amountCtrl = TextEditingController(text: order.amountPaid.toString());
    TextEditingController notesCtrl = TextEditingController(text: "");

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text("Manage Order #${order.id}"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: status,
                decoration: const InputDecoration(labelText: "Status"),
                items: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (val) => status = val!,
              ),
              TextField(controller: amountCtrl, decoration: const InputDecoration(labelText: "Amount Paid"), keyboardType: TextInputType.number),
              DropdownButtonFormField<String>(
                value: paymentMethod,
                decoration: const InputDecoration(labelText: "Payment Method"),
                items: ['Credit', 'Cash', 'UPI', 'Cheque', 'Bank Transfer']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (val) => paymentMethod = val!,
              ),
              TextField(controller: notesCtrl, decoration: const InputDecoration(labelText: "Payment Notes")),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await _api.client.patch('/orders/${order.id}/update/', data: {
                'status': status,
                'amount_paid': amountCtrl.text,
                'payment_method': paymentMethod,
                'payment_note': notesCtrl.text
              });
              Navigator.pop(ctx);
              fetchOrders();
            },
            child: const Text("Update"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Manage Orders"), backgroundColor: AppConstants.darkBg, foregroundColor: AppConstants.primaryGold),
      body: ListView.builder(
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          return Card(
            margin: const EdgeInsets.all(8),
            child: ListTile(
              title: Text("#${order.id} - ${order.fullName}"),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Total: ₹${order.totalAmount} | Balance: ₹${order.balance}", style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text("Status: ${order.status}", style: TextStyle(color: order.status == 'Cancelled' ? Colors.red : Colors.green)),
                ],
              ),
              trailing: ElevatedButton(
                onPressed: () => showUpdateDialog(order),
                child: const Text("Manage"),
              ),
            ),
          );
        },
      ),
    );
  }
}