package com.example.hotelservice.service;

import com.example.hotelservice.entity.Reservation;
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
}