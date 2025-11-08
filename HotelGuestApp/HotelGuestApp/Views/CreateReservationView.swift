import SwiftUI

struct CreateReservationView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    let room: Room
    
    @State private var startDate = Date()
    @State private var endDate = Calendar.current.date(byAdding: .day, value: 1, to: Date())!
    @State private var errorMessage: String?
    
    private var formattedStartDate: String {
        startDate.formatted(.iso8601.year().month().day())
    }
    
    private var formattedEndDate: String {
        endDate.formatted(.iso8601.year().month().day())
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Camera Selectată") {
                    Text("\(room.type) - Camera \(room.number)")
                    Text("\(String(format: "%.2f", room.price)) RON / noapte")
                }
                .listRowBackground(Color.theme.formBackground)
                
                Section("Alege Perioada") {
                    DatePicker("Check-in", selection: $startDate, in: Date()..., displayedComponents: .date)
                    DatePicker("Check-out", selection: $endDate, in: Calendar.current.date(byAdding: .day, value: 1, to: startDate)!..., displayedComponents: .date)
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
                    Button(action: reserve) {
                        Text("Confirmă Rezervarea")
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    .listRowInsets(EdgeInsets())
                }
                .listRowBackground(Color.clear)
            }
            .scrollContentBackground(.hidden)
            .background(Color.theme.background.ignoresSafeArea())
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
        }
    }
}
