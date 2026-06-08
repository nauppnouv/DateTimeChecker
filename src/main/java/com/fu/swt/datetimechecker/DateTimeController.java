package com.fu.swt.datetimechecker;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DateTimeController {

    private final DateTimeService dateTimeService;

    public DateTimeController(DateTimeService dateTimeService) {
        this.dateTimeService = dateTimeService;
    }

    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkDateTime(@RequestBody Map<String, String> request) {
        String dayStr = request.get("day");
        String monthStr = request.get("month");
        String yearStr = request.get("year");

        Map<String, Object> response = new HashMap<>();

        // 1. Format checks
        if (dayStr == null || !dayStr.trim().matches("^\\d+$")) {
            response.put("success", false);
            response.put("message", "Input data for Day is incorrect format!");
            return ResponseEntity.ok(response);
        }
        if (monthStr == null || !monthStr.trim().matches("^\\d+$")) {
            response.put("success", false);
            response.put("message", "Input data for Month is incorrect format!");
            return ResponseEntity.ok(response);
        }
        if (yearStr == null || !yearStr.trim().matches("^\\d+$")) {
            response.put("success", false);
            response.put("message", "Input data for Year is incorrect format!");
            return ResponseEntity.ok(response);
        }

        int day = Integer.parseInt(dayStr.trim());
        int month = Integer.parseInt(monthStr.trim());
        int year = Integer.parseInt(yearStr.trim());

        // 2. Range checks
        if (day < 1 || day > 31) {
            response.put("success", false);
            response.put("message", "Input data for Day is out of range!");
            return ResponseEntity.ok(response);
        }
        if (month < 1 || month > 12) {
            response.put("success", false);
            response.put("message", "Input data for Month is out of range!");
            return ResponseEntity.ok(response);
        }
        if (year < 1000 || year > 3000) {
            response.put("success", false);
            response.put("message", "Input data for Year is out of range!");
            return ResponseEntity.ok(response);
        }

        // 3. Date validity check
        boolean isValid = dateTimeService.isValidDate(year, month, day);
        response.put("success", isValid);
        if (isValid) {
            response.put("message", day + "/" + month + "/" + year + " is correct date time!");
        } else {
            response.put("message", day + "/" + month + "/" + year + " is NOT correct date time!");
        }

        return ResponseEntity.ok(response);
    }
}
