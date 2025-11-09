import SwiftUI

struct RoomDetailView: View {
    @EnvironmentObject var apiService: ApiService
    let room: Room
    
    @State private var reviews = [Review]()
    @State private var showCreateReservation = false
    @State private var showCreateReview = false
    @State private var isLoadingReviews = true
    
    var roomTypeIcon: String {
        switch room.type {
        case "Single": return "bed.double"
        case "Double": return "bed.double.fill"
        case "Suite": return "building.2"
        case "Deluxe": return "star.fill"
        case "Presidential": return "crown.fill"
        default: return "bed.double"
        }
    }
    
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
    
    var averageRating: Double {
        guard !reviews.isEmpty else { return 0 }
        let total = reviews.reduce(0) { $0 + $1.rating }
        return Double(total) / Double(reviews.count)
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                ZStack(alignment: .bottomTrailing) {
                    LinearGradient(
                        colors: [roomTypeColor, roomTypeColor.opacity(0.6)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .frame(height: 280)
                    
                    Image(systemName: roomTypeIcon)
                        .font(.system(size: 120))
                        .foregroundColor(.white.opacity(0.3))
                    
                    StatusBadge(status: room.status)
                        .padding(20)
                }
                
                VStack(spacing: 24) {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(room.type)
                                    .font(.system(size: 32, weight: .bold))
                                    .foregroundColor(Color("textPrimary"))
                                
                                HStack(spacing: 8) {
                                    Image(systemName: "door.left.hand.open")
                                    Text("Camera \(room.number)")
                                        .font(.title3)
                                }
                                .foregroundColor(Color("textSecondary"))
                            }
                            
                            Spacer()
                            
                            VStack(alignment: .trailing, spacing: 4) {
                                Text("\(String(format: "%.0f", room.price))")
                                    .font(.system(size: 36, weight: .bold))
                                    .foregroundColor(Color("green"))
                                Text("RON / noapte")
                                    .font(.caption)
                                    .foregroundColor(Color("textSecondary"))
                            }
                        }
                        
                        if !reviews.isEmpty {
                            HStack(spacing: 8) {
                                ForEach(1...5, id: \.self) { star in
                                    Image(systemName: star <= Int(averageRating.rounded()) ? "star.fill" : "star")
                                        .font(.caption)
                                        .foregroundColor(Color("yellow"))
                                }
                                Text(String(format: "%.1f", averageRating))
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(Color("textPrimary"))
                                Text("(\(reviews.count) recenzii)")
                                    .font(.caption)
                                    .foregroundColor(Color("textSecondary"))
                            }
                        }
                    }
                    .padding()
                    .background(Color("formBackground"))
                    .cornerRadius(16)
                    
                    VStack(spacing: 16) {
                        FeatureRow(icon: "wifi", title: "WiFi Gratuit", color: Color("blue"))
                        FeatureRow(icon: "tv", title: "TV HD", color: Color("purple"))
                        FeatureRow(icon: "air.conditioner.horizontal", title: "Aer Condiționat", color: Color("green"))
                        FeatureRow(icon: "shower", title: "Baie Privată", color: Color("blue"))
                        FeatureRow(icon: "refrigerator", title: "Minibar", color: Color("red"))
                        FeatureRow(icon: "fork.knife", title: "Room Service", color: Color("yellow"))
                    }
                    .padding()
                    .background(Color("formBackground"))
                    .cornerRadius(16)
                    
                    VStack(spacing: 12) {
                        Button(action: { showCreateReservation = true }) {
                            HStack {
                                Image(systemName: "calendar.badge.plus")
                                Text("Rezervă Acum")
                                    .font(.headline)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: [Color("blue"), Color("purple")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(16)
                            .shadow(color: Color("blue").opacity(0.5), radius: 10, x: 0, y: 5)
                        }
                        .disabled(room.status != "Curat")
                        .opacity(room.status == "Curat" ? 1 : 0.5)
                        
                        Button(action: { showCreateReview = true }) {
                            HStack {
                                Image(systemName: "star.bubble")
                                Text("Lasă o Recenzie")
                                    .font(.headline)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color("formBackground"))
                            .foregroundColor(Color("blue"))
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color("blue"), lineWidth: 2)
                            )
                        }
                    }
                    .padding(.horizontal)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Text("Recenzii")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(Color("textPrimary"))
                            
                            Spacer()
                            
                            if !reviews.isEmpty {
                                Text("\(reviews.count)")
                                    .font(.headline)
                                    .foregroundColor(Color("blue"))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color("blue").opacity(0.2))
                                    .cornerRadius(12)
                            }
                        }
                        
                        if isLoadingReviews {
                            HStack {
                                Spacer()
                                ProgressView()
                                    .tint(Color("blue"))
                                Spacer()
                            }
                            .padding()
                        } else if reviews.isEmpty {
                            EmptyStateView(
                                icon: "star",
                                title: "Nicio recenzie",
                                message: "Fii primul care lasă o recenzie!"
                            )
                        } else {
                            ForEach(reviews) { review in
                                ReviewCard(review: review)
                            }
                        }
                    }
                    .padding()
                    .background(Color("formBackground"))
                    .cornerRadius(16)
                }
                .padding()
            }
        }
        .background(Color("background"))
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await loadReviews()
        }
        .sheet(isPresented: $showCreateReservation) {
            CreateReservationView(room: room)
        }
        .sheet(isPresented: $showCreateReview) {
            CreateReviewView(room: room, onReviewPosted: {
                Task { await loadReviews() }
            })
        }
    }
    
    func loadReviews() async {
        isLoadingReviews = true
        do {
            reviews = try await apiService.fetchPublicReviews(roomId: room.id)
        } catch {
            print(error.localizedDescription)
        }
        isLoadingReviews = false
    }
}

struct FeatureRow: View {
    let icon: String
    let title: String
    let color: Color
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
                .frame(width: 32)
            
            Text(title)
                .font(.body)
                .foregroundColor(Color("textPrimary"))
            
            Spacer()
            
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(Color("green"))
        }
        .padding(.vertical, 8)
    }
}

struct ReviewCard: View {
    let review: Review
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 44, height: 44)
                    .overlay(
                        Text(review.guestName.prefix(1))
                            .font(.headline)
                            .foregroundColor(.white)
                    )
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(review.guestName)
                        .font(.headline)
                        .foregroundColor(Color("textPrimary"))
                    
                    Text(formatDate(review.createdAt))
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
                
                Spacer()
                
                HStack(spacing: 2) {
                    ForEach(1...5, id: \.self) { star in
                        Image(systemName: star <= review.rating ? "star.fill" : "star")
                            .font(.caption)
                            .foregroundColor(Color("yellow"))
                    }
                }
            }
            
            Text(review.comment)
                .font(.body)
                .foregroundColor(Color("textPrimary"))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding()
        .background(Color("background"))
        .cornerRadius(12)
    }
    
    func formatDate(_ dateString: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: dateString) {
            let displayFormatter = DateFormatter()
            displayFormatter.dateStyle = .medium
            displayFormatter.timeStyle = .short
            displayFormatter.locale = Locale(identifier: "ro_RO")
            return displayFormatter.string(from: date)
        }
        return dateString
    }
}
