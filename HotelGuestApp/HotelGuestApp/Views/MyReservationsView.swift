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
            Group {
                if isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let errorMessage = errorMessage {
                    Text("Eroare: \(errorMessage)")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if reservations.isEmpty {
                    VStack {
                        Image(systemName: "list.bullet.rectangle.portrait")
                            .font(.system(size: 60))
                            .foregroundColor(.theme.textSecondary)
                        Text("Nu ai nicio rezervare.")
                            .font(.headline)
                            .foregroundColor(.theme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List {
                        ForEach(reservations) { reservation in
                            ReservationRowView(reservation: reservation)
                                .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                    Button(role: .destructive) {
                                        reservationToCancel = reservation
                                        showCancelAlert = true
                                    } label: {
                                        Label("Anulează", systemImage: "trash.fill")
                                    }
                                }
                                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                                .listRowBackground(Color.theme.background)
                                .listRowSeparator(.hidden)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .background(Color.theme.background.ignoresSafeArea())
            .navigationTitle("Rezervările Mele")
            .task {
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

struct ReservationRowView: View {
    let reservation: Reservation
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(reservation.reservationCode)
                    .font(.caption.bold())
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.theme.blue.opacity(0.2))
                    .foregroundColor(.theme.blue)
                    .cornerRadius(6)
                Spacer()
                Text("Total: \(String(format: "%.2f", reservation.totalPrice)) RON")
                    .font(.headline)
                    .foregroundColor(.theme.green)
            }
            
            Text("Camera \(reservation.roomNumber) (\(reservation.roomType))")
                .font(.headline)
                .foregroundColor(.theme.textPrimary)
            
            HStack(spacing: 16) {
                VStack(alignment: .leading) {
                    Text("Check-in")
                        .font(.caption)
                        .foregroundColor(.theme.textSecondary)
                    Text(formatDate(reservation.startDate))
                        .font(.subheadline.weight(.medium))
                        .foregroundColor(.theme.textPrimary)
                }
                Image(systemName: "arrow.right")
                    .foregroundColor(.theme.textSecondary)
                VStack(alignment: .leading) {
                    Text("Check-out")
                        .font(.caption)
                        .foregroundColor(.theme.textSecondary)
                    Text(formatDate(reservation.endDate))
                        .font(.subheadline.weight(.medium))
                        .foregroundColor(.theme.textPrimary)
                }
            }
        }
        .padding()
        .background(Color.theme.formBackground)
        .cornerRadius(16)
    }
    
    private func formatDate(_ dateString: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        if let date = formatter.date(from: dateString) {
            return date.formatted(date: .abbreviated, time: .omitted)
        }
        return dateString
    }
}
