// Fungsi untuk menyimpan dan memuat data buku dari localStorage
function handleBookStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
}

function renderBookList(books) {
    const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
    const completeBookshelfList = document.querySelector("#completeBookshelfList");
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    books.forEach(book => {
        const bookElement = document.createElement("article");
        bookElement.classList.add("book_item");

        const titleElement = document.createElement("h2");
        titleElement.innerText = book.title;

        const authorElement = document.createElement("p");
        authorElement.innerText = "Penulis: " + book.author;

        const yearElement = document.createElement("p");
        yearElement.innerText = "Tahun: " + book.year;

        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(yearElement);

        const actionElement = document.createElement("div");
        actionElement.classList.add("action");

        const actionButton = document.createElement("button");
        actionButton.id = book.id;
        const iconC = document.createElement("i");
        if (book.isComplete) {
            iconC.classList.add("fa-solid", "fa-book-open");
        } else {
            iconC.classList.add("fa-solid", "fa-book");
        }
        const textNode1 = document.createTextNode(book.isComplete ? " Belum Selesai dibaca" : " Selesai dibaca");
        actionButton.appendChild(iconC);
        actionButton.appendChild(textNode1);
        actionButton.classList.add("green");
        actionButton.addEventListener("click", () => toggleBookStatus(book.id));

        const deleteButton = document.createElement("button");
        deleteButton.id = book.id;
        // Membuat ikon delete dari Font Awesome
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash"); 
        // Menambahkan ikon ke dalam tombol
        deleteButton.appendChild(icon);
        const textNode = document.createTextNode(" Hapus buku");
        deleteButton.appendChild(textNode);
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", () => deleteBook(book.id));

        actionElement.appendChild(actionButton);
        actionElement.appendChild(deleteButton);
        bookElement.appendChild(actionElement);

        if (book.isComplete) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }
    });
}
function addNewBook(event) {
    event.preventDefault();

    const title = document.querySelector("#inputBookTitle").value;
    const author = document.querySelector("#inputBookAuthor").value;
    const yearInput = document.querySelector("#inputBookYear").value;
    if (!/^\d+$/.test(yearInput)) {
        showToast('Error: Year harus angka');
        return; // Hentikan proses penambahan buku jika yearInput tidak hanya terdiri dari angka
    }
    const year = parseInt(yearInput);
    const isComplete = document.querySelector("#inputBookIsComplete").checked;
    const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete
    };

    books.push(newBook);
    handleBookStorage(books);
    renderBookList(books);
    showToast("Buku berhasil disimpan");
}
function searchBook(event) {
    event.preventDefault();
    const searchInput = document.querySelector("#searchBookTitle").value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchInput));
    renderBookList(filteredBooks);
}

// Fungsi untuk menandai buku sebagai selesai dibaca
function toggleBookStatus(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        handleBookStorage(books);
        renderBookList(books);
    }
}

// Fungsi untuk menghapus buku dari daftar
function deleteBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    const confirmation = confirm('Apakah yakin ingin menghapus buku?');
    if (confirmation) {
        books.splice(bookIndex, 1);
        handleBookStorage(books);
        renderBookList(books);
        showToast('Buku Berhasil dihapus');
    }
}
// Inisialisasi awal: memuat data buku dari localStorage dan menampilkan daftar buku
function initialize() {
    window.addEventListener("load", () => {
        books = JSON.parse(localStorage.getItem("books")) || [];
        renderBookList(books);

        const inputBookForm = document.querySelector("#inputBook");
        const searchBookForm = document.querySelector("#searchBook");

        inputBookForm.addEventListener("submit", addNewBook);
        searchBookForm.addEventListener("submit", searchBook);
    });
}
function showToast(message) {
    const toastElement = document.querySelector("#toast");
    toastElement.innerText = message;
    toastElement.classList.add("show");
    setTimeout(() => {
        toastElement.classList.remove("show");
    }, 3000); // 3000 milidetik (3 detik) untuk menampilkan pesan
}

let books = [];
initialize();
