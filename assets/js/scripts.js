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

const Transaction = {
    all: [
        {
        description: 'Luz',
        amount: -50001,
        date: '23/01/2021',
        }, 
        {
    
        description: 'Website',
        amount: 500000,
        date: '23/01/2021',
        }, 
        {
    
        description: 'Internet',
        amount: -20012,
        date: '23/01/2021',
        }, 
        {
    
        description: 'App',
        amount: 200000,
        date: '23/01/2021',
        }, 
    ],

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove (index) {
        Transaction.all.splice(index,1)
        App.reload()
    },

    incomes () {
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

    expenses () {
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

    total () {
        return Transaction.incomes() + Transaction.expenses() 

    }
}

// Eu preciso pegar as minhas transações do meu
// objeto aqui no javascript e colocar no HTML

const DOM =  {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction) {
        //
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount);
        
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover Transação"></td>
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
        return signal+value
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

    formatData(){
        console.log('formatar os dados')
    },

    validadeFields() {
        const {description, amount, date} = Form.getValues()
        if( description.trim() === '' || 
            amount.trim() === '' || 
            date.trim() === '') {
                throw new Error('Por favor, preencha todos os campos')
            }
    },

    submit(event){
        event.preventDefault()
        //console.log(event)

        // verificar se todas as informações foram preenchidas
        try {
            Form.validadeFields()
            // Formatar os dados para salvar
            Form.formatData()
            // Salvar 
            // Apagar  os dados do formulario 
            // Fechar modal para
            // Atualizar a aplicação
            
        } catch (error) {
            alert(error.message);
        } // PAREI 2:17:15 Maratona Aula 03
 
    }
}

const App = {
    init() {

        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()

    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()








