import Foundation

struct ChatRequest: Codable {
    let message: String
}

struct ChatResponse: Codable {
    let response: String
    let action: String?
    let actionData: ActionData?
}

struct ActionData: Codable {
    let id: Int?
    let request: String?
    let status: String?
}

struct ChatMessageModel: Identifiable {
    let id = UUID()
    let text: String
    let isUser: Bool
    let timestamp: Date
}
