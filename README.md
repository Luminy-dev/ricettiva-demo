# Portale delle demo StayKit

Un sito dimostrativo per struttura, sullo stesso dominio:

```
/                          pagina neutra: nessun elenco
/come-funziona            cos'è il pannello, con le schermate
/nomecliente              il sito dimostrativo di quella struttura
/nomecliente/blog/<id>    un consiglio, alla sua pagina
/nomecliente/privacy      la sua informativa
```

**La radice non elenca niente**, di proposito: era l'unico punto da cui un
cliente, cancellando il proprio nome dall'indirizzo, poteva arrivare alle
anteprime dei suoi concorrenti. Anche un indirizzo inventato dà la stessa
pagina — distinguerli direbbe a chi prova a caso quando ha indovinato.

Per sapere cosa hai in casa: `npm run demo`.

Le demo si costruiscono con i dati veri della struttura — quelli che stanno già
sul suo Booking o sul suo sito — così il cliente non vede «un template», vede il
proprio posto fatto meglio.

---

## Cominciare

```bash
npm install
npm run dev          # http://localhost:5174
```

C'è già `/palazzo-fiorillo`, un B&B inventato a Salerno: serve quando non hai
ancora i dati di nessuno e vuoi far vedere il prodotto.

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Sviluppo con ricarica automatica |
| `npm run check` | Controlli + build. **Lancialo prima di pubblicare** |
| `npm run pubblica` | Controlli, salva e manda online: GitHub + Vercel in un colpo |
| `npm run foto` | Ridimensiona e converte le immagini in WebP |
| `npm run allinea` | Mostra cosa è cambiato nel template del progetto principale |
| `npm run allinea -- --scrivi` | Applica quelle modifiche |
| `npm run esporta -- nomecliente --base https://…` | Prepara il file per mettere live la demo |
| `npm run demo` | L'elenco delle demo, da terminale |
| `npm run mcp:prova` | Verifica che il server MCP risponda, senza Claude Desktop |

---

## Creare una demo parlando

Il modo previsto è il server MCP: gli dai il link della struttura e lui compila.

### Collegarlo a Claude Desktop

**Prima, verifica che il server giri:**

```bash
npm run mcp:prova
```

Devono comparire tre spunte. Se non compaiono, il problema è qui e non serve
andare oltre.

**Poi:**

1. Claude Desktop → menu **Claude** (quello del sistema, non l'ingranaggio
   dentro la finestra) → **Settings…**
2. Scheda **Developer** → **Edit Config**. Si apre
   `claude_desktop_config.json`, e se non esiste lo crea.
3. Incolla il contenuto di [`mcp/claude_desktop_config.esempio.json`](mcp/claude_desktop_config.esempio.json).
   Se hai già altri server, aggiungi solo il blocco `"staykit-demo"` dentro
   `mcpServers` — senza duplicare le graffe esterne.
4. **Chiudi del tutto** Claude Desktop e riaprilo. Non basta la X: dev'essere
   chiuso anche dalla barra delle applicazioni.
5. Nella casella del messaggio, in basso a sinistra, clicca su
   **«Aggiungi file, connettori e altro»** → *Connettori* → *Gestisci
   connettori*: fra questi deve esserci `staykit-demo` con i suoi otto
   strumenti.

Il percorso nell'esempio è già quello giusto per questo computer. Se sposti la
cartella, aggiornalo: dev'essere **assoluto**, i percorsi relativi non
funzionano.

`DEMO_BASE_URL` è facoltativo: se lo imposti, `esporta_demo` non ti chiederà
ogni volta l'indirizzo del portale.

**Se non compare**

| Sintomo | Quasi sempre |
|---|---|
| Il connettore non c'è | JSON con una virgola di troppo, o Claude non chiuso davvero |
| `ENOENT` nei log | Percorso sbagliato, o `node` non trovato: metti il percorso completo di `node.exe` in `command` |
| C'è ma non fa niente | Guarda il log: `type "%APPDATA%\Claude\logs\mcp-server-staykit-demo.log"` |

Per trovare il percorso completo di Node, in PowerShell: `where.exe node`.

### Poi si lavora a voce

Nella casella del messaggio scrivi `/` e scegli **crea-demo-da-link**: è una
procedura già scritta, con l'ordine giusto e i motivi. Incolli il link e parte.

Oppure a mano libera:

> Crea una demo per questa struttura: `https://www.booking.com/hotel/it/...`
> Usa leggi_struttura sulla pagina e anche sul suo sito ufficiale, poi scarica
> le foto migliori e riempi il sito.

**Perché `leggi_struttura` è il primo passo.** La ricerca web restituisce testo
ripulito: gli indirizzi delle immagini non ci sono, e senza quelli le foto — la
cosa più importante di una demo — non si possono prendere. Questo strumento
scarica l'HTML vero e ne tira fuori:

- le **foto in alta risoluzione**, riscrivendo le miniature dei portali nella
  versione grande e scartando loghi, bandierine e avatar
- le **coordinate GPS**, cercate nei dati strutturati, nell'attributo della
  mappa e nei link a Google Maps
- **voto, numero di recensioni, indirizzo, telefono** dai dati che ogni portale
  pubblica per Google
- i **testi delle recensioni**, quando il portale li espone, con autore e data

Conviene passarlo su più fonti: la pagina Booking dà foto e voto, il sito
ufficiale dà email, telefono e partita IVA.

Poi:

```bash
npm run foto     # alleggerisce le foto appena scaricate
npm run check    # dice cosa manca ancora
npm run dev      # e la guardi su /nomecliente
```

### Gli strumenti

| Strumento | A cosa serve |
|---|---|
| `leggi_struttura` | **Primo passo**: foto, coordinate, voto e recapiti da una pagina |
| `geocodifica_indirizzo` | Indirizzo → coordinate, quando la pagina non le ha |
| `elenca_demo` | Cosa c'è già, per non sovrascrivere |
| `crea_demo` | Crea la cartella e il file vuoto |
| `leggi_demo` | Rilegge il file per correggere |
| `aggiorna_demo` | Scrive i campi (patch parziale) |
| `scarica_foto` | Porta le immagini dentro il progetto |
| `controlla_demo` | Cosa manca, diviso fra «lo trovo ancora io» e «serve il cliente» |
| `collega_booking` | Le date aprono Booking già filtrato, invece del modulo |
| `esporta_demo` | Prepara il file da importare nel sito vero |
| `elimina_demo` | Cancella tutto, con conferma |

Il server scrive **solo** dentro `demo/` e `public/demo/`. Un nome che tenta di
uscire da lì viene rifiutato, e i nomi che coprirebbero una pagina del portale
(`come-funziona`, `privacy`, `assets`, `pannello`) pure.

### Quando una foto non si riesce a prendere

Qualche portale carica la galleria solo con JavaScript, e allora nell'HTML non
c'è niente da estrarre. In quel caso `leggi_struttura` te lo dice invece di
restituire una lista vuota senza spiegazioni. Le vie d'uscita, in ordine:

1. il **sito ufficiale** della struttura — quasi sempre ha le stesse foto e
   nessuna difesa
2. la sua pagina **Facebook** o **Instagram**
3. un **altro portale**: Airbnb, Expedia, Tripadvisor
4. chiedere le foto al cliente, che è comunque quello che farai per il sito
   vero

### Cosa nasce insieme a ogni demo

Dando a `crea_demo` il **link Booking** della struttura — o usando poi
`collega_booking` — la barra delle date apre la sua pagina con arrivo, partenza
e ospiti già filtrati. Chi guarda sceglie 14–16 agosto per due persone e finisce
su Booking con esattamente quella ricerca: la dimostrazione arriva a un
risultato vero invece di fermarsi a un modulo che, in una demo, non manda niente
a nessuno.

Serve l'indirizzo della **scheda** — quello con `/hotel/` dentro — non una
pagina di ricerca: Booking non applica i filtri a una ricerca per nome e
riporta alla home con i campi vuoti. Cerca la struttura, aprila, copia
l'indirizzo dalla barra del browser: i trenta parametri di sessione che ti porti
dietro (`aid`, `label`, `sid`, `srepoch`…) vengono tolti da soli. Sono la tua
sessione e la ricerca da cui arrivavi: scadono, e col tempo farebbero comportare
male il link.

L'assistente riempie anche:

- **due articoli** nei consigli — «come arrivare» e «dove mangiare» funzionano
  quasi ovunque. Ognuno ha la sua pagina, `/nomecliente/blog/come-arrivare`
- **due o tre offerte**, inventate: «7 notti, la settima gratis», «−15%
  prenotando 60 giorni prima». In una demo sono proposte, non impegni — servono
  a far vedere come si presentano. Quando consegni, dillo al cliente

La galleria resta nella pagina ma non nel menu in alto: con otto voci la barra
diventa illeggibile, e la galleria si trova benissimo scorrendo.

### Quello che non si può trovare

Racconto della struttura, email, partita IVA, orari della colazione, prezzi
reali: non stanno in rete, o ci stanno in versioni che si contraddicono.
`controlla_demo` li tiene in un elenco separato apposta.

Su questi **non inventare niente**. Una demo con una storia di famiglia
plausibile ma falsa si smonta alla prima domanda del cliente, e ti fa perdere
la vendita meglio di una sezione spenta.

---

## Fare una demo a mano

Serve una cartella e un file:

```
demo/nomecliente/sito.json      i contenuti
public/demo/nomecliente/*.jpg   le foto
```

Il formato è **identico** a quello che il pannello salva su Supabase nel
progetto principale: se vuoi un esempio completo, guarda
`demo/palazzo-fiorillo/sito.json`.

In più c'è un blocco `vetrina`, che è solo tuo e non finisce mai sul sito:

```json
"vetrina": {
  "luogo": "Salerno · centro storico",
  "nota": "Conosciuto alla fiera, richiamare a settembre",
  "creata": "2026-08-13",
  "fonte": "https://www.booking.com/hotel/it/..."
}
```

---

## Mettere live una demo

Quando il cliente dice sì, la demo si sposta sul suo sito senza rifare niente.

```bash
npm run esporta -- nomecliente --base https://demo.tuodominio.it
```

Esce `export/nomecliente.json`. Poi, nel pannello del sito vero: modo
rivenditore → **Esporta e importa** → *Importa un sito* → scegli il file, e
lascia acceso **«scarica le foto»**.

Quell'ultima casella è il punto di tutto. Nella demo le immagini stanno qui,
su questo portale; se non venissero scaricate, il sito del cliente
continuerebbe a caricarle dal tuo dominio — e il giorno che spegni il portale
o cancelli la demo, lui perde tutte le foto. Con la casella accesa vengono
copiate nel suo spazio e i percorsi riscritti: da lì in poi non dipende più da
niente di tuo.

Il portale dev'essere online **durante** l'importazione, una volta sola.

Si può fare anche parlando: chiedi all'assistente di usare `esporta_demo`.

---

## Le schermate del pannello

Vanno in `public/pannello/` con i nomi elencati in
`public/pannello/LEGGIMI.txt`. Finché un file manca, al suo posto la pagina
mostra un segnaposto che dice quale — così puoi pubblicare prima di averle
fatte tutte.

Falle sulla struttura demo, non su un cliente vero: nelle schermate del
pannello si leggono nomi, email e numeri di telefono di persone reali.

Poi `npm run foto -- pannello` per convertirle.

---

## Pubblicare

La repo è `Luminy-dev/ricettiva-demo`, e Vercel ci sta attaccato sopra: ogni
push sul ramo `main` fa ripartire la build da solo. Non c'è una seconda cosa da
fare dopo, e non esiste il caso "l'ho messo su GitHub ma il sito è vecchio".

```bash
npm run pubblica
npm run pubblica -- "nuove foto Palazzo Fiorillo"
```

Il comando fa `npm run check` per primo: se i controlli o la build falliscono
non spinge niente. Quando hai fretta e sai cosa stai facendo, `-- --veloce`
salta la verifica.

Il progetto Vercel non ha variabili d'ambiente da impostare: il portale non ha
un backend e non tocca nessun database. Serve solo un sottodominio tuo, tipo
`demo.tuodominio.it`.

La prima volta, su un computer nuovo, va fatto il login a GitHub: `gh auth login`.

---

## Due cose da tenere a mente

**Le demo non vanno indicizzate.** Mostrano i contenuti di una struttura vera
su un dominio che non è il suo: se finissero su Google, faresti concorrenza al
tuo cliente con una copia del suo stesso sito. Il portale si difende su tre
livelli — `robots.txt`, meta tag e `X-Robots-Tag` nell'intestazione HTTP — e
`npm run check` fallisce se ne togli uno. Ma la protezione vera è cancellare le
demo che non servono più.

**I moduli non inviano niente.** Durante la dimostrazione il modulo mostra la
conferma di invio, perché quello che vuoi far vedere è il percorso e un errore
rosso a metà sembra un sito rotto. La barra di regia lo scrive per tutto il
tempo, così nessuno crede di aver mandato davvero una richiesta.

---

## Rapporto col progetto principale

Questa è una repo separata, ma il template è lo stesso. `npm run allinea` copia
da `../Website bnb/frontend` le cartelle che non sono del portale — temi,
componenti, sezioni, dizionari, utilità — e ti dice cosa è cambiato prima di
toccare niente.

Restano fuori, di proposito:

| File | Perché è diverso qui |
|---|---|
| `src/lib/api.js` | Il portale non ha un backend: i moduli fingono |
| `src/lib/privacy-link.js` | L'informativa sta su `/<slug>/privacy`, non su `/privacy` |
| `src/config/vetrina.js` | Qui il portale *è* la vetrina |

Se il template sta altrove:

```bash
TEMPLATE_DIR="C:/percorso/al/frontend" npm run allinea
```

Dopo un allineamento, sempre `npm run check`.
