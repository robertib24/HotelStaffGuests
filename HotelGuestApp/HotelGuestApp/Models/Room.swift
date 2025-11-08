import Foundation

struct Room: Codable, Identifiable, Hashable {
    let id: Int
    let number: String
    let type: String
    let price: Double
    let status: String
}
