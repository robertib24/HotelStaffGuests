import SwiftUI

struct ChatView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var messages: [ChatMessageModel] = []
    @State private var newMessage: String = ""
    @State private var isLoading: Bool = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                messageList
                messageInput
            }
            .navigationTitle("Asistent Virtual")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    private var messageList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 12) {
                    if messages.isEmpty {
                        VStack(spacing: 16) {
                            Image(systemName: "bubble.left.and.bubble.right")
                                .font(.system(size: 64))
                                .foregroundColor(.blue.opacity(0.3))
                            Text("Bună! Cum te pot ajuta?")
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)

                            VStack(alignment: .leading, spacing: 8) {
                                suggestionButton(text: "Vreau să comand ceva", icon: "cart")
                                suggestionButton(text: "Am nevoie de curățenie", icon: "sparkles")
                                suggestionButton(text: "Recomandări locale", icon: "map")
                            }
                        }
                        .padding()
                    }

                    ForEach(messages) { message in
                        MessageBubble(message: message)
                            .id(message.id)
                    }
                }
                .padding()
                .onChange(of: messages.count) { _ in
                    if let lastMessage = messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }
        }
    }

    private func suggestionButton(text: String, icon: String) -> some View {
        Button(action: {
            newMessage = text
            sendMessage()
        }) {
            HStack {
                Image(systemName: icon)
                Text(text)
                    .font(.subheadline)
                Spacer()
            }
            .padding(12)
            .background(Color.blue.opacity(0.1))
            .foregroundColor(.blue)
            .cornerRadius(12)
        }
    }

    private var messageInput: some View {
        HStack(spacing: 12) {
            TextField("Scrie un mesaj...", text: $newMessage)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .disabled(isLoading)

            Button(action: sendMessage) {
                if isLoading {
                    ProgressView()
                        .frame(width: 24, height: 24)
                } else {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 32))
                        .foregroundColor(newMessage.isEmpty ? .gray : .blue)
                }
            }
            .disabled(newMessage.isEmpty || isLoading)
        }
        .padding()
        .background(Color(uiColor: .secondarySystemBackground))
    }

    private func sendMessage() {
        guard !newMessage.isEmpty else { return }

        let userMessage = ChatMessageModel(text: newMessage, isUser: true, timestamp: Date())
        messages.append(userMessage)

        let messageToSend = newMessage
        newMessage = ""
        isLoading = true

        Task {
            do {
                let response = try await apiService.sendChatMessage(messageToSend)
                let botMessage = ChatMessageModel(text: response.response, isUser: false, timestamp: Date())

                await MainActor.run {
                    messages.append(botMessage)
                    isLoading = false
                }
            } catch {
                await MainActor.run {
                    errorMessage = "Eroare: \(error.localizedDescription)"
                    isLoading = false
                }
            }
        }
    }
}

struct MessageBubble: View {
    let message: ChatMessageModel

    var body: some View {
        HStack {
            if message.isUser { Spacer() }

            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .padding(12)
                    .background(message.isUser ? Color.blue : Color(uiColor: .secondarySystemBackground))
                    .foregroundColor(message.isUser ? .white : .primary)
                    .cornerRadius(16)
                    .frame(maxWidth: UIScreen.main.bounds.width * 0.7, alignment: message.isUser ? .trailing : .leading)

                Text(message.timestamp, style: .time)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }

            if !message.isUser { Spacer() }
        }
    }
}
