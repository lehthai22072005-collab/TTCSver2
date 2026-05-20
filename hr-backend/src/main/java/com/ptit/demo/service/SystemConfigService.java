package com.ptit.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemConfigService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String getValue(String key, String defaultValue) {
        try {
            List<String> values = jdbcTemplate.queryForList(
                    "SELECT config_value FROM system_config WHERE config_key = ?",
                    String.class,
                    key
            );

            if (values.isEmpty() || values.get(0) == null) {
                return defaultValue;
            }

            return values.get(0);
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public int getInt(String key, int defaultValue) {
        try {
            return Integer.parseInt(getValue(key, String.valueOf(defaultValue)));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public boolean getBoolean(String key, boolean defaultValue) {
        String value = getValue(key, String.valueOf(defaultValue));

        return "true".equalsIgnoreCase(value)
                || "1".equals(value)
                || "on".equalsIgnoreCase(value)
                || "bật".equalsIgnoreCase(value)
                || "đang bật".equalsIgnoreCase(value);
    }
}