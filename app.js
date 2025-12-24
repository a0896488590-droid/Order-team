// For simplicity using localStorage
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

// Helper: calculate total
function calcTotal(quantity, price, delivery){
  return quantity * price + delivery;
}

// Display orders for member
function displayMemberOrders(){
  const list = document.getElementById('orderList');
  if(!list) return;
  list.innerHTML = '';
  const username = localStorage.getItem('username');
  orders.filter(o => o.createdBy === username).forEach((order, idx)=>{
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <strong>${order.bookName}</strong> | ${order.quantity} x ${order.bookPrice} + ${order.deliveryFee} = ${order.total}<br>
      Status: ${order.status}<br>
      Notes: ${order.notes}<br>
      <button onclick="requestEdit(${idx})">Request Edit</button>
    `;
    list.appendChild(div);
  });
}

// Display orders for admin
function displayAdminOrders(){
  const list = document.getElementById('adminOrderList');
  if(!list) return;
  list.innerHTML = '';
  orders.forEach((order, idx)=>{
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <strong>${order.bookName}</strong> | ${order.quantity} x ${order.bookPrice} + ${order.deliveryFee} = ${order.total}<br>
      Status: ${order.status} | Created by: ${order.createdBy}<br>
      Notes: ${order.notes}<br>
      <button onclick="approveEdit(${idx})">Approve Edit</button>
      <button onclick="rejectEdit(${idx})">Reject Edit</button>
    `;
    list.appendChild(div);
  });
}

// Member submits new order
const orderForm = document.getElementById('orderForm');
if(orderForm){
  orderForm.addEventListener('submit', e=>{
    e.preventDefault();
    const newOrder = {
      customerName: document.getElementById('customerName').value,
      phone: document.getElementById('phone').value,
      bookName: document.getElementById('bookName').value,
      quantity: Number(document.getElementById('quantity').value),
      bookPrice: Number(document.getElementById('bookPrice').value),
      deliveryFee: Number(document.getElementById('deliveryFee').value),
      notes: document.getElementById('notes').value,
      status: 'Pending',
      createdBy: localStorage.getItem('username'),
      total: 0,
      editRequested: false,
      editData: null
    };
    newOrder.total = calcTotal(newOrder.quantity,newOrder.bookPrice,newOrder.deliveryFee);
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    orderForm.reset();
    displayMemberOrders();
  });
}

// Member requests edit
function requestEdit(idx){
  const newNotes = prompt("အမိန့်ပြင်လိုသည့် note ထည့်ပါ:");
  if(newNotes){
    orders[idx].editRequested = true;
    orders[idx].editData = {notes: newNotes};
    localStorage.setItem('orders', JSON.stringify(orders));
    displayMemberOrders();
    alert("Edit request submitted");
  }
}

// Admin approves edit
function approveEdit(idx){
  if(orders[idx].editRequested && orders[idx].editData){
    orders[idx].notes = orders[idx].editData.notes;
    orders[idx].editRequested = false;
    orders[idx].editData = null;
    localStorage.setItem('orders', JSON.stringify(orders));
    displayAdminOrders();
    alert("Edit approved");
  }
}

// Admin rejects edit
function rejectEdit(idx){
  if(orders[idx].editRequested){
    orders[idx].editRequested = false;
    orders[idx].editData = null;
    localStorage.setItem('orders', JSON.stringify(orders));
    displayAdminOrders();
    alert("Edit rejected");
  }
}

// Initial display
displayMemberOrders();
displayAdminOrders();
