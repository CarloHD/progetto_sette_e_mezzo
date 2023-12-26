# Incipit progetto

Realizzazione del classico gioco del 7 e mezzo

## Regole di base

- mazzo composto da 40 carte
  
  - 10 carte per 4 semi

    - per ogni seme 7 carte di valore da uno a sette

    - per ogni seme 3 carte di valore mezzo

  - una carta di un singolo seme di valore mezzo avrà valore variabile compreso tra 0.5 a 7, prendendo il valore più alto possibile senza superare il valore massimo 7.5 , 0 avendo il valore minimo di 0.5

- punteggio massimo per vincere è 7.5 (sette e mezzo)

- ogni giocatore (compreso il mazziere) comincia con una carta

- ogni giocatore (compreso il mazziere) può scegliere se pescare una carta per avvicinarsi il più possibile al valore massimo, o terminare il suo turno con il valore totale in mano

- i giocatori (compreso il mazziere) giocano a carte coperte

- tra il giocatore ed il mazziere vince chi ha il valore più vicino a 7.5

- chi supera il valore 7.5 con le carte in mano perde


## Logica progetto

Si parte avviando la sessione tramite la funzione `play()`

Questa funzione darà vita all'istanza dell'oggetto `Sessione` il quale chiede
il nome del giocatore; l'oggetto `Sessione` creerà le istanze `Mazzo` e
due istanze di `Giocatore`, una delle quali ha la proprietà `isMazziere` su vero.

Avviata la sessione inizierà il turno dove al Mazziere ed al Giocatore verrà
assegnata la prima carta

Il primo turno ad essere giocato è quello del giocatore in cui potrà scegliere
se pescare una carta con il metodo `aggiungiCartaAllaMano()` o se passare il turno
con il metodo `passaTurno()`.

Nel turno del Mazziere se viene passato il turno
la sessione viene completata e viene sancito il vincitore.
Se uno dei due giocatori supera il limite massimo viene sancito il vincitore.