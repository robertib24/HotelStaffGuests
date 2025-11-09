import SwiftUI

struct LoginView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    @State private var isRegistering = false
    @State private var isLoading = false
    @State private var showPassword = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                LinearGradient(
                    colors: [Color("background"), Color("blue").opacity(0.3)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 32) {
                        Spacer(minLength: 40)
                        
                        VStack(spacing: 16) {
                            ZStack {
                                Circle()
                                    .fill(LinearGradient(
                                        colors: [Color("blue"), Color("purple")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ))
                                    .frame(width: 120, height: 120)
                                    .shadow(color: Color("blue").opacity(0.5), radius: 20, x: 0, y: 10)
                                
                                Image(systemName: "building.2.crop.circle.fill")
                                    .font(.system(size: 60))
                                    .foregroundStyle(.white)
                            }
                            .padding(.bottom, 8)
                            
                            Text("Bine ai venit!")
                                .font(.system(size: 36, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                            
                            Text("Autentifică-te pentru a continua")
                                .font(.subheadline)
                                .foregroundColor(Color("textSecondary"))
                        }
                        .padding(.horizontal)
                        
                        VStack(spacing: 20) {
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
                            
                            if let errorMessage = errorMessage {
                                ErrorBanner(message: errorMessage)
                            }
                            
                            Button(action: login) {
                                HStack {
                                    if isLoading {
                                        ProgressView()
                                            .tint(.white)
                                    } else {
                                        Text("Autentificare")
                                            .font(.headline)
                                        Image(systemName: "arrow.right.circle.fill")
                                    }
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
                            .disabled(isLoading)
                            
                            Button {
                                isRegistering = true
                            } label: {
                                HStack {
                                    Text("Nu ai cont?")
                                        .foregroundColor(Color("textSecondary"))
                                    Text("Înregistrează-te")
                                        .foregroundColor(Color("blue"))
                                        .fontWeight(.semibold)
                                }
                                .font(.subheadline)
                            }
                            .padding(.top, 8)
                        }
                        .padding(.horizontal, 24)
                        
                        Spacer()
                    }
                }
            }
            .navigationDestination(isPresented: $isRegistering) {
                RegisterView()
            }
        }
    }
    
    func login() {
        errorMessage = nil
        isLoading = true
        
        Task {
            do {
                let request = AuthRequest(email: email, password: password)
                try await apiService.login(credentials: request)
            } catch {
                errorMessage = "Email sau parolă incorectă."
            }
            isLoading = false
        }
    }
}

struct CustomTextField: View {
    let icon: String
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(Color("blue"))
                .frame(width: 24)
            
            TextField(placeholder, text: $text)
                .keyboardType(keyboardType)
                .autocapitalization(.none)
                .foregroundColor(Color("textPrimary"))
        }
        .padding()
        .background(Color("formBackground").opacity(0.8))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color("blue").opacity(0.3), lineWidth: 1)
        )
    }
}

struct CustomSecureField: View {
    let icon: String
    let placeholder: String
    @Binding var text: String
    @Binding var showPassword: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(Color("blue"))
                .frame(width: 24)
            
            if showPassword {
                TextField(placeholder, text: $text)
                    .autocapitalization(.none)
                    .foregroundColor(Color("textPrimary"))
            } else {
                SecureField(placeholder, text: $text)
                    .foregroundColor(Color("textPrimary"))
            }
            
            Button(action: { showPassword.toggle() }) {
                Image(systemName: showPassword ? "eye.slash.fill" : "eye.fill")
                    .foregroundColor(Color("textSecondary"))
            }
        }
        .padding()
        .background(Color("formBackground").opacity(0.8))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color("blue").opacity(0.3), lineWidth: 1)
        )
    }
}

struct ErrorBanner: View {
    let message: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(Color("red"))
            Text(message)
                .font(.subheadline)
                .foregroundColor(Color("textPrimary"))
            Spacer()
        }
        .padding()
        .background(Color("red").opacity(0.2))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color("red").opacity(0.5), lineWidth: 1)
        )
    }
}
