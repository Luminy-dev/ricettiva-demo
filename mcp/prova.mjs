#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Prova del server MCP, senza Claude Desktop
//
//    node mcp/prova.mjs
//
//  Serve a separare due domande che altrimenti si confondono:
//  «il server funziona?» e «Claude Desktop lo trova?». Se questo
//  va e Claude no, il problema è nella configurazione, non nel codice.
// ─────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const server = join(dirname(fileURLToPath(import.meta.url)), 'server.mjs')
const proc = spawn(process.execPath, [server], { stdio: ['pipe', 'pipe', 'inherit'] })

const richieste = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
  { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
  { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'elenca_demo', arguments: {} } },
]
for (const r of richieste) proc.stdin.write(JSON.stringify(r) + '\n')
proc.stdin.end()

let buffer = ''
proc.stdout.on('data', (c) => {
  buffer += c
  for (const riga of buffer.split('\n').slice(0, -1)) {
    if (!riga.trim()) continue
    const m = JSON.parse(riga)
    if (m.error) {
      console.log(`  ✗ id=${m.id}: ${m.error.message}`)
    } else if (m.id === 1) {
      console.log(`  ✓ server avviato: ${m.result.serverInfo.name} ${m.result.serverInfo.version}`)
    } else if (m.id === 2) {
      console.log(`  ✓ ${m.result.tools.length} strumenti: ${m.result.tools.map((t) => t.name).join(', ')}`)
    } else if (m.id === 3) {
      const testo = m.result.content[0].text
      const quante = testo.startsWith('[') ? JSON.parse(testo).length : 0
      console.log(`  ✓ demo presenti: ${quante || 'nessuna'}`)
    }
  }
  buffer = buffer.split('\n').at(-1)
})

proc.on('close', () => {
  console.log('\n  Se vedi tre spunte, il server è a posto.')
  console.log('  Se Claude Desktop non lo vede lo stesso, guarda i log:')
  console.log('    type "%APPDATA%\\Claude\\logs\\mcp-server-staykit-demo.log"\n')
})
