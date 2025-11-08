import Foundation

struct Reservation: Codable, Identifiable, Hashable {
    let id: Int
    let reservationCode: String
    let guestId: Int
    let guestName: String
    let roomId: Int
    let roomNumber: String
    let roomType: String
    let startDate: String
    let endDate: String
    let totalPrice: Double
}
