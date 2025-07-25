/**
 * Created by hc on 2016/10/21.
 */
var score = 0;
var ID = null;
var idparent = null;
var click1 = null;
var click2 = null;
var moveturn = "white";
var colorarray = [];
var attackarray = [];
var pentaclearray = [];
var mynum = 0;
var enemynum = 0;
var obsnum = 0;
var movecount = 0;
var stage = 1;
var eat = null;
var eated = false;
var pawnrate = 1;
var bishoprate = 0;
var knightrate = 0;
var rookrate = 0;
var queenrate = 0;
var whitepentacle = false;
var blackpentacle = false;
var pentacleid;
var moveleft;

$(document).ready(function () {
    prepareForMobile();
    init();
});

function prepareForMobile() {
    if (documentWidth > 525) {
        gridWidth = 525;
        cellWidth = 60;
        cellMargain = 5;
    } else {
        $("#newgamebutton").hover(function () {
            $("#newgamebutton").css("background-color", "#8f7a66");
        }, function () {
            $("#newgamebutton").css("background-color", "#8f7a66");
        });
    }


    $("#grid-container").css("width", gridWidth - 2 * cellMargain);
    $("#grid-container").css("height", gridWidth - 2 * cellMargain);
    $("#grid-container").css("padding", cellMargain);
    $("#grid-container").css("border-radius", 0.02 * gridWidth);

    $(".grid-cell-e").css("width", cellWidth);
    $(".grid-cell-e").css("height", cellWidth);
    $(".grid-cell-e").css("border-radius", 0.02 * gridWidth);

    $(".grid-cell-o").css("width", cellWidth);
    $(".grid-cell-o").css("height", cellWidth);
    $(".grid-cell-o").css("border-radius", 0.02 * gridWidth);
}

function newgame() {
    window.location.assign(window.location.href);
}

function login() {

}

function signup() {

}

// 初始化棋盤
function init() {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    addwhiteking();
    addwhiterook();
    addwhitebishop();
    addwhiteknight();
    addwhitepawn();
    addwhitepawn();
    for (var i = 0; i < 2; i++) {
        addblackpawn();
        addobstacle();
    }
    score = 0;
    updateScore();
}

function parentclick(click) {
    if (click != idparent.id) {
        if (whitepentacle) {
            pentaclemove(ID.id);
            whitepentacle = false;
        } else {
            moveImageToNewParent(ID.id, click);
        }
    }
}

function childclick(click) {
    var clicking = click.id.substring(0, 5);
    click2 = click;
    if (click1 == null) {
        click1 = click2;
    }
    if (moveturn == clicking) {
        ID = click2;
        idparent = ID.parentNode;
        click1.parentNode.style.backgroundColor = "";
        click1 = click2;
        moveable(click);
        click.parentNode.style.backgroundColor = "yellow";
    } else if (click1.id.substring(0, 5) != click2.id.substring(0, 5) && click2.parentNode.style.backgroundColor == "red") {
        eat = click2.id;
        eated = true;
        var parentDiv = click2.parentNode;
        parentDiv.style.backgroundColor = "red";
        ID = click1;
        idparent = ID.parentNode;
        parentDiv.removeChild(click2);
    } else if (click2.id.substring(0, 8) == "pentacle" && click2.parentNode.style.backgroundColor == "green") {
        eat = click2.id;
        eated = true;
        var parentDiv = click2.parentNode;
        ID = click1;
        idparent = ID.parentNode;
        whitepentacle = true;
        pentacleid = click1.id;
        parentDiv.removeChild(click2);
    } else {
        alert(click.id);
        ID = null;
        click1 = null;
        backgroundclear();
    }
}

function moveable(click) {
    colorarray = [];
    var clickid = click.id;
    var parentID = click.parentNode.id;
    var i, j, k, color, a, b;
    var count = 0;
    backgroundclear();
    i = parseInt(parentID.split("-")[2]);
    j = parseInt(parentID.split("-")[3]);
    if (clickid.substring(0, 10) == "white-rook") {
        if (j != 7) {
            for (k = j + 1; k < 8; k++) {
                if (k == j + 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + i + "-" + k).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + i + "-" + k).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + i + "-" + k);
            }
        }
        if (j != 0) {
            for (k = j - 1; k >= 0; k--) {
                if (k == j - 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + i + "-" + k).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + i + "-" + k).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + i + "-" + k);
            }
        }
        if (i != 7) {
            for (k = i + 1; k < 8; k++) {
                if (k == i + 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + k + "-" + j).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + k + "-" + j);
            }
        }
        if (i != 0) {
            for (k = i - 1; k >= 0; k--) {
                if (k == i - 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + k + "-" + j).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + k + "-" + j);
            }
        }
    }
    if (clickid.substring(0, 12) == "white-knight") {
        if (i + 2 < 8 && j + 1 < 8) {
            a = i + 2;
            b = j + 1;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i + 2 < 8 && j - 1 >= 0) {
            a = i + 2;
            b = j - 1;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i - 2 >= 0 && j + 1 < 8) {
            a = i - 2;
            b = j + 1;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i - 2 >= 0 && j - 1 >= 0) {
            a = i - 2;
            b = j - 1;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i + 1 < 8 && j + 2 < 8) {
            a = i + 1;
            b = j + 2;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i - 1 >= 0 && j + 2 < 8) {
            a = i - 1;
            b = j + 2;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i + 1 < 8 && j - 2 >= 0) {
            a = i + 1;
            b = j - 2;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        if (i - 1 >= 0 && j - 2 >= 0) {
            a = i - 1;
            b = j - 2;
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
    }
    if (clickid.substring(0, 12) == "white-bishop") {
        a = i + 1;
        b = j + 1;
        for (k = a; k < 8; k++) {
            if (b > 7 || count == 4) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b++;
            }
        }
        count = 0;
        a = i + 1;
        b = j - 1;
        for (k = a; k < 8; k++) {
            if (b < 0 || count == 4) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b--;
            }
        }
        count = 0;
        a = i - 1;
        b = j - 1;
        for (k = a; k >= 0; k--) {
            if (b < 0 || count == 4) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b--;
            }
        }
        count = 0;
        a = i - 1;
        b = j + 1;
        for (k = a; k >= 0; k--) {
            if (b > 7 || count == 4) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b++;
            }
        }
        count = 0;
    }
    if (clickid.substring(0, 11) == "white-queen") {
        if (j != 7) {
            for (k = j + 1; k < 8; k++) {
                if (k == j + 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + i + "-" + k).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + i + "-" + k).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + i + "-" + k);
            }
        }
        if (j != 0) {
            for (k = j - 1; k >= 0; k--) {
                if (k == j - 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + i + "-" + k).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + i + "-" + k).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + i + "-" + k).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + i + "-" + k);
            }
        }
        if (i != 7) {
            for (k = i + 1; k < 8; k++) {
                if (k == i + 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + k + "-" + j).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + k + "-" + j);
            }
        }
        if (i != 0) {
            for (k = i - 1; k >= 0; k--) {
                if (k == i - 4) {
                    break;
                }
                if (document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) != "pentacle") {
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "obstacle") {
                            break;
                        }
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 5) == "black") {
                            document.getElementById("grid-cell-" + k + "-" + j).style.backgroundColor = "red";
                        }
                        break;
                    }
                }
                colorarray.push("grid-cell-" + k + "-" + j);
            }
        }
        a = i + 1;
        b = j + 1;
        for (k = a; k < 8; k++) {
            if (b > 7 || count == 2) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b++;
            }
        }
        count = 0;
        a = i + 1;
        b = j - 1;
        for (k = a; k < 8; k++) {
            if (b < 0 || count == 2) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b--;
            }
        }
        count = 0;
        a = i - 1;
        b = j - 1;
        for (k = a; k >= 0; k--) {
            if (b < 0 || count == 2) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b--;
            }
        }
        count = 0;
        a = i - 1;
        b = j + 1;
        for (k = a; k >= 0; k--) {
            if (b > 7 || count == 2) {
                break;
            } else {
                if (document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                        count++;
                        colorarray.push("grid-cell-" + k + "-" + b);
                    } else if (document.getElementById("grid-cell-" + k + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + k + "-" + b).style.backgroundColor = "red";
                        break;
                    } else {
                        break;
                    }
                } else if (!document.getElementById("grid-cell-" + k + "-" + b).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + b);
                    count++;
                }
                b++;
            }
        }
        count = 0;
    }
    if (clickid.substring(0, 10) == "white-king") {
        a = i + 1;
        b = j + 1;
        if (a < 8 && b < 8) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i;
        b = j + 1;
        if (b < 8) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i + 1;
        b = j;
        if (a < 8) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i - 1;
        b = j - 1;
        if (a >= 0 && b >= 0) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i + 1;
        b = j - 1;
        if (a < 8 && b >= 0) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i;
        b = j - 1;
        if (b >= 0) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i - 1;
        b = j;
        if (a >= 0) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
        a = i - 1;
        b = j + 1;
        if (a >= 0 && b < 8) {
            if (!document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                colorarray.push("grid-cell-" + a + "-" + b);
            } else {
                if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 8) == "pentacle") {
                    colorarray.push("grid-cell-" + a + "-" + b);
                } else if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                    document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                }
            }
        }
    }
    if (clickid.substring(0, 10) == "white-pawn") {
        if (clickid.substring(0, 5) == "white") {
            if (i == 6) {
                for (k = i - 1; k > i - 3; k--) {
                    if (!document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                        colorarray.push("grid-cell-" + k + "-" + j);
                    } else {
                        if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "pentacle") {
                            colorarray.push("grid-cell-" + k + "-" + j);
                        }
                        break;
                    }
                }
            } else {
                k = i - 1;
                if (!document.getElementById("grid-cell-" + k + "-" + j).hasChildNodes()) {
                    colorarray.push("grid-cell-" + k + "-" + j);
                } else {
                    if (document.getElementById("grid-cell-" + k + "-" + j).firstElementChild.id.substring(0, 8) == "pentacle") {
                        colorarray.push("grid-cell-" + k + "-" + j);
                    }
                }
            }
            if (i - 1 >= 0 && j - 1 >= 0) {
                a = i - 1;
                b = j - 1;
                if (document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                    }
                }
            }
            if (i - 1 >= 0 && j + 1 < 8) {
                a = i - 1;
                b = j + 1;
                if (document.getElementById("grid-cell-" + a + "-" + b).hasChildNodes()) {
                    if (document.getElementById("grid-cell-" + a + "-" + b).firstElementChild.id.substring(0, 5) == "black") {
                        document.getElementById("grid-cell-" + a + "-" + b).style.backgroundColor = "red";
                    }
                }
            }
        }
    }
    for (k = 0; k < colorarray.length; k++) {
        color = document.getElementById(colorarray[k]);
        color.style.backgroundColor = "green";
    }
}

function backgroundclear() {
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            color = document.getElementById("grid-cell-" + i + "-" + j);
            color.style.backgroundColor = "";
        }
    }
}

function moveImageToNewParent(imageId, newParentId) {
    var image = document.getElementById(imageId);
    var newParent = document.getElementById(newParentId);
    if (whitepentacle) {
        backgroundclear();
        if (image && newParent) {
            newParent.appendChild(image);
        }
        if (movecount == 1) {
            enemyMove();
            movecount = 0;
        } else {
            movecount++;
        }
        ID = null;
        click1 = null;
        document.getElementById("stage").textContent = "Stage " + stage;
        moveleft = 2 - movecount;
        document.getElementById("moveleft").textContent = moveleft + " Move Left";
    }
    if (blackpentacle) {
        backgroundclear();
        if (image && newParent) {
            newParent.appendChild(image);
        }
    }
    if (newParent.style.backgroundColor == "green" || newParent.style.backgroundColor == "red") {
        click1.parentNode.style.backgroundColor = "";
        if (image && newParent) {
            newParent.appendChild(image);
        }
        if (eated) {
            scoreplus(eat);
        }
        if (movecount == 1) {
            enemyMove();
            movecount = 0;
        } else {
            movecount++;
        }
        ID = null;
        click1 = null;
        document.getElementById("stage").textContent = "Stage " + stage;
        moveleft = 2 - movecount;
        document.getElementById("moveleft").textContent = moveleft + " Move Left";
        pawnupgrade();
    } else {
        ID = null;
        click1 = null;
    }
    backgroundclear();
}

function scoreplus(eat) {
    var pawn;
    pawn = eat.substring(0, 10);
    if (pawn == "black-pawn") {
        score += 10;
    }
    var knight;
    knight = eat.substring(0, 12);
    if (knight == "black-knight") {
        score += 30;
    }
    var rook;
    rook = eat.substring(0, 10);
    if (rook == "black-rook") {
        score += 50;
    }
    var bishop;
    bishop = eat.substring(0, 12);
    if (bishop == "black-bishop") {
        score += 30;
    }
    var queen;
    queen = eat.substring(0, 11);
    if (queen == "black-queen") {
        score += 90;
    }
    eated = false;
    document.getElementById("scoretext").textContent = "Score : " + score;
}

function addobstacle() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    min = 2;
    max = 6;
    var randomInt2 = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/pig.png";
    AImg.classList.add("obstacle");
    AImg.id = "obstacle" + obsnum;
    var randomgrid = document.getElementById("grid-cell-" + randomInt2 + "-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addobstacle();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        obsnum++;
    }
}

function addpentacle() {
    var pentacle = [];
    for (var i = 7; i >= 0; i--) {
        for (var j = 7; j >= 0; j--) {
            var grid = document.getElementById("grid-cell-" + i + "-" + j);
            if (grid.hasChildNodes() && grid.firstElementChild.id.substring(0, 8) == "pentacle") {
                pentacle.push(grid);
            }
        }
    }
    if (pentacle.length < 4) {
        var min = 0;
        var max = 8;
        var randomInt = Math.floor(Math.random() * (max - min)) + min;
        min = 2;
        max = 6;
        var randomInt2 = Math.floor(Math.random() * (max - min)) + min;
        var AImg = document.createElement("img");
        AImg.src = "./image/pentacle.png";
        AImg.classList.add("obstacle");
        AImg.id = "pentacle" + obsnum;
        AImg.onclick = function () {
            childclick(AImg);
        }
        var randomgrid = document.getElementById("grid-cell-" + randomInt2 + "-" + randomInt)
        if (randomgrid.hasChildNodes()) {
            addpentacle();
        } else {
            if (!randomgrid.hasChildNodes()) {
                var Add = randomgrid;
                Add.appendChild(AImg);
            }
            obsnum++;
        }
    }
}

function addwhiteking() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-king.png";
    AImg.classList.add("chess");
    AImg.id = "white-king";
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-7-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhiteking();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
}

function addwhiteknight() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-knight.png";
    AImg.classList.add("chess");
    AImg.id = "white-knight" + mynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-7-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhiteknight();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
    mynum++;
}

function addwhiterook() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-rook.png";
    AImg.classList.add("chess");
    AImg.id = "white-rook" + mynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-7-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhiterook();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
    mynum++;
}

function addwhitebishop() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-bishop.png";
    AImg.classList.add("chess");
    AImg.id = "white-bishop" + mynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-7-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhitebishop();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
    mynum++;
}

function addwhitequeen() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-queen.png";
    AImg.classList.add("chess");
    AImg.id = "white-queen" + mynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-7-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhitequeen();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
    mynum++;
}

function addwhitepawn() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/white-pawn.png";
    AImg.classList.add("chess");
    AImg.id = "white-pawn" + mynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var grid = document.getElementById("grid-cell-6-" + randomInt)
    if (grid.hasChildNodes()) {
        addwhitepawn();
    } else {
        if (!grid.hasChildNodes()) {
            var Add = grid;
            Add.appendChild(AImg);
        }
    }
    mynum++;
}

function addblackpawn() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/black-pawn.png";
    AImg.classList.add("chess");
    AImg.id = "black-pawn" + enemynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var randomgrid = document.getElementById("grid-cell-0-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addblackpawn();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        enemynum++;
    }
}

function addblackknight() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/black-knight.png";
    AImg.classList.add("chess");
    AImg.id = "black-knight" + enemynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var randomgrid = document.getElementById("grid-cell-0-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addblackknight();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        enemynum++;
    }
}

function addblackrook() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/black-rook.png";
    AImg.classList.add("chess");
    AImg.id = "black-rook" + enemynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var randomgrid = document.getElementById("grid-cell-0-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addblackrook();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        enemynum++;
    }
}

function addblackbishop() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/black-bishop.png";
    AImg.classList.add("chess");
    AImg.id = "black-bishop" + enemynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var randomgrid = document.getElementById("grid-cell-0-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addblackbishop();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        enemynum++;
    }
}

function addblackqueen() {
    var min = 0;
    var max = 8;
    var randomInt = Math.floor(Math.random() * (max - min)) + min;
    var AImg = document.createElement("img");
    AImg.src = "./image/chess/black-queen.png";
    AImg.classList.add("chess");
    AImg.id = "black-queen" + enemynum;
    AImg.onclick = function () {
        childclick(AImg);
    }
    var randomgrid = document.getElementById("grid-cell-0-" + randomInt)
    if (randomgrid.hasChildNodes()) {
        addblackqueen();
    } else {
        if (!randomgrid.hasChildNodes()) {
            var Add = randomgrid;
            Add.appendChild(AImg);
        }
        enemynum++;
    }
}

function addblack() {
    var blackarray = [];
    for (var i = 0; i < 8; i++) {
        if (document.getElementById("grid-cell-0-" + i).hasChildNodes()) {
            blackarray.push("grid-cell-0-" + i);
        }
    }
    if (blackarray.length >= 6) {
        for (var i = 0; i < blackarray.length; i++) {
            var child = document.getElementById(blackarray[i]).firstElementChild.id;
            var parent = blackarray[i].substring(0, 10) + "1" + blackarray[i].substring(11, 13);
            var image = document.getElementById(child);
            var newParent = document.getElementById(parent);
            if (!newParent.hasChildNodes()) {
                if (image && newParent) {
                    newParent.appendChild(image);
                }
            }
        }
    }
    var pawn = Math.random() < pawnrate ? true : false;
    if (pawn) {
        addblackpawn();
    }
    var bishop = Math.random() < bishoprate ? true : false;
    if (bishop) {
        addblackbishop();
    }
    var knight = Math.random() < knightrate ? true : false;
    if (knight) {
        addblackknight();
    }
    var rook = Math.random() < rookrate ? true : false;
    if (rook) {
        addblackrook();
    }
    var queen = Math.random() < queenrate ? true : false;
    if (queen) {
        addblackqueen();
    }
}

function addwhite() {
    var pawn = Math.random() < pawnrate ? true : false;
    if (pawn) {
        addwhitepawn();
    }
    var bishop = Math.random() < bishoprate ? true : false;
    if (bishop) {
        addwhitebishop();
    }
    var knight = Math.random() < knightrate ? true : false;
    if (knight) {
        addwhiteknight();
    }
    var rook = Math.random() < rookrate ? true : false;
    if (rook) {
        addwhiterook();
    }
}

function enemyMove() {
    attackarray = [];
    pentaclearray = [];
    var newgrid;
    var image;
    var gridElementId;
    var attackgrid;
    var attackgrid2;
    var a, b;
    for (var i = 7; i >= 0; i--) {
        for (var j = 7; j >= 0; j--) {
            var grid = document.getElementById("grid-cell-" + i + "-" + j);
            if (grid.hasChildNodes()) {
                gridElementId = grid.firstElementChild.id;
                if (gridElementId.substring(0, 10) == "black-pawn") {
                    var k = i + 1;
                    var l = j + 1;
                    var m = j - 1;
                    if (l < 8) {
                        attackgrid = document.getElementById("grid-cell-" + k + "-" + l);
                    }
                    if (m >= 0) {
                        attackgrid2 = document.getElementById("grid-cell-" + k + "-" + m);
                    }
                    if (l < 8 && m >= 0) {
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "white") {
                                var rand = Math.random() < 0.5 ? l : m;
                                newgrid = document.getElementById("grid-cell-" + k + "-" + rand);
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                            }
                            newgrid = attackgrid;
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                        } else if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "white") {
                            newgrid = attackgrid2;
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                        } else {
                            k = i + 1;
                            newgrid = document.getElementById("grid-cell-" + k + "-" + j);
                            if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                                newgrid.removeChild(newgrid.firstChild);
                                pentaclearray.push(gridElementId);
                            }
                        }
                    } else if (l > 7) {
                        if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "white") {
                            newgrid = attackgrid2;
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                        } else {
                            k = i + 1;
                            newgrid = document.getElementById("grid-cell-" + k + "-" + j);
                            if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                                newgrid.removeChild(newgrid.firstChild);
                                pentaclearray.push(gridElementId);
                            }
                        }
                    } else if (m < 0) {
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            newgrid = attackgrid;
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                        } else {
                            k = i + 1;
                            newgrid = document.getElementById("grid-cell-" + k + "-" + j);
                            if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                                newgrid.removeChild(newgrid.firstChild);
                                pentaclearray.push(gridElementId);
                            }
                        }
                    }
                    if (!newgrid.hasChildNodes()) {
                        var image = document.getElementById(gridElementId);
                        if (image && newgrid) {
                            newgrid.appendChild(image);
                        }
                    }
                    continue;
                }
                if (gridElementId.substring(0, 12) == "black-knight") {
                    if (i + 2 < 8 && j + 1 < 8) {
                        a = i + 2;
                        b = j + 1;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i + 2 < 8 && j - 1 >= 0) {
                        a = i + 2;
                        b = j - 1;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i - 2 >= 0 && j + 1 < 8) {
                        a = i - 2;
                        b = j + 1;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i - 2 >= 0 && j - 1 >= 0) {
                        a = i - 2;
                        b = j - 1;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i + 1 < 8 && j + 2 < 8) {
                        a = i + 1;
                        b = j + 2;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i - 1 >= 0 && j + 2 < 8) {
                        a = i - 1;
                        b = j + 2;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i + 1 < 8 && j - 2 >= 0) {
                        a = i + 1;
                        b = j - 2;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (i - 1 >= 0 && j - 2 >= 0) {
                        a = i - 1;
                        b = j - 2;
                        attackgrid = document.getElementById("grid-cell-" + a + "-" + b);
                        if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                            attackarray.push("grid-cell-" + a + "-" + b);
                        }
                    }
                    if (attackarray.length > 0) {
                        var min = 0;
                        var max = attackarray.length;
                        var randomInt = Math.floor(Math.random() * (max - min)) + min;
                        newgrid = document.getElementById(attackarray[randomInt]);
                        if (newgrid.firstElementChild.id.substring(0, 5) == "white") {
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                        }
                        if (!newgrid.hasChildNodes()) {
                            var image = document.getElementById(gridElementId);
                            if (image && newgrid) {
                                newgrid.appendChild(image);
                            }
                        }
                    } else {
                        var rand = Math.random() < 0.5 ? "left" : "right";
                        if (j < 2) {
                            rand = "right";
                        } else if (j > 5) {
                            rand = "left";
                        }
                        if (rand == "left") {
                            if (i < 6) {
                                a = i + 2;
                                b = j - 1;
                                newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                } else {
                                    a = i + 1;
                                    b = j - 2;
                                    newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                }
                            } else {
                                a = i + 1;
                                b = j - 2;
                                newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                            }
                        } else if (rand == "right") {
                            if (i < 6) {
                                a = i + 2;
                                b = j + 1;
                                newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                } else {
                                    a = i + 1;
                                    b = j + 2;
                                    newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                }
                            } else {
                                a = i + 1;
                                b = j + 2;
                                newgrid = document.getElementById("grid-cell-" + a + "-" + b);
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                            }
                        }
                    }
                    continue;
                }
                if (gridElementId.substring(0, 10) == "black-rook") {
                    for (var k = i + 1; k < i + 4; k++) {
                        if (k > 7) {
                            break;
                        }
                        attackgrid = document.getElementById("grid-cell-" + k + "-" + j);
                        if (attackgrid.hasChildNodes()) {
                            if (attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                                newgrid = attackgrid;
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                                break;
                            } else if (attackgrid.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid.firstElementChild.id.substring(0, 5) == "black") {
                                break;
                            }
                        } else {
                            newgrid = attackgrid;
                            if (!newgrid.hasChildNodes()) {
                                var image = document.getElementById(gridElementId);
                                if (image && newgrid) {
                                    newgrid.appendChild(image);
                                }
                            }
                        }
                    }
                    newgrid = attackgrid;
                    if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                        while (newgrid.firstChild) {
                            newgrid.removeChild(newgrid.firstChild);
                        }
                        if (!newgrid.hasChildNodes()) {
                            var image = document.getElementById(gridElementId);
                            if (image && newgrid) {
                                newgrid.appendChild(image);
                            }
                        }
                        pentaclearray.push(gridElementId);
                    }
                    continue;
                }
                if (gridElementId.substring(0, 12) == "black-bishop") {
                    var l = j + 1;
                    if (j < 4) {
                        for (var k = i + 1; k < i + 4; k++) {
                            if (k > 7 || l > 7) {
                                break;
                            }
                            attackgrid = document.getElementById("grid-cell-" + k + "-" + l);
                            if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                                newgrid = attackgrid;
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                                break;
                            } else if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "black") {
                                break;
                            } else {
                                newgrid = attackgrid;
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                            }
                            l++;
                        }
                        newgrid = attackgrid;
                        if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                            if (!newgrid.hasChildNodes()) {
                                var image = document.getElementById(gridElementId);
                                if (image && newgrid) {
                                    newgrid.appendChild(image);
                                }
                            }
                            pentaclearray.push(gridElementId);
                        }
                    } else {
                        l = j - 1;
                        for (var k = i + 1; k < i + 4; k++) {
                            if (k > 7 || l < 0) {
                                break;
                            }
                            attackgrid2 = document.getElementById("grid-cell-" + k + "-" + l);
                            if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "white") {
                                newgrid = attackgrid2;
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                                break;

                            } else if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "black") {
                                break;
                            } else {
                                newgrid = attackgrid2;
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                            }
                            l--;
                        }
                        newgrid = attackgrid2;
                        if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                            if (!newgrid.hasChildNodes()) {
                                var image = document.getElementById(gridElementId);
                                if (image && newgrid) {
                                    newgrid.appendChild(image);
                                }
                            }
                            pentaclearray.push(gridElementId);
                        }
                    }
                    continue;
                }
                if (gridElementId.substring(0, 11) == "black-queen") {
                    var rand = Math.random() < 0.5 ? "straight" : "incline";
                    if (rand == "straight") {
                        for (var k = i + 1; k < i + 4; k++) {
                            if (k > 7) {
                                break;
                            }
                            attackgrid = document.getElementById("grid-cell-" + k + "-" + j);
                            if (attackgrid.hasChildNodes()) {
                                if (attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                                    newgrid = attackgrid;
                                    while (newgrid.firstChild) {
                                        newgrid.removeChild(newgrid.firstChild);
                                    }
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                    break;
                                } else if (attackgrid.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid.firstElementChild.id.substring(0, 5) == "black") {
                                    break;
                                }
                            } else {
                                newgrid = attackgrid;
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                            }
                        }
                        newgrid = attackgrid;
                        if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                            while (newgrid.firstChild) {
                                newgrid.removeChild(newgrid.firstChild);
                            }
                            if (!newgrid.hasChildNodes()) {
                                var image = document.getElementById(gridElementId);
                                if (image && newgrid) {
                                    newgrid.appendChild(image);
                                }
                            }
                            pentaclearray.push(gridElementId);
                        }
                    } else if (rand == "incline") {
                        var l = j + 1;
                        if (j < 4) {
                            for (var k = i + 1; k < i + 4; k++) {
                                if (k > 7 || l > 7) {
                                    break;
                                }
                                attackgrid = document.getElementById("grid-cell-" + k + "-" + l);
                                if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "white") {
                                    newgrid = attackgrid;
                                    while (newgrid.firstChild) {
                                        newgrid.removeChild(newgrid.firstChild);
                                    }
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                    break;
                                } else if (attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid.hasChildNodes() && attackgrid.firstElementChild.id.substring(0, 5) == "black") {
                                    break;
                                } else {
                                    newgrid = attackgrid;
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                }
                                l++;
                            }
                            newgrid = attackgrid;
                            if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                                pentaclearray.push(gridElementId);
                            }
                        } else {
                            l = j - 1;
                            for (var k = i + 1; k < i + 4; k++) {
                                if (k > 7 || l < 0) {
                                    break;
                                }
                                attackgrid2 = document.getElementById("grid-cell-" + k + "-" + l);
                                if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "white") {
                                    newgrid = attackgrid2;
                                    while (newgrid.firstChild) {
                                        newgrid.removeChild(newgrid.firstChild);
                                    }
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                    break;

                                } else if (attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 8) == "obstacle" || attackgrid2.hasChildNodes() && attackgrid2.firstElementChild.id.substring(0, 5) == "black") {
                                    break;
                                } else {
                                    newgrid = attackgrid2;
                                    if (!newgrid.hasChildNodes()) {
                                        var image = document.getElementById(gridElementId);
                                        if (image && newgrid) {
                                            newgrid.appendChild(image);
                                        }
                                    }
                                }
                                l--;
                            }
                            newgrid = attackgrid2;
                            if (newgrid.hasChildNodes() && newgrid.firstElementChild.id.substring(0, 8) == "pentacle") {
                                while (newgrid.firstChild) {
                                    newgrid.removeChild(newgrid.firstChild);
                                }
                                if (!newgrid.hasChildNodes()) {
                                    var image = document.getElementById(gridElementId);
                                    if (image && newgrid) {
                                        newgrid.appendChild(image);
                                    }
                                }
                                pentaclearray.push(gridElementId);
                            }
                        }
                    }
                    continue;
                }
                if (grid.firstElementChild.id.substring(0, 8) == "obstacle") {
                    var k = j;
                    var direction = Math.random() < 0.5 ? k + 1 : k - 1;
                    if (direction > 7) {
                        direction = 7
                    } else if (direction < 0) {
                        direction = 0
                    }
                    var newgrid2 = document.getElementById("grid-cell-" + i + "-" + direction);
                    if (!newgrid2.hasChildNodes()) {
                        var image = document.getElementById(grid.firstElementChild.id);
                        if (image && newgrid2) {
                            newgrid2.appendChild(image);
                        }
                    }
                    continue;
                }
            }
        }
    }
    stage++;
    if (pentaclearray.length > 0) {
        blackpentacle = true;
        for (var k = 0; k < pentaclearray.length; k++) {
            pentaclemove(pentaclearray[k]);
        }
        blackpentacle = false;
    }
    var pentacle = Math.random() < 0.1 ? true : false;
    if (pentacle) {
        addpentacle();
    }
    if (stage % 10 == 0) {
        var white = Math.random() < 0.5 ? true : false;
        if (white) {
            addwhitebishop();
        } else {
            addwhiteknight();
        }
        addwhite();
    }
    if (stage % 30 == 0) {
        addwhitequeen();
    }
    if (stage % 5 == 0) {
        pawnrate -= 0.05;
        if (stage > 15) {
            bishoprate += 0.075;
            knightrate += 0.075;
        }
        if (stage > 30) {
            rookrate += 0.05;
        }
        if (stage > 50) {
            queenrate += 0.05;
        }
    }
    var one = Math.random() < 0.4 ? true : false;
    if (one) {
        addblack();
    } else {
        addblack();
        addblack();
    }
    setTimeout(function () {
        isGameOver();
    }, 100);
}

function pentaclemove(elementid) {
    do {
        var min = 1;
        var max = 6;
        var randomInt = Math.floor(Math.random() * (max - min)) + min;
        var randomInt2 = Math.floor(Math.random() * (max - min)) + min;
        var parent = document.getElementById("grid-cell-" + randomInt2 + "-" + randomInt);
    } while (parent.hasChildNodes());
    moveImageToNewParent(elementid, parent.id);
    whitepentacle = false;
    blackpentacle = false;
    backgroundclear();
}

function pawnupgrade() {
    for (var i = 0; i < 8; i++) {
        var grid = document.getElementById("grid-cell-0-" + i);
        if (grid.hasChildNodes() && grid.firstElementChild.id.substring(0, 10) == "white-pawn") {
            grid.removeChild(grid.firstElementChild);
            var rand = Math.random();
            var upgrade = "bishop";
            if (rand < 0.65) {
                upgrade = "knight";
            }
            if (rand < 0.3) {
                upgrade = "rook";
            }
            if (rand < 0.1) {
                upgrade = "queen";
            }
            var AImg = document.createElement("img");
            AImg.src = "./image/chess/white-" + upgrade + ".png";
            AImg.classList.add("chess");
            AImg.id = "white-" + upgrade;
            AImg.onclick = function () {
                childclick(AImg);
            }
            var Add = grid;
            Add.appendChild(AImg);
            mynum++;
        } else {
            continue;
        }
    }
}

function isGameOver() {
    if (document.getElementById("white-king") == undefined) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "save_score_chess.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log("分數已儲存到資料庫");
            }
        };
        xhr.send("score=" + score);
        alert("You lose! King Died!");
        setTimeout(function () {
            newgame();
        }, 1000);
    }
    for (var i = 0; i < 8; i++) {
        var grid = document.getElementById("grid-cell-7-" + i);
        if (grid.hasChildNodes()) {
            if (grid.firstElementChild.id.substring(0, 5) == "black") {
                grid.style.backgroundColor = "purple";
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "save_score_chess.php", true);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        console.log("分數已儲存到資料庫");
                    }
                };
                xhr.send("score=" + score);
                setTimeout(function () {
                    alert("You lose! Defend fail!");
                }, 100);
                setTimeout(function () {
                    newgame();
                }, 1000);
                break;
            }
        }
    }
}
