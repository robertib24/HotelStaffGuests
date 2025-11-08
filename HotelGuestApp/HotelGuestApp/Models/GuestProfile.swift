import Foundation

struct GuestProfile: Codable, Identifiable {
    let id: Int
    let name: String
    let email: String
}
