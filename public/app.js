/**
 * Aplicativo
 * 
 * // https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
 * 
 */
function App() {

    // Guarda a referÃªncia Ã  instÃ¢ncia corrente numa variÃ¡vel auxiliar interna
    var self = this;

    /** Arquivo de imagem */
    self.file = undefined;
    /** Quebra cabeÃ§as */
    self.puzzle = undefined;
    /** Loop principal */
    self.mainLoop = undefined;

    /**
     * FunÃ§Ã£o chamada ao carregamento da pÃ¡gina
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
        // Toda vez que mudar o arquivo, guarda a referÃªncia do arquivo selecionado
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
     * Método responsável pela atualização dos frames
     */
    self.update = function () {
        if (self.puzzle) {
            self.puzzle.update();
        }
    };

    /**
     * Método responsável pela renderização dos frames
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
        // Se já definiu, limpa, embaralha e redesenha
        if (self.puzzle) {
            self.puzzle.clear();
            self.puzzle.shuffle();
            self.puzzle.draw();
        }
    };

    /**
     * Método responsável pelo carregamento da imagem selecionada
     */
    self.loadImage = function () {
        var file = self.file;
        var reader = new FileReader();
        // Quando terminar de carregar, chama esta funÃ§Ã£o
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
     *  Limpa a imagem carregada, retornando à default
     */
    self.clearImage = function () {
        document.getElementById('img').src = "notFound.jpeg";
        self.file = '';
        return;

        var co = ctx;

        // Draw a red square

        co.fillStyle = 'red';
        co.fillRect(50, 50, 100, 100);

        // Change the globalCompositeOperation to destination-over so that anything
        // that is drawn on to the canvas from this point on is drawn at the back
        // of whats already on the canvas
        co.globalCompositeOperation = 'destination-over';
        // Draw a big yellow rectangle

        co.fillStyle = 'yellow';
        co.fillRect(0, 0, 600, 250);
        // Now return the globalCompositeOperation to source-over and draw a
        // blue rectangle
        co.globalCompositeOperation = 'source-over';
        co.fillStyle = 'blue';
        co.fillRect(75, 75, 100, 100);

    };

    return self;
}

/**
 * Representa um quebra cabeÃ§as
 */
function Puzzle(img, canvasSize, numRows) {

    var self = this;
    /** Guarda a referência da imagem completa */
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
     * Método responsável por tratar o clique no Puzzle
     * 
     * @param {Number} cX 
     * @param {Number} cY 
     */
    self.clickEvent = function (cX, cY) {
        console.log('Mouse... X: ' + cX + ' Y: ' + cY);
        self.subs.forEach(function (elm, idx) {
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
 * Representa uma subimagem de um quebra cabeÃ§as
 */
function SubImage(img, s, startX, startY) {

    var self = this;
    /** Start position */
    self.sx = startX;
    self.sy = startY;

    /** Actual position */
    self.px = self.sx;
    self.py = self.sy;
    /** If its selected */
    self.selected = false;

    self.s = s;

    /**
     * 
     * @param {Number} mX 
     * @param {Number} mY 
     */
    self.isInContact = function (mX, mY) {
        // Colliding Y axis
        if (mY > self.sy && mY < (self.sy + self.s) &&
            // Colliding X axis
            mX > self.sx && mX < (self.sx + self.s)) {
            return true;
        }
        return false;
    };

    self.getX = function () { return self.px; };
    self.getY = function () { return self.py; };

    self.select = function () {
        self.selected = true;
    };

    self.unselect = function () {
        self.selected = false;
    };

    self.move = function (newX, newY) {
        self.px = newX;
        self.py = newY;
    };

    self.draw = function () {
        var co = ctx;
        co.fillStyle = '';
        co.globalAlpha = 1;
        co.drawImage(img, self.px, self.py, self.s, self.s, self.sx, self.sy, self.s, self.s);
        if (self.selected) {
            co.fillStyle = 'rgba(120,120,30,.3)';
            co.globalAlpha = .30;
            co.fillRect(self.px, self.py, self.s, self.s);
        }
    };

    self.clear = function () {
        ctx.clearRect(self.px, self.py, s, s);
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
