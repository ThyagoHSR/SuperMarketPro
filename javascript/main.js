document.addEventListener('DOMContentLoaded', function () {
    const budgetInput = document.getElementById('budget');
    const updateBudgetBtn = document.getElementById('update-budget');
    const itemList = document.getElementById('item-list');
    const totalSpan = document.getElementById('total');
    const addItemBtn = document.getElementById('add-item');
    const itemNameInput = document.getElementById('item-name');
    const itemQuantityInput = document.getElementById('item-quantity');
    const itemPriceInput = document.getElementById('item-price');
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modal-message');

    let budget = 0;
    let total = 0;
    let items = [];

    if (localStorage.getItem('budget')) {
        budget = parseFloat(localStorage.getItem('budget'));
        budgetInput.value = budget;
    }

    if (localStorage.getItem('items')) {
        items = JSON.parse(localStorage.getItem('items'));
        renderItems();
        updateTotal();
    }

    updateBudgetBtn.addEventListener('click', function () {
        budget = parseFloat(budgetInput.value);
        localStorage.setItem('budget', budget); // Salvar o orçamento no localStorage
        updateTotal();
        toggleAddButton();
    });

    budgetInput.addEventListener('input', function () {
        toggleAddButton();
    });

    addItemBtn.addEventListener('click', function () {
        const itemName = itemNameInput.value.trim();
        const itemQuantity = parseInt(itemQuantityInput.value);
        const itemPrice = parseFloat(itemPriceInput.value);

        if (budget > 0) {
            if (itemName !== '' && !isNaN(itemQuantity) && itemQuantity > 0 && !isNaN(itemPrice) && itemPrice > 0) {
                if (total + (itemPrice * itemQuantity) <= budget) {
                    items.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
                    renderItems();
                    updateTotal();
                    itemNameInput.value = '';
                    itemQuantityInput.value = '';
                    itemPriceInput.value = '';
                    localStorage.setItem('items', JSON.stringify(items)); // Salvar os itens no localStorage
                } else {
                    showModal('O valor do item excede o seu orçamento disponível.', 'danger');
                }
            } else {
                showModal('Por favor, insira um nome, uma quantidade e um preço válidos para o item.', 'danger');
            }
        } else {
            showModal('Por favor, insira um valor disponível antes de adicionar itens à lista.', 'danger');
        }
    });

    itemList.addEventListener('click', function (event) {
        if (event.target && event.target.nodeName === 'BUTTON') {
            const index = parseInt(event.target.dataset.index);
            total -= items[index].price * items[index].quantity;
            items.splice(index, 1);
            renderItems();
            updateTotal();
            localStorage.setItem('items', JSON.stringify(items)); // Atualizar os itens salvos no localStorage
        }
    });

    function renderItems() {
        itemList.innerHTML = '';
        items.forEach(function (item, index) {
            const li = document.createElement('li');
            li.textContent = `${item.name} (${item.quantity}x) - R$${item.price * item.quantity}`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.classList.add('btn', 'btn-danger', 'btn-sm');
            removeBtn.dataset.index = index;
            li.appendChild(removeBtn);
            itemList.appendChild(li);
        });
    }

    function updateTotal() {
        total = items.reduce(function (acc, item) {
            return acc + (item.price * item.quantity);
        }, 0);
        totalSpan.textContent = total.toFixed(2);
    }

    function toggleAddButton() {
        addItemBtn.disabled = !(budget > 0);
    }

    function showModal(message, type) {
        modalMessage.textContent = message;
        modal.style.display = "block";

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        const closeBtn = document.querySelector(".close");
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        setTimeout(function(){
            modal.style.display = "none";
        }, 3000);
    }
});
