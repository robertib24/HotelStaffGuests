package com.example.hotelservice.service;

import com.example.hotelservice.dto.ChatResponseDTO;
import com.example.hotelservice.dto.HousekeepingRequestDTO;
import com.example.hotelservice.dto.RoomServiceRequestDTO;
import com.example.hotelservice.entity.ChatMessage;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.repository.ChatMessageRepository;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.ReservationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    private final AnthropicService anthropicService;
    private final RoomServiceRequestService roomServiceRequestService;
    private final HousekeepingRequestService housekeepingRequestService;
    private final ChatMessageRepository chatMessageRepository;
    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final ObjectMapper objectMapper;

    public ChatService(AnthropicService anthropicService,
                      RoomServiceRequestService roomServiceRequestService,
                      HousekeepingRequestService housekeepingRequestService,
                      ChatMessageRepository chatMessageRepository,
                      GuestRepository guestRepository,
                      ReservationRepository reservationRepository) {
        this.anthropicService = anthropicService;
        this.roomServiceRequestService = roomServiceRequestService;
        this.housekeepingRequestService = housekeepingRequestService;
        this.chatMessageRepository = chatMessageRepository;
        this.guestRepository = guestRepository;
        this.reservationRepository = reservationRepository;
        this.objectMapper = new ObjectMapper();
    }

    public ChatResponseDTO processMessage(String message, String userEmail) throws IOException {
        System.out.println("📥 Received message from: " + userEmail + " - Message: " + message);

        Guest guest = guestRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        String systemPrompt = buildSystemPrompt();
        System.out.println("🤖 Calling Anthropic API...");
        String response = anthropicService.chat(message, systemPrompt);
        System.out.println("✅ AI Response: " + response);

        ChatMessage chatMessage = ChatMessage.builder()
                .guest(guest)
                .message(message)
                .response(response)
                .role("assistant")
                .build();
        chatMessageRepository.save(chatMessage);

        ChatResponseDTO result = parseResponse(response, guest);
        System.out.println("📤 Sending response - Action: " + result.getAction());
        return result;
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

    private String extractJsonFromMarkdown(String response) {
        Pattern pattern = Pattern.compile("```json\\s*\\n(.+?)\\n```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(response);
        if (matcher.find()) {
            String extracted = matcher.group(1).trim();
            System.out.println("🔍 Extracted JSON from markdown: " + extracted);
            return extracted;
        }
        return response;
    }

    private ChatResponseDTO parseResponse(String response, Guest guest) {
        try {
            if (response.contains("\"action\":")) {
                String jsonString = extractJsonFromMarkdown(response);
                JsonNode jsonResponse = objectMapper.readTree(jsonString);
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

                    Reservation activeReservation = reservationRepository.findAll().stream()
                            .filter(r -> r.getGuest().getId().equals(guest.getId()))
                            .filter(r -> !r.getStartDate().isAfter(LocalDate.now()))
                            .filter(r -> !r.getEndDate().isBefore(LocalDate.now()))
                            .findFirst()
                            .orElse(null);

                    if (activeReservation != null) {
                        HousekeepingRequestDTO dto = HousekeepingRequestDTO.builder()
                                .roomId(activeReservation.getRoom().getId())
                                .requestType(type)
                                .description(description)
                                .priority("NORMAL")
                                .build();
                        var created = housekeepingRequestService.createRequest(dto, guest.getEmail());

                        return ChatResponseDTO.builder()
                                .response("Am înregistrat cererea ta pentru housekeeping: " + description + ". Echipa de curățenie va fi notificată!")
                                .action("housekeeping")
                                .actionData(created)
                                .build();
                    } else {
                        return ChatResponseDTO.builder()
                                .response("Nu am găsit o rezervare activă pentru tine. Te rog să contactezi recepția pentru asistență.")
                                .action("error")
                                .build();
                    }
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
