import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var apiService: ApiService
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            RoomListView()
                .tabItem {
                    Label("Camere", systemImage: selectedTab == 0 ? "bed.double.fill" : "bed.double")
                }
                .tag(0)
            
            MyReservationsView()
                .tabItem {
                    Label("Rezervări", systemImage: selectedTab == 1 ? "list.bullet.clipboard.fill" : "list.bullet.clipboard")
                }
                .tag(1)
            
            ProfileView()
                .tabItem {
                    Label("Profil", systemImage: selectedTab == 2 ? "person.crop.circle.fill" : "person.crop.circle")
                }
                .tag(2)
        }
        .tint(Color("blue"))
    }
}
