////////// Fonctions utiles //////////

// Enregistrement du panier
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupération du panier
function getBasket() {
  // Récupération du panier
  let basket = localStorage.getItem("basket");

  // Si il n'y a pas encore de panier
  if (basket == null) {
    return [];
  }

  // Si il y a déjà un panier
  else {
    return JSON.parse(basket);
  }
}

// Ajout au panier
function addBasket(product) {
  // Récupération du panier
  let basket = getBasket();

  // Chercher si le produit existe déjà
  let foundProduct = basket.find((p) => p.id == product.id);

  // Si le produit existe déjà dans le panier
  if (foundProduct != undefined) {
    foundProduct.quantity += 1;
  }

  // Si le produit n'existe pas
  else {
    product.quantity = 1;
    // Ajout du nouveau produit au panier
    basket.push(product);
  }

  // Enregistrement du panier
  saveBasket(basket);
}

// Suppression d'un produit du panier
function removeFromBasket(product) {
  // Récupération du panier
  let basket = getBasket();

  // On supprime les produits ayant un id similaire à l'id du produit sélectionné
  basket = basket.filter((p) => p.id != product.id);

  // Enregistrement du panier
  saveBasket(basket);
}

// Modifier les quantités (addition ou soustraction)
function changeQuantity(product, quantity) {
  // Récupération du panier
  let basket = getBasket();

  // Chercher si le produit existe déjà
  let foundProduct = basket.find((p) => p.id == product.id);

  // Si le produit existe déjà dans le panier
  if (foundProduct != undefined) {
    foundProduct.quantity += quantity;

    // Si on arrive à 0
    if(foundProduct.quantity <= 0){
        removeFromBasket(foundProduct);
    }

    // Si on est au dessus de 0
    else {
        saveBasket(basket);
    }
  }
}

// Récupérer le nombre total de produits dans le panier
function getNumberProduct(){
  // Récupération du panier
  let basket = getBasket();
  let number = 0;
  for(let product of basket){
      number += product.quantity;
  }
  return number;
}

// Récupérer le prix total du panier
function getTotalPrice(){
      // Récupération du panier
  let basket = getBasket();
  let total = 0;
  for(let product of basket){
      total += product.quantity * product.price;
  }
  return total;
}














