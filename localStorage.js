/**
Il localStorage è come una "scatola" dentro il nostro browser 
Questa scatola può conservare informazioni anche dopo che chiudiamo la pagina 

Ogni sito ha a disposizione 5MB di spazio
(quindi, se un sito supera il limite devo liberare spazio per salvare ancora)

Ogni volta che mettiamo qualcosa nel localStorage
assegnamo la chiave (nome) ed il contenuto (valore)

*/

// SALVARE QUALCOSA
localStorage.setItem("chiave", "valore");

// RECUPERARE QUALCOSA
const valore = localStorage.getItem("chiave");

/*
Possiamo salvare SOLO ED ESCLUSIVAMENTE delle STRINGHE

Se vogliamo salvare una lista, 
dobbiamo trasformarla in stringa
tramite JSON.stringify().

Quando andiamo a rirprendere la lista, 
usiamo JSON.parse() per riconvertirla in 
array o oggetto.
*/
