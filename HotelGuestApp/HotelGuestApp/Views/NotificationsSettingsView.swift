import SwiftUI

struct NotificationsSettingsView: View {
    @Environment(\.dismiss) var dismiss
    @State private var pushNotificationsEnabled = true
    @State private var emailNotificationsEnabled = true
    @State private var reservationUpdates = true
    @State private var roomServiceUpdates = true
    @State private var housekeepingUpdates = true
    @State private var promotionsEnabled = false
    @State private var soundEnabled = true
    @State private var badgeEnabled = true

    var body: some View {
        ZStack {
            Color("background")
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    headerSection

                    pushNotificationsSection
                    emailSection
                    notificationTypesSection
                    notificationSettingsSection
                }
                .padding()
            }
        }
        .navigationTitle("Notificări")
        .navigationBarTitleDisplayMode(.large)
    }

    private var headerSection: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("yellow").opacity(0.3), Color("orange").opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "bell.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("yellow"), Color("orange")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            Text("Gestionează Notificările")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))

            Text("Personalizează modul în care primești actualizări")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
    }

    private var pushNotificationsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Notificări Push")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Toggle(isOn: $pushNotificationsEnabled.animation(.spring())) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Activează Notificări Push")
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))
                    Text("Primește notificări instant pe dispozitiv")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
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

    private var emailSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Notificări Email")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Toggle(isOn: $emailNotificationsEnabled.animation(.spring())) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Activează Email-uri")
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))
                    Text("Primește actualizări pe email")
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
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

    private var notificationTypesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Tipuri de Notificări")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            NotificationToggleRow(
                isOn: $reservationUpdates,
                icon: "calendar.badge.clock",
                title: "Actualizări Rezervări",
                subtitle: "Check-in, check-out, modificări",
                color: Color("blue")
            )

            NotificationToggleRow(
                isOn: $roomServiceUpdates,
                icon: "fork.knife",
                title: "Room Service",
                subtitle: "Status comenzi, livrări",
                color: Color("purple")
            )

            NotificationToggleRow(
                isOn: $housekeepingUpdates,
                icon: "sparkles",
                title: "Curățenie",
                subtitle: "Status cereri housekeeping",
                color: Color("green")
            )

            NotificationToggleRow(
                isOn: $promotionsEnabled,
                icon: "tag.fill",
                title: "Oferte & Promoții",
                subtitle: "Reduceri, pachete speciale",
                color: Color("orange")
            )
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var notificationSettingsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Setări Notificări")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            Toggle(isOn: $soundEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "speaker.wave.2.fill")
                        .foregroundColor(Color("blue"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Sunet")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Redă sunet pentru notificări")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("blue"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            Toggle(isOn: $badgeEnabled.animation(.spring())) {
                HStack(spacing: 12) {
                    Image(systemName: "app.badge")
                        .foregroundColor(Color("red"))
                        .frame(width: 32)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Badge Icon")
                            .font(.body)
                            .foregroundColor(Color("textPrimary"))
                        Text("Afișează numărul de notificări")
                            .font(.caption)
                            .foregroundColor(Color("textSecondary"))
                    }
                }
            }
            .tint(Color("red"))
            .padding()
            .background(Color("background"))
            .cornerRadius(12)
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }
}

struct NotificationToggleRow: View {
    @Binding var isOn: Bool
    let icon: String
    let title: String
    let subtitle: String
    let color: Color

    var body: some View {
        Toggle(isOn: $isOn.animation(.spring())) {
            HStack(spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color.opacity(0.2))
                        .frame(width: 40, height: 40)

                    Image(systemName: icon)
                        .foregroundColor(color)
                        .font(.system(size: 18))
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.body)
                        .foregroundColor(Color("textPrimary"))
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(Color("textSecondary"))
                }
            }
        }
        .tint(color)
        .padding()
        .background(Color("background"))
        .cornerRadius(12)
    }
}
