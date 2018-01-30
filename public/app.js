/**
 * Aplicativo
 */
function App() {

    // Guarda a referência à instância corrente numa variável auxiliar interna
    var self = this;

    /** Arquivo de imagem */
    self.file = undefined;
    /**Quebra cabeças */
    self.puzzle = undefined;

    /**
     * Função chamada ao carregamento da página
     */
    self.onLoad = function () {
        window['ctx'] = document.getElementById('canvas').getContext('2d');
        // Toda vez que mudar o arquivo, guarda a referência do arquivo selecionado
        document.getElementById('file').addEventListener('change', function (evt) {
            self.file = evt.target.files[0];
        });
    };

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

    self.clearImage = function () {
        document.getElementById('img').src = "notFound.jpeg";
        self.file = '';
    };
    //app.start();

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
                self.subs.push(new SubImage(img, s, s * j, s * i));
            }
        }
    })();

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
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numRows; j++) {
                self.subs[i * j + i].clear(i * self.size, j * self.size);
            }
        }
    };

}

/**
 * Representa uma subimagem de um quebra cabeças
 */
function SubImage(img, s, sx, sy) {

    var self = this;

    self.draw = function (px, py) {
        ctx.drawImage(img, sx, sy, s, s, px, py, s, s);
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