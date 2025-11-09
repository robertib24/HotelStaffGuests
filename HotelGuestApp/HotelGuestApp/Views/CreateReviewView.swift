import SwiftUI

struct CreateReviewView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    let room: Room
    var onReviewPosted: () -> Void
    
    @State private var rating: Int = 5
    @State private var comment: String = ""
    @State private var errorMessage: String?
    @State private var isLoading = false
    @FocusState private var isCommentFocused: Bool
    
    var isFormValid: Bool {
        comment.count >= 10
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        RoomInfoCard(room: room)
                        
                        VStack(spacing: 20) {
                            Text("Rating-ul tău")
                                .font(.headline)
                                .foregroundColor(Color("textPrimary"))
                                .frame(maxWidth: .infinity, alignment: .leading)
                            
                            VStack(spacing: 16) {
                                HStack(spacing: 8) {
                                    ForEach(1...5, id: \.self) { star in
                                        Button(action: { rating = star }) {
                                            Image(systemName: star <= rating ? "star.fill" : "star")
                                                .font(.system(size: 36))
                                                .foregroundColor(star <= rating ? Color("yellow") : Color("textSecondary"))
                                                .scaleEffect(star == rating ? 1.2 : 1.0)
                                                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: rating)
                                        }
                                    }
                                }
                                
                                Text(ratingText)
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundColor(ratingColor)
                            }
                            .padding()
                            .background(Color("formBackground"))
                            .cornerRadius(16)
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Comentariul tău")
                                    .font(.headline)
                                    .foregroundColor(Color("textPrimary"))
                                
                                ZStack(alignment: .topLeading) {
                                    if comment.isEmpty {
                                        Text("Spune-ne despre experiența ta...")
                                            .foregroundColor(Color("textSecondary"))
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 12)
                                    }
                                    
                                    TextEditor(text: $comment)
                                        .frame(minHeight: 150)
                                        .scrollContentBackground(.hidden)
                                        .foregroundColor(Color("textPrimary"))
                                        .focused($isCommentFocused)
                                        .padding(4)
                                }
                                .padding(8)
                                .background(Color("formBackground"))
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(
                                            isCommentFocused ? Color("blue") : Color("textSecondary").opacity(0.3),
                                            lineWidth: isCommentFocused ? 2 : 1
                                        )
                                )
                                
                                HStack {
                                    Text("\(comment.count) / 1000 caractere")
                                        .font(.caption)
                                        .foregroundColor(Color("textSecondary"))
                                    
                                    Spacer()
                                    
                                    if comment.count >= 10 {
                                        HStack(spacing: 4) {
                                            Image(systemName: "checkmark.circle.fill")
                                                .foregroundColor(Color("green"))
                                            Text("Valid")
                                        }
                                        .font(.caption)
                                        .foregroundColor(Color("green"))
                                    } else if comment.count > 0 {
                                        Text("Minim 10 caractere")
                                            .font(.caption)
                                            .foregroundColor(Color("yellow"))
                                    }
                                }
                            }
                        }
                        
                        if let errorMessage = errorMessage {
                            ErrorBanner(message: errorMessage)
                        }
                        
                        Button(action: postReview) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Text("Trimite Recenzia")
                                        .font(.headline)
                                    Image(systemName: "paperplane.fill")
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: isFormValid ? [Color("yellow"), Color("green")] : [Color("textSecondary"), Color("textSecondary")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(16)
                            .shadow(color: isFormValid ? Color("yellow").opacity(0.5) : Color.clear, radius: 10, x: 0, y: 5)
                        }
                        .disabled(isLoading || !isFormValid)
                    }
                    .padding()
                }
            }
            .navigationTitle("Recenzie Nouă")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anulează") { dismiss() }
                }
            }
        }
    }
    
    var ratingText: String {
        switch rating {
        case 1: return "Dezamăgitor"
        case 2: return "Sub așteptări"
        case 3: return "Acceptabil"
        case 4: return "Foarte bun"
        case 5: return "Excepțional"
        default: return ""
        }
    }
    
    var ratingColor: Color {
        switch rating {
        case 1...2: return Color("red")
        case 3: return Color("yellow")
        case 4: return Color("blue")
        case 5: return Color("green")
        default: return Color("textSecondary")
        }
    }
    
    func postReview() {
        errorMessage = nil
        
        guard comment.count >= 10 else {
            errorMessage = "Comentariul trebuie să aibă minim 10 caractere."
            return
        }
        
        isLoading = true
        
        Task {
            do {
                let request = ReviewRequest(roomId: room.id, rating: rating, comment: comment)
                _ = try await apiService.createReview(request)
                onReviewPosted()
                dismiss()
            } catch let apiError as ApiError {
                errorMessage = apiError.message
            } catch {
                errorMessage = "Eroare la trimiterea recenziei."
            }
            isLoading = false
        }
    }
}

struct RoomInfoCard: View {
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
                RoundedRectangle(cornerRadius: 12)
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
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}
