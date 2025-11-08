import Foundation

struct Review: Codable, Identifiable, Hashable {
    let id: Int
    let guestName: String
    let rating: Int
    let comment: String
    let createdAt: String
}
