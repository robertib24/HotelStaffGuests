import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var profile: GuestProfile?
    @State private var name: String = ""
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var successMessage: String?
    @State private var showLogoutAlert = false
    @State private var isEditing = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        ProfileHeader(name: profile?.name ?? "", email: profile?.email ?? "")
                        
                        if isEditing {
                            EditProfileSection(
                                name: $name,
                                newPassword: $newPassword,
                                confirmPassword: $confirmPassword,
                                errorMessage: $errorMessage,
                                successMessage: $successMessage,
                                isLoading: $isLoading,
                                onSave: updateProfile,
                                onCancel: {
                                    isEditing = false
                                    resetFields()
                                }
                            )
                        } else {
                            ProfileInfoSection(
                                name: profile?.name ?? "",
                                email: profile?.email ?? "",
                                onEdit: {
                                    isEditing = true
                                }
                            )
                        }
                        
                        SettingsSection(showLogoutAlert: $showLogoutAlert)
                    }
                    .padding()
                }
            }
            .navigationTitle("Profil")
            .navigationBarTitleDisplayMode(.large)
            .task {
                await loadProfile()
            }
            .alert("Deconectare", isPresented: $showLogoutAlert) {
                Button("Deconectează-te", role: .destructive) {
                    apiService.logout()
                }
                Button("Anulează", role: .cancel) { }
            } message: {
                Text("Ești sigur că vrei să te deconectezi?")
            }
        }
    }
    
    func loadProfile() async {
        isLoading = true
        errorMessage = nil
        successMessage = nil
        do {
            let profile = try await apiService.fetchProfile()
            self.profile = profile
            self.name = profile.name
        } catch {
            errorMessage = "Eroare la încărcarea profilului."
        }
        isLoading = false
    }
    
    func updateProfile() {
        guard !name.isEmpty else {
            errorMessage = "Numele nu poate fi gol."
            return
        }
        
        if !newPassword.isEmpty {
            guard newPassword == confirmPassword else {
                errorMessage = "Parolele nu se potrivesc."
                return
            }
            guard newPassword.count >= 6 else {
                errorMessage = "Parola trebuie să aibă minim 6 caractere."
                return
            }
        }
        
        isLoading = true
        errorMessage = nil
        successMessage = nil
        
        Task {
            do {
                let request = GuestProfileUpdateRequest(
                    name: name,
                    password: newPassword.isEmpty ? nil : newPassword
                )
                let updatedProfile = try await apiService.updateProfile(request)
                self.profile = updatedProfile
                self.name = updatedProfile.name
                self.newPassword = ""
                self.confirmPassword = ""
                self.successMessage = "Profilul a fost actualizat!"
                isEditing = false
            } catch let apiError as ApiError {
                errorMessage = apiError.message
            } catch {
                errorMessage = "Eroare la actualizarea profilului."
            }
            isLoading = false
        }
    }
    
    func resetFields() {
        name = profile?.name ?? ""
        newPassword = ""
        confirmPassword = ""
        errorMessage = nil
        successMessage = nil
    }
}

struct ProfileHeader: View {
    let name: String
    let email: String
    
    var initials: String {
        let parts = name.split(separator: " ")
        if parts.count >= 2 {
            return String(parts[0].prefix(1) + parts[parts.count - 1].prefix(1)).uppercased()
        }
        return String(name.prefix(1)).uppercased()
    }
    
    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .shadow(color: Color("blue").opacity(0.5), radius: 20, x: 0, y: 10)
                
                Text(initials)
                    .font(.system(size: 40, weight: .bold))
                    .foregroundColor(.white)
            }
            
            VStack(spacing: 4) {
                Text(name)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))
                
                Text(email)
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
    }
}

struct ProfileInfoSection: View {
    let name: String
    let email: String
    let onEdit: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Informații Cont")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                
                Spacer()
                
                Button(action: onEdit) {
                    HStack(spacing: 4) {
                        Image(systemName: "pencil")
                        Text("Editează")
                    }
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(Color("blue"))
                }
            }
            
            InfoRow(icon: "person.fill", title: "Nume", value: name)
            InfoRow(icon: "envelope.fill", title: "Email", value: email)
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}

struct InfoRow: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(Color("blue"))
                .frame(width: 32)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.caption)
                    .foregroundColor(Color("textSecondary"))
                Text(value)
                    .font(.body)
                    .foregroundColor(Color("textPrimary"))
            }
            
            Spacer()
        }
        .padding()
        .background(Color("background"))
        .cornerRadius(12)
    }
}

struct EditProfileSection: View {
    @Binding var name: String
    @Binding var newPassword: String
    @Binding var confirmPassword: String
    @Binding var errorMessage: String?
    @Binding var successMessage: String?
    @Binding var isLoading: Bool
    let onSave: () -> Void
    let onCancel: () -> Void
    
    @State private var showPassword = false
    @State private var showConfirmPassword = false
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Editare Profil")
                .font(.headline)
                .foregroundColor(Color("textPrimary"))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            CustomTextField(icon: "person.fill", placeholder: "Nume", text: $name)
            
            Text("Schimbă Parola (opțional)")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 8)
            
            CustomSecureField(
                icon: "lock.fill",
                placeholder: "Parolă nouă",
                text: $newPassword,
                showPassword: $showPassword
            )
            
            CustomSecureField(
                icon: "lock.fill",
                placeholder: "Confirmă parola",
                text: $confirmPassword,
                showPassword: $showConfirmPassword
            )
            
            if let errorMessage = errorMessage {
                ErrorBanner(message: errorMessage)
            }
            
            if let successMessage = successMessage {
                SuccessBanner(message: successMessage)
            }
            
            HStack(spacing: 12) {
                Button(action: onCancel) {
                    Text("Anulează")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color("formBackground"))
                        .foregroundColor(Color("textSecondary"))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color("textSecondary").opacity(0.3), lineWidth: 1)
                        )
                }
                
                Button(action: onSave) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Salvează")
                                .font(.headline)
                            Image(systemName: "checkmark.circle.fill")
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
                    .cornerRadius(12)
                }
                .disabled(isLoading)
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}

struct SuccessBanner: View {
    let message: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(Color("green"))
            Text(message)
                .font(.subheadline)
                .foregroundColor(Color("textPrimary"))
            Spacer()
        }
        .padding()
        .background(Color("green").opacity(0.2))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color("green").opacity(0.5), lineWidth: 1)
        )
    }
}

struct SettingsSection: View {
    @Binding var showLogoutAlert: Bool

    var body: some View {
        VStack(spacing: 12) {
            NavigationLink(destination: NotificationsSettingsView()) {
                HStack(spacing: 12) {
                    Image(systemName: "bell.fill")
                        .font(.title3)
                        .foregroundColor(Color("yellow"))
                        .frame(width: 32)

                    Text("Notificări")
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }

            NavigationLink(destination: PrivacySettingsView()) {
                HStack(spacing: 12) {
                    Image(systemName: "lock.fill")
                        .font(.title3)
                        .foregroundColor(Color("purple"))
                        .frame(width: 32)

                    Text("Confidențialitate")
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }

            NavigationLink(destination: HelpSupportView()) {
                HStack(spacing: 12) {
                    Image(systemName: "questionmark.circle.fill")
                        .font(.title3)
                        .foregroundColor(Color("blue"))
                        .frame(width: 32)

                    Text("Ajutor & Suport")
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))

                    Spacer()

                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }

            Button(action: { showLogoutAlert = true }) {
                HStack(spacing: 12) {
                    Image(systemName: "rectangle.portrait.and.arrow.right")
                        .font(.title3)
                        .foregroundColor(Color("red"))
                        .frame(width: 32)

                    Text("Deconectare")
                        .font(.body)
                        .fontWeight(.semibold)
                        .foregroundColor(Color("red"))

                    Spacer()
                }
                .padding()
                .background(Color("red").opacity(0.1))
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color("red").opacity(0.3), lineWidth: 1)
                )
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}

struct SettingRow: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(color)
                    .frame(width: 32)
                
                Text(title)
                    .font(.body)
                    .foregroundColor(Color("textPrimary"))
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(Color("textSecondary"))
            }
            .padding()
            .background(Color("background"))
            .cornerRadius(12)
        }
    }
}
