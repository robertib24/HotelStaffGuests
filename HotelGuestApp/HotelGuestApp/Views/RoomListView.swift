import SwiftUI

struct RoomListView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var rooms = [Room]()
    @State private var isLoading = true
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView()
                } else if let errorMessage = errorMessage {
                    Text("Eroare: \(errorMessage)")
                } else {
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(rooms) { room in
                                NavigationLink(value: room) {
                                    RoomRowView(room: room)
                                        .transition(.move(edge: .leading).combined(with: .opacity))
                                }
                            }
                        }
                        .padding()
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.theme.background.ignoresSafeArea())
            .navigationTitle("Camere Disponibile")
            .navigationDestination(for: Room.self) { room in
                RoomDetailView(room: room)
            }
            .task {
                await loadRooms()
            }
        }
    }
    
    func loadRooms() async {
        if !rooms.isEmpty { return }
        isLoading = true
        errorMessage = nil
        do {
            let loadedRooms = try await apiService.fetchPublicRooms()
            withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                self.rooms = loadedRooms
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

struct RoomRowView: View {
    let room: Room
    
    var body: some View {
        HStack {
            Image(systemName: "bed.double.fill")
                .font(.title)
                .foregroundColor(.theme.yellow)
                .frame(width: 50)
            
            VStack(alignment: .leading) {
                Text(room.type)
                    .font(.headline)
                    .foregroundColor(.theme.textPrimary)
                Text("Camera \(room.number)")
                    .font(.subheadline)
                    .foregroundColor(.theme.textSecondary)
            }
            
            Spacer()
            
            Text("\(String(format: "%.2f", room.price)) RON")
                .font(.headline)
                .foregroundColor(.theme.green)
        }
        .padding()
        .background(Color.theme.formBackground)
        .cornerRadius(16)
    }
}
