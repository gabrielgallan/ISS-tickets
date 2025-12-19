import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],   // Arquivo principal da sua aplicação
  outDir: 'dist',          // build/main.cjs

  format: ['cjs'],          // CommonJS – IDEAL para Node portátil
  clean: true,              // Limpa build/ antes de compilar
  minify: false,            // Mantém legível

  dts: false                // não gera .d.ts (produção não precisa)
})