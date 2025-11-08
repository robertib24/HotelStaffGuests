import Foundation
import Combine

class ApiService: ObservableObject {
    
    @Published var isAuthenticated: Bool = false
    private var token: String? {
        didSet {
            DispatchQueue.main.async {
                self.isAuthenticated = self.token != nil
            }
        }
    }
    
    private let baseURL = "http://localhost:8080/api"
    private let tokenStorage = TokenStorageService.shared
    
    private let jsonDecoder: JSONDecoder = {
        let decoder = JSONDecoder()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        decoder.dateDecodingStrategy = .formatted(formatter)
        return decoder
    }()
    
    private let jsonEncoder: JSONEncoder = {
        let encoder = JSONEncoder()
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        encoder.dateEncodingStrategy = .formatted(formatter)
        return encoder
    }()
    
    init() {
        self.token = tokenStorage.loadToken()
        self.isAuthenticated = self.token != nil
    }
    
    func login(credentials: AuthRequest) async throws {
        let response: AuthResponse = try await postRequest(
            endpoint: "/client/auth/login",
            data: credentials,
            authenticated: false
        )
        tokenStorage.saveToken(response.token)
        self.token = response.token
    }
    
    func register(details: GuestRegisterRequest) async throws {
        let response: AuthResponse = try await postRequest(
            endpoint: "/client/auth/register",
            data: details,
            authenticated: false
        )
        tokenStorage.saveToken(response.token)
        self.token = response.token
    }
    
    func logout() {
        tokenStorage.deleteToken()
        self.token = nil
    }
    
    func fetchPublicRooms() async throws -> [Room] {
        return try await getRequest(endpoint: "/rooms", authenticated: false)
    }
    
    func fetchRoomDetails(roomId: Int) async throws -> Room {
        return try await getRequest(endpoint: "/rooms/\(roomId)", authenticated: false)
    }
    
    func fetchPublicReviews(roomId: Int) async throws -> [Review] {
        return try await getRequest(endpoint: "/reviews/room/\(roomId)", authenticated: false)
    }
    
    func fetchMyReservations() async throws -> [Reservation] {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        return try await getRequest(endpoint: "/client/my-reservations", authenticated: true)
    }
    
    func createReservation(_ request: ClientReservationRequest) async throws -> Reservation {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        return try await postRequest(endpoint: "/client/reservations", data: request, authenticated: true)
    }
    
    func createReview(_ request: ReviewRequest) async throws -> Review {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        return try await postRequest(endpoint: "/client/reviews", data: request, authenticated: true)
    }
    
    func cancelReservation(id: Int) async throws {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        try await deleteRequest(endpoint: "/client/my-reservations/\(id)")
    }
    
    func fetchProfile() async throws -> GuestProfile {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        return try await getRequest(endpoint: "/client/profile", authenticated: true)
    }
    
    func updateProfile(_ request: GuestProfileUpdateRequest) async throws -> GuestProfile {
        guard isAuthenticated else { throw URLError(.userAuthenticationRequired) }
        return try await putRequest(endpoint: "/client/profile", data: request)
    }
    
    private func getRequest<T: Decodable>(endpoint: String, authenticated: Bool) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        if authenticated {
            guard let token = self.token else {
                throw URLError(.userAuthenticationRequired)
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            if let apiError = try? jsonDecoder.decode(ApiError.self, from: data) {
                throw apiError
            }
            throw URLError(.badServerResponse)
        }
        
        return try jsonDecoder.decode(T.self, from: data)
    }
    
    private func postRequest<T: Encodable, R: Decodable>(endpoint: String, data: T, authenticated: Bool) async throws -> R {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try jsonEncoder.encode(data)
        
        if authenticated {
            guard let token = self.token else {
                throw URLError(.userAuthenticationRequired)
            }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let (responseData, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            if let apiError = try? jsonDecoder.decode(ApiError.self, from: responseData) {
                throw apiError
            }
            throw URLError(.badServerResponse)
        }
        
        return try jsonDecoder.decode(R.self, from: responseData)
    }
    
    private func putRequest<T: Encodable, R: Decodable>(endpoint: String, data: T) async throws -> R {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try jsonEncoder.encode(data)
        
        guard let token = self.token else {
            throw URLError(.userAuthenticationRequired)
        }
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (responseData, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            if let apiError = try? jsonDecoder.decode(ApiError.self, from: responseData) {
                throw apiError
            }
            throw URLError(.badServerResponse)
        }
        
        return try jsonDecoder.decode(R.self, from: responseData)
    }
    
    private func deleteRequest(endpoint: String) async throws {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        
        guard let token = self.token else {
            throw URLError(.userAuthenticationRequired)
        }
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (responseData, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            if let apiError = try? jsonDecoder.decode(ApiError.self, from: responseData) {
                throw apiError
            }
            throw URLError(.badServerResponse)
        }
    }
}
