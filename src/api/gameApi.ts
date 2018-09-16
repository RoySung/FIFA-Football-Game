import { ScoreData } from '@/types'
class GameApi implements ScoreData {
  public playerName: string
  public score: number
  constructor(playerName: string = '') {
    this.playerName = playerName
    this.score = 0
  }

  public setPlayerName(playerName: string) {
    this.playerName = playerName
  }

  public setScore(score: number) {
    return new Promise((resolve, reject) => {
      this.score = score

      const body = {
        playerName: this.playerName,
        score,
      }
      fetch('https://fifa-football-game.firebaseio.com/scores.json', {
        body: JSON.stringify(body),
        method: 'POST',
      })
      .then(res => resolve(res))
      .catch(e => reject(e))
    })
  }

  public getScores(limitToLast = 10): Promise<ScoreData[]> {
    return new Promise((resolve, reject) => {
      const url = new URL('https://fifa-football-game.firebaseio.com/scores.json')
      url.searchParams.set('orderBy', '"score"')
      url.searchParams.set('limitToLast', limitToLast.toString())
      fetch(url.href, {
        method: 'GET',
      })
      .then(res => res.json())
      .then(result => {
        const arr: ScoreData[] = Object.keys(result).reduce((acc: ScoreData[], key) => {
          const obj: ScoreData = result[key]
          acc.push(obj)
          return acc
        }, []).sort((a: ScoreData, b: ScoreData): number => b.score - a.score)
        resolve(arr)
      })
      .catch(e => reject(e))
    })
  }

}

export default GameApi
