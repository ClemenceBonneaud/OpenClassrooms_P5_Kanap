////////// Page Panier //////////

// Stockage de l'url de l'API
const api = "http://localhost:3000/api/products";

// Stockage des éléments à ajouter au HTML
const elt = `<article class="cart__item" data-id="" data-color"">
                <div class="cart__item__img">
                    <img src="" alt="">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2></h2>
                        <p data-couleur = "couleur"></p>
                        <p data-prix = "prix">Blabla</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;

////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Mise en page ------------------------------ //
////////////////////////////////////////////////////////////////////////////////

// Récupération du panier
function getBasket() {
  // Récupération du panier
  let basket = localStorage.getItem("basket");

  // Si il n'y a pas de panier
  if (basket == null) {
    alert("Le panier est vide");
  }

  // Si il y a un panier
  else {
    return JSON.parse(basket);
  }
}

// Enregistrement du panier
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// Modification du panier
function addBasket(product, quantite) {
  // Récupération du panier
  let basket = getBasket();

  // Trouver le produit dans le panier
  let foundProduct = basket.find(
    (p) => p.id == product.id && p.option == product.option
  );

  foundProduct.quantity = quantite;

  // Enregistrement du panier
  saveBasket(basket);
}

// Suppression du panier
function removeFromBasket(product) {
  // Récupération du panier
  let basket = getBasket();

  // On supprime les produits ayant un id similaire à l'id du produit sélectionné
  basket = basket.filter(
    (p) => p.id != product.id || p.option != product.option
  );

  // Enregistrement du panier
  saveBasket(basket);
}

// Quantité totale
function getTotalNumber() {
  // Récupération du panier
  let basket = getBasket();
  let number = 0;
  for (let product of basket) {
    number += parseInt(product.quantity);
  }
  return number;
}

// Prix Total
function getTotalPrice() {
  // Récupération du panier
  let basket = getBasket();
  let price = 0;
  // On récupère les données de l'API
  fetch(api)
    .then(function (response) {
      return response.json();
    })
    .then(function (myData) {
      let panier = getBasket();
      for (let i = 0; i < panier.length; i += 1) {
        // On parcours l'API pour trouver le produit
        let foundProduct = myData.find((p) => p._id == panier[i].id);

        // On calcul le prix par produit
        priceProduct = panier[i].quantity * foundProduct.price;

        // On ajoute le prix de chaque produit au prix total
        price += priceProduct;
      }
      document.getElementById("totalPrice").innerText = price;
    });
}

// On récupère les données de l'API
fetch(api)
  .then(function (response) {
    return response.json();
  })
  .then(function (myData) {
    let panier = getBasket();
    for (let i = 0; i < panier.length; i += 1) {
      // On crée le bloc HTML
      document.getElementById("cart__items").innerHTML += elt;

      // -------------------- Informations du panier -------------------- //
      // ARTICLE - ID
      let articleId = document.querySelectorAll("section article")[i];
      articleId.setAttribute("data-id", panier[i].id);

      // ARTICLE - COLOR
      let articleColor = document.querySelectorAll("section article")[i];
      articleColor.setAttribute("data-color", panier[i].option);

      // COULEUR
      let couleur = document.querySelectorAll(
        ".cart__item__content__description > p[data-couleur]"
      )[i];
      couleur.innerText = panier[i].option;

      // QUANTITE
      let quantity = document.querySelectorAll(
        ".cart__item__content__settings__quantity > input"
      )[i];
      quantity.setAttribute("value", panier[i].quantity);

      // -------------------- Informations de l'API -------------------- //
      // On parcours l'API pour trouver le produit
      let foundProduct = myData.find((p) => p._id == panier[i].id);

      // IMAGE - SRC
      let imageSrc = document.querySelectorAll(".cart__item__img > img")[i];
      imageSrc.setAttribute("src", foundProduct.imageUrl);

      // IMAGE - ALT
      let imageAlt = document.querySelectorAll(".cart__item__img > img")[i];
      imageAlt.setAttribute("alt", foundProduct.altTxt);

      // NOM
      let nom = document.querySelectorAll(
        ".cart__item__content__description > h2"
      )[i];
      nom.innerText = foundProduct.name;

      // PRIX
      let prix = document.querySelectorAll(
        ".cart__item__content__description > p[data-prix]"
      )[i];
      prix.innerHTML = `${foundProduct.price} €`;
    }

    // -------------------- Totaux -------------------- //

    document.getElementById("totalQuantity").innerText = getTotalNumber();

    getTotalPrice();

    // -------------------- Modification des quantités -------------------- //
    let input = document.querySelectorAll(".itemQuantity");

    for (let k = 0; k < input.length; k += 1) {
      input[k].addEventListener("change", function () {
        // Récupération de la nouvelle valeur
        let newValue = document.querySelectorAll(".itemQuantity")[k].value;
        addBasket(panier[k], newValue);

        // Recalcul des totaux

        document.getElementById("totalQuantity").innerText = getTotalNumber();

        getTotalPrice();
      });
    }

    // -------------------- Suppression d'un produit -------------------- //
    let boutonSupprimer = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < boutonSupprimer.length; j += 1) {
      boutonSupprimer[j].addEventListener("click", function () {
        // Message d'alerte
        if (
          confirm(
            `Êtes-vous certain.e de vouloir retirer cet article du panier ?`
          )
        ) {
          // Récupérer le produit lié au bouton
          let productToRemove = boutonSupprimer[j].closest("article");
          let productToDelete = panier[j];

          // Supprimer le produit
          productToRemove.remove();

          // Supprimer le produit du localStorage
          removeFromBasket(productToDelete);

          // Recalcul des totaux

          document.getElementById("totalQuantity").innerText = getTotalNumber();

          getTotalPrice();
        }
      });
    }
  })
  .catch(function (err) {
    console.log(err);
  });

////////////////////////////////////////////////////////////////////////////////////////
// ------------------------------ Validation du panier ------------------------------ //
////////////////////////////////////////////////////////////////////////////////////////

let submit = document.querySelector("#order");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  // Récupération des input
  let firstName = document.querySelector("#firstName");
  let lastName = document.querySelector("#lastName");
  let address = document.querySelector("#address");
  let city = document.querySelector("#city");
  let email = document.querySelector("#email");

  // Récupération des messages
  let firstNameMessage = document.querySelector("#firstNameErrorMsg");
  let lastNameMessage = document.querySelector("#lastNameErrorMsg");
  let addressMessage = document.querySelector("#addressErrorMsg");
  let cityMessage = document.querySelector("#cityErrorMsg");
  let emailMessage = document.querySelector("#emailErrorMsg");

  // Messages par défaut
  firstNameMessage.innerText = "";
  lastNameMessage.innerText = "";
  addressMessage.innerText = "";
  cityMessage.innerText = "";
  emailMessage.innerText = "";

  // Messages en cas d'erreur
  firstName.oninvalid = function () {
    firstNameMessage.innerText = "Veuillez saisir un prénom";
  };
  lastName.oninvalid = function () {
    lastNameMessage.innerText = "Veuillez saisir un nom";
  };
  address.oninvalid = function () {
    addressMessage.innerText = "Veuillez saisir une adresse";
  };
  city.oninvalid = function () {
    cityMessage.innerText = "Veuillez saisir une ville";
  };
  email.oninvalid = function () {
    emailMessage.innerText =
      "Veuillez saisir un email valide \nex : monkanap@kanap.com";
  };

  // Récupération des informations fournies
  let prenom = document.querySelector("#firstName").value;
  let nom = document.querySelector("#lastName").value;
  let adresse = document.querySelector("#address").value;
  let ville = document.querySelector("#city").value;
  let mail = document.querySelector("#email").value;

  // -------------------- Objet contact / Object tableau -------------------- //
  let contact = {
    firstName: prenom,
    lastName: nom,
    address: adresse,
    city: ville,
    email: mail,
  };

  let tabProduit = getBasket();

  let products = [];

  for (produit of tabProduit) {
    products.push(produit.id);
  }

  // -------------------- Récupération du numéro de commande -------------------- //

  /*   let request = new Request(api, {
    method: "POST",
    body: JSON.stringify(contact),
    headers: new Headers(),
  });

  fetch(request).then(function (response) {
    console.log(response.json);
  }); */

  fetch(api, {
    method: "POST",
    headers: {
      "Accept": "application/json", 
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact), 
  });

  //   document.location.href = "./confirmation.html";
});
