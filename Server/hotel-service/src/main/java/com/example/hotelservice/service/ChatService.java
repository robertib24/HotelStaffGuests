package com.example.hotelservice.service;

import com.example.hotelservice.dto.ChatResponseDTO;
import com.example.hotelservice.dto.HousekeepingRequestDTO;
import com.example.hotelservice.dto.RoomServiceRequestDTO;
import com.example.hotelservice.entity.ChatMessage;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.repository.ChatMessageRepository;
import com.example.hotelservice.repository.GuestRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ChatService {

    private final AnthropicService anthropicService;
    private final RoomServiceRequestService roomServiceRequestService;
    private final HousekeepingRequestService housekeepingRequestService;
    private final ChatMessageRepository chatMessageRepository;
    private final GuestRepository guestRepository;
    private final ObjectMapper objectMapper;

    public ChatService(AnthropicService anthropicService,
                      RoomServiceRequestService roomServiceRequestService,
                      HousekeepingRequestService housekeepingRequestService,
                      ChatMessageRepository chatMessageRepository,
                      GuestRepository guestRepository) {
        this.anthropicService = anthropicService;
        this.roomServiceRequestService = roomServiceRequestService;
        this.housekeepingRequestService = housekeepingRequestService;
        this.chatMessageRepository = chatMessageRepository;
        this.guestRepository = guestRepository;
        this.objectMapper = new ObjectMapper();
    }

    public ChatResponseDTO processMessage(String message, String userEmail) throws IOException {
        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        String systemPrompt = buildSystemPrompt();
        String response = anthropicService.chat(message, systemPrompt);

        ChatMessage chatMessage = ChatMessage.builder()
                .guest(guest)
                .message(message)
                .response(response)
                .role("assistant")
                .build();
        chatMessageRepository.save(chatMessage);

        return parseResponse(response, guest);
    }

    private String buildSystemPrompt() {
        return "Ești un asistent virtual pentru un hotel. Scopul tău este să ajuți oaspeții cu:\n" +
                "1. Informații despre hotel și facilități\n" +
                "2. Room service - comenzi mâncare, băuturi, articole pentru cameră\n" +
                "3. Housekeeping - curățenie camere, schimbare lenjerie, reparații\n" +
                "4. Recomandări locale - atracții turistice, restaurante, transport\n\n" +
                "Când un oaspete cere ceva specific (room service sau housekeeping), răspunde în format JSON astfel:\n" +
                "Pentru room service: {\"action\":\"room_service\",\"request\":\"descrierea cererii\"}\n" +
                "Pentru housekeeping: {\"action\":\"housekeeping\",\"type\":\"CLEANING/MAINTENANCE/SUPPLIES\",\"description\":\"descrierea problemei\"}\n" +
                "Pentru conversații normale, răspunde natural în română, fără JSON.\n\n" +
                "Exemple:\n" +
                "- \"Vreau să comand pizza\" -> {\"action\":\"room_service\",\"request\":\"Pizza\"}\n" +
                "- \"Camera mea are nevoie de curățenie\" -> {\"action\":\"housekeeping\",\"type\":\"CLEANING\",\"description\":\"Curățenie cameră\"}\n" +
                "- \"Ce atracții turistice sunt în zonă?\" -> răspuns normal text\n\n" +
                "Fii prietenos, profesionist și eficient!";
    }

    private ChatResponseDTO parseResponse(String response, Guest guest) {
        try {
            if (response.contains("\"action\":")) {
                JsonNode jsonResponse = objectMapper.readTree(response);
                String action = jsonResponse.get("action").asText();

                if ("room_service".equals(action)) {
                    String request = jsonResponse.get("request").asText();
                    RoomServiceRequestDTO dto = RoomServiceRequestDTO.builder()
                            .request(request)
                            .build();
                    var created = roomServiceRequestService.createRequest(dto, guest.getEmail());
                    return ChatResponseDTO.builder()
                            .response("Am înregistrat cererea ta pentru room service: " + request + ". Personalul nostru te va contacta în curând!")
                            .action("room_service")
                            .actionData(created)
                            .build();
                }

                if ("housekeeping".equals(action)) {
                    String type = jsonResponse.get("type").asText();
                    String description = jsonResponse.get("description").asText();

                    return ChatResponseDTO.builder()
                            .response("Am înregistrat cererea ta pentru housekeeping: " + description + ". Echipa de curățenie va fi notificată!")
                            .action("housekeeping")
                            .build();
                }
            }
        } catch (JsonProcessingException e) {
        }

        return ChatResponseDTO.builder()
                .response(response)
                .action("conversation")
                .build();
    }
}
