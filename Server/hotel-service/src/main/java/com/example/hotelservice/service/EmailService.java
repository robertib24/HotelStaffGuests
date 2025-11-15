package com.example.hotelservice.service;

import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.entity.RoomServiceRequest;
import com.example.hotelservice.entity.HousekeepingRequest;
import com.example.hotelservice.entity.Review;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReservationConfirmation(Reservation reservation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(reservation.getGuest().getEmail());
            message.setSubject("Confirmare Rezervare - " + reservation.getReservationCode());
            message.setText(buildReservationEmailBody(reservation));

            mailSender.send(message);
            log.info("Email de confirmare trimis către: {}", reservation.getGuest().getEmail());
        } catch (Exception e) {
            log.error("Eroare la trimiterea email-ului: {}", e.getMessage());
        }
    }

    @Async
    public void sendReservationCancellation(Reservation reservation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(reservation.getGuest().getEmail());
            message.setSubject("Anulare Rezervare - " + reservation.getReservationCode());
            message.setText(buildCancellationEmailBody(reservation));

            mailSender.send(message);
            log.info("Email de anulare trimis către: {}", reservation.getGuest().getEmail());
        } catch (Exception e) {
            log.error("Eroare la trimiterea email-ului: {}", e.getMessage());
        }
    }

    private String buildReservationEmailBody(Reservation reservation) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return String.format(
                "Bună ziua %s,\n\n" +
                        "Rezervarea dumneavoastră a fost confirmată cu succes!\n\n" +
                        "Detalii rezervare:\n" +
                        "Cod: %s\n" +
                        "Cameră: %s (%s)\n" +
                        "Check-in: %s\n" +
                        "Check-out: %s\n" +
                        "Preț total: %.2f RON\n\n" +
                        "Vă așteptăm cu drag!\n\n" +
                        "Cu stimă,\n" +
                        "Echipa Hotel Admin",
                reservation.getGuest().getName(),
                reservation.getReservationCode(),
                reservation.getRoom().getNumber(),
                reservation.getRoom().getType(),
                reservation.getStartDate().format(formatter),
                reservation.getEndDate().format(formatter),
                reservation.getTotalPrice()
        );
    }

    private String buildCancellationEmailBody(Reservation reservation) {
        return String.format(
                "Bună ziua %s,\n\n" +
                        "Rezervarea dumneavoastră cu codul %s a fost anulată.\n\n" +
                        "Dacă aveți întrebări, vă rugăm să ne contactați.\n\n" +
                        "Cu stimă,\n" +
                        "Echipa Hotel Admin",
                reservation.getGuest().getName(),
                reservation.getReservationCode()
        );
    }

    @Async
    public void sendRoomServiceStatusUpdate(RoomServiceRequest request, String oldStatus, String newStatus) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getGuest().getEmail());
            message.setSubject("Actualizare Comandă Room Service #" + request.getId());
            message.setText(buildRoomServiceEmailBody(request, oldStatus, newStatus));

            mailSender.send(message);
            log.info("Email room service trimis către: {}", request.getGuest().getEmail());
        } catch (Exception e) {
            log.error("Eroare la trimiterea email-ului room service: {}", e.getMessage());
        }
    }

    @Async
    public void sendHousekeepingStatusUpdate(HousekeepingRequest request, String oldStatus, String newStatus) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(request.getGuest().getEmail());
            message.setSubject("Actualizare Cerere Curățenie #" + request.getId());
            message.setText(buildHousekeepingEmailBody(request, oldStatus, newStatus));

            mailSender.send(message);
            log.info("Email housekeeping trimis către: {}", request.getGuest().getEmail());
        } catch (Exception e) {
            log.error("Eroare la trimiterea email-ului housekeeping: {}", e.getMessage());
        }
    }

    private String buildRoomServiceEmailBody(RoomServiceRequest request, String oldStatus, String newStatus) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String statusMessage = getStatusMessage(newStatus);

        return String.format(
                "Bună ziua %s,\n\n" +
                        "Comanda dumneavoastră de room service a fost actualizată!\n\n" +
                        "Detalii comandă:\n" +
                        "Număr: #%d\n" +
                        "Cameră: %s\n" +
                        "Cerere: %s\n" +
                        "Status anterior: %s\n" +
                        "Status curent: %s\n" +
                        "Data: %s\n\n" +
                        "%s\n\n" +
                        "Cu stimă,\n" +
                        "Echipa Hotel Admin",
                request.getGuest().getName(),
                request.getId(),
                request.getRoom() != null ? request.getRoom().getNumber() : "N/A",
                request.getRequest(),
                oldStatus,
                newStatus,
                request.getCreatedAt().format(formatter),
                statusMessage
        );
    }

    private String buildHousekeepingEmailBody(HousekeepingRequest request, String oldStatus, String newStatus) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String statusMessage = getStatusMessage(newStatus);

        return String.format(
                "Bună ziua %s,\n\n" +
                        "Cererea dumneavoastră de curățenie a fost actualizată!\n\n" +
                        "Detalii cerere:\n" +
                        "Număr: #%d\n" +
                        "Cameră: %s\n" +
                        "Tip: %s\n" +
                        "Descriere: %s\n" +
                        "Prioritate: %s\n" +
                        "Status anterior: %s\n" +
                        "Status curent: %s\n" +
                        "Data: %s\n\n" +
                        "%s\n\n" +
                        "Cu stimă,\n" +
                        "Echipa Hotel Admin",
                request.getGuest().getName(),
                request.getId(),
                request.getRoom() != null ? request.getRoom().getNumber() : "N/A",
                request.getRequestType(),
                request.getDescription() != null ? request.getDescription() : "Fără descriere",
                request.getPriority(),
                oldStatus,
                newStatus,
                request.getCreatedAt().format(formatter),
                statusMessage
        );
    }

    @Async
    public void sendReviewResponseNotification(Review review) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(review.getGuest().getEmail());
            message.setSubject("Răspuns la Recenzia Dumneavoastră");
            message.setText(buildReviewResponseEmailBody(review));

            mailSender.send(message);
            log.info("Email răspuns recenzie trimis către: {}", review.getGuest().getEmail());
        } catch (Exception e) {
            log.error("Eroare la trimiterea email-ului pentru răspuns recenzie: {}", e.getMessage());
        }
    }

    private String buildReviewResponseEmailBody(Review review) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return String.format(
                "Bună ziua %s,\n\n" +
                        "Am primit recenzia dumneavoastră și dorim să vă mulțumim pentru feedback!\n\n" +
                        "Recenzia dumneavoastră:\n" +
                        "Camera: %s\n" +
                        "Rating: %d/5 stele\n" +
                        "Comentariu: %s\n\n" +
                        "Răspunsul nostru:\n" +
                        "%s\n\n" +
                        "Vă mulțumim că ați ales hotelul nostru!\n\n" +
                        "Cu stimă,\n" +
                        "Echipa Hotel Admin",
                review.getGuest().getName(),
                review.getRoom().getType() + " - Camera " + review.getRoom().getNumber(),
                review.getRating(),
                review.getComment(),
                review.getStaffResponse()
        );
    }

    private String getStatusMessage(String status) {
        return switch (status) {
            case "PENDING" -> "Cererea dumneavoastră este în așteptare și va fi procesată în curând.";
            case "IN_PROGRESS" -> "Personalul nostru lucrează la cererea dumneavoastră în acest moment!";
            case "COMPLETED" -> "Cererea dumneavoastră a fost finalizată cu succes. Mulțumim!";
            default -> "Statusul cererii a fost actualizat.";
        };
    }
}