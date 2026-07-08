const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("addressInput");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartBtn.addEventListener("click", function (){
    updateCartModal()
    cartModal.style.display = "flex"    
})

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// FECHAR O MODAL COM O BOTÃO FECHAR
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

// COLOCAR UM ITEM NO CARRINHO
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

// FUNÇÃO PARA ADD NO CARRIHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        existingItem.quantity += 1
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    
    updateCartModal()
}

// ATUALIZA CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-5", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p  class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
    }
}

// PEGAR ENDEREÇO (Limpa o erro quando o usuário digita)
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue.trim() !== ""){
        addressWarn.classList.add("hidden");
        addressInput.style.borderColor = ""; 
    }
})

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestauranteOpen();
    if(!isOpen){

        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;
    
    if(addressInput.value.trim() === ""){
        addressWarn.classList.remove("hidden");
        addressInput.style.borderColor = "red"; 
        return;
    }

    const cartIems = cart.map((item) => {
        return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartIems)
    const phone = "13998002200"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
})

// VERIFICAR SE O RESTAURANTE ESTA ABERTO
function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

// MANIPULANDO COR DO HORARIO DE FUNCIONAMENTO
const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}