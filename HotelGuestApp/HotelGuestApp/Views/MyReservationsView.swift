import SwiftUI

struct MyReservationsView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var reservations = [Reservation]()
    @State private var isLoading = true
    @State private var errorMessage: String?
    @State private var reservationToCancel: Reservation?
    @State private var showCancelAlert = false

    var body: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()

                if isLoading {
                    LoadingView()
                } else if let errorMessage = errorMessage {
                    ErrorView(message: errorMessage) {
                        Task { await loadReservations() }
                    }
                } else if reservations.isEmpty {
                    EmptyReservationsView()
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            headerSection

                            LazyVStack(spacing: 16) {
                                ForEach(reservations) { reservation in
                                    ReservationCard(reservation: reservation)
                                        .contextMenu {
                                            Button(role: .destructive) {
                                                reservationToCancel = reservation
                                                showCancelAlert = true
                                            } label: {
                                                Label("Anulează rezervarea", systemImage: "trash.fill")
                                            }
                                        }
                                }
                            }
                            .padding(.horizontal)
                        }
                        .padding(.vertical)
                    }
                }
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await loadReservations()
            }
            .refreshable {
                await loadReservations()
            }
            .alert("Confirmare Anulare", isPresented: $showCancelAlert, presenting: reservationToCancel) { reservation in
                Button("Anulează Rezervarea", role: .destructive) {
                    Task {
                        await cancelReservation(reservation)
                    }
                }
                Button("Înapoi", role: .cancel) { }
            } message: { reservation in
                Text("Ești sigur că vrei să anulezi rezervarea \(reservation.reservationCode)?")
            }
        }
    }

    private var headerSection: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("green").opacity(0.3), Color("blue").opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "calendar.badge.checkmark")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("green"), Color("blue")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            Text("Rezervările Mele")
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))

            Text("\(reservations.count) \(reservations.count == 1 ? "rezervare activă" : "rezervări active")")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
        .padding(.horizontal)
    }

    func loadReservations() async {
        isLoading = true
        errorMessage = nil
        do {
            reservations = try await apiService.fetchMyReservations()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func cancelReservation(_ reservation: Reservation) async {
        do {
            try await apiService.cancelReservation(id: reservation.id)
            withAnimation(.spring()) {
                reservations.removeAll { $0.id == reservation.id }
            }
        } catch {
            errorMessage = "Eroare la anularea rezervării."
        }
    }
}

struct ReservationCard: View {
    let reservation: Reservation
    @State private var isPressed = false

    var daysUntilCheckIn: Int {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        if let startDate = formatter.date(from: reservation.startDate) {
            return Calendar.current.dateComponents([.day], from: Date(), to: startDate).day ?? 0
        }
        return 0
    }

    var isUpcoming: Bool {
        daysUntilCheckIn >= 0
    }

    var numberOfNights: Int {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        if let start = formatter.date(from: reservation.startDate),
           let end = formatter.date(from: reservation.endDate) {
            return Calendar.current.dateComponents([.day], from: start, to: end).day ?? 1
        }
        return 1
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header with icon and room info
            HStack(alignment: .top, spacing: 16) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [roomTypeColor, roomTypeColor.opacity(0.6)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 70, height: 70)
                        .shadow(color: roomTypeColor.opacity(0.3), radius: 8, x: 0, y: 4)

                    Image(systemName: roomTypeIcon)
                        .font(.system(size: 30))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(reservation.roomType)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(Color("textPrimary"))

                        Spacer()

                        Text(reservation.reservationCode)
                            .font(.caption)
                            .fontWeight(.semibold)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                Capsule()
                                    .fill(Color("blue").opacity(0.15))
                            )
                            .foregroundColor(Color("blue"))
                    }

                    Text("Camera \(reservation.roomNumber)")
                        .font(.subheadline)
                        .foregroundColor(Color("textSecondary"))

                    if isUpcoming {
                        StatusPill(
                            icon: daysUntilCheckIn == 0 ? "clock.fill" : "calendar",
                            text: daysUntilCheckIn == 0 ? "Check-in astăzi" : "Peste \(daysUntilCheckIn) zile",
                            color: daysUntilCheckIn == 0 ? Color("green") : Color("blue")
                        )
                    }
                }
            }
            .padding()

            Divider()
                .background(Color("textSecondary").opacity(0.2))

            // Check-in / Check-out dates
            HStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 6) {
                        Image(systemName: "calendar.badge.clock")
                            .font(.caption)
                        Text("Check-in")
                            .font(.caption)
                            .fontWeight(.medium)
                    }
                    .foregroundColor(Color("textSecondary"))

                    Text(formatDate(reservation.startDate))
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(Color("textPrimary"))
                }

                Spacer()

                Image(systemName: "arrow.right")
                    .foregroundColor(Color("textSecondary").opacity(0.5))
                    .padding(.horizontal, 8)

                Spacer()

                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 6) {
                        Image(systemName: "calendar.badge.checkmark")
                            .font(.caption)
                        Text("Check-out")
                            .font(.caption)
                            .fontWeight(.medium)
                    }
                    .foregroundColor(Color("textSecondary"))

                    Text(formatDate(reservation.endDate))
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(Color("textPrimary"))
                }

                Spacer()

                VStack(spacing: 4) {
                    Text("\(numberOfNights)")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color("blue"), Color("purple")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                    Text(numberOfNights == 1 ? "noapte" : "nopți")
                        .font(.caption2)
                        .foregroundColor(Color("textSecondary"))
                }
            }
            .padding()
            .background(Color("background").opacity(0.5))

            Divider()
                .background(Color("textSecondary").opacity(0.2))

            // Total price
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Total")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                    Text("\(String(format: "%.2f", reservation.totalPrice)) RON")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color("green"), Color("green").opacity(0.7)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                }

                Spacer()

                ZStack {
                    Circle()
                        .fill(Color("green").opacity(0.1))
                        .frame(width: 40, height: 40)

                    Image(systemName: "checkmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(Color("green"))
                }
            }
            .padding()
        }
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color("formBackground"))
                .shadow(color: Color.black.opacity(isPressed ? 0.1 : 0.15), radius: isPressed ? 6 : 12, x: 0, y: isPressed ? 2 : 6)
        )
        .scaleEffect(isPressed ? 0.98 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
    }

    var roomTypeIcon: String {
        switch reservation.roomType {
        case "Single": return "bed.double"
        case "Double": return "bed.double.fill"
        case "Suite": return "building.2"
        case "Deluxe": return "star.fill"
        case "Presidential": return "crown.fill"
        default: return "bed.double"
        }
    }

    var roomTypeColor: Color {
        switch reservation.roomType {
        case "Single": return Color("blue")
        case "Double": return Color("purple")
        case "Suite": return Color("yellow")
        case "Deluxe": return Color("red")
        case "Presidential": return Color("green")
        default: return Color("blue")
        }
    }

    func formatDate(_ dateString: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateFormat = "dd MMM yyyy"
            displayFormatter.locale = Locale(identifier: "ro_RO")
            return displayFormatter.string(from: date)
        }
        return dateString
    }
}

struct StatusPill: View {
    let icon: String
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption2)
            Text(text)
                .font(.caption)
                .fontWeight(.semibold)
        }
        .foregroundColor(color)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(
            Capsule()
                .fill(color.opacity(0.15))
        )
    }
}

struct EmptyReservationsView: View {
    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("blue").opacity(0.1), Color("purple").opacity(0.1)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 120, height: 120)

                Image(systemName: "calendar.badge.exclamationmark")
                    .font(.system(size: 60))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            VStack(spacing: 8) {
                Text("Nicio Rezervare")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))

                Text("Nu ai nicio rezervare activă.\nExploreaază camerele disponibile!")
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
    }
}

struct LoadingView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .stroke(Color("blue").opacity(0.2), lineWidth: 4)
                    .frame(width: 60, height: 60)

                Circle()
                    .trim(from: 0, to: 0.7)
                    .stroke(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        style: StrokeStyle(lineWidth: 4, lineCap: .round)
                    )
                    .frame(width: 60, height: 60)
                    .rotationEffect(Angle(degrees: isAnimating ? 360 : 0))
                    .animation(.linear(duration: 1).repeatForever(autoreverses: false), value: isAnimating)
            }
            .onAppear { isAnimating = true }

            Text("Se încarcă...")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
        }
    }
}

struct ErrorView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(Color("red").opacity(0.1))
                    .frame(width: 100, height: 100)

                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("red"), Color("red").opacity(0.7)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            VStack(spacing: 8) {
                Text("Oops! Ceva nu a mers bine")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))

                Text(message)
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }

            Button(action: retry) {
                HStack(spacing: 8) {
                    Image(systemName: "arrow.clockwise")
                    Text("Încearcă din nou")
                        .fontWeight(.semibold)
                }
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    LinearGradient(
                        colors: [Color("blue"), Color("purple")],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(12)
                .shadow(color: Color("blue").opacity(0.3), radius: 8, x: 0, y: 4)
            }
        }
        .padding()
    }
}
