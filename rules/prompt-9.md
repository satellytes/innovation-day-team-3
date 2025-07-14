Prompt 9: Anpassung der Start- und Checkout-Seiten im React Frontend
Bitte erstelle die folgenden Anpassungen für die React-Frontend-Anwendung, um die Struktur gemäß den neuen Anforderungen für die Benutzerführung anzupassen.

Anforderungen:

Verschiebung der aktuellen Startseite zu /checkout:

Benenne die aktuelle Startseiten-Komponente (die die Produktauswahl enthält) entsprechend um, z.B. zu CheckoutPage.js oder ProductSelectionPage.js.

Passe die React-Router-Konfiguration so an, dass diese Komponente nun unter dem Pfad /checkout erreichbar ist. Die URL / soll nicht mehr darauf zeigen.

Erstellung einer neuen Startseite (/):

Erstelle eine neue React-Komponente für die Startseite, z.B. HomePage.js.

Diese neue Startseite soll das gleiche Look & Feel wie die bisherige Startseite haben (Farben, Schriftarten, allgemeines Layout). Übernimm dafür das Styling und eventuell wiederverwendbare UI-Komponenten.

Inhalt der neuen Startseite:

Füge eine Überschrift hinzu, z.B. "Wähle einen Kunden aus oder erstelle einen neuen".

Implementiere eine Logik, um alle vorhandenen Kunden aus dem Go-Backend abzurufen. Erstelle dafür einen neuen API-Endpunkt im Go-Backend, der eine Liste aller users (aus der users-Tabelle) zurückgibt, idealerweise mit id, email und stripe_customer_id.

Zeige die abgerufenen Kunden in einer übersichtlichen Liste oder Tabelle an. Für jeden Kunden sollen die email und eventuell eine id sichtbar sein.

Jeder Kunden-Eintrag in der Liste muss einen "Simulate" Button enthalten.

"Simulate" Button Funktionalität:

Beim Klick auf den "Simulate" Button soll die id (aus der Datenbank), der email und der stripe_customer_id des jeweiligen Kunden im Browser-Speicher (z.B. localStorage oder sessionStorage) abgelegt werden.

Nachdem die Daten gespeichert wurden, soll der Benutzer automatisch zur /checkout Seite navigiert werden.

Auf der /checkout Seite muss die Logik angepasst werden, um zu prüfen, ob Kundendaten im Speicher vorhanden sind. Wenn ja, sollen diese Daten verwendet werden, um den Kontext der Abonnement-Erstellung entsprechend vorzubesetzen (z.B. dem Backend die stripe_customer_id mitzuschicken, falls ein bestehender Kunde abonniert).

Stelle sicher, dass diese gespeicherten Daten auf /checkout und potenziell anderen nachfolgenden Seiten abrufbar sind, solange sie im Speicher gehalten werden.

Go-Backend Anpassung:

Erstelle einen neuen REST-Endpunkt im Go-Backend: GET /api/v1/users. Dieser Endpunkt soll eine Liste aller users aus der Postgres-Datenbank zurückgeben, beschränkt auf id, email und stripe_customer_id.

Fokus der Ausgabe:

Gib den gesamten Code für die geänderten und neuen React-Komponenten, die Router-Konfiguration und den neuen Go-Backend-Endpunkt aus. Stelle sicher, dass die Dateipfade klar erkennbar sind.