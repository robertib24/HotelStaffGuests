import SwiftUI

struct RoomListView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var rooms = [Room]()
    @State private var isLoading = true
    @State private var errorMessage: String?
    @State private var searchText = ""
    @State private var selectedFilter: RoomFilter = .all
    
    enum RoomFilter: String, CaseIterable {
        case all = "Toate"
        case single = "Single"
        case double = "Double"
        case suite = "Suite"
        case deluxe = "Deluxe"
        case presidential = "Presidential"
    }
    
    var filteredRooms: [Room] {
        var result = rooms
        
        if selectedFilter != .all {
            result = result.filter { $0.type == selectedFilter.rawValue }
        }
        
        if !searchText.isEmpty {
            result = result.filter {
                $0.number.localizedCaseInsensitiveContains(searchText) ||
                $0.type.localizedCaseInsensitiveContains(searchText)
            }
        }
        
        return result
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()
                
                if isLoading {
                    LoadingView()
                } else if let errorMessage = errorMessage {
                    ErrorView(message: errorMessage) {
                        Task { await loadRooms() }
                    }
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            SearchBar(text: $searchText)
                                .padding(.horizontal)
                            
                            FilterScrollView(selectedFilter: $selectedFilter)
                            
                            if filteredRooms.isEmpty {
                                EmptyStateView(
                                    icon: "bed.double",
                                    title: "Nicio cameră găsită",
                                    message: "Încearcă să modifici filtrele sau căutarea"
                                )
                                .padding(.top, 60)
                            } else {
                                LazyVStack(spacing: 16) {
                                    ForEach(filteredRooms) { room in
                                        NavigationLink(value: room) {
                                            RoomCard(room: room)
                                        }
                                        .buttonStyle(PlainButtonStyle())
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                        .padding(.vertical)
                    }
                }
            }
            .navigationTitle("Camere Disponibile")
            .navigationBarTitleDisplayMode(.large)
            .navigationDestination(for: Room.self) { room in
                RoomDetailView(room: room)
            }
            .task {
                await loadRooms()
            }
            .refreshable {
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
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                self.rooms = loadedRooms
            }
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

struct SearchBar: View {
    @Binding var text: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color("textSecondary"))
            
            TextField("Caută cameră...", text: $text)
                .foregroundColor(Color("textPrimary"))
            
            if !text.isEmpty {
                Button(action: { text = "" }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color("textSecondary"))
                }
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(12)
    }
}

struct FilterScrollView: View {
    @Binding var selectedFilter: RoomListView.RoomFilter
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(RoomListView.RoomFilter.allCases, id: \.self) { filter in
                    FilterChip(
                        title: filter.rawValue,
                        isSelected: selectedFilter == filter
                    ) {
                        withAnimation(.spring(response: 0.3)) {
                            selectedFilter = filter
                        }
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.semibold)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    isSelected ?
                    LinearGradient(colors: [Color("blue"), Color("purple")], startPoint: .leading, endPoint: .trailing) :
                    LinearGradient(colors: [Color("formBackground"), Color("formBackground")], startPoint: .leading, endPoint: .trailing)
                )
                .foregroundColor(isSelected ? .white : Color("textSecondary"))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(Color("blue").opacity(isSelected ? 0 : 0.3), lineWidth: 1)
                )
        }
    }
}

struct RoomCard: View {
    let room: Room
    
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
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                LinearGradient(
                    colors: [roomTypeColor.opacity(0.6), roomTypeColor.opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .frame(height: 140)
                
                Image(systemName: roomTypeIcon)
                    .font(.system(size: 60))
                    .foregroundColor(.white.opacity(0.3))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                StatusBadge(status: room.status)
                    .padding(12)
            }
            
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(room.type)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(Color("textPrimary"))
                        
                        HStack(spacing: 4) {
                            Image(systemName: "door.left.hand.open")
                                .font(.caption)
                            Text("Camera \(room.number)")
                                .font(.subheadline)
                        }
                        .foregroundColor(Color("textSecondary"))
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("\(String(format: "%.0f", room.price)) RON")
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(Color("green"))
                        
                        Text("/ noapte")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
                
                HStack(spacing: 16) {
                    FeatureTag(icon: "wifi", text: "WiFi")
                    FeatureTag(icon: "tv", text: "TV")
                    FeatureTag(icon: "air.conditioner.horizontal", text: "AC")
                }
            }
            .padding(16)
        }
        .background(Color("formBackground"))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)
    }
}

struct StatusBadge: View {
    let status: String
    
    var statusColor: Color {
        switch status {
        case "Curat": return Color("green")
        case "Ocupat": return Color("red")
        case "Necesită Curățenie": return Color("yellow")
        case "În Mentenanță": return Color("blue")
        default: return Color("textSecondary")
        }
    }
    
    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)
            Text(status)
                .font(.caption)
                .fontWeight(.semibold)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(statusColor.opacity(0.2))
        .cornerRadius(12)
        .foregroundColor(statusColor)
    }
}

struct FeatureTag: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
            Text(text)
                .font(.caption)
        }
        .foregroundColor(Color("textSecondary"))
    }
}

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.5)
                .tint(Color("blue"))
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
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 60))
                .foregroundColor(Color("red"))
            
            Text("Eroare")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))
            
            Text(message)
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Button(action: retry) {
                HStack {
                    Image(systemName: "arrow.clockwise")
                    Text("Încearcă din nou")
                }
                .font(.headline)
                .padding()
                .background(Color("blue"))
                .foregroundColor(.white)
                .cornerRadius(12)
            }
        }
        .padding()
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 60))
                .foregroundColor(Color("textSecondary"))
            
            Text(title)
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(Color("textPrimary"))
            
            Text(message)
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
        }
        .padding()
    }
}
