// ─────────────────────────────────────────────────────────────
//  StayKit — Testo dell'informativa privacy
//
//  Sta qui e non nel database per un motivo preciso: descrive come
//  funziona QUESTO software, e chi lo sa è chi lo scrive. Se il
//  cliente potesse riscriverla, la prima modifica sbagliata la
//  renderebbe falsa — e un'informativa falsa è peggio di nessuna.
//
//  Del cliente sono solo i dati che lo identificano come titolare
//  del trattamento (nome, indirizzo, email, PEC): quelli li mette
//  dal pannello e finiscono nei segnaposto {tra graffe}.
//
//  Le sezioni non ci sono tutte sempre: quelle sui cookie di
//  statistica, sul gestionale, sulla mappa e su WhatsApp compaiono
//  solo se quei moduli sono davvero attivi. Vedi src/lib/privacy.js.
//
//  ⚠ È un modello, non una consulenza legale. Chi pubblica il sito
//  resta responsabile di farlo verificare: sta scritto anche nel
//  pannello, sopra i campi.
// ─────────────────────────────────────────────────────────────

export const LEGAL = {
  it: {
    'privacy.title': 'Informativa sulla privacy',
    'privacy.updated': 'Ultimo aggiornamento',
    'privacy.back': 'Torna al sito',
    'privacy.intro':
      'Questa pagina spiega quali dati personali raccogliamo attraverso questo sito, perché lo facciamo e ' +
      'quali diritti hai. È scritta ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).',

    'privacy.owner.title': 'Chi tratta i tuoi dati',
    'privacy.owner.body':
      'Il titolare del trattamento è {titolare}{indirizzo}. Per qualunque questione relativa ai tuoi dati ' +
      'personali puoi scrivere a {email}{pec}.',
    'privacy.owner.dpo': 'Responsabile della protezione dei dati: {dpo}.',
    'privacy.owner.missing':
      'I dati del titolare del trattamento non sono ancora stati inseriti. Contattaci ai recapiti indicati sul sito.',

    'privacy.form.title': 'Richieste di disponibilità e messaggi',
    'privacy.form.body':
      'Quando compili un modulo del sito ci invii i dati che hai scritto nei campi. Li usiamo solo per ' +
      'risponderti e gestire la tua eventuale prenotazione.',
    'privacy.form.list.data': 'Dati raccolti: nome, email, telefono (se lo indichi), date del soggiorno, numero di ospiti, unità di interesse e il testo del messaggio.',
    'privacy.form.list.base': 'Base giuridica: l’esecuzione di misure precontrattuali richieste da te (art. 6.1.b GDPR).',
    'privacy.form.list.need': 'Conferimento: nome ed email sono necessari per risponderti; il resto è facoltativo.',
    'privacy.form.list.keep': 'Conservazione: {mesi} mesi dall’ultimo contatto, poi cancellazione.',
    'privacy.form.list.spam': 'Antispam: il modulo contiene un campo nascosto che tu non vedi e non compili, e il tuo indirizzo IP viene letto per contare quante richieste arrivano nello stesso minuto. Non lo salviamo nel database e non lo colleghiamo al tuo messaggio: resta in memoria per un minuto e poi sparisce. I nostri fornitori tecnici lo registrano nei propri log di sicurezza, come fa qualunque sito.',

    'privacy.cookie.title': 'Cookie e memoria del browser',
    'privacy.cookie.body':
      'Il sito non usa cookie di profilazione e non ti segue su altri siti. Per funzionare salva nella ' +
      'memoria del tuo browser solo la lingua scelta e, se ti viene chiesto, la tua risposta sui cookie.',
    'privacy.cookie.analytics':
      'Se acconsenti, carichiamo {strumento} per contare le visite in forma aggregata. Senza il tuo consenso ' +
      'lo script non viene nemmeno scaricato. Puoi cambiare idea in qualsiasi momento cancellando i dati del ' +
      'sito dalle impostazioni del browser.',
    'privacy.cookie.none':
      'Non usiamo strumenti di statistica: per questo non vedi nessun banner sui cookie.',

    'privacy.engine.title': 'Prenotazioni online',
    'privacy.engine.body':
      'Le prenotazioni passano da {fornitore}, che è un fornitore autonomo con una propria informativa. ' +
      'Quando prosegui verso la prenotazione, i dati che inserisci lì vengono trattati da loro secondo le loro condizioni.',
    'privacy.engine.embedded':
      'Il loro modulo è incorporato in questa pagina: caricandolo il tuo browser si collega ai loro server, che ' +
      'possono registrare l’indirizzo IP e impostare cookie tecnici propri.',

    'privacy.map.title': 'Mappa',
    'privacy.map.body':
      'La mappa che mostra dove siamo è fornita da Google Maps. Aprendola il tuo browser si collega ai server ' +
      'di Google, che possono trattare il tuo indirizzo IP secondo la loro informativa.',

    'privacy.whatsapp.title': 'WhatsApp',
    'privacy.whatsapp.body':
      'Se ci scrivi su WhatsApp la conversazione avviene sulla piattaforma di Meta, secondo le sue condizioni. ' +
      'Noi conserviamo il messaggio per il tempo necessario a risponderti.',

    'privacy.hosting.title': 'Dove stanno i dati e chi li vede',
    'privacy.hosting.body':
      'Il sito è ospitato su Vercel e i dati dei moduli sono salvati su Supabase, in un database nell’Unione ' +
      'Europea. Entrambi agiscono come responsabili del trattamento, con contratto ai sensi dell’art. 28 GDPR. ' +
      'Le notifiche via email passano da Resend.',
    'privacy.hosting.nosale':
      'Non vendiamo i tuoi dati, non li cediamo a fini pubblicitari e non facciamo profilazione né decisioni automatizzate.',

    'privacy.rights.title': 'I tuoi diritti',
    'privacy.rights.body':
      'Puoi chiederci in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il ' +
      'trattamento, riceverli in formato leggibile o opporti al loro uso (artt. 15-22 GDPR). Ti rispondiamo ' +
      'entro un mese. Se ritieni che il trattamento non sia corretto puoi rivolgerti al Garante per la ' +
      'protezione dei dati personali (www.garanteprivacy.it).',

    'privacy.minors.title': 'Minori',
    'privacy.minors.body':
      'Il sito non è rivolto a minori di 14 anni e non raccogliamo consapevolmente i loro dati. Le prenotazioni ' +
      'sono fatte da un adulto, che risponde anche per gli altri ospiti che indica.',

    'privacy.changes.title': 'Modifiche',
    'privacy.changes.body':
      'Se cambiamo il funzionamento del sito aggiorniamo questa pagina e la data in cima. Ti conviene ' +
      'rileggerla prima di inviarci nuovi dati.',
  },

  en: {
    'privacy.title': 'Privacy policy',
    'privacy.updated': 'Last updated',
    'privacy.back': 'Back to the site',
    'privacy.intro':
      'This page explains which personal data we collect through this website, why we do it and what rights ' +
      'you have. It is written under Articles 13 and 14 of Regulation (EU) 2016/679 (GDPR).',

    'privacy.owner.title': 'Who handles your data',
    'privacy.owner.body':
      'The data controller is {titolare}{indirizzo}. For anything concerning your personal data you can write ' +
      'to {email}{pec}.',
    'privacy.owner.dpo': 'Data protection officer: {dpo}.',
    'privacy.owner.missing':
      'The data controller’s details have not been filled in yet. Please use the contact details shown on the site.',

    'privacy.form.title': 'Availability requests and messages',
    'privacy.form.body':
      'When you fill in a form on this site you send us what you typed into the fields. We use it only to reply ' +
      'to you and to handle your booking, if there is one.',
    'privacy.form.list.data': 'Data collected: name, email, phone (if you give it), stay dates, number of guests, the unit you are interested in and the text of your message.',
    'privacy.form.list.base': 'Legal basis: steps taken at your request before entering into a contract (Art. 6.1.b GDPR).',
    'privacy.form.list.need': 'Name and email are needed to reply to you; everything else is optional.',
    'privacy.form.list.keep': 'Retention: {mesi} months from our last contact, then deletion.',
    'privacy.form.list.spam': 'Anti-spam: the form contains a hidden field you neither see nor fill in, and your IP address is read to count how many requests arrive within the same minute. We do not store it in the database and do not link it to your message: it stays in memory for a minute and then it is gone. Our technical providers record it in their own security logs, as any website does.',

    'privacy.cookie.title': 'Cookies and browser storage',
    'privacy.cookie.body':
      'This site uses no profiling cookies and does not follow you across other sites. To work it stores in ' +
      'your browser only the language you picked and, if you were asked, your answer about cookies.',
    'privacy.cookie.analytics':
      'If you consent, we load {strumento} to count visits in aggregate form. Without your consent the script ' +
      'is not even downloaded. You can change your mind at any time by clearing this site’s data in your browser settings.',
    'privacy.cookie.none':
      'We use no analytics tools, which is why you see no cookie banner.',

    'privacy.engine.title': 'Online bookings',
    'privacy.engine.body':
      'Bookings go through {fornitore}, an independent provider with its own privacy policy. When you move on ' +
      'to booking, the data you enter there is handled by them under their own terms.',
    'privacy.engine.embedded':
      'Their form is embedded in this page: loading it connects your browser to their servers, which may record ' +
      'your IP address and set their own technical cookies.',

    'privacy.map.title': 'Map',
    'privacy.map.body':
      'The map showing where we are is provided by Google Maps. Opening it connects your browser to Google’s ' +
      'servers, which may process your IP address under their own policy.',

    'privacy.whatsapp.title': 'WhatsApp',
    'privacy.whatsapp.body':
      'If you write to us on WhatsApp the conversation happens on Meta’s platform, under its terms. We keep ' +
      'the message for as long as we need to reply to you.',

    'privacy.hosting.title': 'Where the data lives and who sees it',
    'privacy.hosting.body':
      'The site is hosted on Vercel and form data is stored on Supabase, in a database inside the European ' +
      'Union. Both act as processors under an Art. 28 GDPR agreement. Email notifications go through Resend.',
    'privacy.hosting.nosale':
      'We do not sell your data, do not pass it on for advertising, and do no profiling or automated decision-making.',

    'privacy.rights.title': 'Your rights',
    'privacy.rights.body':
      'At any time you can ask us to access your data, correct it, delete it, restrict its processing, receive ' +
      'it in a readable format or object to its use (Arts. 15-22 GDPR). We reply within one month. If you ' +
      'believe the processing is not lawful you can complain to your national data protection authority.',

    'privacy.minors.title': 'Minors',
    'privacy.minors.body':
      'This site is not aimed at children under 14 and we do not knowingly collect their data. Bookings are ' +
      'made by an adult, who also answers for the other guests they list.',

    'privacy.changes.title': 'Changes',
    'privacy.changes.body':
      'If we change how the site works we update this page and the date at the top. It is worth re-reading it ' +
      'before sending us new data.',
  },

  de: {
    'privacy.title': 'Datenschutzerklärung',
    'privacy.updated': 'Zuletzt aktualisiert',
    'privacy.back': 'Zurück zur Website',
    'privacy.intro':
      'Diese Seite erklärt, welche personenbezogenen Daten wir über diese Website erheben, warum wir das tun ' +
      'und welche Rechte Sie haben. Sie ist nach Art. 13 und 14 der Verordnung (EU) 2016/679 (DSGVO) verfasst.',

    'privacy.owner.title': 'Wer Ihre Daten verarbeitet',
    'privacy.owner.body':
      'Verantwortlicher ist {titolare}{indirizzo}. Bei allen Fragen zu Ihren personenbezogenen Daten schreiben ' +
      'Sie bitte an {email}{pec}.',
    'privacy.owner.dpo': 'Datenschutzbeauftragter: {dpo}.',
    'privacy.owner.missing':
      'Die Angaben zum Verantwortlichen wurden noch nicht eingetragen. Bitte nutzen Sie die auf der Website angegebenen Kontaktdaten.',

    'privacy.form.title': 'Anfragen und Nachrichten',
    'privacy.form.body':
      'Wenn Sie ein Formular ausfüllen, senden Sie uns das, was Sie in die Felder geschrieben haben. Wir nutzen ' +
      'es ausschließlich, um Ihnen zu antworten und Ihre Buchung zu bearbeiten.',
    'privacy.form.list.data': 'Erhobene Daten: Name, E-Mail, Telefon (falls angegeben), Reisedaten, Anzahl der Gäste, gewünschte Einheit und der Text Ihrer Nachricht.',
    'privacy.form.list.base': 'Rechtsgrundlage: vorvertragliche Maßnahmen auf Ihre Anfrage hin (Art. 6.1.b DSGVO).',
    'privacy.form.list.need': 'Name und E-Mail sind für die Antwort erforderlich; alles Weitere ist freiwillig.',
    'privacy.form.list.keep': 'Speicherdauer: {mesi} Monate ab dem letzten Kontakt, danach Löschung.',
    'privacy.form.list.spam': 'Spamschutz: Das Formular enthält ein verstecktes Feld, das Sie weder sehen noch ausfüllen, und Ihre IP-Adresse wird gelesen, um Anfragen innerhalb einer Minute zu zählen. Wir speichern sie nicht in der Datenbank und verknüpfen sie nicht mit Ihrer Nachricht: Sie bleibt eine Minute im Arbeitsspeicher und verschwindet dann. Unsere technischen Dienstleister protokollieren sie in ihren Sicherheitslogs, wie jede Website.',

    'privacy.cookie.title': 'Cookies und Browserspeicher',
    'privacy.cookie.body':
      'Die Website verwendet keine Profiling-Cookies und verfolgt Sie nicht über andere Seiten hinweg. Zum ' +
      'Funktionieren speichert sie in Ihrem Browser nur die gewählte Sprache und – falls gefragt – Ihre Antwort zu den Cookies.',
    'privacy.cookie.analytics':
      'Mit Ihrer Einwilligung laden wir {strumento}, um Besuche in aggregierter Form zu zählen. Ohne Ihre ' +
      'Einwilligung wird das Skript nicht einmal heruntergeladen. Sie können Ihre Meinung jederzeit ändern, ' +
      'indem Sie die Daten dieser Website in den Browsereinstellungen löschen.',
    'privacy.cookie.none':
      'Wir verwenden keine Statistik-Tools; deshalb sehen Sie kein Cookie-Banner.',

    'privacy.engine.title': 'Online-Buchungen',
    'privacy.engine.body':
      'Buchungen laufen über {fornitore}, einen eigenständigen Anbieter mit eigener Datenschutzerklärung. Wenn ' +
      'Sie zur Buchung weitergehen, werden die dort eingegebenen Daten von diesem Anbieter verarbeitet.',
    'privacy.engine.embedded':
      'Dessen Formular ist in diese Seite eingebunden: beim Laden verbindet sich Ihr Browser mit deren Servern, ' +
      'die Ihre IP-Adresse speichern und eigene technische Cookies setzen können.',

    'privacy.map.title': 'Karte',
    'privacy.map.body':
      'Die Karte stammt von Google Maps. Beim Öffnen verbindet sich Ihr Browser mit den Servern von Google, ' +
      'die Ihre IP-Adresse nach ihrer eigenen Erklärung verarbeiten können.',

    'privacy.whatsapp.title': 'WhatsApp',
    'privacy.whatsapp.body':
      'Wenn Sie uns über WhatsApp schreiben, findet das Gespräch auf der Plattform von Meta statt, zu deren ' +
      'Bedingungen. Wir bewahren die Nachricht so lange auf, wie wir für die Antwort brauchen.',

    'privacy.hosting.title': 'Wo die Daten liegen und wer sie sieht',
    'privacy.hosting.body':
      'Die Website läuft auf Vercel, die Formulardaten liegen bei Supabase in einer Datenbank in der ' +
      'Europäischen Union. Beide handeln als Auftragsverarbeiter nach Art. 28 DSGVO. E-Mail-Benachrichtigungen ' +
      'laufen über Resend.',
    'privacy.hosting.nosale':
      'Wir verkaufen Ihre Daten nicht, geben sie nicht für Werbung weiter und betreiben weder Profiling noch automatisierte Entscheidungen.',

    'privacy.rights.title': 'Ihre Rechte',
    'privacy.rights.body':
      'Sie können jederzeit Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Übertragung Ihrer ' +
      'Daten oder Widerspruch verlangen (Art. 15-22 DSGVO). Wir antworten innerhalb eines Monats. Halten Sie ' +
      'die Verarbeitung für unrechtmäßig, können Sie sich bei Ihrer Datenschutzaufsichtsbehörde beschweren.',

    'privacy.minors.title': 'Minderjährige',
    'privacy.minors.body':
      'Die Website richtet sich nicht an Kinder unter 14 Jahren; wir erheben deren Daten nicht wissentlich. ' +
      'Buchungen werden von einer erwachsenen Person vorgenommen, die auch für die angegebenen Mitreisenden einsteht.',

    'privacy.changes.title': 'Änderungen',
    'privacy.changes.body':
      'Ändert sich die Funktionsweise der Website, aktualisieren wir diese Seite und das Datum oben. Lesen Sie ' +
      'sie am besten erneut, bevor Sie uns neue Daten senden.',
  },

  fr: {
    'privacy.title': 'Politique de confidentialité',
    'privacy.updated': 'Dernière mise à jour',
    'privacy.back': 'Retour au site',
    'privacy.intro':
      'Cette page explique quelles données personnelles nous recueillons via ce site, pourquoi et quels sont ' +
      'vos droits. Elle est rédigée au titre des articles 13 et 14 du Règlement (UE) 2016/679 (RGPD).',

    'privacy.owner.title': 'Qui traite vos données',
    'privacy.owner.body':
      'Le responsable du traitement est {titolare}{indirizzo}. Pour toute question relative à vos données ' +
      'personnelles, écrivez à {email}{pec}.',
    'privacy.owner.dpo': 'Délégué à la protection des données : {dpo}.',
    'privacy.owner.missing':
      'Les coordonnées du responsable du traitement n’ont pas encore été renseignées. Utilisez les contacts indiqués sur le site.',

    'privacy.form.title': 'Demandes de disponibilité et messages',
    'privacy.form.body':
      'Lorsque vous remplissez un formulaire, vous nous envoyez ce que vous avez saisi. Nous l’utilisons ' +
      'uniquement pour vous répondre et gérer votre éventuelle réservation.',
    'privacy.form.list.data': 'Données recueillies : nom, e-mail, téléphone (si vous l’indiquez), dates du séjour, nombre de voyageurs, logement souhaité et texte de votre message.',
    'privacy.form.list.base': 'Base légale : mesures précontractuelles prises à votre demande (art. 6.1.b RGPD).',
    'privacy.form.list.need': 'Le nom et l’e-mail sont nécessaires pour vous répondre ; le reste est facultatif.',
    'privacy.form.list.keep': 'Conservation : {mesi} mois à compter du dernier contact, puis suppression.',
    'privacy.form.list.spam': 'Anti-spam : le formulaire contient un champ caché que vous ne voyez pas et ne remplissez pas, et votre adresse IP est lue pour compter les demandes reçues dans la même minute. Nous ne l’enregistrons pas en base et ne la relions pas à votre message : elle reste une minute en mémoire puis disparaît. Nos prestataires techniques la consignent dans leurs journaux de sécurité, comme tout site web.',

    'privacy.cookie.title': 'Cookies et mémoire du navigateur',
    'privacy.cookie.body':
      'Le site n’utilise aucun cookie de profilage et ne vous suit pas sur d’autres sites. Pour fonctionner, il ' +
      'enregistre dans votre navigateur uniquement la langue choisie et, le cas échéant, votre réponse sur les cookies.',
    'privacy.cookie.analytics':
      'Avec votre consentement, nous chargeons {strumento} pour compter les visites de façon agrégée. Sans ' +
      'votre consentement, le script n’est même pas téléchargé. Vous pouvez changer d’avis à tout moment en ' +
      'effaçant les données de ce site dans les réglages de votre navigateur.',
    'privacy.cookie.none':
      'Nous n’utilisons aucun outil de statistiques : c’est pourquoi aucune bannière cookies ne s’affiche.',

    'privacy.engine.title': 'Réservations en ligne',
    'privacy.engine.body':
      'Les réservations passent par {fornitore}, prestataire indépendant disposant de sa propre politique de ' +
      'confidentialité. Lorsque vous poursuivez la réservation, les données saisies y sont traitées selon ses conditions.',
    'privacy.engine.embedded':
      'Son module est intégré à cette page : son chargement connecte votre navigateur à ses serveurs, qui ' +
      'peuvent enregistrer votre adresse IP et déposer leurs propres cookies techniques.',

    'privacy.map.title': 'Carte',
    'privacy.map.body':
      'La carte est fournie par Google Maps. En l’ouvrant, votre navigateur se connecte aux serveurs de Google, ' +
      'qui peuvent traiter votre adresse IP selon leur propre politique.',

    'privacy.whatsapp.title': 'WhatsApp',
    'privacy.whatsapp.body':
      'Si vous nous écrivez sur WhatsApp, la conversation a lieu sur la plateforme de Meta, selon ses ' +
      'conditions. Nous conservons le message le temps nécessaire pour vous répondre.',

    'privacy.hosting.title': 'Où sont les données et qui y accède',
    'privacy.hosting.body':
      'Le site est hébergé chez Vercel et les données des formulaires sont stockées chez Supabase, dans une ' +
      'base située dans l’Union européenne. Tous deux agissent comme sous-traitants au titre de l’art. 28 RGPD. ' +
      'Les notifications par e-mail passent par Resend.',
    'privacy.hosting.nosale':
      'Nous ne vendons pas vos données, ne les cédons pas à des fins publicitaires et ne pratiquons ni profilage ni décision automatisée.',

    'privacy.rights.title': 'Vos droits',
    'privacy.rights.body':
      'Vous pouvez à tout moment demander l’accès à vos données, leur rectification, leur effacement, la ' +
      'limitation du traitement, leur portabilité ou vous y opposer (art. 15-22 RGPD). Nous répondons sous un ' +
      'mois. Si vous estimez le traitement irrégulier, vous pouvez saisir votre autorité de protection des données.',

    'privacy.minors.title': 'Mineurs',
    'privacy.minors.body':
      'Le site ne s’adresse pas aux moins de 14 ans et nous ne recueillons pas sciemment leurs données. Les ' +
      'réservations sont effectuées par un adulte, qui répond aussi des autres voyageurs qu’il indique.',

    'privacy.changes.title': 'Modifications',
    'privacy.changes.body':
      'Si le fonctionnement du site change, nous mettons à jour cette page et la date en haut. Relisez-la avant ' +
      'de nous envoyer de nouvelles données.',
  },
}
