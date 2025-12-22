import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../core/constants.dart';
import '../models/models.dart';
import '../services/api_client.dart';

class DashboardScreen extends StatelessWidget {
  final ApiClient _api = ApiClient();

  Future<AnalyticsData> fetchAnalytics() async {
    final response = await _api.client.get('/orders/analytics/');
    return AnalyticsData.fromJson(response.data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(title: const Text("Dashboard Overview"), backgroundColor: AppConstants.darkBg, foregroundColor: AppConstants.primaryGold),
      body: FutureBuilder<AnalyticsData>(
        future: fetchAnalytics(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error loading data: ${snapshot.error}"));
          }

          final data = snapshot.data!;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Stats Grid
                Row(
                  children: [
                    _StatCard(title: "Revenue", value: "₹${data.totalRevenue}", color: Colors.green),
                    const SizedBox(width: 10),
                    _StatCard(title: "Orders", value: "${data.totalOrders}", color: Colors.blue),
                    const SizedBox(width: 10),
                    _StatCard(title: "Users", value: "${data.totalUsers}", color: Colors.purple),
                  ],
                ),
                const SizedBox(height: 24),
                // Chart
                Container(
                  height: 300,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                  child: BarChart(
                    BarChartData(
                      borderData: FlBorderData(show: false),
                      titlesData: FlTitlesData(
                        leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 40)),
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (val, meta) {
                              if (val.toInt() < data.salesData.length) {
                                return Text(data.salesData[val.toInt()].name, style: const TextStyle(fontSize: 10));
                              }
                              return const Text("");
                            },
                          ),
                        ),
                      ),
                      barGroups: data.salesData.asMap().entries.map((entry) {
                        return BarChartGroupData(
                          x: entry.key,
                          barRods: [BarChartRodData(toY: entry.value.revenue, color: AppConstants.primaryGold)],
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title, value;
  final Color color;
  const _StatCard({required this.title, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)]),
        child: Column(
          children: [
            Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}