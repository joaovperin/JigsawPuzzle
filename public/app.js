/**
 * Aplicativo
 * 
 * // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
 * 
 */
function App() {

    // Guarda a referência à instância corrente numa variável auxiliar interna
    var self = this;

    /** Arquivo de imagem */
    self.file = undefined;
    /** Quebra cabeças */
    self.puzzle = undefined;
    /** Loop principal */
    self.mainLoop = undefined;

    /**
     * Função chamada ao carregamento da página
     */
    self.onLoad = function () {
        var myCanvas = document.getElementById('canvas');
        window['ctx'] = myCanvas.getContext('2d');
        // Add o listener do clique no canvas
        myCanvas.addEventListener('click', function (event) {
            if (self.puzzle) {
                var elemLeft = myCanvas.offsetLeft, elemTop = myCanvas.offsetTop;
                var x = event.pageX - elemLeft,
                    y = event.pageY - elemTop;
                self.puzzle.clickEvent(x, y)
            }
        }, false);
        // Toda vez que mudar o arquivo, guarda a referência do arquivo selecionado
        document.getElementById('file').addEventListener('change', function (evt) {
            self.file = evt.target.files[0];
        });
        // ~60 FPS
        self.mainLoop = setInterval(function () {
            self.update();
            self.render();
        }, 16);
    };

    self.update = function () {
        if (self.puzzle) {
            self.puzzle.update();
        }
    };

    self.render = function () {
        if (self.puzzle) {
            self.puzzle.clear();
            self.puzzle.draw();
        }
    };

    /**
     * Embaralha o puzzle
     */
    self.shuffle = function () {
        if (self.puzzle) {
            self.puzzle.clear();
            self.puzzle.shuffle();
            self.puzzle.draw();
        }
    };

    /**
     * Função responsável por carregar uma imagem
     */
    self.loadImage = function () {
        var file = self.file;
        var reader = new FileReader();
        // Quando terminar de carregar, chama esta função
        reader.onloadend = function () {
            var img = document.getElementById('img');
            img.src = reader.result;
            img.onload = function () {
                self.puzzle = new Puzzle(document.getElementById('img'), 500, 10);
                self.puzzle.draw();
            };
        };
        // Se informou um arquivo
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    /**
     *  Limpa a imagem 
     */
    self.clearImage = function () {
        document.getElementById('img').src = "notFound.jpeg";
        self.file = '';
    };

    return self;
}

/**
 * Representa um quebra cabeças
 */
function Puzzle(img, canvasSize, numRows) {

    var self = this;
    self.fullImage = img;

    self.size = canvasSize / numRows;

    // Constructor function (gambiarra, eu sei kk)
    (function () {
        self.subs = [];
        var s = self.size;
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numRows; j++) {
                var subtmp = new SubImage(img, s, s * j, s * i);
                self.subs.push(subtmp);
            }
        }
    })();

    self.clickEvent = function (cX, cY) {
        self.subs.forEach(function (elm) {
            // Collision detection between clicked offset and element.
            if (elm.isInContact(cX, cY)) {
                elm.select();
            } else {
                elm.unselect();
            }
        });
    };

    self.update = function () {

    };

    self.shuffle = function () {
        shuffleArray(self.subs);
    };

    self.draw = function () {
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numRows; j++) {
                self.subs[j + i * numRows].draw(j * self.size, i * self.size);
            }
        }
    };

    self.clear = function () {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        //for (var i = 0; i < numRows; i++) {
        //    for (var j = 0; j < numRows; j++) {
        //       self.subs[i * j + i].clear(i * self.size, j * self.size);
        //  }
        //}
    };

}

/**
 * Representa uma subimagem de um quebra cabeças
 */
function SubImage(img, s, startX, startY) {

    var self = this;
    var sx = startX;
    var sy = startY;

    var bright = false;

    self.isInContact = function (mX, mY) {
        if (mY > sy && mY < sy + s
            && mX > sx && mX < sx + s) {
            return true;
        }
        return false;
    };

    self.select = function () {
        bright = true;
    };

    self.unselect = function () {
        bright = false;
    };

    self.move = function (newX, newY) {
        sx = newX;
        st = newY;
    };

    self.draw = function (px, py) {
        ctx.drawImage(img, sx, sy, s, s, px, py, s, s);
        if (bright) {
            // darken the image with a 50% black fill
            ctx.save();
            ctx.globalAlpha = .70;
            ctx.fillStyle = "black";
            ctx.fillRect(sx, sy, s, s);
            ctx.restore();
        }
    };

    self.clear = function (px, py) {
        ctx.clearRect(px, py, s, s);
    };

    return self;
};



/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}