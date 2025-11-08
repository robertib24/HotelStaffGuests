import Foundation

struct ClientReservationRequest: Codable {
    let roomId: Int
    let startDate: String
    let endDate: String
}
