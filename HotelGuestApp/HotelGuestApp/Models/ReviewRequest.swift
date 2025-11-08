import Foundation

struct ReviewRequest: Codable {
    let roomId: Int
    let rating: Int
    let comment: String
}
