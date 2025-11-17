import SwiftUI

struct CreateReservationView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    let room: Room
    
    @State private var startDate = Date()
    @State private var endDate = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
    @State private var errorMessage: String?
    @State private var isLoading = false
    
    var numberOfNights: Int {
        let calendar = Calendar.current
        let start = calendar.startOfDay(for: startDate)
        let end = calendar.startOfDay(for: endDate)
        let components = calendar.dateComponents([.day], from: start, to: end)
        return components.day ?? 0
    }
    
    var totalPrice: Double {
        Double(numberOfNights) * room.price
    }
    
    private var formattedStartDate: String {
        startDate.formatted(.iso8601.year().month().day())
    }
    
    private var formattedEndDate: String {
        endDate.formatted(.iso8601.year().month().day())
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        RoomSummaryCard(room: room)
                        
                        VStack(spacing: 20) {
                            Text("Selectează Perioada")
                                .font(.headline)
                                .foregroundColor(Color("textPrimary"))
                                .frame(maxWidth: .infinity, alignment: .leading)
                            
                            DateSelectionCard(
                                title: "Check-in",
                                date: $startDate,
                                icon: "calendar.badge.clock",
                                color: Color("blue")
                            )
                            
                            DateSelectionCard(
                                title: "Check-out",
                                date: $endDate,
                                icon: "calendar.badge.checkmark",
                                color: Color("purple")
                            )
                            
                            StayInfoCard(nights: numberOfNights)
                        }
                        .padding()
                        .background(Color("formBackground"))
                        .cornerRadius(16)
                        
                        PriceSummaryCard(
                            nightlyRate: room.price,
                            numberOfNights: numberOfNights,
                            totalPrice: totalPrice
                        )
                        
                        if let errorMessage = errorMessage {
                            ErrorBanner(message: errorMessage)
                        }
                        
                        Button(action: reserve) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Text("Confirmă Rezervarea")
                                        .font(.headline)
                                    Image(systemName: "checkmark.circle.fill")
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: [Color("green"), Color("blue")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(16)
                            .shadow(color: Color("green").opacity(0.5), radius: 10, x: 0, y: 5)
                        }
                        .disabled(isLoading || numberOfNights <= 0)
                        .opacity(numberOfNights > 0 ? 1 : 0.5)
                    }
                    .padding()
                }
            }
            .navigationTitle("Rezervare Nouă")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anulează") { dismiss() }
                }
            }
        }
    }
    
    func reserve() {
        errorMessage = nil
        
        guard endDate > startDate else {
            errorMessage = "Data de check-out trebuie să fie după data de check-in."
            return
        }
        
        isLoading = true
        
        Task {
            do {
                let request = ClientReservationRequest(
                    roomId: room.id,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate
                )
                _ = try await apiService.createReservation(request)
                dismiss()
            } catch let apiError as ApiError {
                errorMessage = apiError.message
            } catch {
                errorMessage = "Camera nu este disponibilă în acest interval."
            }
            isLoading = false
        }
    }
}

struct RoomSummaryCard: View {
    let room: Room
    
    var roomTypeColor: Color {
        switch room.type {
        case "Single": return Color("blue")
        case "Double": return Color("purple")
        case "Suite": return Color("yellow")
        case "Deluxe": return Color("red")
        case "Presidential": return Color("green")
        default: return Color("blue")
        }
    }
    
    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [roomTypeColor, roomTypeColor.opacity(0.6)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 60, height: 60)
                
                Image(systemName: "bed.double.fill")
                    .font(.title2)
                    .foregroundColor(.white)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(room.type)
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))
                
                Text("Camera \(room.number)")
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("\(String(format: "%.0f", room.price))")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(Color("green"))
                Text("RON/noapte")
                    .font(.caption)
                    .foregroundColor(Color("textSecondary"))
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}

struct DateSelectionCard: View {
    let title: String
    @Binding var date: Date
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(Color("textPrimary"))
            }
            
            DatePicker(
                "",
                selection: $date,
                in: Date()...,
                displayedComponents: .date
            )
            .datePickerStyle(.graphical)
            .tint(color)
        }
        .padding()
        .background(Color("background"))
        .cornerRadius(12)
    }
}

struct StayInfoCard: View {
    let nights: Int
    
    var body: some View {
        HStack {
            Image(systemName: "moon.stars.fill")
                .font(.title2)
                .foregroundColor(Color("yellow"))
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Durata șederii")
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
                Text("\(nights) \(nights == 1 ? "noapte" : "nopți")")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))
            }
            
            Spacer()
        }
        .padding()
        .background(Color("yellow").opacity(0.1))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color("yellow").opacity(0.3), lineWidth: 1)
        )
    }
}

struct PriceSummaryCard: View {
    let nightlyRate: Double
    let numberOfNights: Int
    let totalPrice: Double
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Rezumat Preț")
                .font(.headline)
                .foregroundColor(Color("textPrimary"))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            VStack(spacing: 12) {
                PriceRow(
                    label: "\(String(format: "%.0f", nightlyRate)) RON x \(numberOfNights) \(numberOfNights == 1 ? "noapte" : "nopți")",
                    value: String(format: "%.2f", nightlyRate * Double(numberOfNights))
                )
                
                Divider()
                    .background(Color("textSecondary").opacity(0.3))
                
                HStack {
                    Text("Total")
                        .font(.title3)
                        .fontWeight(.bold)
                        .foregroundColor(Color("textPrimary"))
                    
                    Spacer()
                    
                    Text("\(String(format: "%.2f", totalPrice)) RON")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color("green"))
                }
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(
                    LinearGradient(
                        colors: [Color("green"), Color("blue")],
                        startPoint: .leading,
                        endPoint: .trailing
                    ),
                    lineWidth: 2
                )
        )
    }
}

struct PriceRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
            
            Spacer()
            
            Text("\(value) RON")
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(Color("textPrimary"))
        }
    }
}
