document.getElementById('submitTodo').addEventListener('click', async () => {
  const name = document.getElementById('todoName').value.trim();
  const priority = document.getElementById('todoPriority').value || 'low';
  const isFun = document.getElementById('todoIsFun').value || 'true';

document.getElementById('displayTodos').addEventListener('click', async () => {
    const response = await fetch('/todos');
    const todos = await response.json();
    document.getElementById('todoDisplay').textContent = JSON.stringify(todos, null, 2);
  });

document.getElementById('deleteTodo').addEventListener('click', async () => {
    const id = document.getElementById('todoIdToDelete').value;
    const response = await fetch(`/todos/${id}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
  });
    
  const todo = { name, priority, isFun: isFun === 'true' };

  console.log("Sending todo:", todo); // DEBUG

  try {
    const response = await fetch('/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to submit:', error); // DEBUG
      alert(`Failed to submit todo: ${error}`);
      return;
    }

    const result = await response.json();
    alert(`Todo added: ${JSON.stringify(result, null, 2)}`);
  } catch (err) {
    console.error('Error:', err); // DEBUG
    alert('An error occurred while adding todo');
  }
});
