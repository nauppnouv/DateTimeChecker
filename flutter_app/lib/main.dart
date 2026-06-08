import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const DateTimeCheckerApp());
}

class DateTimeCheckerApp extends StatelessWidget {
  final http.Client? httpClient;
  const DateTimeCheckerApp({super.key, this.httpClient});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Date Time Checker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF0078D7),
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      home: DateTimeCheckerScreen(httpClient: httpClient),
    );
  }
}

class DateTimeCheckerScreen extends StatefulWidget {
  final http.Client? httpClient;
  const DateTimeCheckerScreen({super.key, this.httpClient});

  @override
  State<DateTimeCheckerScreen> createState() => _DateTimeCheckerScreenState();
}

class _DateTimeCheckerScreenState extends State<DateTimeCheckerScreen> {
  final TextEditingController _dayController = TextEditingController();
  final TextEditingController _monthController = TextEditingController();
  final TextEditingController _yearController = TextEditingController();

  final FocusNode _dayFocus = FocusNode();
  final FocusNode _monthFocus = FocusNode();
  final FocusNode _yearFocus = FocusNode();

  String? _resultMessage;
  bool? _isSuccess;
  bool _isLoading = false;

  // Change this URL depending on your environment:
  // - Android Emulator: http://10.0.2.2:8081
  // - iOS Simulator / Web (Chrome): http://localhost:8081
  // - Physical device: http://<your-host-ip>:8081
  static const String _baseUrl = 'http://localhost:8081';

  Future<void> _checkDate() async {
    setState(() {
      _isLoading = true;
      _resultMessage = null;
      _isSuccess = null;
    });

    try {
      final response = widget.httpClient != null
          ? await widget.httpClient!.post(
              Uri.parse('$_baseUrl/api/check'),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode({
                'day': _dayController.text,
                'month': _monthController.text,
                'year': _yearController.text,
              }),
            )
          : await http.post(
              Uri.parse('$_baseUrl/api/check'),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode({
                'day': _dayController.text,
                'month': _monthController.text,
                'year': _yearController.text,
              }),
            );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _resultMessage = data['message'];
          _isSuccess = data['success'];
          _isLoading = false;
        });
      } else {
        setState(() {
          _resultMessage = 'Server error: ${response.statusCode}';
          _isSuccess = false;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _resultMessage = 'Cannot connect to server. Please ensure the backend is running.';
        _isSuccess = false;
        _isLoading = false;
      });
    }
  }

  void _clearFields() {
    _dayController.clear();
    _monthController.clear();
    _yearController.clear();
    setState(() {
      _resultMessage = null;
      _isSuccess = null;
    });
    _dayFocus.requestFocus();
  }

  void _showExitDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm'),
        content: const Text('Are you sure you want to exit?'),
        actions: [
          TextButton(
            key: const Key('confirm-yes'),
            onPressed: () {
              Navigator.of(context).pop();
              // Simulate exit by showing a snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Application exited.')),
              );
            },
            child: const Text('Yes'),
          ),
          TextButton(
            key: const Key('confirm-no'),
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('No'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _dayController.dispose();
    _monthController.dispose();
    _yearController.dispose();
    _dayFocus.dispose();
    _monthFocus.dispose();
    _yearFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Date Time Checker'),
        backgroundColor: const Color(0xFF0078D7),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            key: const Key('close-button'),
            icon: const Icon(Icons.close),
            onPressed: _showExitDialog,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Title
            const Text(
              'Date Time Checker',
              key: Key('app-title'),
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
            const SizedBox(height: 32),

            // Day input
            TextField(
              key: const Key('day-input'),
              controller: _dayController,
              focusNode: _dayFocus,
              decoration: const InputDecoration(
                labelText: 'Day',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.calendar_today),
              ),
              keyboardType: TextInputType.text,
              textInputAction: TextInputAction.next,
              onSubmitted: (_) => _monthFocus.requestFocus(),
            ),
            const SizedBox(height: 16),

            // Month input
            TextField(
              key: const Key('month-input'),
              controller: _monthController,
              focusNode: _monthFocus,
              decoration: const InputDecoration(
                labelText: 'Month',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.date_range),
              ),
              keyboardType: TextInputType.text,
              textInputAction: TextInputAction.next,
              onSubmitted: (_) => _yearFocus.requestFocus(),
            ),
            const SizedBox(height: 16),

            // Year input
            TextField(
              key: const Key('year-input'),
              controller: _yearController,
              focusNode: _yearFocus,
              decoration: const InputDecoration(
                labelText: 'Year',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.event),
              ),
              keyboardType: TextInputType.text,
              textInputAction: TextInputAction.done,
              onSubmitted: (_) => _checkDate(),
            ),
            const SizedBox(height: 20),

            // Result message
            if (_isLoading)
              const Center(child: CircularProgressIndicator()),

            if (_resultMessage != null)
              Container(
                key: const Key('result-message'),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _isSuccess == true
                      ? const Color(0xFFD4EDDA)
                      : const Color(0xFFF8D7DA),
                  border: Border.all(
                    color: _isSuccess == true
                        ? const Color(0xFFC3E6CB)
                        : const Color(0xFFF5C6CB),
                  ),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  _resultMessage!,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: _isSuccess == true
                        ? const Color(0xFF155724)
                        : const Color(0xFF721C24),
                  ),
                ),
              ),

            const SizedBox(height: 24),

            // Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    key: const Key('clear-button'),
                    onPressed: _clearFields,
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Clear', style: TextStyle(fontSize: 16)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    key: const Key('check-button'),
                    onPressed: _isLoading ? null : _checkDate,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      backgroundColor: const Color(0xFF0078D7),
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Check', style: TextStyle(fontSize: 16)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
