import SwiftUI

struct PrivacySettingsView: View {
    @Environment(\.dismiss) var dismiss
    @State private var dataCollectionEnabled = true
    @State private var analyticsEnabled = false
    @State private var locationTrackingEnabled = true
    @State private var personalizedAdsEnabled = false
    @State private var shareWithPartnersEnabled = false
    @State private var showDeleteAccountAlert = false

    var body: some View {
        ZStack {
            Color("background")
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    headerSection

                    dataPrivacySection
                    accountPrivacySection
                    legalSection
                    dangerZoneSection
                }
                .padding()
            }
        }
        .navigationTitle("Confidențialitate")
        .navigationBarTitleDisplayMode(.large)
        .alert("Șterge Contul", isPresented: $showDeleteAccountAlert) {
            Button("Anulează", role: .cancel) { }
            Button("Șterge", role: .destructive) {
                // Handle account deletion
            }
        } message: {
            Text("Ești sigur că vrei să ștergi contul? Această acțiune este permanentă și nu poate fi anulată.")
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

                Image(systemName: "lock.shield.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("blue"), Color("purple")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            Text("Securitate & Confidențialitate")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))

            Text("Controlează cum sunt folosite datele tale")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
    }

    private var dataPrivacySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Colectare Date")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Toggle(isOn: $dataCollectionEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "chart.bar.fill")
                        .foregroundColor(Color("blue"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Date de Utilizare")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Ajută-ne să îmbunătățim aplicația")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("blue"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            Toggle(isOn: $analyticsEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "chart.pie.fill")
                        .foregroundColor(Color("purple"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Analytics")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Colectează date anonime despre utilizare")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("purple"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            Toggle(isOn: $locationTrackingEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "location.fill")
                        .foregroundColor(Color("green"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Locație")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Pentru servicii bazate pe locație")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("green"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var accountPrivacySection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Cont & Marketing")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Toggle(isOn: $personalizedAdsEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "sparkles")
                        .foregroundColor(Color("orange"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Reclame Personalizate")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Afișează oferte relevante pentru tine")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("orange"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            Toggle(isOn: $shareWithPartnersEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "person.2.fill")
                        .foregroundColor(Color("blue"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Partajare cu Parteneri")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Date partajate cu servicii terțe")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("blue"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var legalSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Documente Legale")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Button(action: {
                // Open Terms of Service
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "doc.text.fill")
                        .foregroundColor(Color("blue"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Termeni și Condiții")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Citește termenii de utilizare")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .foregroundColor(Color("textSecondary"))
                        .font(.system(size: 14))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }

            Button(action: {
                // Open Privacy Policy
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "hand.raised.fill")
                        .foregroundColor(Color("green"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Politica de Confidențialitate")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Cum sunt procesate datele tale")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .foregroundColor(Color("textSecondary"))
                        .font(.system(size: 14))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }

            Button(action: {
                // Request data export
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "arrow.down.doc.fill")
                        .foregroundColor(Color("purple"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Descarcă Datele Tale")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Exportă toate datele personale")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }

                    Spacer()

                    Image(systemName: "chevron.right")
                        .foregroundColor(Color("textSecondary"))
                        .font(.system(size: 14))
                }
                .padding()
                .background(Color("background"))
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var dangerZoneSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Zona Periculoasă")
                    .font(.headline)
                    .foregroundColor(Color("red"))
                Spacer()
            }

            Button(action: {
                showDeleteAccountAlert = true
            }) {
                HStack(spacing: 12) {
                    Image(systemName: "trash.fill")
                        .foregroundColor(Color("red"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Șterge Contul")
                            .font(.body)
                            .foregroundColor(Color("red"))
                        Text("Acțiune permanentă și ireversibilă")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }

                    Spacer()

                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(Color("red"))
                        .font(.system(size: 14))
                }
                .padding()
                .background(Color("background"))
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
