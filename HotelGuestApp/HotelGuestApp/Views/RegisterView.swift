import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var apiService: ApiService
    @Environment(\.dismiss) var dismiss
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage: String?
    @State private var isLoading = false
    @State private var showPassword = false
    @State private var showConfirmPassword = false
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color("background"), Color("purple").opacity(0.3)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    VStack(spacing: 8) {
                        Text("Creare Cont")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        
                        Text("Completează datele pentru a începe")
                            .font(.subheadline)
                            .foregroundColor(Color("textSecondary"))
                    }
                    .padding(.top, 20)
                    
                    VStack(spacing: 16) {
                        CustomTextField(
                            icon: "person.fill",
                            placeholder: "Nume complet",
                            text: $name
                        )
                        
                        CustomTextField(
                            icon: "envelope.fill",
                            placeholder: "Email",
                            text: $email,
                            keyboardType: .emailAddress
                        )
                        
                        CustomSecureField(
                            icon: "lock.fill",
                            placeholder: "Parolă",
                            text: $password,
                            showPassword: $showPassword
                        )
                        
                        CustomSecureField(
                            icon: "lock.fill",
                            placeholder: "Confirmă parola",
                            text: $confirmPassword,
                            showPassword: $showConfirmPassword
                        )
                        
                        PasswordStrengthIndicator(password: password)
                        
                        if let errorMessage = errorMessage {
                            ErrorBanner(message: errorMessage)
                        }
                        
                        Button(action: register) {
                            HStack {
                                if isLoading {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Text("Înregistrare")
                                        .font(.headline)
                                    Image(systemName: "checkmark.circle.fill")
                                }
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: [Color("purple"), Color("blue")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(16)
                            .shadow(color: Color("purple").opacity(0.5), radius: 10, x: 0, y: 5)
                        }
                        .disabled(isLoading || !isFormValid)
                        .opacity(isFormValid ? 1 : 0.6)
                    }
                    .padding(.horizontal, 24)
                    
                    Spacer()
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
    
    var isFormValid: Bool {
        !name.isEmpty && !email.isEmpty && password.count >= 6 && password == confirmPassword
    }
    
    func register() {
        errorMessage = nil
        
        guard password == confirmPassword else {
            errorMessage = "Parolele nu se potrivesc"
            return
        }
        
        guard password.count >= 6 else {
            errorMessage = "Parola trebuie să aibă minim 6 caractere"
            return
        }
        
        isLoading = true
        
        Task {
            do {
                let request = GuestRegisterRequest(name: name, email: email, password: password)
                try await apiService.register(details: request)
                dismiss()
            } catch {
                errorMessage = "Eroare la înregistrare. Încearcă din nou."
            }
            isLoading = false
        }
    }
}

struct PasswordStrengthIndicator: View {
    let password: String
    
    var strength: Int {
        var score = 0
        if password.count >= 6 { score += 1 }
        if password.count >= 8 { score += 1 }
        if password.rangeOfCharacter(from: .uppercaseLetters) != nil { score += 1 }
        if password.rangeOfCharacter(from: .decimalDigits) != nil { score += 1 }
        return score
    }
    
    var strengthText: String {
        switch strength {
        case 0...1: return "Slabă"
        case 2: return "Medie"
        case 3: return "Bună"
        case 4: return "Excelentă"
        default: return ""
        }
    }
    
    var strengthColor: Color {
        switch strength {
        case 0...1: return Color("red")
        case 2: return Color("yellow")
        case 3: return Color("green")
        case 4: return Color("blue")
        default: return Color("textSecondary")
        }
    }
    
    var body: some View {
        if !password.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Puterea parolei:")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                    Text(strengthText)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(strengthColor)
                }
                
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 4)
                            .fill(Color("formBackground"))
                            .frame(height: 6)
                        
                        RoundedRectangle(cornerRadius: 4)
                            .fill(strengthColor)
                            .frame(width: geometry.size.width * CGFloat(strength) / 4, height: 6)
                            .animation(.easeInOut, value: strength)
                    }
                }
                .frame(height: 6)
            }
        }
    }
}
