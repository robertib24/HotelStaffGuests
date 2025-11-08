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
    
    var body: some View {
        NavigationStack {
            Form {
                if isLoading {
                    HStack {
                        Spacer()
                        ProgressView()
                        Spacer()
                    }
                    .listRowBackground(Color.theme.formBackground)
                } else if let profile = profile {
                    Section("Detalii Cont") {
                        HStack {
                            Text("Email")
                            Spacer()
                            Text(profile.email)
                                .foregroundColor(.theme.textSecondary)
                        }
                        TextField("Nume", text: $name)
                    }
                    .listRowBackground(Color.theme.formBackground)
                    
                    Section("Schimbă Parola") {
                        SecureField("Parolă Nouă (lasă gol pt. a păstra)", text: $newPassword)
                        SecureField("Confirmă Parola Nouă", text: $confirmPassword)
                    }
                    .listRowBackground(Color.theme.formBackground)
                    
                    if let errorMessage = errorMessage {
                        Section {
                            Text(errorMessage)
                                .foregroundColor(.theme.red)
                        }
                        .listRowBackground(Color.theme.formBackground)
                    }
                    
                    if let successMessage = successMessage {
                        Section {
                            Text(successMessage)
                                .foregroundColor(.theme.green)
                        }
                        .listRowBackground(Color.theme.formBackground)
                    }
                    
                    Section {
                        Button(action: updateProfile) {
                            Text("Salvează Modificările")
                        }
                        .buttonStyle(PrimaryButtonStyle())
                        .listRowInsets(EdgeInsets())
                    }
                    .listRowBackground(Color.clear)
                    
                    Section {
                        Button(role: .destructive, action: {
                            apiService.logout()
                        }) {
                            Text("Deconectare")
                                .frame(maxWidth: .infinity, alignment: .center)
                        }
                    }
                    .listRowBackground(Color.theme.formBackground)
                }
            }
            .scrollContentBackground(.hidden)
            .background(Color.theme.background.ignoresSafeArea())
            .navigationTitle("Profilul Meu")
            .task {
                await loadProfile()
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
            } catch let apiError as ApiError {
                errorMessage = apiError.message
            } catch {
                errorMessage = "Eroare la actualizarea profilului."
            }
            isLoading = false
        }
    }
}
