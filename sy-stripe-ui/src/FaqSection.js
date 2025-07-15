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

import { useState } from 'react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="max-w-5xl mx-auto mt-16 mb-24 px-4">
      <h2 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold text-center mb-8 font-oswald text-koenigsblau">
        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14v.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
        </svg>
        Häufige Fragen zu unseren Abonnements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`bg-white border ${openIndex === idx ? 'border-blue-400 shadow-xl' : 'border-gray-200 shadow'} rounded-xl transition-all duration-200 group hover:shadow-lg hover:-translate-y-1`}
          >
            <button
              className="w-full flex justify-between items-center px-6 py-5 font-semibold text-lg text-blue-900 focus:outline-none rounded-t-xl"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-6 h-6 text-blue-500 transform transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id={`faq-answer-${idx}`}
              className={`px-6 pb-5 text-gray-700 text-base leading-relaxed transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
              aria-hidden={openIndex !== idx}
            >
              {openIndex === idx && faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
