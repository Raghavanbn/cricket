import chalk from 'chalk';

console.log(chalk.blue('Hi - Welcome to typescript'));

enum DismissalType {
    BOWLED = "BOWLED",
    RUNOUT = "RUNOUT",
    LBW = "LBW",
    CAUGHT = "CAUGHT",
    NOTOUT = "NOTOUT"
    
}

interface DismissalInfo {
    fielderName : string;
    hasBatsmanCrossed : boolean;
    batsmanOut : 'striker' | 'non-striker';
}

interface BallInfo { // defining a structure
    runsScored : number;
    isOut : boolean;  
    dismissalType : DismissalType;
    dismissalInfo? : DismissalInfo; // ? - optional values
    batsmanName : string;
    bowlerName : string;
    totalBallsFaced : number;
    madeInOvers : number,
    totalOvers : number,
    runsGiven : number,
    wicketsTaken : number
    
}

type Team = { // Entity - holding values
    totalRuns : number;
    totalWicketsLost : number;
    totalBallsFaced : number;
    players : Array<Player>;
    totalOvers : number;
}

type Player = {
    runsScored : number;
    totalBallsFaced : number;
    dismissalInfo : DismissalInfo;
    wicketsTaken : number;
    runsGiven : number;
    totalOvers : number;
    madeInOvers : number;
    dismissalType : DismissalType;
    isOut : boolean;
    batsmanName : string;
    bowlerName : string;
}

const teamObj: Team = {
    totalRuns : 0,
    totalWicketsLost : 0,
    totalBallsFaced : 0,
    players:[],
    totalOvers : 0
}


const inputArray : Array<BallInfo> = require('./data.json');

const initDismissalInfo = (options?: Partial<DismissalInfo>) : DismissalInfo => {
    const defaults : DismissalInfo = {
        fielderName : '' ,
        hasBatsmanCrossed : false,
       batsmanOut : 'striker' ,
    };

   return {
    ...defaults,
    ...options,
   }; 
}

inputArray.forEach(ball => { 

    const d1: DismissalInfo = initDismissalInfo({ 
        fielderName: ball.dismissalInfo?.fielderName, 
        hasBatsmanCrossed: ball.dismissalInfo?.hasBatsmanCrossed,
        batsmanOut:ball.dismissalInfo?.batsmanOut
     });
    
    const  player: Player = {
        runsScored : ball.runsScored,
        totalBallsFaced : ball.totalBallsFaced,
        dismissalInfo : d1 ,
        wicketsTaken : ball.wicketsTaken,
        runsGiven : ball.runsGiven,
        totalOvers : ball.totalOvers,
        madeInOvers : ball.madeInOvers,
        dismissalType : DismissalType[ball.dismissalType],
        isOut : ball.isOut,
        batsmanName : ball.batsmanName,
        bowlerName : ball.bowlerName,
    }
    teamObj.players.push(player);
})

const updatedTeam = inputArray.reduce((acc, ball) => {

    return {
        totalRuns : acc.totalRuns + ball.runsScored,
        totalWicketsLost : acc.totalWicketsLost + (ball.isOut ? 1 : 0),
        totalBallsFaced : acc.totalBallsFaced + ball.totalBallsFaced,
        players : acc.players,
        totalOvers : (acc.totalBallsFaced + ball.totalBallsFaced) / 6
        
    }
}, teamObj)

console.log('Team India ' , updatedTeam);


const printScoreCard = () => {
    console.log(chalk.blue('India'), 'Vs', chalk.red('England'));
    console.log("\n");
    updatedTeam.players.forEach(player => {
        let batsman = '';
    if(player.dismissalType == DismissalType.CAUGHT){
        if(player.dismissalInfo.fielderName == player.bowlerName){
            batsman = player.batsmanName + '   c & b ' + player.bowlerName +'    '+ player.runsScored 
            + ' (' + player.totalBallsFaced + ')';
        } 
        else {
            batsman = player.batsmanName + '   c ' + player.dismissalInfo.fielderName+' b '+player.bowlerName  +'    '+ player.runsScored 
        + ' (' + player.totalBallsFaced + ')';
        }        
    } 
    else if(player.dismissalType == DismissalType.NOTOUT){
        batsman = chalk.green(player.batsmanName) + '   Not Out'  +'    '+ player.runsScored 
        + ' (' + player.totalBallsFaced + ')';
    }
     
    else {
        batsman = player.batsmanName + '   ' + player.dismissalType +'    '+ player.runsScored 
        + ' (' + player.totalBallsFaced + ')';
    }
    
    console.log(batsman);

});
    console.log("\n");
    console.log('Total','   ',updatedTeam.totalRuns,' for',chalk.red(updatedTeam.totalWicketsLost),' in',updatedTeam.totalOvers,' overs');
    console.log('Bowler','  O   M   R   W');
    console.log("\n");
    updatedTeam.players.forEach(player => {
        const bowler = player.bowlerName + '   ' + player.totalOvers  +'    '+ player.madeInOvers 
            +'  '+ player.runsGiven + '  ' +player.wicketsTaken;
        console.log(bowler);

});
}

printScoreCard();

