"use strict"

// Initialisation scores
let playerCount = parseInt(localStorage.getItem('playerCountSave'));
let computerCount = parseInt(localStorage.getItem('computerCountSave'));

if(isNaN(playerCount)){
    playerCount = 0;
}

if(isNaN(computerCount)){
    computerCount = 0;
}

// Affichage scores
let playerScore = document.getElementById('playerScore');
let computerScore = document.getElementById('computerScore');

function showScores(playerCount,computerCount){
    playerScore.innerHTML = `Score = ${playerCount}`;
    computerScore.innerHTML = `Score = ${computerCount}`;
}

showScores(playerCount,computerCount);

// Affichage morpion
let screen;
let table;

function drawMorpion(){
    screen = document.getElementById('screen');
    table = document.createElement('table');
    table.id = 'morpionTable';
    screen.appendChild(table);

    for(let j=1; j<6; j++){
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for(let i=1; i<6; i++){
            let td = document.createElement('td');
            td.width = '90px';
            td.height = '90px';
            td.style.border = '2px solid black';
            td.id = `${j}${i}`;
            td.title = `${j}${i}`;
            td.style.textAlign = 'center';
            tr.appendChild(td);
        }
    }
}

drawMorpion();
playGame();

// Initialisation des contrôles
let playedCase, indexCase, tabCase;
let tabPlayer, tabComputer;
let playerSol, computerSol;

function initControls(){
    // Contôle des cases restant à jouer
    tabCase = ['11','12','13','14','15','21','22','23','24','25','31','32','33','34','35','41','42','43','44','45','51','52','53','54','55'];
    // tableau coups joués par player
    tabPlayer = [];
    // tableau coups joués par computer
    tabComputer = [];
    // Solutions pour gagner la partie (player)
    playerSol = [
        [11,12,13,14,15],
        [21,22,23,24,25],
        [31,32,33,34,35],
        [41,42,43,44,45],
        [51,52,53,54,55],
        [11,21,31,41,51],
        [12,22,32,42,52],
        [13,23,33,43,53],
        [14,24,34,44,54],
        [15,25,35,45,55],
        [11,22,33,44,55],
        [15,24,33,42,51],
    ];
    // Solutions pour gagner la partie (computer)
    computerSol = [
        [11,12,13,14,15],
        [21,22,23,24,25],
        [31,32,33,34,35],
        [41,42,43,44,45],
        [51,52,53,54,55],
        [11,21,31,41,51],
        [12,22,32,42,52],
        [13,23,33,43,53],
        [14,24,34,44,54],
        [15,25,35,45,55],
        [11,22,33,44,55],
        [15,24,33,42,51],
    ];
}

initControls();

// Contrôle si partie gagné par player
function checkPlayerWin(playedCase){
    for(let i=0; i<12; i++){
        let indexCheck = playerSol[i].indexOf(playedCase);
        if(indexCheck !== -1){
            playerSol[i].splice(indexCheck,1);
        }
        if(playerSol[i].length === 0){
            window.alert('Player win !');
            playerCount += 1;
            localStorage.setItem('playerCountSave',playerCount);
        }
    }
}

// Contrôle si partie gagné par computer
function checkComputerWin(playedCase){
    for(let i=0; i<12; i++){
        let indexCheck = computerSol[i].indexOf(playedCase);
        if(indexCheck !== -1){
            computerSol[i].splice(indexCheck,1);
        }
        if(computerSol[i].length === 0){
            window.alert('Computer win !');
            computerCount += 1;
            localStorage.setItem('computerCountSave',computerCount);
        }
    }
}

// MaJ tableau coups joués par player
function tabPlayerAdd(playedCase){
    tabPlayer.push(playedCase);   
}

// MaJ tableau coups joués par computer
function tabComputerAdd(playedCase){
    tabComputer.push(playedCase);   
}

// Dessin de la croix
function drawCroix(playedCase){
    let posCroix = document.getElementById(`${playedCase}`);
    let imgCroix = document.createElement('img');
    imgCroix.src = 'img/croix.png';
    imgCroix.style.width = '70px';
    posCroix.appendChild(imgCroix);
}

//
// Détermination coup joué par computer
//

let min;
let max;
let cy;
let cx;

// Random
function randomCy(){
    min = Math.ceil(1);
    max = Math.floor(5);
    cy = Math.floor(Math.random() * (max - min + 1)) + min;
    return cy
}

function randomCx(){
    min = Math.ceil(1);
    max = Math.floor(5);
    cx = Math.floor(Math.random() * (max - min + 1)) + min;
    return cx
}

// validation choix du computer
function validComputer(){
    do{
        randomCy();
        randomCx();

        playedCase = parseInt(`${cy}${cx}`);
        indexCase = tabCase.indexOf(`${playedCase}`);
        // vérif case pas déjà jouée
        if(indexCase !== -1){
            // suppréssion de la case jouée des cases jouables
            tabCase.splice(indexCase,1);
            break;
        }   
    } while(playedCase > 0);
    
}

// Dessin du cercle
function drawCercle(playedCase){
    let posCercle = document.getElementById(`${playedCase}`);
    let imgCercle = document.createElement('img');
    imgCercle.src = 'img/cercle.png';
    imgCercle.style.width = '70px';
    posCercle.appendChild(imgCercle);
}

// Bouton refresh
// remise à zéro > nouvelle partie
//
document.getElementById('refresh').addEventListener('click', () => {
    document.getElementById('screen').removeChild(table);
    initControls();
    drawMorpion();
    playGame();

});

// GAME
// Choix d'une case(py,px) par player + choix d'une case(cy,cx) par computer
//
function playGame(){
    // Récupération des scores
    localStorage.getItem(playerCount,computerCount);
    for(let py=1; py<6; py++){
        for(let px=1; px<6; px++){
            // c'est au tour du player > choix d'une case
            document.getElementById(`${py}${px}`).addEventListener('click', () => {
            // récupération numéro case jouée
            playedCase = parseInt(`${py}${px}`);
            indexCase = tabCase.indexOf(`${playedCase}`);
            // vérif case pas déjà jouée
            if(indexCase !== -1){
                // suppréssion de la case jouée des cases jouables
                tabCase.splice(indexCase,1);
                // dessin croix > choix player validé
                tabPlayerAdd(playedCase);
                drawCroix(playedCase);
                // Check si player gagne
                checkPlayerWin(playedCase);
                
                if(tabCase.length > 1){
                    // c'est au tour du computer
                    validComputer();
                    // dessin cercle > choix computer validé
                    tabComputerAdd(playedCase);
                    drawCercle(playedCase);
                    // Check si computer gagne
                    checkComputerWin(playedCase);
                    
                } else {
                    // Personne ne gagne > Fin de partie
                    window.alert('Partie terminée');
                }
                
            }
            // Mise à jour scores
            showScores(playerCount,computerCount);    
            });
        }
    }
}