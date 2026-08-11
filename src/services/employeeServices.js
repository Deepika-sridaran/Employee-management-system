const API_URL = "http://localhost:8080/employees";

export async function getAllEmployees() {

    const response = await fetch(API_URL);

    if (!response.ok){
        throw new Error("Failed to fetch Employees");
    }
    return await response.json();
}
export async function getEmployeeById(id) {

    const response = await fetch ('${API_URL}/${id}');

    if (!response.ok){
        throw new Error("Failed to fetch Employee");
    }
    return await response.json();
}
export async function createEmployee(employee) {
    
    const response = await fetch(API_URL, {method:"POST", 
        headers:{"Content-Type": "application/json"}, body:JSON.stringify(employee)});

        if (!response.ok){
            throw new Error("Failed to Create Employee");
        }
        return await response.json();
}
export async function updateEmployee(id, employee) {
    
    const response = await fetch('${API_URL}/${id}', {method: "PUT", 
        headers: {"Content-Type": "application/json"}, body: JSON.stringify(employee)});

        if (!response.ok){
            throw new Error("Failed to Update Employee");
        }
        return await response.json();
}
export async function deleteEmployee(id) {

    const response = await fetch('${API_URL}/${id}', {
        method: "DELETE"});

    if (!response.ok) {
        throw new Error("Failed to delete employee");
    }
    return await response.text();
}