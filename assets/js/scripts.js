const Modal = {
    open() {
        //Abrir Modal
        //Adicionar a class active ao modal
        document.querySelector(".modal-overlay").classList.add("active");
    },
    close() {
        //fechar o Modal
        //remover a class active do modal a
        document.querySelector(".modal-overlay").classList.remove("active");
    },
};

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transactions) {
        localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions))
    }
}

const Export = {
    exportCsv() {
        let csv = ''
        let header = 'description, amount, date'
        let values = ''
        Transaction.all.forEach((transaction) => {
            values += transaction.description + ',' + (transaction.amount/100).toFixed(2) + ',' + transaction.date + '\n'
        })
        csv += header + '\n' + values;
        //console.log(csv)
        
        let blobArquivo = new Blob([csv], { type: 'text/csv' })
        var linkDownloadCsv = document.createElement('a')
        linkDownloadCsv.download = 'export.csv'
        linkDownloadCsv.href = URL.createObjectURL(blobArquivo)
        linkDownloadCsv.dataset.downloadurl = ['text/csv', linkDownloadCsv.download, linkDownloadCsv.href].join(':')
        linkDownloadCsv.style.display = "none"
        document.body.appendChild(linkDownloadCsv)
        linkDownloadCsv.click()
        document.body.removeChild(linkDownloadCsv)
        setTimeout(function () { URL.revokeObjectURL(linkDownloadCsv.href) }, 1500)
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas as Transações
        // para cada transação,  
        Transaction.all.forEach((transaction) => {
            // se for maior que 0
            if (transaction.amount > 0) {
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }
        })

        return income
    },

    expenses() {
        let expense = 0;
        //pegar todas as Transações
        // para cada transação,  
        Transaction.all.forEach((transaction) => {
            // se for maior que 0
            if (transaction.amount < 0) {
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })

        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()

    }
}

// Eu preciso pegar as minhas transações do meu
// objeto aqui no javascript e colocar no HTML

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        //
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
        `

        return html
    },

    updateBalance() {
        // pegar os valores
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }

}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        return signal + value
    },

    formatAmount(value) {
        value = Number(value.replace(/\,\./g, '')) * 100
        return value

    },

    formatDate(date) {
        const splittedDate = date.split('-')
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos')
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return { description: description, amount: amount, date: date }
    },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()
        //console.log(event)

        // verificar se todas as informações foram preenchidas
        try {
            Form.validadeFields()
            // Formatar os dados para salvar
            const transaction = Form.formatValues()
            // Salvar 
            Form.saveTransaction(transaction)
            // Apagar  os dados do formulario 
            Form.clearFields()
            // Fechar modal para
            Modal.close()
            // Atualizar a aplicação

        } catch (error) {
            alert(error.message);
        } // 

    },


}

const App = {
    init() {

        //Arrow Function
        // Transaction.all.forEach((transaction,index) => {
        //     DOM.addTransaction(transaction, index)
        // })
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()








