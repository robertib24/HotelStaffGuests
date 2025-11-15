# Hotel Management System - Diagrame UML

Acest director conține diagramele UML pentru sistemul de management hotelier.

## Diagrame Disponibile

### 1. Use Case Diagram (Diagrama Cazurilor de Utilizare)
**Fișier:** `use-case-diagram.puml`

Această diagramă prezintă toate cazurile de utilizare ale sistemului pentru fiecare tip de utilizator:

**Actori:**
- **Guest (iOS App)** - Clienții hotelului care folosesc aplicația mobilă
- **Admin** - Administrator cu drepturi complete
- **Manager** - Manager cu acces la majoritatea funcțiilor
- **Receptionist** - Recepționer cu acces la rezervări și statusul camerelor
- **Chef** - Chef cu acces la comenzile de room service
- **Cleaner** - Personal de curățenie cu acces la solicitări de curățenie

**Funcționalități principale:**
- Gestionare rezervări
- Room service și housekeeping
- Sistem de recenzii cu răspunsuri
- Notificări email și WebSocket
- Dashboard-uri personalizate pe rol

### 2. Sequence Diagram - Room Service Request
**Fișier:** `sequence-diagram-room-service.puml`

Această diagramă secvențială prezintă fluxul complet pentru o comandă de room service:

**Etape:**
1. Guest creează comandă din iOS app
2. Backend salvează în baza de date
3. Trimitere notificări (Email + WebSocket)
4. Chef primește notificarea în timp real
5. Chef procesează comanda (IN_PROGRESS)
6. Guest primește email de status update
7. Chef finalizează comanda (COMPLETED)
8. Guest primește confirmare finală

## Cum să Vizualizezi Diagramele

### Opțiunea 1: Visual Studio Code (Recomandat)
1. Instalează extensia **PlantUML** de la jebbs
2. Deschide fișierul `.puml`
3. Apasă `Alt + D` pentru preview

### Opțiunea 2: IntelliJ IDEA
1. Instalează plugin-ul **PlantUML integration**
2. Deschide fișierul `.puml`
3. Click dreapta → "Show PlantUML Diagram"

### Opțiunea 3: Online (PlantUML Server)
1. Vizitează [http://www.plantuml.com/plantuml/uml/](http://www.plantuml.com/plantuml/uml/)
2. Copiază conținutul fișierului `.puml`
3. Lipește în editor și vezi diagrama

### Opțiunea 4: Export ca imagine
```bash
# Instalează PlantUML
brew install plantuml  # macOS
# sau
apt-get install plantuml  # Linux

# Generează PNG
plantuml use-case-diagram.puml
plantuml sequence-diagram-room-service.puml
```

## Tehnologii Ilustrate în Diagrame

### Backend (Spring Boot)
- REST API endpoints
- JWT Authentication
- WebSocket/STOMP pentru notificări real-time
- Async email notifications cu `@Async`
- JPA/Hibernate pentru persistență

### Frontend (React)
- Material-UI components
- WebSocket client (SockJS + STOMP)
- Toast notifications
- Role-based routing

### Mobile (iOS/SwiftUI)
- REST API integration
- Async/await pentru networking
- State management
- NavigationStack

### Database (PostgreSQL)
- Relații între entități
- Status management
- Transaction handling
- ACID compliance

## Legendă

**PlantUML Notații folosite:**

- `-->` : Asociere simplă
- `..>` : Dependență (include/extend)
- `--|>` : Generalizare (moștenire)
- `<<include>>` : Relație de include
- `<<extend>>` : Relație de extend
- `activate/deactivate` : Activare obiect în diagramă secvențială
- `autonumber` : Numerotare automată a mesajelor

## Actualizări

**Ultima actualizare:** 2025-01-15

Diagramele reflectă starea actuală a sistemului, incluzând:
- ✅ Sistem de notificări WebSocket
- ✅ Email notifications pentru toate acțiunile
- ✅ Review response system
- ✅ Dashboard personalizat pentru Chef
- ✅ Role-based access control

## Contact

Pentru întrebări despre diagrame sau arhitectura sistemului, contactați echipa de dezvoltare.
