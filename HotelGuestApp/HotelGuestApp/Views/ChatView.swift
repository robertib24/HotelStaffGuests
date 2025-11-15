import SwiftUI

struct ChatView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var messages: [ChatMessageModel] = []
    @State private var newMessage: String = ""
    @State private var isLoading: Bool = false
    @State private var errorMessage: String?
    @State private var showSuggestions: Bool = true

    var body: some View {
        NavigationView {
            ZStack {
                Color("background")
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    if let error = errorMessage {
                        errorBanner
                    }

                    messageList
                    messageInput
                }
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    chatHeader
                }
            }
        }
    }

    private var chatHeader: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("purple").opacity(0.3), Color("blue").opacity(0.3)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 40, height: 40)

                Image(systemName: "sparkles")
                    .font(.system(size: 18))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("purple"), Color("blue")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            VStack(alignment: .leading, spacing: 2) {
                Text("Asistent Virtual")
                    .font(.headline)
                    .foregroundColor(Color("textPrimary"))

                HStack(spacing: 4) {
                    Circle()
                        .fill(Color("green"))
                        .frame(width: 6, height: 6)
                    Text("Online")
                        .font(.caption2)
                        .foregroundColor(Color("textSecondary"))
                }
            }
        }
    }

    private var errorBanner: some View {
        HStack(spacing: 8) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(Color("red"))
                .font(.caption)

            Text(errorMessage ?? "")
                .font(.caption)
                .foregroundColor(Color("red"))

            Spacer()

            Button("OK") {
                withAnimation {
                    errorMessage = nil
                }
            }
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundColor(Color("red"))
        }
        .padding(12)
        .background(Color("red").opacity(0.1))
        .cornerRadius(12)
        .padding(.horizontal)
        .padding(.top, 8)
        .transition(.move(edge: .top).combined(with: .opacity))
    }

    private var messageList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 16) {
                    if messages.isEmpty {
                        emptyStateView
                    }

                    ForEach(messages) { message in
                        MessageBubble(message: message)
                            .id(message.id)
                    }

                    if isLoading {
                        typingIndicator
                    }
                }
                .padding()
                .onChange(of: messages.count) { _ in
                    if let lastMessage = messages.last {
                        withAnimation(.spring()) {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }
        }
    }

    private var emptyStateView: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color("purple").opacity(0.2), Color("blue").opacity(0.2)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 100, height: 100)
                    .blur(radius: 20)

                Image(systemName: "bubble.left.and.bubble.right.fill")
                    .font(.system(size: 50))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color("purple"), Color("blue")],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
            }

            VStack(spacing: 8) {
                Text("Bună! Cum te pot ajuta?")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(Color("textPrimary"))

                Text("Întreabă-mă orice despre hotel")
                    .font(.subheadline)
                    .foregroundColor(Color("textSecondary"))
            }

            if showSuggestions {
                VStack(spacing: 12) {
                    suggestionButton(text: "Vreau să comand ceva", icon: "cart.fill")
                    suggestionButton(text: "Am nevoie de curățenie", icon: "sparkles")
                    suggestionButton(text: "Recomandări locale", icon: "map.fill")
                }
                .padding(.top, 8)
            }
        }
        .padding(.vertical, 40)
    }

    private func suggestionButton(text: String, icon: String) -> some View {
        Button(action: {
            newMessage = text
            sendMessage()
            withAnimation {
                showSuggestions = false
            }
        }) {
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color("blue").opacity(0.1))
                        .frame(width: 36, height: 36)

                    Image(systemName: icon)
                        .font(.system(size: 14))
                        .foregroundColor(Color("blue"))
                }

                Text(text)
                    .font(.subheadline)
                    .foregroundColor(Color("textPrimary"))

                Spacer()

                Image(systemName: "arrow.right")
                    .font(.caption)
                    .foregroundColor(Color("textSecondary"))
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color("formBackground"))
                    .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
            )
        }
    }

    private var typingIndicator: some View {
        HStack {
            HStack(spacing: 6) {
                ForEach(0..<3) { index in
                    Circle()
                        .fill(Color("textSecondary"))
                        .frame(width: 8, height: 8)
                        .opacity(0.6)
                        .scaleEffect(animatingDot(index: index) ? 1.2 : 0.8)
                        .animation(
                            Animation.easeInOut(duration: 0.6)
                                .repeatForever()
                                .delay(Double(index) * 0.2),
                            value: isLoading
                        )
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(Color("formBackground"))
            )

            Spacer()
        }
    }

    private func animatingDot(index: Int) -> Bool {
        return isLoading
    }

    private var messageInput: some View {
        VStack(spacing: 0) {
            Divider()
                .background(Color("textSecondary").opacity(0.2))

            HStack(spacing: 12) {
                HStack(spacing: 12) {
                    TextField("Scrie un mesaj...", text: $newMessage)
                        .foregroundColor(Color("textPrimary"))
                        .disabled(isLoading)
                }
                .padding(12)
                .background(Color("formBackground"))
                .cornerRadius(20)

                Button(action: sendMessage) {
                    if isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .frame(width: 44, height: 44)
                            .background(
                                Circle()
                                    .fill(
                                        LinearGradient(
                                            colors: [Color("blue").opacity(0.5), Color("purple").opacity(0.5)],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                            )
                    } else {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: newMessage.isEmpty ? [Color("textSecondary").opacity(0.3), Color("textSecondary").opacity(0.3)] : [Color("blue"), Color("purple")],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 44, height: 44)

                            Image(systemName: "arrow.up")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .shadow(color: newMessage.isEmpty ? .clear : Color("blue").opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                }
                .disabled(newMessage.isEmpty || isLoading)
                .animation(.spring(), value: newMessage.isEmpty)
            }
            .padding()
            .background(Color("background"))
        }
    }

    private func sendMessage() {
        guard !newMessage.isEmpty else { return }

        let userMessage = ChatMessageModel(text: newMessage, isUser: true, timestamp: Date())

        withAnimation(.spring()) {
            messages.append(userMessage)
        }

        let messageToSend = newMessage
        newMessage = ""
        isLoading = true

        print("📤 Sending message: \(messageToSend)")

        Task {
            do {
                print("🔄 Calling API...")
                let response = try await apiService.sendChatMessage(messageToSend)
                print("✅ Received response: \(response.response)")
                print("🎬 Action: \(response.action ?? "none")")

                let botMessage = ChatMessageModel(text: response.response, isUser: false, timestamp: Date())

                await MainActor.run {
                    withAnimation(.spring()) {
                        messages.append(botMessage)
                        isLoading = false
                    }
                    print("✅ Message added to UI")
                }
            } catch {
                print("❌ Error: \(error)")
                await MainActor.run {
                    let errorMsg = "Eroare: \(error.localizedDescription)"
                    errorMessage = errorMsg
                    let errorBubble = ChatMessageModel(text: errorMsg, isUser: false, timestamp: Date())
                    withAnimation(.spring()) {
                        messages.append(errorBubble)
                        isLoading = false
                    }
                }
            }
        }
    }
}

struct MessageBubble: View {
    let message: ChatMessageModel
    @State private var appeared = false

    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if message.isUser { Spacer(minLength: 40) }

            if !message.isUser {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color("purple").opacity(0.2), Color("blue").opacity(0.2)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 32, height: 32)

                    Image(systemName: "sparkles")
                        .font(.system(size: 14))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color("purple"), Color("blue")],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
            }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 6) {
                Text(message.text)
                    .font(.body)
                    .padding(14)
                    .background(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .fill(
                                message.isUser ?
                                LinearGradient(colors: [Color("blue"), Color("purple")], startPoint: .topLeading, endPoint: .bottomTrailing) :
                                LinearGradient(colors: [Color("formBackground"), Color("formBackground")], startPoint: .topLeading, endPoint: .bottomTrailing)
                            )
                            .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
                    )
                    .foregroundColor(message.isUser ? .white : Color("textPrimary"))
                    .frame(maxWidth: UIScreen.main.bounds.width * 0.75, alignment: message.isUser ? .trailing : .leading)

                Text(message.timestamp, style: .time)
                    .font(.caption2)
                    .foregroundColor(Color("textSecondary"))
                    .padding(.horizontal, 4)
            }

            if !message.isUser { Spacer(minLength: 40) }
        }
        .opacity(appeared ? 1 : 0)
        .offset(y: appeared ? 0 : 20)
        .onAppear {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                appeared = true
            }
        }
    }
}
