package com.example.hotelservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AnthropicService {

    private final OkHttpClient client;
    private final ObjectMapper objectMapper;

    @Value("${anthropic.api.key}")
    private String apiKey;

    @Value("${anthropic.model}")
    private String model;

    public AnthropicService() {
        this.client = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public String chat(String userMessage, String systemPrompt) throws IOException {
        if (apiKey == null || apiKey.isEmpty() || apiKey.startsWith("${")) {
            throw new IOException("ANTHROPIC_API_KEY is not configured. Please set it in environment variables.");
        }

        System.out.println("🔑 Using API key: " + (apiKey.substring(0, Math.min(10, apiKey.length())) + "..."));
        System.out.println("🤖 Model: " + model);

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("max_tokens", 1024);

        if (systemPrompt != null && !systemPrompt.isEmpty()) {
            requestBody.put("system", systemPrompt);
        }

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode userMsg = objectMapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);
        messages.add(userMsg);

        requestBody.set("messages", messages);

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );

        System.out.println("📡 Sending request to Anthropic API...");

        Request request = new Request.Builder()
                .url("https://api.anthropic.com/v1/messages")
                .addHeader("x-api-key", apiKey)
                .addHeader("anthropic-version", "2023-06-01")
                .addHeader("content-type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "null";

            if (!response.isSuccessful()) {
                System.err.println("❌ API Error - Code: " + response.code());
                System.err.println("❌ Response: " + responseBody);
                throw new IOException("API request failed with code " + response.code() + ": " + responseBody);
            }

            System.out.println("✅ API Response received");
            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            return jsonResponse.get("content").get(0).get("text").asText();
        }
    }
}
