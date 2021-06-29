
/** #########################################################

PODERIAMOS PEGAR O CLICK ASSIM:
const input = document.querySelector("input[name='price']")
input.addEventListener("keydown", function(event) {
   ...
})

MAS VAMOS USAR ESSE MODELOMAIS DINÂMICO:
Mask.apply(eventTarget, function)
AGORA VAMOS PEGAR O event DO CLICK NO HTML
COM O ATRIBUTO onkeydown="Mask.apply(this, 'formatBRL')";
ASSIM COMO UMA window, ESSE this REFERENCIA DE UMA FORMA
GLOBAL TODOS OS ELEMENTOS DO ELEMENTO, SÒ QUE DIFERENTE DO
DA window, O ESCOPO É LOCAL, NESSE CASO SERÂO TODOS OS
ELEMENTOS DA TAH input

############################################################

REGEX EXPLICAÇÃO:

  // isEmail(value) {
  //   let error = null
  //   /^\w/ significa que a expressão precisa começar com
  //   alguma coisa, mas sem os caracteres especiais;
  //   /^\w+/ significa que é um ou mais caracter;
  //   /^\w+([\.-])/ usar o parênteses para isolar uma ideia,
  //   a chave para passar alguns caracteres que vamos permitir
  //   aqui, no caso, vamos permitir que se coloque . ou - ,
  //   e utilizamos a \. para que o signigicado do . seja
  //   de apenas um ponto mesmo;
  //   /^\w+([\.-]?)/ o interrogação ? significa que o ponto e
  //   o traço são facultativos;
  //   /^\w+([\.-]?\w+)/ aqui o \w+ depois do ? signigica que
  //   posso ter um ou mais caracter;
  //   /^\w+([\.-]?\w+)*/
  //   o asterisco significa que poderemos, ou
  //   não, ter os caracteres isolados na ideia do parênteses;
  //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)/ agora vamos repetir a
  //   mesma ideia só que especificando que é depos do @;
  //   logo depois, com (\.\w{2,3})/ vamos especificar que precisamos
  //   de um ponto seguidos por 2 ou 3 caracteres, note que isolamos
  //   esse novo conjunto com ();
  //   no final do grupo especificado, disse com + que esse grupo pode
  //   ocorrer uma ou mais vezes ...(grupo-isolado)+/
  //   Então pra finalizar, especificamos com $ que a expressão teve
  //   terminar com o grupo...(grupo-isolado)+$/ e isso é uma regra, se
  //   não for assim, ele não vai aceitar a expressão como um email válido
  //   const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  //   if(!value.match(mailFormat)) error = "Email inválido!"

  //   return {error, value}
  // }

// ########################################################## */

const Mask = {
  apply(input, func) {
    setTimeout(function() {

      input.value = Mask[func] (input.value)

    }, 1)
  },
  formatBRL(value) {
    value = value.replace(/\D/g,"")

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value/100)
  },
  cpfCnpj(value) {
    value = value.replace(/\D/g,"")

    if (value.length > 14) value = value.slice(0, -1)


    if (value.length > 11) {// >>> cnpj input <<<
      // input: 11222333444455

      value = value.replace(/(\d{2})(\d)/, "$1.$2")
      // output: 11.222333444455

      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      // output: 11.222.333444455

      value = value.replace(/(\d{3})(\d)/, "$1/$2")
      // output: 11.222.333/444455

      value = value.replace(/(\d{4})(\d)/, "$1-$2")
      // output: 11.222.333/4444-55

    } else {//>>> cpf input <<<<

      // input: 11222333444455

      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      // output: 112.22333444455

      value = value.replace(/(\d{3})(\d)/, "$1.$2")
      // output: 112.223.33444455

      value = value.replace(/(\d{3})(\d)/, "$1-$2")
      // output: 112.223.334.444-55
    }

    return value
  },

  cep(value) {
    value = value.replace(/\D/g,"")

    if (value.length > 8) value = value.slice(0, -1)

    value = value.replace(/(\d{5})(\d)/, "$1-$2")

    return value
  }
}

/** GALERIA DE CONTRO DE IMAGENS COM JS
 * o new FileReader() é um constructor JS para ler
 * arquivos carregos. O constructor new Image() cria uma
 * nova tag de images
 */

const PhotosUpload = {
  input: "",
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 6,
  files: [],

  handleFileInput(event) {
    const {files: fileList} = event.target
    PhotosUpload.input = event.target

    if(PhotosUpload.hasLimit(event)) return


    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file)

      // new FileReader() constructor JS para
      // leitura de arquivos de imagens (image format BLOB)
      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image() //cria tag <img>src="some/image"</img>
        image.src = String(reader.result) //output para 'readAsDataURL'

        // PhotosUpload.getContainer(image) adiciona/remove
        //  uma div e insere a img criada pela new Image()
        const div = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(div)

      }

      reader.readAsDataURL(file)

    })

    // A function PhotosUpload.getAllFiles() cria um Array
    // para podermos manipular os files inseridos
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

  },

  hasLimit(event) {
    const {uploadLimit, input, preview} = PhotosUpload
    const {files: fileList} = input

    if (fileList.length > uploadLimit) {
      alert(`Error! Envie no máximo ${uploadLimit} imagens`)
      event.preventDefault()

      return true
    }

    const photosDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert("Limite de fotos excedido!")
      event.preventDefault()

      return true
    }

    return false
  },

  getAllFiles() {
    const dataTransfer =  new ClipboardEvent("").clipboardData || new DataTransfer() // ClipboardEvent() => p/ Firefox

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },

  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image)

    div.appendChild(PhotosUpload.getRemoveButton())

    return div
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "close"

    return button
  },

  removePhoto(event) {
    // event.tarteg => <i> e parentNode <div class="photo">
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    photoDiv.remove()

  },

  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},` // 1,2,3,...
      }
    }

    photoDiv.remove()
  }
}

// MANIPULAR APRESENTAÇÃO DE IMAGENS - SHOW RECIPES PAGE
const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(event) {
    const {target} = event

    ImageGallery.previews.forEach(preview => preview.classList.remove("active"))
    target.classList.add("active")

    ImageGallery.highlight.src = target.src
    LightBox.image.src = target.src
  }
}

// ONCLICK GERAR UM MODAL DA RECEITA PRINCIPAL - SHOW RECIPES
const LightBox = {
  target: document.querySelector(".lightbox-target"),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.hightbox-close"),

  open() {
    LightBox.target.style.opacity = 1
    LightBox.target.style.top = 0
    LightBox.target.style.bottom = 0
    LightBox.closeButton.style.top = 0
  },
  close() {
    LightBox.target.style.opacity = 0
    LightBox.target.style.top = "-100%"
    LightBox.target.style.bottom = "initial"
    LightBox.closeButton.style.top = "-80px"
  }
}

const Validate = {
  apply(input, func) {
    //Limpar a div de tentativas erradas de email
    Validate.clearErrors(input)

    //Antes de qualquer coisa, ele verifica
    //se há um error por causa da isEmail(value)
    let results = Validate[func] (input.value)
    input.value = results.value

    if(results.error) Validate.displayError(input, results.error)

  },

  displayError(input, error) {
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    input.focus()
  },

  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error")
    if (errorDiv) errorDiv.remove()
  },

  isEmail(value) {
    let error = null
    // Dúvidas com REGEX? Verifique a documentação no início do código
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(mailFormat)) error = "Email inválido!"

    return {error, value}
  },

  isCpfCnpj(value) {
    let error = null

    const cleanValues = value.replace(/\D/g,"")

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "CNPJ incorreto!"
    }
    else if (cleanValues.length < 12 && cleanValues.length !== 11) {
      error = "CPF incorreto!"
    }

    return {error, value}
  },

  isCep(value) {
    let error = null

    const cleanValues = value.replace(/\D/g,"")

    if (cleanValues.length !== 8) {
      error = "CEP incorreto!"
    }

    return {error, value}
  },

  allFields(event) {
    const items = document.querySelectorAll('.item input, .item select, .item textarea')

    for (item of items) {
      if (item.value == "") {

        const message = document.createElement('div')
        message.classList.add('messages')
        message.classList.add('error')
        message.style.position = 'fixed'
        message.innerHTML = 'Todos os campos são obrigatórios!'

        document.querySelector('body').append(message)

        event.preventDefault()

      }
    }
  }
}
