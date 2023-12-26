// funzione per mischiare array
function shuffle (array: Carta[]) {
  for (let i = 200; i > 0; i--) {
    let j = Math.floor(Math.random() * (40 - 0) + 0)
    let x = Math.floor(Math.random() * (40 - 0) + 0)
    let temp = array[x]
    array[x] = array[j]
    array[j] = temp
  }

  return array

  // let currentIndex = array.length,
  //   randomIndex

  // // While there remain elements to shuffle.
  // while (currentIndex > 0) {
  //   // Pick a remaining element.
  //   randomIndex = Math.floor(Math.random() * currentIndex)
  //   currentIndex--

  //   // And swap it with the current element.
  //   ;[array[currentIndex], array[randomIndex]] = [
  //     array[randomIndex],
  //     array[currentIndex]
  //   ]
  // }

  // return array
}

let sessione: Sessione | undefined

class Carta {
  constructor (
    protected _valore: number,
    public seme?: 'bastoni' | 'coppe' | 'spade' | 'denari',
    public figura?: 'donna' | 'cavallo' | 're'
  ) {}

  cartaMatta = this.figura === 're' && this.seme === 'denari'

  public set valore (carteInManoGiocatore: Carta[]) {
    if (this.cartaMatta) {
      let valoriPossibili = [0.5, 1, 2, 3, 4, 5, 6, 7]
      const valoreTotaleInMano = carteInManoGiocatore.reduce((acc, carta) => {
        if (!carta.cartaMatta) {
          return acc + carta.valore
        } else {
          return acc
        }
      }, 0)
      valoriPossibili = valoriPossibili.filter(valore => {
        if (valoreTotaleInMano === 0.5) {
          return valore === 7
        } else {
          return valore + valoreTotaleInMano < 7.5
        }
      })
      this._valore = Math.max(...valoriPossibili)
    }
  }

  public get valore (): number {
    return this._valore
  }
}

class Mazzo {
  numeroDiCarte: number = 40
  listaCarte: Carta[] = new Array(this.numeroDiCarte)
    .fill(new Carta(1), 0, 4)
    .fill(new Carta(2), 4, 8)
    .fill(new Carta(3), 8, 12)
    .fill(new Carta(4), 12, 16)
    .fill(new Carta(5), 16, 20)
    .fill(new Carta(6), 20, 24)
    .fill(new Carta(7), 24, 28)
    .fill(new Carta(0.5), 28, 32)
    .fill(new Carta(0.5), 32, 36)
    .fill(new Carta(0.5), 36, 39)
    .fill(new Carta(0.5), 39, 40)
    .map((carta, index) => {
      // imposto il seme
      switch (index) {
        case 0:
        case 4:
        case 8:
        case 12:
        case 16:
        case 20:
        case 24:
        case 28:
        case 32:
        case 36:
          carta = new Carta(carta._valore, 'bastoni')
          break
        case 1:
        case 5:
        case 9:
        case 13:
        case 17:
        case 21:
        case 25:
        case 29:
        case 33:
        case 37:
          carta = new Carta(carta._valore, 'coppe')
          break
        case 2:
        case 6:
        case 10:
        case 14:
        case 18:
        case 22:
        case 26:
        case 30:
        case 34:
        case 38:
          carta = new Carta(carta._valore, 'spade')
          break
        case 3:
        case 7:
        case 11:
        case 15:
        case 19:
        case 23:
        case 27:
        case 31:
        case 35:
        case 39:
          carta = new Carta(carta._valore, 'denari')
          break
      }
      // inposto le figure
      switch (index) {
        case 28:
        case 29:
        case 30:
        case 31:
          carta = new Carta(carta._valore, carta.seme, 'donna')
          break
        case 32:
        case 33:
        case 34:
        case 35:
          carta = new Carta(carta._valore, carta.seme, 'cavallo')
          break
        case 36:
        case 37:
        case 38:
        case 39:
          carta = new Carta(carta._valore, carta.seme, 're')
          break
      }
      return carta
    })

  mazzoMischiato: Carta[] = shuffle([...this.listaCarte])

  pesca () {
    if (this.numeroDiCarte > 0) {
      this.numeroDiCarte--
      return this.mazzoMischiato.shift()
    } else {
      throw new Error('mazzo finito!')
    }
  }
}

class Giocatore {
  constructor (
    public nome: string,
    private sessione: Sessione,
    private isMazziere: boolean
  ) {}

  inTurno = false

  listaCarteInMano: Carta[] = []
  protected _valoreInMano: number = 0

  public set valoreInMano (listaCarteInMano: Carta[]) {
    this._valoreInMano = listaCarteInMano.reduce((acc, carta) => {
      if (carta.cartaMatta) {
        carta.valore = listaCarteInMano
      }
      return acc + carta.valore
    }, 0)
  }

  public get valoreInMano (): number {
    return this._valoreInMano
  }

  calcolaValoreInMano () {
    this.valoreInMano = this.listaCarteInMano
  }

  aggiungiCartaAllaMano (inizio?: boolean) {
    if (this.inTurno || inizio) {
      const cartaPescata = this.sessione.mazzo.pesca()
      if (cartaPescata) {
        this.listaCarteInMano.push(cartaPescata)
        this.calcolaValoreInMano()

        if (this.valoreInMano > 7.5) {
          console.error('hai sballato!')
          this.sessione.calcolaVincitore()
        }
      }
    }
  }

  inizioTurno () {
    this.inTurno = true
    console.log(`È il turno di ${this.nome}`)
  }

  passaTurno () {
    this.inTurno = false

    if (!this.isMazziere) {
      this.sessione.giocatori[1].inizioTurno()
    }

    if (this.isMazziere) {
      this.sessione.calcolaVincitore()
    }
  }
}

class Sessione {
  constructor (public mazzo: Mazzo, nomeGiocatore: string) {
    this.giocatori.push(new Giocatore(nomeGiocatore, this, false))
    this.giocatori.push(new Giocatore('Mazziere', this, true))
    this.giocatori.forEach(giocatore => giocatore.aggiungiCartaAllaMano(true))
  }

  giocatori: Giocatore[] = []
  totMazziere: number = 0
  totGiocatore: number = 0

  calcolaVincitore () {
    this.totMazziere = this.giocatori[this.giocatori.length - 1].valoreInMano
    this.totGiocatore = this.giocatori[0].valoreInMano
    let risultato
    if (this.totGiocatore > 7.5) {
      risultato = 'Ha vinto il Mazziere'
    } else if (this.totMazziere > 7.5) {
      risultato = 'Ha vinto il Giocatore'
    } else if (this.totMazziere === this.totGiocatore) {
      risultato = 'Pareggio! Ha vinto il Mazziere'
    } else if (this.totMazziere > this.totGiocatore) {
      risultato = 'Ha vinto il Mazziere'
    } else {
      risultato = 'Ha vinto il Giocatore'
    }

    console.log(risultato)
    sessione = undefined
  }
}

function play () {
  const nomeGiocatore = window.prompt(`Qual'è il tuo nome?`)

  if (nomeGiocatore) {
    sessione = new Sessione(new Mazzo(), nomeGiocatore)
    sessione.giocatori[0].inizioTurno()
  } else {
    window.alert('Non puoi avviare una partita senza inserire il tuo nome!')
  }
}

/*
avvia partita

  aspetta risultato giocatore 1
  aspetta risultato giocatore 2

    controlla chi ha vinto

      fine partita



*/
