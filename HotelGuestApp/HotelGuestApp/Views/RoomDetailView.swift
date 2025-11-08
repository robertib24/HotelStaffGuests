import SwiftUI

struct RoomDetailView: View {
    @EnvironmentObject var apiService: ApiService
    let room: Room
    
    @State private var reviews = [Review]()
    @State private var showCreateReservation = false
    @State private var showCreateReview = false
    
    var body: some View {
        List {
            Section {
                HStack {
                    Text("Număr")
                    Spacer()
                    Text(room.number)
                }
                HStack {
                    Text("Tip")
                    Spacer()
                    Text(room.type)
                }
                HStack {
                    Text("Preț / noapte")
                    Spacer()
                    Text("\(String(format: "%.2f", room.price)) RON")
                        .foregroundColor(.theme.green)
                }
                HStack {
                    Text("Status")
                    Spacer()
                    Text(room.status)
                        .foregroundColor(room.status == "Curat" ? .theme.blue : .theme.yellow)
                }
            }
            .listRowBackground(Color.theme.formBackground)
            
            Section {
                Button(action: { showCreateReservation = true }) {
                    Label("Rezervă Acum", systemImage: "calendar.badge.plus")
                }
                .disabled(room.status != "Curat")
                
                Button(action: { showCreateReview = true }) {
                    Label("Lasă o recenzie", systemImage: "star.bubble")
                }
            }
            .listRowBackground(Color.theme.formBackground)
            
            Section("Recenzii") {
                if reviews.isEmpty {
                    Text("Nicio recenzie pentru această cameră.")
                        .foregroundColor(.theme.textSecondary)
                } else {
                    ForEach(reviews) { review in
                        VStack(alignment: .leading, spacing: 5) {
                            Text(review.guestName)
                                .font(.headline)
                                .foregroundColor(.theme.textPrimary)
                            RatingView(rating: review.rating)
                            Text(review.comment)
                                .font(.body)
                                .foregroundColor(.theme.textSecondary)
                        }
                        .padding(.vertical, 5)
                    }
                }
            }
            .listRowBackground(Color.theme.formBackground)
        }
        .scrollContentBackground(.hidden)
        .background(Color.theme.background.ignoresSafeArea())
        .navigationTitle(room.type)
        .task {
            await loadReviews()
        }
        .sheet(isPresented: $showCreateReservation) {
            CreateReservationView(room: room)
                .preferredColorScheme(.dark)
        }
        .sheet(isPresented: $showCreateReview) {
            CreateReviewView(room: room, onReviewPosted: {
                Task { await loadReviews() }
            })
            .preferredColorScheme(.dark)
        }
    }
    
    func loadReviews() async {
        do {
            reviews = try await apiService.fetchPublicReviews(roomId: room.id)
        } catch {
            print(error.localizedDescription)
        }
    }
}

struct RatingView: View {
    let rating: Int
    
    var body: some View {
        HStack {
            ForEach(1...5, id: \.self) { number in
                Image(systemName: number > rating ? "star" : "star.fill")
                    .foregroundColor(.theme.yellow)
            }
        }
    }
}
