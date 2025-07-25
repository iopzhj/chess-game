
documentWidth = window.screen.availWidth;
gridWidth = 0.92 * documentWidth;
cellWidth = 0.18 * documentWidth;
cellMargain = 0.04 * documentWidth;

function  getPosTop(i,j) {
    return cellMargain + i * ( cellMargain + cellWidth );
}

function  getPosLeft(i,j) {
    return cellMargain + j * ( cellMargain + cellWidth );
}