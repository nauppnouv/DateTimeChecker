package com.fu.swt.datetimechecker;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class DateTimeServiceTest {

    private final DateTimeService service = new DateTimeService();

    // ==========================================
    // SHEET DayInMonth — Input: (month, year)
    // ==========================================

    @Test
    public void testDaysInMonth_Normal() {
        // Normal (N): tháng bình thường
        assertEquals(31, service.daysInMonth(2023, 1));
        assertEquals(30, service.daysInMonth(2023, 4));
        assertEquals(31, service.daysInMonth(2023, 7));
    }

    @Test
    public void testDaysInMonth_Boundary() {
        // Boundary (B): tháng đặc biệt, năm nhuận/không nhuận
        assertEquals(29, service.daysInMonth(2000, 2)); // năm nhuận chia hết 400
        assertEquals(29, service.daysInMonth(2020, 2)); // năm nhuận chia hết 4, không chia 100
        assertEquals(28, service.daysInMonth(1900, 2)); // chia hết 100 nhưng không chia hết 400
        assertEquals(28, service.daysInMonth(2021, 2)); // không nhuận
        assertEquals(31, service.daysInMonth(2023, 12)); // tháng cuối năm
        assertEquals(31, service.daysInMonth(2023, 1)); // tháng đầu năm
    }

    @Test
    public void testDaysInMonth_Abnormal() {
        // Abnormal (A): giá trị ngoài vùng hợp lệ
        assertEquals(0, service.daysInMonth(2023, 0));
        assertEquals(0, service.daysInMonth(2023, 13));
    }

    // ==========================================
    // SHEET CheckDate — Input: (day, month, year)
    // ==========================================

    @Test
    public void testIsValidDate_Normal() {
        // Normal (N)
        assertTrue(service.isValidDate(2023, 6, 15));
        assertTrue(service.isValidDate(2023, 1, 31));
        assertTrue(service.isValidDate(2021, 2, 28));
    }

    @Test
    public void testIsValidDate_Boundary() {
        // Boundary (B)
        assertTrue(service.isValidDate(2023, 1, 1)); // ngày đầu
        assertTrue(service.isValidDate(2023, 12, 31)); // ngày cuối
        assertTrue(service.isValidDate(2000, 2, 29)); // ngày 29/2 năm nhuận
        assertFalse(service.isValidDate(2021, 2, 29)); // năm không nhuận
        assertTrue(service.isValidDate(2023, 4, 30)); // max của tháng 30 ngày
        assertFalse(service.isValidDate(2023, 4, 31)); // tháng 4 chỉ có 30 ngày
    }

    @Test
    public void testIsValidDate_Abnormal() {
        // Abnormal (A)
        assertFalse(service.isValidDate(2023, 6, 0));
        assertFalse(service.isValidDate(2023, 1, 32));
    }
}
