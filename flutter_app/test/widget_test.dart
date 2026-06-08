import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:datetimechecker/main.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  group('DateTimeChecker Mobile App - Widget Tests', () {

    // ==========================================
    // UI Elements Rendering Tests
    // ==========================================

    testWidgets('should display all UI elements correctly', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Check title text
      expect(find.text('Date Time Checker'), findsWidgets);

      // Check input fields
      expect(find.byKey(const Key('day-input')), findsOneWidget);
      expect(find.byKey(const Key('month-input')), findsOneWidget);
      expect(find.byKey(const Key('year-input')), findsOneWidget);

      // Check buttons
      expect(find.byKey(const Key('check-button')), findsOneWidget);
      expect(find.byKey(const Key('clear-button')), findsOneWidget);
      expect(find.byKey(const Key('close-button')), findsOneWidget);

      // Check labels
      expect(find.text('Day'), findsOneWidget);
      expect(find.text('Month'), findsOneWidget);
      expect(find.text('Year'), findsOneWidget);
      expect(find.text('Check'), findsOneWidget);
      expect(find.text('Clear'), findsOneWidget);
    });

    // ==========================================
    // Input Field Tests
    // ==========================================

    testWidgets('should accept text input in Day field', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      final dayField = find.byKey(const Key('day-input'));
      await tester.enterText(dayField, '25');
      expect(find.text('25'), findsOneWidget);
    });

    testWidgets('should accept text input in Month field', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      final monthField = find.byKey(const Key('month-input'));
      await tester.enterText(monthField, '12');
      expect(find.text('12'), findsOneWidget);
    });

    testWidgets('should accept text input in Year field', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      final yearField = find.byKey(const Key('year-input'));
      await tester.enterText(yearField, '2026');
      expect(find.text('2026'), findsOneWidget);
    });

    testWidgets('should accept non-numeric text input (for format validation)', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      final dayField = find.byKey(const Key('day-input'));
      await tester.enterText(dayField, 'abc');
      expect(find.text('abc'), findsOneWidget);
    });

    // ==========================================
    // Clear Button Tests
    // ==========================================

    testWidgets('should clear all inputs when Clear is pressed', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Enter text in all fields
      await tester.enterText(find.byKey(const Key('day-input')), '25');
      await tester.enterText(find.byKey(const Key('month-input')), '5');
      await tester.enterText(find.byKey(const Key('year-input')), '2026');

      // Tap Clear button
      await tester.tap(find.byKey(const Key('clear-button')));
      await tester.pump();

      // Verify fields are empty
      final dayField = tester.widget<TextField>(find.byKey(const Key('day-input')));
      final monthField = tester.widget<TextField>(find.byKey(const Key('month-input')));
      final yearField = tester.widget<TextField>(find.byKey(const Key('year-input')));

      expect(dayField.controller!.text, '');
      expect(monthField.controller!.text, '');
      expect(yearField.controller!.text, '');
    });

    testWidgets('should hide result message when Clear is pressed', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Before any check, result message should not be visible
      expect(find.byKey(const Key('result-message')), findsNothing);

      // Clear should keep result hidden
      await tester.tap(find.byKey(const Key('clear-button')));
      await tester.pump();
      expect(find.byKey(const Key('result-message')), findsNothing);
    });

    // ==========================================
    // Exit Confirmation Dialog Tests
    // ==========================================

    testWidgets('should show exit confirmation dialog when Close is pressed', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Tap the close button in AppBar
      await tester.tap(find.byKey(const Key('close-button')));
      await tester.pumpAndSettle();

      // Verify confirmation dialog appears
      expect(find.text('Confirm'), findsOneWidget);
      expect(find.text('Are you sure you want to exit?'), findsOneWidget);
      expect(find.text('Yes'), findsOneWidget);
      expect(find.text('No'), findsOneWidget);
    });

    testWidgets('should dismiss dialog when No is pressed', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Open the dialog
      await tester.tap(find.byKey(const Key('close-button')));
      await tester.pumpAndSettle();

      // Press No
      await tester.tap(find.byKey(const Key('confirm-no')));
      await tester.pumpAndSettle();

      // Dialog should be dismissed
      expect(find.text('Are you sure you want to exit?'), findsNothing);
    });

    testWidgets('should show snackbar when Yes is pressed on exit dialog', (WidgetTester tester) async {
      await tester.pumpWidget(const DateTimeCheckerApp());

      // Open the dialog
      await tester.tap(find.byKey(const Key('close-button')));
      await tester.pumpAndSettle();

      // Press Yes
      await tester.tap(find.byKey(const Key('confirm-yes')));
      await tester.pumpAndSettle();

      // Dialog should be dismissed and snackbar shown
      expect(find.text('Are you sure you want to exit?'), findsNothing);
      expect(find.text('Application exited.'), findsOneWidget);
    });

    // ==========================================
    // Check Button & API Integration Tests
    // ==========================================

    testWidgets('should show loading indicator when Check is pressed', (WidgetTester tester) async {
      final completer = Completer<http.Response>();
      final client = MockClient((request) async {
        return completer.future;
      });

      await tester.pumpWidget(DateTimeCheckerApp(httpClient: client));

      // Enter data
      await tester.enterText(find.byKey(const Key('day-input')), '25');
      await tester.enterText(find.byKey(const Key('month-input')), '5');
      await tester.enterText(find.byKey(const Key('year-input')), '2026');

      // Tap Check button
      await tester.tap(find.byKey(const Key('check-button')));
      await tester.pump(); // Start request, show loading

      // Loading indicator should appear (CircularProgressIndicator)
      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      // Clean up the completer to prevent leaks/hanging test
      completer.complete(http.Response(jsonEncode({'message': '25/5/2026 is correct date', 'success': true}), 200));
      await tester.pumpAndSettle();
    });

    testWidgets('should disable Check button while loading', (WidgetTester tester) async {
      final completer = Completer<http.Response>();
      final client = MockClient((request) async {
        return completer.future;
      });

      await tester.pumpWidget(DateTimeCheckerApp(httpClient: client));

      // Enter data
      await tester.enterText(find.byKey(const Key('day-input')), '15');
      await tester.enterText(find.byKey(const Key('month-input')), '6');
      await tester.enterText(find.byKey(const Key('year-input')), '2023');

      // Tap Check
      await tester.tap(find.byKey(const Key('check-button')));
      await tester.pump();

      // Button should be disabled while loading (onPressed is null)
      final checkButton = tester.widget<ElevatedButton>(find.byKey(const Key('check-button')));
      expect(checkButton.onPressed, isNull);

      // Clean up
      completer.complete(http.Response(jsonEncode({'message': '15/6/2023 is correct date', 'success': true}), 200));
      await tester.pumpAndSettle();
    });

    testWidgets('should show connection error when backend throws exception', (WidgetTester tester) async {
      final client = MockClient((request) async {
        throw http.ClientException('Connection failed');
      });

      await tester.pumpWidget(DateTimeCheckerApp(httpClient: client));

      // Enter data
      await tester.enterText(find.byKey(const Key('day-input')), '25');
      await tester.enterText(find.byKey(const Key('month-input')), '5');
      await tester.enterText(find.byKey(const Key('year-input')), '2026');

      // Tap Check
      await tester.tap(find.byKey(const Key('check-button')));
      await tester.pumpAndSettle();

      // Should show connection error message
      expect(find.byKey(const Key('result-message')), findsOneWidget);
      expect(find.textContaining('Cannot connect to server'), findsOneWidget);
    });

    testWidgets('should show success message when API returns correct date response', (WidgetTester tester) async {
      final client = MockClient((request) async {
        final Map<String, dynamic> body = jsonDecode(request.body);
        expect(body['day'], '29');
        expect(body['month'], '2');
        expect(body['year'], '2024');

        return http.Response(
          jsonEncode({'message': '29/2/2024 is correct date', 'success': true}),
          200,
        );
      });

      await tester.pumpWidget(DateTimeCheckerApp(httpClient: client));

      await tester.enterText(find.byKey(const Key('day-input')), '29');
      await tester.enterText(find.byKey(const Key('month-input')), '2');
      await tester.enterText(find.byKey(const Key('year-input')), '2024');

      await tester.tap(find.byKey(const Key('check-button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('result-message')), findsOneWidget);
      expect(find.text('29/2/2024 is correct date'), findsOneWidget);
      
      // Verify success styling color (Color(0xFFD4EDDA) or similar background)
      final container = tester.widget<Container>(find.byKey(const Key('result-message')));
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFD4EDDA));
    });

    testWidgets('should show failure message when API returns error response', (WidgetTester tester) async {
      final client = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Input data for Year is out of range!', 'success': false}),
          200,
        );
      });

      await tester.pumpWidget(DateTimeCheckerApp(httpClient: client));

      await tester.enterText(find.byKey(const Key('day-input')), '29');
      await tester.enterText(find.byKey(const Key('month-input')), '2');
      await tester.enterText(find.byKey(const Key('year-input')), '4000');

      await tester.tap(find.byKey(const Key('check-button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('result-message')), findsOneWidget);
      expect(find.text('Input data for Year is out of range!'), findsOneWidget);

      final container = tester.widget<Container>(find.byKey(const Key('result-message')));
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFF8D7DA));
    });
  });
}
