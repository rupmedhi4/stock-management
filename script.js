document.getElementById("candyForm").addEventListener("submit", async (event) => {
    event.preventDefault(); 
  
    try {
      const candyName = document.getElementById("candyName").value;
      const candyDescription = document.getElementById("candyDescription").value;
      const quantity = document.getElementById("quantity").value;
      const price = document.getElementById("price").value;
  
      if (!candyName || !candyDescription || !quantity || !price) {
        alert("Please fill in all fields");
        return;
      }
  
      const candyData = {
        name: candyName,
        description: candyDescription,
        quantity:quantity,
        price: price
      };
  
      const response = await fetch(
        "https://crudcrud.com/api/ff9959587f714d43a25c742728977a26/candyData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(candyData),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Candy added:", data);
      alert("Candy added successfully!");
  
    document.getElementById("candyName").value=""
    document.getElementById("candyDescription").value=""
    document.getElementById("quantity").value=""
    document.getElementById("price").value=""
    initialLoad()

    } catch (error) {
      console.error("Error adding candy:", error);
      alert("Something went wrong. Please try again.");
    }
});



async function initialLoad(){
    try {
      const response = await fetch("https://crudcrud.com/api/ff9959587f714d43a25c742728977a26/candyData", {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); 
      console.log(data);
  
      const stockContainer = document.querySelector(".stock-container");
  
      data.forEach((item) => {
        const stockItem = document.createElement("div");
        stockItem.classList.add("stock-item");
        stockItem.setAttribute("data-id", item._id); 
  
        stockItem.innerHTML = `
          <div>${item.name}</div>
          <div>${item.description}</div>
          <div><span class="quantity">${item.quantity}</span></div>
          <div>$${item.price}</div>
          <div class="actions">
            <button class="buy1">Buy 1</button>
            <button class="buy2">Buy 2</button>
            <button class="buy3">Buy 3</button>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        `;
  
        stockContainer.appendChild(stockItem);
      });
  
      stockContainer.addEventListener("click", async (e) => {
        const stockItem = e.target.closest(".stock-item");
        const stockId = stockItem.getAttribute("data-id");
        const quantityElement = stockItem.querySelector(".quantity");
        let currentQuantity = parseInt(quantityElement.textContent);
  
        if (e.target.classList.contains("buy1")) {
          updateQuantity(stockId, currentQuantity - 1, quantityElement);
        } else if (e.target.classList.contains("buy2")) {
          updateQuantity(stockId, currentQuantity - 2, quantityElement);
        } else if (e.target.classList.contains("buy3")) {
          updateQuantity(stockId, currentQuantity - 3, quantityElement);
        } else if (e.target.classList.contains("edit")) {
          editItem(stockId);
        } else if (e.target.classList.contains("delete")) {
          deleteItem(stockId, stockItem);
        }
      });
  
      async function updateQuantity(id, newQuantity, quantityElement) {
        if (newQuantity < 0) {
          alert("Quantity cannot be less than 0.");
          return;
        }
        try {
          await fetch(`https://crudcrud.com/api/ff9959587f714d43a25c742728977a26/candyData/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: newQuantity }),
          });
          quantityElement.textContent = newQuantity; 
        } catch (error) {
          console.error("Error updating quantity:", error);
        }
      }
  
      function editItem(id) {
        const newName = prompt("Enter new name:");
        const newDescription = prompt("Enter new description:");
        const newQuantity = prompt("Enter new quantity:");
        const newPrice = prompt("Enter new price:");
  
        if (newName && newDescription && newQuantity && newPrice) {
          fetch(`https://crudcrud.com/api/ff9959587f714d43a25c742728977a26/candyData/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newName,
              description: newDescription,
              quantity: parseInt(newQuantity),
              price: parseFloat(newPrice),
            }),
          })
            .then(() => {
              alert("Item updated successfully!");
              location.reload(); 
            })
            .catch((error) => console.error("Error editing item:", error));
        }
      }
  
      async function deleteItem(id, stockItem) {
        try {
          await fetch(`https://crudcrud.com/api/ff9959587f714d43a25c742728977a26/candyData/${id}`, {
            method: "DELETE",
          });
          stockItem.remove(); 
          alert("Item deleted successfully!");
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};


document.addEventListener("DOMContentLoaded",()=>{
    initialLoad()
})