import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists for persistent SQLite database
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance & safe concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK(priority IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL CHECK(status IN ('Pending', 'In Progress', 'Completed')),
    due_date TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
`);

// Seed initial realistic data if database is empty so the user lands on an active workspace
const count = (db.prepare('SELECT count(*) as total FROM tasks').get() as { total: number }).total;

if (count === 0) {
  const today = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];
  
  const dToday = formatYMD(today);
  
  const dYesterday = new Date(today);
  dYesterday.setDate(today.getDate() - 1);
  const strYesterday = formatYMD(dYesterday);

  const dTomorrow = new Date(today);
  dTomorrow.setDate(today.getDate() + 1);
  const strTomorrow = formatYMD(dTomorrow);

  const dIn3Days = new Date(today);
  dIn3Days.setDate(today.getDate() + 3);
  const strIn3Days = formatYMD(dIn3Days);

  const dIn5Days = new Date(today);
  dIn5Days.setDate(today.getDate() + 5);
  const strIn5Days = formatYMD(dIn5Days);

  const dLastWeek = new Date(today);
  dLastWeek.setDate(today.getDate() - 4);
  const strLastWeek = formatYMD(dLastWeek);

  const seedStmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, due_date, category, created_at, updated_at)
    VALUES (@title, @description, @priority, @status, @due_date, @category, @created_at, @updated_at)
  `);

  const initialTasks = [
    {
      title: 'Design API contract for payment gateway',
      description: 'Draft the OpenAPI v3 spec for webhook verification and idempotency keys.',
      priority: 'High',
      status: 'In Progress',
      due_date: dToday,
      category: 'Engineering',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'Review Q4 budget proposal',
      description: 'Audit cloud infrastructure expenses and vendor renewal projections.',
      priority: 'High',
      status: 'Pending',
      due_date: strYesterday, // Overdue task demonstration
      category: 'Finance',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    {
      title: 'Implement Dark Mode design tokens',
      description: 'Map surface colors, contrast pairings, and border tokens across the UI components.',
      priority: 'Medium',
      status: 'Completed',
      due_date: strYesterday,
      category: 'Design',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      title: 'Prepare product launch roadmap deck',
      description: 'Consolidate engineering milestones and marketing launch timelines into 12 slides.',
      priority: 'High',
      status: 'In Progress',
      due_date: strTomorrow,
      category: 'Product',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'Weekly team sprint retrospective',
      description: 'Discuss delivery velocity, blockers, and CI test pipeline optimizations.',
      priority: 'Medium',
      status: 'Pending',
      due_date: dToday,
      category: 'Operations',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      title: 'Security audit for OAuth token refresh',
      description: 'Inspect rotation mechanics, token storage encryption, and CSRF token propagation.',
      priority: 'High',
      status: 'Pending',
      due_date: strIn3Days,
      category: 'Security',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      title: 'Optimize SQLite indexing for search queries',
      description: 'Add composite indexes on status, category, and due_date to ensure sub-millisecond query responses.',
      priority: 'Low',
      status: 'Completed',
      due_date: strLastWeek,
      category: 'Engineering',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      title: 'Update customer documentation and changelog',
      description: 'Document the new REST API filters and bulk update endpoints.',
      priority: 'Low',
      status: 'Pending',
      due_date: strIn5Days,
      category: 'Documentation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const seedMany = db.transaction((tasks) => {
    for (const t of tasks) seedStmt.run(t);
  });

  seedMany(initialTasks);
}
