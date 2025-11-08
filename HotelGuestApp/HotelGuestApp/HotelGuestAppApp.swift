import SwiftUI

@main
struct HotelGuestApp: App {
    @StateObject private var apiService = ApiService()

    var body: some Scene {
        WindowGroup {
            Group {
                if apiService.isAuthenticated {
                    MainTabView()
                } else {
                    LoginView()
                }
            }
            .environmentObject(apiService)
            .preferredColorScheme(.dark)
            .accentColor(.theme.blue)
        }
    }
}
