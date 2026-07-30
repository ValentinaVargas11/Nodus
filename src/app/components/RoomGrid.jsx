import { Bed, Users, Wrench, Sparkles, DoorOpen } from 'lucide-react';
import styles from './RoomGrid.module.css';

const statusConfig = {
  available:   { label: 'Disponible',    cssClass: 'status-available',   textColor: '#16a34a', icon: DoorOpen  },
  occupied:    { label: 'Ocupada',       cssClass: 'status-occupied',    textColor: '#4f6ef7', icon: Bed       },
  cleaning:    { label: 'En Limpieza',   cssClass: 'status-cleaning',    textColor: '#d97706', icon: Sparkles  },
  maintenance: { label: 'Mantenimiento', cssClass: 'status-maintenance', textColor: '#dc2626', icon: Wrench    },
};

const legendDots = [
  { key: 'available',   color: '#16a34a', label: 'Disponible'    },
  { key: 'occupied',    color: '#4f6ef7', label: 'Ocupada'       },
  { key: 'cleaning',    color: '#d97706', label: 'En Limpieza'   },
  { key: 'maintenance', color: '#dc2626', label: 'Mantenimiento' },
];

function groupByFloor(rooms) {
  return rooms.reduce((acc, room) => {
    (acc[room.floor] ??= []).push(room);
    return acc;
  }, {});
}

export default function RoomGrid({ rooms, onRoomClick }) {
  const groupedByFloor = groupByFloor(rooms);
  const floors = Object.keys(groupedByFloor).map(Number).sort((a, b) => b - a);

  return (
    <div>
      <div className="page-header d-flex align-items-start justify-content-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Unidades / Departamentos</h1>
          <p className="page-subtitle">Vista por pisos · {rooms.length} unidades en total</p>
        </div>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          {legendDots.map(d => (
            <div key={d.key} className="d-flex align-items-center gap-2">
              <span className={styles.legendDot} style={{ background: d.color }} />
              <span className={styles.legendLabel}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        {floors.map(floor => (
          <div key={floor}>
            <div className="floor-label">Piso {floor}</div>
            <div className="row g-2">
              {groupedByFloor[floor].map(room => {
                const cfg = statusConfig[room.status];
                const Icon = cfg.icon;
                return (
                  <div key={room.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                    <button className={`room-card ${cfg.cssClass}`} onClick={() => onRoomClick(room)}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="room-number" style={{ color: cfg.textColor }}>{room.number}</span>
                        <Icon size={15} color={cfg.textColor} />
                      </div>
                      <div className="room-type">{room.type}</div>
                      {room.status === 'occupied' && room.guestName && (
                        <>
                          <div className="room-tenant" style={{ color: cfg.textColor }}>{room.guestName}</div>
                          {room.tenantSince && <div className={styles.tenantSince}>Desde: {room.tenantSince}</div>}
                          {room.guests > 0 && (
                            <div className={styles.guestCount}>
                              <Users size={10} /> {room.guests} {room.guests === 1 ? 'persona' : 'personas'}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
