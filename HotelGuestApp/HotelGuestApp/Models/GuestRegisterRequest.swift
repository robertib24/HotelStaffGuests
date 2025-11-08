import Foundation

struct GuestRegisterRequest: Codable {
    let name: String
    let email: String
    let password: String
}
