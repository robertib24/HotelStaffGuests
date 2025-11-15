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
                        VStack(spacing: 20) {
                            headerSection

                            SearchBar(text: $searchText)
                                .padding(.horizontal)

                            FilterScrollView(selectedFilter: $selectedFilter)

                            if filteredRooms.isEmpty {
                                EmptyStateView(
                                    icon: "bed.double",
                                    title: "Nicio cameră găsită",
                                    message: "Încearcă să modifici filtrele sau căutarea"
                                )
                                .padding(.top, 40)
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
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
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

    private var headerSection: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("blue").opacity(0.3), Color("purple").opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "building.2.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            Text("Explorează Camerele")
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))

            Text("Descoperă confortul și luxul perfect pentru tine")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
        .padding(.horizontal)
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
                Button(action: {
                    withAnimation(.spring()) {
                        text = ""
                    }
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(Color("textSecondary"))
                }
                .transition(.scale.combined(with: .opacity))
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color("formBackground"))
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
        )
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
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(
                    Group {
                        if isSelected {
                            LinearGradient(
                                colors: [Color("blue"), Color("purple")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        } else {
                            LinearGradient(
                                colors: [Color("formBackground"), Color("formBackground")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        }
                    }
                )
                .foregroundColor(isSelected ? .white : Color("textSecondary"))
                .cornerRadius(20)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(
                            isSelected ?
                            LinearGradient(colors: [Color("blue"), Color("purple")], startPoint: .leading, endPoint: .trailing) :
                            LinearGradient(colors: [Color("textSecondary").opacity(0.3), Color("textSecondary").opacity(0.3)], startPoint: .leading, endPoint: .trailing),
                            lineWidth: 1
                        )
                )
                .shadow(color: isSelected ? Color("blue").opacity(0.3) : .clear, radius: 8, x: 0, y: 4)
                .scaleEffect(isSelected ? 1.05 : 1.0)
        }
        .animation(.spring(response: 0.3), value: isSelected)
    }
}

struct RoomCard: View {
    let room: Room
    @State private var isPressed = false

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
                .frame(height: 160)
                .overlay(
                    ZStack {
                        Circle()
                            .fill(roomTypeColor.opacity(0.2))
                            .frame(width: 120, height: 120)
                            .blur(radius: 30)
                            .offset(x: -40, y: -20)

                        Circle()
                            .fill(.white.opacity(0.1))
                            .frame(width: 80, height: 80)
                            .blur(radius: 20)
                            .offset(x: 50, y: 40)
                    }
                )

                Image(systemName: roomTypeIcon)
                    .font(.system(size: 70))
                    .foregroundColor(.white.opacity(0.4))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                StatusBadge(status: room.status)
                    .padding(12)
            }
            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))

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
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color("green"), Color("green").opacity(0.7)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )

                        Text("/ noapte")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }

                HStack(spacing: 16) {
                    FeatureTag(icon: "wifi", text: "WiFi", color: Color("blue"))
                    FeatureTag(icon: "tv", text: "TV", color: Color("purple"))
                    FeatureTag(icon: "air.conditioner.horizontal", text: "AC", color: Color("green"))
                }
            }
            .padding(16)
        }
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color("formBackground"))
                .shadow(color: Color.black.opacity(isPressed ? 0.1 : 0.15), radius: isPressed ? 6 : 12, x: 0, y: isPressed ? 2 : 6)
        )
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
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
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(.ultraThinMaterial)
                .overlay(
                    Capsule()
                        .stroke(statusColor.opacity(0.3), lineWidth: 1)
                )
        )
        .foregroundColor(statusColor)
    }
}

struct FeatureTag: View {
    let icon: String
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(color)
            Text(text)
                .font(.caption)
                .foregroundColor(Color("textPrimary"))
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(color.opacity(0.1))
        .cornerRadius(8)
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

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String

    var body: some View {
        VStack(spacing: 20) {
            ZStack {
                Circle()
                    .fill(Color("textSecondary").opacity(0.1))
                    .frame(width: 100, height: 100)

                Image(systemName: icon)
                    .font(.system(size: 50))
                    .foregroundColor(Color("textSecondary").opacity(0.6))
            }

            VStack(spacing: 8) {
                Text(title)
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(Color("textPrimary"))

                Text(message)
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
                    .multilineTextAlignment(.center)
            }
        }
        .padding()
    }
}
