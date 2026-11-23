export type DeviceType = 'cctv' | 'access_point' | 'switch';

export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface DeviceNode {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  mac?: string;
  port?: string;
  location: string;
  status: DeviceStatus;
  x: number; // Persentase 0 - 100% dari lebar denah
  y: number; // Persentase 0 - 100% dari tinggi denah
  lastSeen?: string;
  notes?: string;
}

export type DeviceFilter = 'all' | DeviceType;
export type StatusFilter = 'all' | DeviceStatus;

export interface TopologyStats {
  total: number;
  online: number;
  offline: number;
  warning: number;
  cctvCount: number;
  apCount: number;
  switchCount: number;
}

// Navigation & Multi-level Maps
export type ViewMode = 'full_map' | 'building_detail';

export type ZoneCategory = 'office' | 'production' | 'warehouse' | 'utility' | 'security' | 'other';
export type ZoneColor = 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';

export interface BuildingFloorConfig {
  id: 'l1' | 'l2';
  name: string;
  description: string;
  svgPath: string;
  aspectRatio: string;
  storageKey: string;
}

export interface BuildingZone {
  id: string;
  name: string;
  code: string;
  category: ZoneCategory;
  description: string;
  color?: ZoneColor;
  x: number; // Persentase pada Full Map (0 - 100)
  y: number; // Persentase pada Full Map (0 - 100)
  width: number; // Lebar persentase (1 - 100)
  height: number; // Tinggi persentase (1 - 100)
  floors?: BuildingFloorConfig[];
  isClickable: boolean;
  totalDevices?: number;
  onlineDevices?: number;
}
