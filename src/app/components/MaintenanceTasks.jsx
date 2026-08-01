import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Plus, X, Wrench } from 'lucide-react';
import styles from './MaintenanceTasks.module.css';

const priorityConfig = {
  low:    { label: 'Baja',  badgeClass: 'badge-neutral', dotColor: '#9aa0b2' },
  medium: { label: 'Media', badgeClass: 'badge-warning', dotColor: '#d97706' },
  high:   { label: 'Alta',  badgeClass: 'badge-danger',  dotColor: '#dc2626' },
};

const statusConfig = {
  pending:     { label: 'Pendiente',   icon: Clock,        color: 'var(--text-secondary)' },
  in_progress: { label: 'En Progreso', icon: AlertCircle,  color: 'var(--accent)'         },
  completed:   { label: 'Completada',  icon: CheckCircle,  color: 'var(--success)'        },
};

const filterOptions = [
  { key: 'all',         label: 'Todas'       },
  { key: 'pending',     label: 'Pendiente'   },
  { key: 'in_progress', label: 'En Progreso' },
  { key: 'completed',   label: 'Completada'  },
];

export default function MaintenanceTasks({ tasks, onUpdateTask, onAddTask }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onAddTask({
      roomNumber: fd.get('roomNumber'),
      title: fd.get('title'),
      description: fd.get('description'),
      priority: fd.get('priority'),
      status: 'pending',
      reportedBy: 'Encargado',
      reportedAt: new Date().toLocaleDateString('es-AR'),
    });
    setShowForm(false);
    e.currentTarget.reset();
  };

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between gap-3">
        <div>
          <h1 className="page-title">Reparaciones y Mantenimiento</h1>
          <p className="page-subtitle">Gestión de reportes y reparaciones del edificio</p>
        </div>
        <button className="btn-nodus btn-primary-nodus" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Nueva Tarea
        </button>
      </div>

      <div className="filter-tabs mb-4">
        {filterOptions.map(opt => (
          <button key={opt.key}
            className={`filter-tab${filter === opt.key ? ' active' : ''}`}
            onClick={() => setFilter(opt.key)}>
            {opt.label}
            <span className="count-badge">
              {opt.key === 'all' ? tasks.length : tasks.filter(t => t.status === opt.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="d-flex flex-column gap-2">
        {filtered.map(task => {
          const pCfg = priorityConfig[task.priority];
          const sCfg = statusConfig[task.status];
          const StatusIcon = sCfg.icon;

          return (
            <div key={task.id} className={`task-card priority-${task.priority}`}>
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="flex-grow-1 min-width-0">
                  <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                    <span className={styles.roomTag}>{task.roomNumber}</span>
                    <span className={`badge-nodus ${pCfg.badgeClass}`}>
                      <span className={styles.priorityDot} style={{ background: pCfg.dotColor }} />
                      {pCfg.label}
                    </span>
                    <span className={styles.statusLabel} style={{ color: sCfg.color }}>
                      <StatusIcon size={13} /> {sCfg.label}
                    </span>
                  </div>

                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <p className={styles.taskDesc}>{task.description}</p>

                  <div className={styles.taskMeta}>
                    <span>Reportado por: <strong className={styles.metaStrong}>{task.reportedBy}</strong></span>
                    <span> · </span>
                    <span>{task.reportedAt}</span>
                    {task.assignedTo && (
                      <><span> · </span><span>Asignado a: <strong className={styles.metaStrong}>{task.assignedTo}</strong></span></>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {task.status === 'pending' && (
                    <button onClick={() => onUpdateTask(task.id, { status: 'in_progress' })}
                      className="btn-nodus btn-ghost btn-sm-nodus">Iniciar</button>
                  )}
                  {task.status === 'in_progress' && (
                    <button onClick={() => onUpdateTask(task.id, { status: 'completed' })}
                      className="btn-nodus btn-success-nodus btn-sm-nodus">Completar</button>
                  )}
                  {task.status === 'completed' && (
                    <span className="badge-nodus badge-success"><CheckCircle size={11} /> Completada</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state">
            <Wrench size={40} className="empty-state-icon" />
            <p className={styles.emptyTitle}>Sin tareas</p>
            <p className={styles.emptyText}>No hay tareas en esta categoría</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className={`modal-box ${styles.formModal}`}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Reportar Nuevo Problema</h2>
                <p className="modal-subtitle">Completá los datos del reporte</p>
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label className="label-nodus">Ubicación (Unidad / Área)</label>
                  <input type="text" name="roomNumber" required className="input-nodus"
                    placeholder="Ej: 2A, Terraza, Ascensor" />
                </div>
                <div>
                  <label className="label-nodus">Título</label>
                  <input type="text" name="title" required className="input-nodus"
                    placeholder="Ej: Aire acondicionado no funciona" />
                </div>
                <div>
                  <label className="label-nodus">Descripción</label>
                  <textarea name="description" required rows={3}
                    className={`input-nodus ${styles.textareaInput}`}
                    placeholder="Describí el problema con detalle…" />
                </div>
                <div>
                  <label className="label-nodus">Prioridad</label>
                  <select name="priority" required className="input-nodus select-nodus">
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div className="divider" />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn-nodus btn-primary-nodus flex-fill">Crear Tarea</button>
                  <button type="button" className="btn-nodus btn-ghost flex-fill"
                    onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
