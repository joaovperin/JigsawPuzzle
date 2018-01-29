/**
 * Aplicativo
 */
function App() {

    var self = this;

    /**
     * Função chamada ao carregamento da página
     */
    self.onLoad = function () {
        console.log('carregou a pagina');
        // Toda vez que mudar o arquivo, guarda a referência do arquivo selecionado
        document.getElementById('file').addEventListener('change', function (evt) {
            self.file = evt.target.files[0];
        });
    };

    /**
     * Função responsável por carregar uma imagem
     */
    self.loadImage = function () {

        var file = self.file;
        var reader = new FileReader();
        // Quando terminar de carregar
        reader.onloadend = function () {
            if (reader.result) {
                document.getElementById('img').src = reader.result;
            }
        }

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