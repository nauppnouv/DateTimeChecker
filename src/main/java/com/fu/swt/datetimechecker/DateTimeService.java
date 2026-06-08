package com.fu.swt.datetimechecker;

import org.springframework.stereotype.Service;

@Service
public class DateTimeService {

    // Hàm tính số ngày trong tháng (Figure 3)
    public short daysInMonth(int year, int month) {
        switch (month) {
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                return 31;
            case 4: case 6: case 9: case 11:
                return 30;
            case 2:
                // Kiểm tra năm nhuận (Leap Year)
                if (year % 400 == 0) return 29;
                if (year % 100 == 0) return 28;
                if (year % 4 == 0) return 29;
                return 28;
            default:
                return 0; // Tháng không hợp lệ
        }
    }

    // Hàm kiểm tra ngày hợp lệ (Figure 4)
    public boolean isValidDate(int year, int month, int day) {
        if (month < 1 || month > 12) return false;
        if (day < 1) return false;
        
        short maxDays = daysInMonth(year, month);
        return day <= maxDays;
    }
}
