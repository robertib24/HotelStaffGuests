import Foundation

struct GuestProfileUpdateRequest: Codable {
    let name: String
    let password: String?
}
