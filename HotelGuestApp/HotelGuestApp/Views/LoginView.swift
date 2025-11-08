import SwiftUI

struct LoginView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage: String?
    @State private var isRegistering = false
    @State private var animateIcon = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                
                Image(systemName: "building.2.crop.circle.fill")
                    .font(.system(size: 100))
                    .foregroundColor(.theme.blue)
                    .shadow(color: .theme.blue.opacity(0.5), radius: 10)
                    .scaleEffect(animateIcon ? 1 : 0)
                    .rotationEffect(.degrees(animateIcon ? 0 : -180))
                    .opacity(animateIcon ? 1 : 0)
                
                Text("Bine ai venit!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.theme.textPrimary)
                    .opacity(animateIcon ? 1 : 0)
                    .animation(.easeOut(duration: 0.5).delay(0.1), value: animateIcon)

                TextField("Email", text: $email)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .padding()
                    .background(Color.theme.formBackground)
                    .cornerRadius(10)
                    .foregroundColor(.theme.textPrimary)
                    .opacity(animateIcon ? 1 : 0)
                    .animation(.easeOut(duration: 0.5).delay(0.2), value: animateIcon)

                SecureField("Parolă", text: $password)
                    .padding()
                    .background(Color.theme.formBackground)
                    .cornerRadius(10)
                    .foregroundColor(.theme.textPrimary)
                    .opacity(animateIcon ? 1 : 0)
                    .animation(.easeOut(duration: 0.5).delay(0.3), value: animateIcon)

                if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.theme.red)
                        .font(.caption)
                }
                
                Button(action: login) {
                    Text("Autentificare")
                }
                .buttonStyle(PrimaryButtonStyle())
                .opacity(animateIcon ? 1 : 0)
                .animation(.easeOut(duration: 0.5).delay(0.4), value: animateIcon)

                Button {
                    isRegistering = true
                } label: {
                    Text("Nu ai cont? Înregistrează-te")
                        .foregroundColor(.theme.textSecondary)
                }
                .opacity(animateIcon ? 1 : 0)
                .animation(.easeOut(duration: 0.5).delay(0.5), value: animateIcon)
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.theme.background.ignoresSafeArea())
            .navigationDestination(isPresented: $isRegistering) {
                RegisterView()
            }
            .onAppear {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                    animateIcon = true
                }
            }
        }
    }
    
    func login() {
        errorMessage = nil
        Task {
            do {
                let request = AuthRequest(email: email, password: password)
                try await apiService.login(credentials: request)
            } catch {
                errorMessage = "Email sau parolă incorectă."
            }
        }
    }
}
