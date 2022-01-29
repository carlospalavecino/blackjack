const blackJack = (() => {
    'use strict'

    // XC > Clubs (trebol)
    // XD > Diaminds (diamantes)
    // XH > heart (corazones)
    // XS > spades (pica)

    let deck            = [];
    const tipos         = ['C','D','H','S'],
          especiales    = ['A','J','Q','K'];

    let puntosJugadores = [];
    // Referencias HTML
    const btnPedir = document.querySelector('#btnPedir'),
    btnDetener = document.querySelector('#btnDetener'),
    btnJuegoNuevo = document.querySelector('#btnNuevo');
    
    const puntosHTML = document.querySelectorAll('small'),
    divCartas = document.querySelectorAll('.divCartas');
    
    const inicializar = (nJugadores = 2) => {
        
        deck = crearDeck();
        puntosJugadores = [];
        for( let i = 0; i < nJugadores; i++ ) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( e => e.innerText = 0 );
        divCartas.forEach( d => d.innerHTML = '' );
        
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }
    
    // Crear baraja
    const crearDeck = () => {
        
        deck = [];

        // navegar tipos
        for ( let tipo of tipos ) {
            for ( let i=2; i<=10; i++ ) // agrega cartas numericas
                deck.push( i + tipo );
            for ( let especial of especiales ) // agrega cartas especiales
                deck.push( especial + tipo );
        }

        return _.shuffle(deck); // barajar;

    }

    // tomar carta
    const pedirCarta = () => {
        
        if ( deck.length === 0 ) {
            throw 'No hay mas cartas';        
        }

        // extrae de la baraja y define la ultima carta
        return deck.pop(); // devuelve la carta

    }

    const valorCarta = ( carta ) => {

        const valor = carta.substring(0, carta.length -1);

        return ( isNaN( valor ) )
            ? ( valor === 'A' ) ? 11 : 10
            : Number.parseInt( valor );
        
    }

    // Turno 0 es primer jugador, ultimo computadora
    const acumularPuntos = ( carta, turno ) => {
        
        // acumulador de puntos
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];

    }

    const crearCarta = (carta, turno) => {

        // cargar la carta
        const imgCarta = document.createElement('img');
        imgCarta.classList.add('carta'); // estilo
        imgCarta.src = `assets/cartas/${ carta }.png`; // png src
        divCartas[turno].append( imgCarta ); // insertar carta
            
    }

    const determinarGanador = () => {

        const [puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos )
                alert( "Empate" );
            else if ( puntosComputadora > 21 && puntosMinimos <= 21 )
                alert( "Ganaste!" );
            else 
                alert( "perdiste" );
        }, 100);
    }

    // Turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {

        let puntosComputadora = 0;
        do {
            
            // pedir carta
            const carta = pedirCarta();
            // console.log(carta);
            
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1 );
            
            crearCarta(carta, puntosJugadores.length -1 );

        } while ( puntosComputadora < puntosMinimos && puntosMinimos <= 21 );
        determinarGanador();

    }

    // Eventos
    btnPedir.addEventListener('click', () => {
        
        // pedir carta
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );
        
        crearCarta( carta, 0 );

        if ( puntosJugador > 21 ) {
            console.warn( 'Perdiste' );
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        } else if ( puntosJugador === 21 ) {
            console.warn( '21, Genial!' );
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }

    } );

    btnDetener.addEventListener( 'click', () => {
        
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora( puntosJugadores[0] );

    });

    btnJuegoNuevo.addEventListener( 'click', () => {
        
        inicializar();
        
    });

    return {
        nuevoJuego: inicializar
    }

})();