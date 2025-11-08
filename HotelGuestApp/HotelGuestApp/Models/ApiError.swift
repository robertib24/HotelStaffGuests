import Foundation

struct ApiError: Codable, Error {
    let status: Int
    let message: String
    let error: String
}
