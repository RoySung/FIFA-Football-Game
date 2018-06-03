interface Score {
  playerName: string
  score: number
}

class GameApi implements Score {
  public playerName: string
  public score: number
  constructor(playerName: string) {
    this.playerName = playerName
    this.score = 0
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

  public getScores(limitToLast = 10) {
    return new Promise((resolve, reject) => {
      const url = new URL('https://fifa-football-game.firebaseio.com/scores.json')
      url.searchParams.set('orderBy', '"score"')
      url.searchParams.set('limitToLast', limitToLast.toString())
      fetch(url.href, {
        method: 'GET',
      })
        .then(res => resolve(res.json()))
        .catch(e => reject(e))
    })
  }
}

export default GameApi
