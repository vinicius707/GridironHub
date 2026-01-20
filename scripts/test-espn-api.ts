/**
 * Script simples para testar a ESPN API Client
 * Execute: npx tsx scripts/test-espn-api.ts
 */

import { createEspnApiClient, type EspnTeamDTO } from '../src/infrastructure/api/espn/client'

async function testEspnApi() {
  console.log('🧪 Testando ESPN API Client...\n')

  const client = createEspnApiClient()

  try {
    // Teste 1: Buscar todos os times
    console.log('1️⃣ Buscando todos os times da NFL...')
    const teamsResponse = await client.getTeams()

    console.log('✅ Times encontrados!')
    console.log(`   - Total: ${teamsResponse.count} times`)
    console.log(`   - Páginas: ${teamsResponse.pageCount}`)
    console.log(`   - Itens nesta página: ${teamsResponse.items.length}`)

    // Verifica se os itens são referências ou times completos
    const hasRefs = teamsResponse.items.length > 0 && '$ref' in teamsResponse.items[0]
    
    let firstTeamId: string | null = null
    
    if (hasRefs) {
      console.log('   ⚠️  Resposta contém referências ($ref). Para obter dados completos, use getTeamById()')
      const firstRef = teamsResponse.items[0] as { $ref: string }
      console.log(`   - Primeira referência: ${firstRef.$ref}`)
      
      // Extrai ID da URL da referência
      const teamIdMatch = firstRef.$ref.match(/teams\/(\d+)/)
      if (teamIdMatch) {
        firstTeamId = teamIdMatch[1]
      }
    } else {
      // Se os itens são times completos
      const firstThreeTeams = (teamsResponse.items as EspnTeamDTO[]).slice(0, 3)
      console.log('\n   Primeiros 3 times:')
      firstThreeTeams.forEach((team, index) => {
        console.log(`   ${index + 1}. ${team.displayName} (${team.abbreviation}) - ID: ${team.id}`)
      })
      
      const firstTeam = teamsResponse.items[0] as EspnTeamDTO
      if (firstTeam?.id) {
        firstTeamId = firstTeam.id
      }
    }

    // Teste 2: Buscar um time específico
    if (firstTeamId) {
      console.log(`\n2️⃣ Buscando time específico (ID: ${firstTeamId})...`)
      
      const team = await client.getTeamById(firstTeamId)
      console.log('✅ Time encontrado!')
      console.log(`   - Nome: ${team.displayName}`)
      console.log(`   - Abreviação: ${team.abbreviation}`)
      console.log(`   - Logo: ${team.logos?.[0]?.href || 'N/A'}`)
      
      // Teste 3: Buscar roster
      console.log(`\n3️⃣ Buscando roster do time (ID: ${firstTeamId})...`)
      
      const roster = await client.getTeamRoster(firstTeamId)
      console.log('✅ Roster encontrado!')
      console.log(`   - Time ID: ${roster.id}`)
      
      if (roster.athletes?.items) {
        console.log(`   - ${roster.athletes.items.length} jogadores no roster`)
        
        // Mostra os primeiros 5 jogadores
        const firstFivePlayers = roster.athletes.items.slice(0, 5)
        if (firstFivePlayers.length > 0) {
          console.log('\n   Primeiros 5 jogadores:')
          firstFivePlayers.forEach((player, index) => {
            console.log(`   ${index + 1}. #${player.jersey || 'N/A'} ${player.displayName} (${player.position?.abbreviation || 'N/A'}) - ID: ${player.id}`)
          })
        }

        // Teste 4: Buscar estatísticas de um jogador
        if (roster.athletes.items.length > 0) {
          const firstPlayerId = roster.athletes.items[0].id
          console.log(`\n4️⃣ Buscando estatísticas do jogador (ID: ${firstPlayerId})...`)
          
          try {
            const stats = await client.getPlayerStatistics(firstPlayerId)
            console.log('✅ Estatísticas encontradas!')
            console.log(`   - Jogador: ${stats.displayName}`)
            
            if (stats.splits && stats.splits.length > 0) {
              console.log(`   - ${stats.splits.length} split(s) de estatísticas`)
              
              // Mostra primeira categoria de stats
              const firstSplit = stats.splits[0]
              if (firstSplit.categories && firstSplit.categories.length > 0) {
                const firstCategory = firstSplit.categories[0]
                console.log(`   - Categoria: ${firstCategory.displayName}`)
                console.log(`   - ${firstCategory.stats.length} estatísticas`)
                
                // Mostra as primeiras 5 estatísticas
                const firstFiveStats = firstCategory.stats.slice(0, 5)
                console.log('\n   Primeiras estatísticas:')
                firstFiveStats.forEach((stat, index) => {
                  console.log(`   ${index + 1}. ${stat.displayName}: ${stat.displayValue}`)
                })
              }
            } else {
              console.log('   - Nenhuma estatística disponível no momento')
            }
          } catch (error) {
            console.log('⚠️  Erro ao buscar estatísticas:', error instanceof Error ? error.message : error)
          }
        }
      } else {
        console.log('   - Nenhum jogador encontrado no roster (pode depender da temporada)')
      }
    }

    console.log('\n✅ Todos os testes concluídos com sucesso!')
  } catch (error) {
    console.error('\n❌ Erro ao testar ESPN API:', error)
    if (error instanceof Error) {
      console.error('   Mensagem:', error.message)
      console.error('   Stack:', error.stack)
    }
    process.exit(1)
  }
}

// Executa o teste
testEspnApi()
