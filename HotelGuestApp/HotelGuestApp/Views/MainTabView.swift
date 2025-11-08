import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var apiService: ApiService

    var body: some View {
        TabView {
            RoomListView()
                .tabItem {
                    Label("Camere", systemImage: "bed.double.fill")
                }
            
            MyReservationsView()
                .tabItem {
                    Label("Rezervările Mele", systemImage: "list.bullet.rectangle.fill")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: "person.crop.circle.fill")
                }
        }
        .tint(.theme.blue)
    }
}
