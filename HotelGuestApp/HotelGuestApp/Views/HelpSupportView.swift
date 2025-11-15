import SwiftUI

struct HelpSupportView: View {
    @Environment(\.dismiss) var dismiss
    @State private var expandedFAQ: Int? = nil
    @State private var showReportIssue = false
    @State private var issueDescription = ""

    var body: some View {
        ZStack {
            Color("background")
                .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 24) {
                    headerSection

                    quickActionsSection
                    faqSection
                    contactSection
                    appInfoSection
                }
                .padding()
            }
        }
        .navigationTitle("Ajutor & Suport")
        .navigationBarTitleDisplayMode(.large)
        .sheet(isPresented: $showReportIssue) {
            reportIssueSheet
        }
    }

    private var headerSection: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("green").opacity(0.3), Color("blue").opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "questionmark.circle.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("green"), Color("blue")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            Text("Cum Te Putem Ajuta?")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(Color("textPrimary"))

            Text("Găsește răspunsuri sau contactează echipa noastră")
                .font(.subheadline)
                .foregroundColor(Color("textSecondary"))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .background(Color("formBackground"))
        .cornerRadius(20)
    }

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Acțiuni Rapide")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            HStack(spacing: 12) {
                QuickActionCard(
                    icon: "phone.fill",
                    title: "Apelează",
                    color: Color("green"),
                    action: {
                        if let url = URL(string: "tel:+40123456789") {
                            UIApplication.shared.open(url)
                        }
                    }
                )

                QuickActionCard(
                    icon: "envelope.fill",
                    title: "Email",
                    color: Color("blue"),
                    action: {
                        if let url = URL(string: "mailto:support@hotel.com") {
                            UIApplication.shared.open(url)
                        }
                    }
                )

                QuickActionCard(
                    icon: "message.fill",
                    title: "Chat",
                    color: Color("purple"),
                    action: {
                        // Open chat
                    }
                )
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var faqSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Întrebări Frecvente")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            FAQItem(
                question: "Cum pot face o rezervare?",
                answer: "Accesează secțiunea 'Camere' din meniul principal, alege camera dorită și completează formularul de rezervare cu datele tale.",
                isExpanded: expandedFAQ == 0,
                onTap: { expandedFAQ = expandedFAQ == 0 ? nil : 0 }
            )

            FAQItem(
                question: "Cum pot anula o rezervare?",
                answer: "Mergi la 'Rezervările Mele', selectează rezervarea pe care dorești să o anulezi și apasă butonul 'Anulează Rezervarea'. Vei primi un email de confirmare.",
                isExpanded: expandedFAQ == 1,
                onTap: { expandedFAQ = expandedFAQ == 1 ? nil : 1 }
            )

            FAQItem(
                question: "Cum comand room service?",
                answer: "Folosește funcția 'Room Service' din meniul principal. Selectează produsele dorite, adaugă eventuale note și trimite comanda. Vei fi notificat când comanda este în pregătire.",
                isExpanded: expandedFAQ == 2,
                onTap: { expandedFAQ = expandedFAQ == 2 ? nil : 2 }
            )

            FAQItem(
                question: "Cum solicit curățenie?",
                answer: "Accesează secțiunea 'Curățenie' și creează o cerere nouă. Poți specifica tipul serviciului necesar și prioritatea. Vei primi notificări când cererea este procesată.",
                isExpanded: expandedFAQ == 3,
                onTap: { expandedFAQ = expandedFAQ == 3 ? nil : 3 }
            )

            FAQItem(
                question: "Cum îmi schimb parola?",
                answer: "Mergi la secțiunea 'Profil', apasă pe 'Resetează Parola' și urmează instrucțiunile. Vei primi un email cu link-ul de resetare.",
                isExpanded: expandedFAQ == 4,
                onTap: { expandedFAQ = expandedFAQ == 4 ? nil : 4 }
            )
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var contactSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Contactează-ne")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            ContactRow(
                icon: "phone.fill",
                title: "Telefon",
                value: "+40 123 456 789",
                color: Color("green")
            )

            ContactRow(
                icon: "envelope.fill",
                title: "Email",
                value: "support@hotel.com",
                color: Color("blue")
            )

            ContactRow(
                icon: "clock.fill",
                title: "Program",
                value: "Luni - Duminică, 00:00 - 24:00",
                color: Color("orange")
            )

            Button(action: {
                showReportIssue = true
            }) {
                HStack {
                    Image(systemName: "exclamationmark.bubble.fill")
                        .foregroundColor(.white)
                    Text("Raportează o Problemă")
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
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
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color("formBackground"))
        .cornerRadius(16)
    }

    private var appInfoSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Informații Aplicație")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))
                Spacer()
            }

            HStack {
                Text("Versiune")
                    .foregroundColor(Color("textSecondary"))
                Spacer()
                Text("1.0.0")
                    .foregroundColor(Color("textPrimary"))
                    .fontWeight(.medium)
            }
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            HStack {
                Text("Build")
                    .foregroundColor(Color("textSecondary"))
                Spacer()
                Text("2024.01.15")
                    .foregroundColor(Color("textPrimary"))
                    .fontWeight(.medium)
            }
            .padding()
            .background(Color("background"))
            .cornerRadius(12)

            Button(action: {
                // Check for updates
            }) {
                HStack {
                    Image(systemName: "arrow.clockwise")
                        .foregroundColor(Color("blue"))
                    Text("Verifică Actualizări")
                        .foregroundColor(Color("textPrimary"))
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

    private var reportIssueSheet: some View {
        NavigationStack {
            ZStack {
                Color("background")
                    .ignoresSafeArea()

                VStack(spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Descrie Problema")
                            .font(.headline)
                            .foregroundColor(Color("textPrimary"))

                        TextEditor(text: $issueDescription)
                            .frame(height: 200)
                            .padding(8)
                            .background(Color("formBackground"))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color("textSecondary").opacity(0.2), lineWidth: 1)
                            )
                    }

                    Button(action: {
                        // Submit issue
                        showReportIssue = false
                        issueDescription = ""
                    }) {
                        HStack {
                            Image(systemName: "paperplane.fill")
                                .foregroundColor(.white)
                            Text("Trimite Raport")
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
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
                        .cornerRadius(12)
                    }
                    .disabled(issueDescription.isEmpty)
                    .opacity(issueDescription.isEmpty ? 0.5 : 1.0)

                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Raportează Problemă")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Anulează") {
                        showReportIssue = false
                        issueDescription = ""
                    }
                }
            }
        }
    }
}

struct QuickActionCard: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.2))
                        .frame(width: 50, height: 50)

                    Image(systemName: icon)
                        .foregroundColor(color)
                        .font(.system(size: 20))
                }

                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(Color("textPrimary"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color("background"))
            .cornerRadius(12)
        }
    }
}

struct FAQItem: View {
    let question: String
    let answer: String
    let isExpanded: Bool
    let onTap: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button(action: onTap) {
                HStack {
                    Text(question)
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(Color("textPrimary"))
                        .multilineTextAlignment(.leading)

                    Spacer()

                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .foregroundColor(Color("blue"))
                        .font(.system(size: 14))
                }
            }

            if isExpanded {
                Text(answer)
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
                    .multilineTextAlignment(.leading)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .padding()
        .background(Color("background"))
        .cornerRadius(12)
        .animation(.spring(), value: isExpanded)
    }
}

struct ContactRow: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
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
