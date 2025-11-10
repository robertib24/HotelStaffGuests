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
                    EmptyStateView(
                        icon: "calendar.badge.exclamationmark",
                        title: "Nicio rezervare",
                        message: "Nu ai nicio rezervare activă.\nExploreaază camerele disponibile!"
                    )
                } else {
                    ScrollView {
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
                                    .padding(.horizontal)
                            }
                        }
                        .padding(.vertical)
                    }
                }
            }
            .navigationTitle("Rezervările Mele")
            .navigationBarTitleDisplayMode(.large)
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
            withAnimation {
                reservations.removeAll { $0.id == reservation.id }
            }
        } catch {
            errorMessage = "Eroare la anularea rezervării."
        }
    }
}

struct ReservationCard: View {
    let reservation: Reservation
    
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
            HStack(alignment: .top, spacing: 12) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color("blue"), Color("purple")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 60, height: 60)
                    
                    Image(systemName: roomTypeIcon)
                        .font(.title2)
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
                            .padding(.vertical, 6)
                            .background(Color("blue").opacity(0.2))
                            .foregroundColor(Color("blue"))
                            .cornerRadius(8)
                    }
                    
                    Text("Camera \(reservation.roomNumber)")
                        .font(.subheadline)
                        .foregroundColor(Color("textSecondary"))
                    
                    if isUpcoming {
                        if daysUntilCheckIn == 0 {
                            HStack(spacing: 4) {
                                Image(systemName: "clock.fill")
                                    .font(.caption)
                                Text("Check-in astăzi")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(Color("green"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color("green").opacity(0.2))
                            .cornerRadius(6)
                        } else {
                            HStack(spacing: 4) {
                                Image(systemName: "calendar")
                                    .font(.caption)
                                Text("Peste \(daysUntilCheckIn) zile")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(Color("blue"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color("blue").opacity(0.2))
                            .cornerRadius(6)
                        }
                    }
                }
            }
            .padding()
            
            Divider()
                .background(Color("textSecondary").opacity(0.3))
            
            HStack(spacing: 24) {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar.badge.clock")
                            .font(.caption)
                        Text("Check-in")
                            .font(.caption)
                    }
                    .foregroundColor(Color("textSecondary"))
                    
                    Text(formatDate(reservation.startDate))
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(Color("textPrimary"))
                }
                
                Image(systemName: "arrow.right")
                    .foregroundColor(Color("textSecondary"))
                
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 4) {
                        Image(systemName: "calendar.badge.checkmark")
                            .font(.caption)
                        Text("Check-out")
                            .font(.caption)
                    }
                    .foregroundColor(Color("textSecondary"))
                    
                    Text(formatDate(reservation.endDate))
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(Color("textPrimary"))
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 6) {
                    Text("\(numberOfNights)")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color("blue"))
                    Text(numberOfNights == 1 ? "noapte" : "nopți")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
            }
            .padding()
            .background(Color("background"))
            
            Divider()
                .background(Color("textSecondary").opacity(0.3))
            
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Total")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                    Text("\(String(format: "%.2f", reservation.totalPrice)) RON")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(Color("green"))
                }
                
                Spacer()
                
                Image(systemName: "checkmark.circle.fill")
                    .font(.title2)
                    .foregroundColor(Color("green"))
            }
            .padding()
        }
        .background(Color("formBackground"))
        .cornerRadius(20)
        .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)
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
