Prompt Plan für die Abonnement-Webanwendung

Dieser Plan enthält eine Reihe von Prompts, die verwendet werden können, um eine React-Anwendung für Abonnements zu entwickeln. Jeder Prompt ist darauf ausgelegt, einen spezifischen Teil der Anwendung zu generieren.
Prompt 1: Initiales React App-Setup und Tailwind CSS

Ziel: Erstellung der grundlegenden React-Anwendungsstruktur mit Tailwind CSS-Integration und einem Hauptcontainer.

Erstelle eine grundlegende React-Anwendung in einer einzelnen `App.js`-Datei.
Die Anwendung sollte eine funktionale Komponente namens `App` enthalten.
Inkludiere das Tailwind CSS CDN in den HTML-Head, um Tailwind-Klassen nutzen zu können.
Verwende die Schriftart "Inter".
Füge einen Haupt-Div-Container hinzu, der den gesamten Inhalt der Anwendung umschließt.
Dieser Container sollte zentriert sein, einen maximalen Breitenbereich haben (z.B. `max-w-7xl mx-auto`),
und grundlegende vertikale Polsterung (`py-12`).
Füge eine Überschrift `h1` hinzu, die "Unsere Abonnementpläne" anzeigt, zentriert und mit einer ansprechenden Schriftgröße und -stärke.
Sorge für ein responsives Design.

Prompt 2: Definition der Abonnementplandaten

Ziel: Definition der Mock-Datenstruktur für die Abonnementpläne.

Definiere ein JavaScript-Array von Objekten, das die Mock-Daten für die Abonnementpläne enthält.
Dieses Array sollte außerhalb der `App`-Komponente definiert werden, um es leicht zugänglich zu machen.
Jedes Objekt im Array sollte die folgenden Eigenschaften haben:
- `id`: Ein eindeutiger String-Bezeichner (z.B. 'basic', 'standard', 'premium').
- `name`: Der Name des Plans (z.B. 'Basic Plan').
- `monthlyPrice`: Der monatliche Preis als Zahl (z.B. 9.99).
- `yearlyPrice`: Der jährliche Preis als Zahl (z.B. 99.99).
- `yearlyDiscountPercentage`: Ein optionaler numerischer Wert, der den Rabatt in Prozent für die jährliche Zahlung angibt (z.B. 16).
- `features`: Ein Array von Strings, das die Hauptmerkmale oder Vorteile des Plans auflistet.

Erstelle mindestens drei Beispielpläne mit unterschiedlichen Preisen und Funktionen.
**Hinweis:** In einer realen Anwendung würden diese Daten von einem Backend bereitgestellt, das sie von Stripe oder einer anderen Datenquelle abruft. Für diese Frontend-Übung verwenden wir hartkodierte Mock-Daten.

Prompt 3: SubscriptionCard Komponente

Ziel: Erstellung einer wiederverwendbaren React-Komponente zur Darstellung eines einzelnen Abonnementplans.

Erstelle eine neue funktionale React-Komponente namens `SubscriptionCard`.
Diese Komponente sollte die folgenden Props akzeptieren:
- `plan`: Ein Objekt, das die Daten eines einzelnen Abonnementplans enthält (wie in Prompt 2 definiert).
- `isMonthly`: Ein boolescher Wert, der angibt, ob der monatliche Preis angezeigt werden soll.
- `isSelected`: Ein boolescher Wert, der angibt, ob dieser Plan aktuell ausgewählt ist.
- `onSelect`: Eine Callback-Funktion, die aufgerufen wird, wenn der "Plan auswählen"-Button geklickt wird.

Die Komponente sollte den Plan-Namen, den Preis (basierend auf `isMonthly`), und die Features anzeigen.
Verwende Tailwind CSS für das Styling der Karte:
- Abgerundete Ecken (`rounded-xl`).
- Einen Schatten (`shadow-lg`).
- Eine ansprechende Hintergrundfarbe.
- Innenabstand (`p-6`).
- Visuelle Hervorhebung (z.B. einen farbigen Rahmen oder eine andere Hintergrundfarbe), wenn `isSelected` `true` ist.
- Der "Plan auswählen"-Button sollte ein klares Design haben, abgerundete Ecken und auf `:hover` reagieren.
- Stelle sicher, dass die Karte responsiv ist und gut in einem Rasterlayout aussieht.

Prompt 4: PaymentToggle Komponente

Ziel: Erstellung einer Komponente zum Umschalten zwischen monatlicher und jährlicher Zahlung.

Erstelle eine neue funktionale React-Komponente namens `PaymentToggle`.
Diese Komponente sollte die folgenden Props akzeptieren:
- `isMonthly`: Ein boolescher Wert, der den aktuellen Zustand des Umschalters darstellt.
- `onToggle`: Eine Callback-Funktion, die aufgerufen wird, wenn der Umschalter betätigt wird.

Implementiere den Umschalter als zwei Buttons ("Monatlich" und "Jährlich") oder als einen Toggle-Switch.
Verwende Tailwind CSS für das Styling der Buttons/des Umschalters.
Der aktuell ausgewählte Button sollte visuell hervorgehoben sein.
Neben dem "Jährlich"-Button sollte ein Text wie "Spare X%" angezeigt werden, wobei X der `yearlyDiscountPercentage` des ersten Plans (oder eines repräsentativen Plans) ist. Sorge dafür, dass dieser Text dynamisch ist.
Platziere die Komponente zentral über den Abonnementkarten.

Prompt 5: Hauptlayout und Zustandsverwaltung in App.js

Ziel: Integration der Komponenten und Verwaltung des Anwendungszustands.

Aktualisiere die `App.js`-Datei, um die `SubscriptionCard`- und `PaymentToggle`-Komponenten zu integrieren.
Verwalte die folgenden Zustände in der `App`-Komponente mit `useState`:
- `isMonthly`: Ein boolescher Wert für die aktuelle Zahlungsfrequenz (initial `true` für monatlich).
- `selectedPlanId`: Ein String, der die ID des aktuell ausgewählten Plans speichert (initial `null`).
- `paymentStatus`: Ein String, der den Status des Zahlungsvorgangs anzeigt ('idle', 'loading', 'success', 'error').

Rendere die `PaymentToggle`-Komponente und übergebe die entsprechenden Props.
Rendere die `SubscriptionCard`-Komponenten in einem responsiven Rasterlayout (z.B. mit Tailwind CSS `grid` und `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
Iteriere über die in Prompt 2 definierten `subscriptionPlans`-Daten, um für jeden Plan eine `SubscriptionCard` zu rendern.
Übergib die korrekten Props an jede `SubscriptionCard`.
Implementiere die `onSelect`-Funktion für die `SubscriptionCard`, die den `selectedPlanId`-Zustand aktualisiert.

Prompt 6: Mock-Zahlungsintegration und UI-Feedback

Ziel: Implementierung der simulierten Zahlung und Anzeige von Feedback an den Benutzer.

Erweitere die `App.js`-Komponente um eine asynchrone Funktion namens `initiateStripePayment`.
Diese Funktion sollte die Auswahl des Plans als Argument erhalten.
Simuliere einen API-Aufruf mit `setTimeout` (z.B. 2 Sekunden Verzögerung).
Setze den `paymentStatus`-Zustand auf 'loading' vor dem Aufruf, auf 'success' bei Erfolg und auf 'error' bei einem simulierten Fehler.
Simuliere einen Fehler in etwa 20% der Fälle.
Nach dem Klick auf den "Plan auswählen"-Button in der `SubscriptionCard` (wenn ein Plan ausgewählt ist), rufe diese `initiateStripePayment`-Funktion auf.
Zeige dem Benutzer Feedback zum `paymentStatus`:
- Bei 'loading': Eine Ladeanzeige oder ein Text wie "Zahlung wird verarbeitet..."
- Bei 'success': Eine Erfolgsmeldung (z.B. "Abonnement erfolgreich abgeschlossen!").
- Bei 'error': Eine Fehlermeldung (z.B. "Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.").
Verwende ein einfaches Modal oder eine temporäre Nachricht im UI für dieses Feedback.
**Hinweis:** Diese Funktion simuliert die Kommunikation mit einem Backend, das die tatsächliche Stripe-Transaktion abwickeln würde. Im Produktionsbetrieb würden hier tatsächliche `fetch`-Aufrufe an Ihr Backend erfolgen, welches dann mit der Stripe API interagiert.

Prompt 7: Letzte Verfeinerungen und Responsivität

Ziel: Allgemeine Verbesserungen, Sicherstellung der vollen Responsivität und Hinzufügen von Kommentaren.

Überprüfe die gesamte Anwendung auf volle Responsivität. Stelle sicher, dass das Layout auf mobilen Geräten, Tablets und Desktops optimal aussieht.
Passe bei Bedarf Tailwind CSS-Klassen (z.B. `sm:`, `md:`, `lg:`) an, um das Layout, die Abstände und die Schriftgrößen anzupassen.
Stelle sicher, dass alle interaktiven Elemente (Buttons, Umschalter) auf Touch-Events reagieren und eine angemessene Größe für Touch-Ziele haben.
Füge umfassende Kommentare zum gesamten Code hinzu, um die Logik, die Komponenten und die Zustandsverwaltung zu erklären.
Stelle sicher, dass der Code sauber, lesbar und gut strukturiert ist.

