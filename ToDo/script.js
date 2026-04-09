  console.log("js loaded");
  
  const STORAGE_KEY = 'mytasks_v1';
 
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const now = new Date();
    document.getElementById('dateline').textContent =
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()} ${now.getFullYear()}`;
 
    function loadTasks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultTasks();
      } catch { return defaultTasks(); }
    }
 
    function defaultTasks() {
      return [
        { id: 1, text: 'Task 1', priority: 'high', done: false },
        { id: 2, text: 'Task 2', priority: 'med', done: true },
        { id: 3, text: 'Task 3', priority: 'low', done: false },
      ];
    }
 
    let tasks = loadTasks();
    let filter = 'all';
    let nextId = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1;
 
    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
    }
 
    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
 
    function taskHTML(t) {
      return `<div class="task-item ${t.done ? 'done' : ''}" id="task-${t.id}">
        <div class="check-box ${t.done ? 'checked' : ''}" data-id="${t.id}" role="checkbox" aria-checked="${t.done}" tabindex="0">
          <svg class="check-icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="priority-dot p-${t.priority}" title="${t.priority} priority"></span>
        <span class="task-text">${escHtml(t.text)}</span>
        <button class="del-btn" data-id="${t.id}" aria-label="Delete task" title="Delete">✕</button>
      </div>`;
    }
 
    function render() {
      const total = tasks.length;
      const done  = tasks.filter(t => t.done).length;
      const open  = total - done;
 
      document.getElementById('stat-total').textContent = total;
      document.getElementById('stat-open').textContent  = open;
      document.getElementById('stat-done').textContent  = done;
 
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      document.getElementById('progress-fill').style.width = pct + '%';
 
      const visible = tasks.filter(t =>
        filter === 'all'  ? true :
        filter === 'done' ? t.done : !t.done
      );
 
      const container = document.getElementById('tasks-container');
 
      if (visible.length === 0) {
        container.innerHTML = `<div class="empty-state">${
          filter === 'done' ? 'no completed tasks yet' :
          filter === 'open' ? 'all caught up!' :
          'no tasks yet — add one above'
        }</div>`;
        return;
      }
 
      const openTasks = visible.filter(t => !t.done);
      const doneTasks = visible.filter(t =>  t.done);
 
      let html = '';
      if (openTasks.length > 0) {
        if (filter === 'all') html += `<div class="section-label">Open</div>`;
        openTasks.forEach(t => html += taskHTML(t));
      }
      if (doneTasks.length > 0) {
        if (filter === 'all') html += `<div class="section-label">Completed</div>`;
        doneTasks.forEach(t => html += taskHTML(t));
      }
 
      container.innerHTML = html;
 
      container.querySelectorAll('.check-box').forEach(el => {
        el.addEventListener('click', () => toggle(+el.dataset.id));
        el.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') toggle(+el.dataset.id); });
      });
      container.querySelectorAll('.del-btn').forEach(el => {
        el.addEventListener('click', () => remove(+el.dataset.id));
      });
    }
 
    function toggle(id) {
      const t = tasks.find(t => t.id === id);
      if (t) { t.done = !t.done; save(); render(); }
    }
 
    function remove(id) {
      tasks = tasks.filter(t => t.id !== id);
      save(); render();
    }
 
    function addTask() {
      const input = document.getElementById('task-input');
      const text  = input.value.trim();
      if (!text) { input.focus(); return; }
      const priority = document.getElementById('priority-sel').value;
      tasks.unshift({ id: nextId++, text, priority, done: false });
      input.value = '';
      if (filter === 'done') setFilter('all');
      save(); render();
      input.focus();
    }
 
    function setFilter(f) {
      filter = f;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === f);
      });
      render();
    }
 
    document.getElementById('add-btn').addEventListener('click', addTask);
    document.getElementById('task-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') addTask();
    });
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
    document.getElementById('clear-done').addEventListener('click', () => {
      tasks = tasks.filter(t => !t.done);
      save(); render();
    });
 
    render();