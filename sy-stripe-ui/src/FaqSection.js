import React from 'react';

const faqs = [
  {
    question: 'Wie kann ich mein Abonnement kündigen?',
    answer:
      'Sie können Ihr Abonnement jederzeit bequem in Ihrem Benutzerkonto kündigen. Nach der Kündigung bleibt Ihr Zugang bis zum Ende des bereits bezahlten Zeitraums erhalten.'
  },
  {
    question: 'Gibt es eine kostenlose Testphase?',
    answer:
      'Ja, Sie können unseren Service kostenlos testen. Während der Testphase stehen Ihnen alle Funktionen unverbindlich zur Verfügung.'
  },
  {
    question: 'Was passiert nach der Testphase?',
    answer:
      'Nach Ablauf der Testphase wird automatisch das von Ihnen gewählte Abonnement aktiviert, sofern Sie nicht vorher kündigen.'
  },
  {
    question: 'Welche Zahlungsmethoden gibt es?',
    answer:
      'Wir akzeptieren Kreditkarte, PayPal und SEPA-Lastschrift als Zahlungsmethoden.'
  },
  {
    question: 'Erhalte ich eine Rechnung?',
    answer:
      'Ja, nach jeder erfolgreichen Zahlung erhalten Sie eine Rechnung per E-Mail. Zusätzlich können Sie alle Rechnungen jederzeit in Ihrem Benutzerkonto einsehen.'
  },
  {
    question: 'Kann ich mein Abonnement ändern?',
    answer:
      'Sie können Ihr Abonnement jederzeit upgraden oder downgraden. Die Änderung wird entweder sofort oder zum nächsten Abrechnungszeitraum wirksam.'
  }
];

export default function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto mt-16 mb-24 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Häufige Fragen zu unseren Abonnements</h2>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
