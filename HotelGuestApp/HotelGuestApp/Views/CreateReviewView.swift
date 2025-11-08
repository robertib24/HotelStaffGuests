import SwiftUI

struct CreateReviewView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    let room: Room
    var onReviewPosted: () -> Void
    
    @State private var rating: Int = 5
    @State private var comment: String = ""
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Camera \(room.number)") {
                    Text(room.type)
                }
                .listRowBackground(Color.theme.formBackground)
                
                Section("Rating-ul tău") {
                    Picker("Rating", selection: $rating) {
                        ForEach(1...5, id: \.self) { num in
                            Text("\(num) stele").tag(num)
                        }
                    }
                    .pickerStyle(.segmented)
                    RatingView(rating: rating)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 5)
                }
                .listRowBackground(Color.theme.formBackground)
                
                Section("Comentariu") {
                    TextEditor(text: $comment)
                        .frame(height: 150)
                        .scrollContentBackground(.hidden)
                }
                .listRowBackground(Color.theme.formBackground)
                
                if let errorMessage = errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundColor(.theme.red)
                    }
                    .listRowBackground(Color.theme.formBackground)
                }
                
                Section {
                    Button(action: postReview) {
                        Text("Trimite Recenzia")
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    .listRowInsets(EdgeInsets())
                }
                .listRowBackground(Color.clear)
            }
            .scrollContentBackground(.hidden)
            .background(Color.theme.background.ignoresSafeArea())
            .navigationTitle("Recenzie Nouă")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anulează") { dismiss() }
                }
            }
        }
    }
    
    func postReview() {
        errorMessage = nil
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
        }
    }
}
