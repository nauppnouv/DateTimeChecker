package com.fu.swt.datetimechecker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DateTimeController.class)
public class DateTimeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DateTimeService dateTimeService;

    @Test
    public void testCheckDateTime_InvalidDayFormat() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"abc\",\"month\":\"12\",\"year\":\"2020\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Day is incorrect format!"));
    }

    @Test
    public void testCheckDateTime_InvalidMonthFormat() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"15\",\"month\":\"xy\",\"year\":\"2020\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Month is incorrect format!"));
    }

    @Test
    public void testCheckDateTime_InvalidYearFormat() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"15\",\"month\":\"08\",\"year\":\"12a\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Year is incorrect format!"));
    }

    @Test
    public void testCheckDateTime_DayOutOfRange() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"32\",\"month\":\"10\",\"year\":\"2020\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Day is out of range!"));
    }

    @Test
    public void testCheckDateTime_MonthOutOfRange() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"15\",\"month\":\"13\",\"year\":\"2020\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Month is out of range!"));
    }

    @Test
    public void testCheckDateTime_YearOutOfRange() throws Exception {
        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"15\",\"month\":\"08\",\"year\":\"999\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Input data for Year is out of range!"));
    }

    @Test
    public void testCheckDateTime_ValidDate() throws Exception {
        when(dateTimeService.isValidDate(2026, 5, 25)).thenReturn(true);

        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"25\",\"month\":\"5\",\"year\":\"2026\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("25/5/2026 is correct date time!"));
    }

    @Test
    public void testCheckDateTime_InvalidDate() throws Exception {
        when(dateTimeService.isValidDate(2026, 11, 31)).thenReturn(false);

        mockMvc.perform(post("/api/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"day\":\"31\",\"month\":\"11\",\"year\":\"2026\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("31/11/2026 is NOT correct date time!"));
    }
}
