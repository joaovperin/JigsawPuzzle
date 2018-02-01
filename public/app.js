/**
 * Aplicativo
 * 
 * // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
 * 
 */
function App() {

    // Guarda a refer√™ncia √† inst√¢ncia corrente numa vari√°vel auxiliar interna
    var self = this;

    /** Arquivo de imagem */
    self.file = undefined;
    /** Quebra cabe√ßas */
    self.puzzle = undefined;
    /** Loop principal */
    self.mainLoop = undefined;

    /**
     * Fun√ß√£o chamada ao carregamento da p√°gina
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
        // Toda vez que mudar o arquivo, guarda a refer√™ncia do arquivo selecionado
        document.getElementById('file').addEventListener('change', function (evt) {
            self.file = evt.target.files[0];
        });
        // ~60 FPS
        self.mainLoop = setInterval(function () {
            self.update();
            self.render();
        }, 16);
    };

    /**
     * MÈtodo respons·vel pela atualizaÁ„o dos frames
     */
    self.update = function () {
        if (self.puzzle) {
            self.puzzle.update();
        }
    };

    /**
     * MÈtodo respons·vel pela renderizaÁ„o dos frames
     */
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
        // Se j· definiu, limpa, embaralha e redesenha
        if (self.puzzle) {
            self.puzzle.clear();
            self.puzzle.shuffle();
            self.puzzle.draw();
        }
    };

    /**
     * MÈtodo respons·vel pelo carregamento da imagem selecionada
     */
    self.loadImage = function () {
        var file = self.file;
        var reader = new FileReader();
        // Quando terminar de carregar, chama esta fun√ß√£o
        reader.onloadend = function () {
            var img = document.getElementById('img');
            img.src = reader.result;
            img.onload = function () {
                self.puzzle = new Puzzle(img, 500, 3);
                self.puzzle.draw();
            };
        };
        // Se informou um arquivo
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    /**
     *  Limpa a imagem carregada, retornando ‡ default
     */
    self.clearImage = function () {
        document.getElementById('img').src = "notFound.jpeg";
        self.file = '';
    };

    return self;
}

/**
 * Representa um quebra cabe√ßas
 */
function Puzzle(img, canvasSize, numRows) {

    var self = this;
    /** Guarda a referÍncia da imagem completa */
    self.fullImage = img;
    /** Tamanho do canvas */
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

    /**
     * MÈtodo respons·vel por tratar o clique no Puzzle
     * 
     * @param {Number} cX 
     * @param {Number} cY 
     */
    self.clickEvent = function (cX, cY) {
        console.log('Mouse... X: ' + cX + ' Y: ' + cY);
        var idx = 0;
        self.subs.forEach(function (elm) {
            // Collision detection between clicked offset and element.
            elm.unselect();
            if (elm.isInContact(cX, cY)) {
                console.log('Elm ' + idx + ' ... X: ' + elm.getX() + ' Y: ' + elm.getY());
                elm.select();
            }
        });
    };

    self.update = function () {

    };

    self.shuffle = function () {
        shuffleArray(self.subs);
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numRows; j++) {
                self.subs[j + i * numRows].move(j * self.size, i * self.size);
            }
        }
    };

    self.draw = function () {
        self.subs.forEach(function (elm) {
            elm.draw();
        });
    };

    self.clear = function () {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
    };

}

/**
 * Representa uma subimagem de um quebra cabe√ßas
 */
function SubImage(img, s, startX, startY) {

    var self = this;
    /** Start position */
    var sx = startX;
    var sy = startY;

    /** Actual position */
    var px = sx;
    var py = sy;
    /** If its selected */
    var selected = false;

    /**
     * 
     * @param {Number} mX 
     * @param {Number} mY 
     */
    self.isInContact = function (mX, mY) {
        // Colliding Y axis
        if (mY > py && mY < (py + s) &&
            // Colliding X axis
            mX > px && mX < (px + s)) {
            return true;
        }
        return false;
    };

    self.getX = function () { return px; };
    self.getY = function () { return py; };

    self.select = function () {
        selected = true;
    };

    self.unselect = function () {
        selected = false;
    };

    self.move = function (newX, newY) {
        px = newX;
        py = newY;
    };

    self.draw = function () {
        ctx.drawImage(img, px, py, s, s, sx, sy, s, s);
        if (selected) {

            // TODO: Corrigir rotina de renderizaÁ„o do hightlight 
            // t· bugada :/

            ctx.save();
            ctx.beginPath();
            ctx.rect(px, py, s, s);
            //context.fillStyle = 'yellow';
            //context.fill();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 7;
            ctx.stroke();
            ctx.restore();

            /* ctx.save();
            // darken the image with a 50% black fill
            ctx.globalAlpha = .30;
            ctx.fillStyle = "black";
            ctx.fillRect(px, py, s, s);
            ctx.restore();*/
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