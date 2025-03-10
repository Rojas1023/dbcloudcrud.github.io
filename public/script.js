async function fetchAccounts() {
    try {
        const response = await fetch("http://localhost:3000/accounts");
        const data = await response.json();

        const tableBody = document.getElementById("accounts-table");
        tableBody.innerHTML = "";

        data.forEach(account => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${account.id}</td>
                <td>${account.nombre}</td>
                <td>${account.balance}</td>
                <td>${account.telefono}</td>
                <td>
                    <button onclick="editAccount('${account.id}', '${account.nombre}', ${account.balance}, '${account.telefono}')">Editar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

function createAccount() {
    const nombre = prompt("Ingrese el nombre:");
    const balance = prompt("Ingrese el balance:");
    const telefono = prompt("Ingrese el teléfono:");

    if (nombre && balance && telefono) {
        fetch("http://localhost:3000/accounts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, balance, telefono }),
        })
        .then(response => {
            if (response.ok) {
                alert("Cuenta creada con éxito.");
                fetchAccounts(); // Actualizar la lista de cuentas
            } else {
                alert("Error al crear la cuenta.");
            }
        })
        .catch(error => console.error("Error al crear la cuenta:", error));
    }
}

function editAccount(id, nombre, balance, telefono) {
    localStorage.setItem("editAccountId", id);
    localStorage.setItem("editAccountNombre", nombre);
    localStorage.setItem("editAccountBalance", balance);
    localStorage.setItem("editAccountTelefono", telefono);
    window.location.href = "/editar.html";
}

window.onload = fetchAccounts;