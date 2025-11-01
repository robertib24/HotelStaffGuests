package com.example.hotelservice.config;

import com.example.hotelservice.entity.Employee;
import com.example.hotelservice.entity.Guest;
import com.example.hotelservice.entity.Room;
import com.example.hotelservice.entity.Reservation;
import com.example.hotelservice.repository.EmployeeRepository;
import com.example.hotelservice.repository.GuestRepository;
import com.example.hotelservice.repository.RoomRepository;
import com.example.hotelservice.repository.ReservationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(EmployeeRepository employeeRepository,
                      GuestRepository guestRepository,
                      RoomRepository roomRepository,
                      ReservationRepository reservationRepository,
                      PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.guestRepository = guestRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (guestRepository.count() == 0) {
            loadInitialData();
        }
    }

    private void loadInitialData() {

        if (employeeRepository.findByEmail("admin@hotel.com").isEmpty()) {
            Employee admin = new Employee();
            admin.setName("Admin Manager");
            admin.setEmail("admin@hotel.com");
            admin.setPassword(passwordEncoder.encode("1234"));
            admin.setRole("Admin");
            employeeRepository.save(admin);
        }

        Employee receptionist = new Employee();
        receptionist.setName("Ana Popescu");
        receptionist.setEmail("ana.popescu@hotel.com");
        receptionist.setPassword(passwordEncoder.encode("parola123"));
        receptionist.setRole("Receptionist");

        Employee cleaner = new Employee();
        cleaner.setName("Ion Vasile");
        cleaner.setEmail("ion.vasile@hotel.com");
        cleaner.setPassword(passwordEncoder.encode("parola123"));
        cleaner.setRole("Cleaner");

        employeeRepository.saveAll(List.of(receptionist, cleaner));

        Guest guest1 = new Guest();
        guest1.setName("Lionel Messi");
        guest1.setEmail("leo.messi@intermiami.com");

        Guest guest2 = new Guest();
        guest2.setName("Cristiano Ronaldo");
        guest2.setEmail("cr7@alnassr.com");

        guestRepository.saveAll(List.of(guest1, guest2));

        Room room101 = new Room();
        room101.setNumber("101");
        room101.setType("Single");
        room101.setPrice(250.0);

        Room room102 = new Room();
        room102.setNumber("102");
        room102.setType("Double");
        room102.setPrice(400.0);

        Room room201 = new Room();
        room201.setNumber("201");
        room201.setType("Suite");
        room201.setPrice(750.0);

        Room room202 = new Room();
        room202.setNumber("202");
        room202.setType("Presidential");
        room202.setPrice(2500.0);

        roomRepository.saveAll(List.of(room101, room102, room201, room202));

        LocalDate startDate1 = LocalDate.now().minusDays(2);
        LocalDate endDate1 = LocalDate.now().plusDays(3);
        long nights1 = ChronoUnit.DAYS.between(startDate1, endDate1);
        double totalPrice1 = nights1 * room201.getPrice();

        Reservation reservation1 = Reservation.builder()
                .guest(guest1)
                .room(room201)
                .startDate(startDate1)
                .endDate(endDate1)
                .totalPrice(totalPrice1)
                .createdAt(startDate1.minusDays(1))
                .build();

        LocalDate startDate2 = LocalDate.now().plusDays(10);
        LocalDate endDate2 = LocalDate.now().plusDays(17);
        long nights2 = ChronoUnit.DAYS.between(startDate2, endDate2);
        double totalPrice2 = nights2 * room202.getPrice();

        Reservation reservation2 = Reservation.builder()
                .guest(guest2)
                .room(room202)
                .startDate(startDate2)
                .endDate(endDate2)
                .totalPrice(totalPrice2)
                .createdAt(LocalDate.now())
                .build();

        reservationRepository.saveAll(List.of(reservation1, reservation2));
    }
}