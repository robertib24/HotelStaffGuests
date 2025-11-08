import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    
    var body: some View {
        VStack(spacing: 20) {
            
            TextField("Nume complet", text: $name)
                .padding()
                .background(Color.theme.formBackground)
                .cornerRadius(10)
                .foregroundColor(.theme.textPrimary)
            
            TextField("Email", text: $email)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding()
                .background(Color.theme.formBackground)
                .cornerRadius(10)
                .foregroundColor(.theme.textPrimary)
            
            SecureField("Parolă", text: $password)
                .padding()
                .background(Color.theme.formBackground)
                .cornerRadius(10)
                .foregroundColor(.theme.textPrimary)
            
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .foregroundColor(.theme.red)
                    .font(.caption)
            }
            
            Button(action: register) {
                Text("Înregistrare")
            }
            .buttonStyle(PrimaryButtonStyle())
            
            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.theme.background.ignoresSafeArea())
        .navigationTitle("Cont Nou")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    func register() {
        errorMessage = nil
        Task {
            do {
                let request = GuestRegisterRequest(name: name, email: email, password: password)
                try await apiService.register(details: request)
                dismiss()
            } catch {
                errorMessage = "Eroare la înregistrare. Încearcă din nou."
            }
        }
    }
}
