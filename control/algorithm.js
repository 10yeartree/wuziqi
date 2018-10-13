ie4 = (navigator.appName.indexOf("Microsoft") != -1 && parseInt(navigator.appVersion) > 3) ? true: false;
ie3 = (navigator.appName.indexOf("Microsoft") != -1 && parseInt(navigator.appVersion) < 4) ? true: false;

boardSize = 15;
userSq = 1;
machSq = -1;
blinkSq = "b-1";
blinkHint = "b1";
myTurn = false;
winningMove = 9999999;
openFour = 8888888;
twoThrees = 7777777;

if (document.images) {
    uImg = new Image();
    uImg.src = 'images/s' + userSq + '.gif';
    mImg = new Image();
    mImg.src = 'images/s' + machSq + '.gif';
    uIm1 = new Image();
    uIm1.src = 'images/sb1.gif';
    mIm1 = new Image();
    mIm1.src = 'images/sb-1.gif';
    bImg = new Image();
    bImg.src = 'images/s0.gif';
}

f = new Array();
s = new Array();
q = new Array();

iMax = new Array();
jMax = new Array();
nMax = 0;

for (i = 0; i < 20; i++) {
    f[i] = new Array();
    s[i] = new Array();
    q[i] = new Array();
    for (j = 0; j < 20; j++) {
        f[i][j] = 0;
        s[i][j] = 0;
        q[i][j] = 0;
    }
}

iLastUserMove = 0;
jLastUserMove = 0;

function clk(iMove, jMove) {
    if (myTurn || autoplayOn) return;
    hideHint();

    if (f[iMove][jMove] != 0) {
        alert('这一格已经有棋子了！');
        return;
    }
    f[iMove][jMove] = userSq;
    drawSquare(iMove, jMove, userSq);
    myTurn = true;
    iLastUserMove = iMove;
    jLastUserMove = jMove;

    dly = (document.images) ? 10 : boardSize * 30;

    if (winningPos(iMove, jMove, userSq) == winningMove) {
        setTimeout('gameOver=1;alert("恭喜你，你赢了！")', dly);
    }
    else {
        setTimeout("machineMove(iLastUserMove,jLastUserMove);", dly);
    }
}

function getBestMachMove() {
    maxS = evaluatePos(s, userSq);
    maxQ = evaluatePos(q, machSq);

    if (maxQ >= maxS) {
        maxS = -1;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {
                if (q[i][j] == maxQ) {
                    if (s[i][j] > maxS) {
                        maxS = s[i][j];
                        nMax = 0
                    }
                    if (s[i][j] == maxS) {
                        iMax[nMax] = i;
                        jMax[nMax] = j;
                        nMax++
                    }
                }
            }
        }
    } else {
        maxQ = -1;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {
                if (s[i][j] == maxS) {
                    if (q[i][j] > maxQ) {
                        maxQ = q[i][j];
                        nMax = 0
                    }
                    if (q[i][j] == maxQ) {
                        iMax[nMax] = i;
                        jMax[nMax] = j;
                        nMax++
                    }
                }
            }
        }
    }

    randomK = Math.floor(nMax * Math.random());
    iMach = iMax[randomK];
    jMach = jMax[randomK];
}

function getBestUserMove() {
    maxQ = evaluatePos(q, machSq);
    maxS = evaluatePos(s, userSq);

    if (maxS == -1) {
        center = Math.floor(boardSize / 2);
        s[center][center] = 1;
        maxS = 1;
    }

    if (maxS >= maxQ) {
        maxQ = -1;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {
                if (s[i][j] == maxS) {
                    if (q[i][j] > maxQ) {
                        maxQ = q[i][j];
                        nMax = 0
                    }
                    if (q[i][j] == maxQ) {
                        iMax[nMax] = i;
                        jMax[nMax] = j;
                        nMax++
                    }
                }
            }
        }
    } else {
        maxS = -1;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {
                if (q[i][j] == maxQ) {
                    if (s[i][j] > maxS) {
                        maxS = s[i][j];
                        nMax = 0
                    }
                    if (s[i][j] == maxS) {
                        iMax[nMax] = i;
                        jMax[nMax] = j;
                        nMax++
                    }
                }
            }
        }
    }

    randomK = Math.floor(nMax * Math.random());
    iHint = iMax[randomK];
    jHint = jMax[randomK];
}

function machineMove(iUser, jUser) {
    getBestMachMove();
    f[iMach][jMach] = machSq;
    if (document.images) {
        drawSquare(iMach, jMach, blinkSq);
        setTimeout("drawSquare(iMach,jMach,machSq)", 900);
    } else {
        drawSquare(iMach, jMach, machSq);
    }

    if (winningPos(iMach, jMach, machSq) == winningMove) {
        setTimeout('gameOver=1;alert("你已经输了！");', 900);
    }
    else if (drawPos) {
        setTimeout('gameOver=1;alert("此局是平局！")', 900);
    }
    else {
        setTimeout("myTurn=false;", 950);
    }
}

function hasNeighbors(i, j) {
    if (j > 0 && f[i][j - 1] != 0) return 1;
    if (j + 1 < boardSize && f[i][j + 1] != 0) return 1;
    if (i > 0) {
        if (f[i - 1][j] != 0) return 1;
        if (j > 0 && f[i - 1][j - 1] != 0) return 1;
        if (j + 1 < boardSize && f[i - 1][j + 1] != 0) return 1;
    }
    if (i + 1 < boardSize) {
        if (f[i + 1][j] != 0) return 1;
        if (j > 0 && f[i + 1][j - 1] != 0) return 1;
        if (j + 1 < boardSize && f[i + 1][j + 1] != 0) return 1;
    }
    return 0;
}

w = new Array(0, 20, 17, 15.4, 14, 10);
nPos = new Array();
dirA = new Array();

function winningPos(i, j, mySq) {
    test3 = 0;
    test4 = 0;

    L = 1;
    m = 1;
    while (j + m < boardSize && f[i][j + m] == mySq) {
        L++;
        m++
    }
    m1 = m;
    m = 1;
    while (j - m >= 0 && f[i][j - m] == mySq) {
        L++;
        m++
    }
    m2 = m;
    if (L > 4) {
        return winningMove;
    }
    side1 = (j + m1 < boardSize && f[i][j + m1] == 0);
    side2 = (j - m2 >= 0 && f[i][j - m2] == 0);

    if (L == 4 && (side1 || side2)) test3++;
    if (side1 && side2) {
        if (L == 4) test4 = 1;
        if (L == 3) test3++;
    }

    L = 1;
    m = 1;
    while (i + m < boardSize && f[i + m][j] == mySq) {
        L++;
        m++
    }
    m1 = m;
    m = 1;
    while (i - m >= 0 && f[i - m][j] == mySq) {
        L++;
        m++
    }
    m2 = m;
    if (L > 4) {
        return winningMove;
    }
    side1 = (i + m1 < boardSize && f[i + m1][j] == 0);
    side2 = (i - m2 >= 0 && f[i - m2][j] == 0);
    if (L == 4 && (side1 || side2)) test3++;
    if (side1 && side2) {
        if (L == 4) test4 = 1;
        if (L == 3) test3++;
    }

    L = 1;
    m = 1;
    while (i + m < boardSize && j + m < boardSize && f[i + m][j + m] == mySq) {
        L++;
        m++
    }
    m1 = m;
    m = 1;
    while (i - m >= 0 && j - m >= 0 && f[i - m][j - m] == mySq) {
        L++;
        m++
    }
    m2 = m;
    if (L > 4) {
        return winningMove;
    }
    side1 = (i + m1 < boardSize && j + m1 < boardSize && f[i + m1][j + m1] == 0);
    side2 = (i - m2 >= 0 && j - m2 >= 0 && f[i - m2][j - m2] == 0);
    if (L == 4 && (side1 || side2)) test3++;
    if (side1 && side2) {
        if (L == 4) test4 = 1;
        if (L == 3) test3++;
    }

    L = 1;
    m = 1;
    while (i + m < boardSize && j - m >= 0 && f[i + m][j - m] == mySq) {
        L++;
        m++
    }
    m1 = m;
    m = 1;
    while (i - m >= 0 && j + m < boardSize && f[i - m][j + m] == mySq) {
        L++;
        m++
    }
    m2 = m;
    if (L > 4) {
        return winningMove;
    }
    side1 = (i + m1 < boardSize && j - m1 >= 0 && f[i + m1][j - m1] == 0);
    side2 = (i - m2 >= 0 && j + m2 < boardSize && f[i - m2][j + m2] == 0);
    if (L == 4 && (side1 || side2)) test3++;
    if (side1 && side2) {
        if (L == 4) test4 = 1;
        if (L == 3) test3++;
    }

    if (test4) return openFour;
    if (test3 >= 2) return twoThrees;
    return - 1;
}

function evaluatePos(a, mySq) {
    maxA = -1;
    drawPos = true;

    for (i = 0; i < boardSize; i++) {
        for (j = 0; j < boardSize; j++) {

            // Compute "value" a[i][j] of the (i,j) move
            if (f[i][j] != 0) {
                a[i][j] = -1;
                continue;
            }
            if (hasNeighbors(i, j) == 0) {
                a[i][j] = -1;
                continue;
            }

            wp = winningPos(i, j, mySq);
            if (wp > 0) a[i][j] = wp;
            else {
                minM = i - 4;
                if (minM < 0) minM = 0;
                minN = j - 4;
                if (minN < 0) minN = 0;
                maxM = i + 5;
                if (maxM > boardSize) maxM = boardSize;
                maxN = j + 5;
                if (maxN > boardSize) maxN = boardSize;

                nPos[1] = 1;
                A1 = 0;
                m = 1;
                while (j + m < maxN && f[i][j + m] != -mySq) {
                    nPos[1]++;
                    A1 += w[m] * f[i][j + m];
                    m++
                }
                if (j + m >= boardSize || f[i][j + m] == -mySq) A1 -= (f[i][j + m - 1] == mySq) ? (w[5] * mySq) : 0;
                m = 1;
                while (j - m >= minN && f[i][j - m] != -mySq) {
                    nPos[1]++;
                    A1 += w[m] * f[i][j - m];
                    m++
                }
                if (j - m < 0 || f[i][j - m] == -mySq) A1 -= (f[i][j - m + 1] == mySq) ? (w[5] * mySq) : 0;
                if (nPos[1] > 4) drawPos = false;

                nPos[2] = 1;
                A2 = 0;
                m = 1;
                while (i + m < maxM && f[i + m][j] != -mySq) {
                    nPos[2]++;
                    A2 += w[m] * f[i + m][j];
                    m++
                }
                if (i + m >= boardSize || f[i + m][j] == -mySq) A2 -= (f[i + m - 1][j] == mySq) ? (w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && f[i - m][j] != -mySq) {
                    nPos[2]++;
                    A2 += w[m] * f[i - m][j];
                    m++
                }
                if (i - m < 0 || f[i - m][j] == -mySq) A2 -= (f[i - m + 1][j] == mySq) ? (w[5] * mySq) : 0;
                if (nPos[2] > 4) drawPos = false;

                nPos[3] = 1;
                A3 = 0;
                m = 1;
                while (i + m < maxM && j + m < maxN && f[i + m][j + m] != -mySq) {
                    nPos[3]++;
                    A3 += w[m] * f[i + m][j + m];
                    m++
                }
                if (i + m >= boardSize || j + m >= boardSize || f[i + m][j + m] == -mySq) A3 -= (f[i + m - 1][j + m - 1] == mySq) ? (w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && j - m >= minN && f[i - m][j - m] != -mySq) {
                    nPos[3]++;
                    A3 += w[m] * f[i - m][j - m];
                    m++
                }
                if (i - m < 0 || j - m < 0 || f[i - m][j - m] == -mySq) A3 -= (f[i - m + 1][j - m + 1] == mySq) ? (w[5] * mySq) : 0;
                if (nPos[3] > 4) drawPos = false;

                nPos[4] = 1;
                A4 = 0;
                m = 1;
                while (i + m < maxM && j - m >= minN && f[i + m][j - m] != -mySq) {
                    nPos[4]++;
                    A4 += w[m] * f[i + m][j - m];
                    m++;
                }
                if (i + m >= boardSize || j - m < 0 || f[i + m][j - m] == -mySq) A4 -= (f[i + m - 1][j - m + 1] == mySq) ? (w[5] * mySq) : 0;
                m = 1;
                while (i - m >= minM && j + m < maxN && f[i - m][j + m] != -mySq) {
                    nPos[4]++;
                    A4 += w[m] * f[i - m][j + m];
                    m++;
                }
                if (i - m < 0 || j + m >= boardSize || f[i - m][j + m] == -mySq) A4 -= (f[i - m + 1][j + m - 1] == mySq) ? (w[5] * mySq) : 0;
                if (nPos[4] > 4) drawPos = false;

                dirA[1] = (nPos[1] > 4) ? A1 * A1: 0;
                dirA[2] = (nPos[2] > 4) ? A2 * A2: 0;
                dirA[3] = (nPos[3] > 4) ? A3 * A3: 0;
                dirA[4] = (nPos[4] > 4) ? A4 * A4: 0;

                A1 = 0;
                A2 = 0;
                for (k = 1; k < 5; k++) {
                    if (dirA[k] >= A1) {
                        A2 = A1;
                        A1 = dirA[k]
                    }
                }
                a[i][j] = A1 + A2;
            }
            if (a[i][j] > maxA) {
                maxA = a[i][j];
            }
        }
    }
    return maxA;
}

function drawSquare(par1, par2, par3) {
    if (document.images) {
        eval('document.s' + par1 + '_' + par2 + '.src="images/s' + par3 + '.gif"');
    } else {
        setTimeout("writeBoard()", 50);
    }
}

hintShown = false;
iHint = jHint = 6;

function showHint() {
    if (myTurn && autoplayOn) return;
    if (hintShown) {
        hideHint();
        return;
    }
    hintShown = 1;
    getBestUserMove();

    if (document.images) {
        drawSquare(iHint, jHint, blinkHint);
    }
}

function hideHint() {
    hintShown = 0;
    drawSquare(iHint, jHint, f[iHint][jHint]);
}

function autoplay() {
    if (autoplayOn) {
        if (myTurn) {
            getBestMachMove();
            f[iMach][jMach] = machSq;
            drawSquare(iMach, jMach, blinkSq);
            timerDR = setTimeout("drawSquare(iMach,jMach,machSq);", 900);
            if (winningPos(iMach, jMach, machSq) == winningMove) {
                setTimeout('gameOver=1;alert("白棋获胜！黑棋负！")', 900);
            } else if (drawPos) {
                setTimeout('alert("此局是平局！")', 900);
            } else {
                myTurn = false;
                timerAP = setTimeout("autoplay()", 950);
            }
        } else {
            getBestUserMove();
            f[iHint][jHint] = userSq;
            drawSquare(iHint, jHint, blinkHint);
            timerDR = setTimeout("drawSquare(iHint,jHint,userSq)", 900);
            if (winningPos(iHint, jHint, userSq) == winningMove) {
                setTimeout('gameOver=1;alert("黑棋获胜！白棋负！")', 900);
            } else {
                myTurn = true;
                timerAP = setTimeout("autoplay()", 950);
            }
        }
    }
}

autoplayOn = 0;
timerAP = 0;
function setAutoplay() {
    if (gameOver) resetGame();
    if (autoplayOn) {
        if (myTurn) {
            setTimeout("setAutoplay()", 950);
            return;
        }
        autoplayOn = 0;
        clearTimeout(timerAP);
        return;
    }
    if (document.images) {
        setTimeout("hideHint();autoplayOn=1;autoplay();", 100);
    } else {
        alert('Sorry, Autoplay Mode is not supported for your browser!');
    }
}

buf = '';

function writeBoard() {
    container = document.getElementById("workspace");
    bufStr = "";
    for (i = 0; i < boardSize; i++) {
        for (j = 0; j < boardSize; j++) {
            bufStr += "<a href='#s' onClick='clk(" + i + ',' + j + ");if(top.ie4)this.blur();return false;'>"
            bufStr += "<img name='s" + i + '_' + j + "' src='images/s" + f[i][j] + ".gif'" + ">"
            bufStr += "</a>"
        }
    }
    //alert(bufStr)
    container.innerHTML = bufStr;
}

function resetGame() {
    if (autoplayOn) {
        autoplayOn = 0;
        clearTimeout(timerAP);
        clearTimeout(timerDR);
    }
    drawPos = 0;
    myTurn = 0;
    autoplayOn = 0;
    gameOver = 0;

    for (i = 0; i < 20; i++) {
        for (j = 0; j < 20; j++) {
            f[i][j] = 0;
        }
    }

    if (!document) return;
    if (document.images) {
        if (!document.s9_9) return;
        for (i = 0; i < boardSize; i++) {
            for (j = 0; j < boardSize; j++) {
                eval('document.s' + i + '_' + j + '.src=bImg.src');
            }
        }
    } else writeBoard();
}

function init() {
    if (autoplayOn) {
        autoplayOn = 0;
        clearTimeout(timerAP);
        clearTimeout(timerDR);
    }
    writeBoard();
    resetGame();
}