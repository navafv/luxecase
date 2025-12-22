import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:dio/dio.dart';
import '../core/constants.dart';

class AuthProvider with ChangeNotifier {
  final Dio _dio = Dio(); // Basic dio for login (no interceptor needed)
  final _storage = const FlutterSecureStorage();
  
  bool _isAuthenticated = false;
  bool get isAuthenticated => _isAuthenticated;

  Future<bool> login(String email, String password) async {
    try {
      final response = await _dio.post('${AppConstants.baseUrl}/users/login/', data: {
        'email': email,
        'password': password,
      });

      final accessToken = response.data['access'];
      final refreshToken = response.data['refresh'];

      // Check Admin Privileges
      Map<String, dynamic> decodedToken = JwtDecoder.decode(accessToken);
      if (decodedToken['is_admin'] == true) {
        await _storage.write(key: 'access_token', value: accessToken);
        await _storage.write(key: 'refresh_token', value: refreshToken);
        _isAuthenticated = true;
        notifyListeners();
        return true;
      } else {
        throw Exception("Access Denied: Not an Admin");
      }
    } catch (e) {
      print(e);
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.deleteAll();
    _isAuthenticated = false;
    notifyListeners();
  }

  // Check token on app start
  Future<void> checkLoginStatus() async {
    final token = await _storage.read(key: 'access_token');
    if (token != null && !JwtDecoder.isExpired(token)) {
      _isAuthenticated = true;
    } else {
      _isAuthenticated = false;
    }
    notifyListeners();
  }
}