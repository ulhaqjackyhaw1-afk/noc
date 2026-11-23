import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DeviceNode, DeviceType, DeviceStatus, DeviceFilter } from '../types/topology';

// --- Preset Data for Office Lantai 1 ---
const INITIAL_DEVICES_L1: DeviceNode[] = [
  {
    id: 'l1-sw-1',
    name: 'SW-L1-PANEL',
    type: 'switch',
    ip: '192.168.10.4',
    mac: '00:1A:2B:3C:4D:11',
    port: 'Port 1-24',
    location: 'R. Panel',
    status: 'online',
    x: 18.0,
    y: 42.0,
    notes: 'Switch distribusi panel lantai 1',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l1-cctv-1',
    name: 'CCTV-L1-RESEPSI',
    type: 'cctv',
    ip: '192.168.10.30',
    mac: 'BC:5E:CD:11:44:01',
    port: 'Port 2',
    location: 'Resepsionis',
    status: 'online',
    x: 52.0,
    y: 28.0,
    notes: 'Kamera Dome arah meja tamu & pintu masuk',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l1-ap-1',
    name: 'AP-L1-LOBBY',
    type: 'access_point',
    ip: '192.168.10.11',
    mac: '70:89:CC:11:22:11',
    port: 'Port 3',
    location: 'Resepsionis',
    status: 'online',
    x: 48.0,
    y: 21.0,
    notes: 'Wi-Fi Tamu & Lobby Lantai 1',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l1-ap-2',
    name: 'AP-L1-ANGGREK',
    type: 'access_point',
    ip: '192.168.10.12',
    mac: '70:89:CC:11:22:12',
    port: 'Port 4',
    location: 'R. Anggrek',
    status: 'online',
    x: 84.0,
    y: 16.0,
    notes: 'Ruang Rapat Utama Lantai 1',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l1-cctv-2',
    name: 'CCTV-L1-KORIDOR',
    type: 'cctv',
    ip: '192.168.10.31',
    mac: 'BC:5E:CD:11:44:02',
    port: 'Port 5',
    location: 'Area Koridor',
    status: 'online',
    x: 52.0,
    y: 50.0,
    notes: 'Arah tangga dan lorong HGA',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l1-cctv-3',
    name: 'CCTV-L1-ARSIP',
    type: 'cctv',
    ip: '192.168.10.32',
    mac: 'BC:5E:CD:11:44:03',
    port: 'Port 6',
    location: 'R. Arsip',
    status: 'warning',
    x: 18.0,
    y: 88.0,
    notes: 'Bitrate drop / perlu pengecekan konektor',
    lastSeen: '10 menit lalu'
  },
  {
    id: 'l1-ap-3',
    name: 'AP-L1-HGA',
    type: 'access_point',
    ip: '192.168.10.14',
    mac: '70:89:CC:11:22:14',
    port: 'Port 7',
    location: 'Area Kerja PUR/MKT',
    status: 'online',
    x: 75.0,
    y: 65.0,
    notes: 'AP Area Kerja Staff HGA & Purchasing',
    lastSeen: 'Baru saja'
  }
];

// --- Preset Data for Office Lantai 2 ---
const INITIAL_DEVICES_L2: DeviceNode[] = [
  {
    id: 'l2-sw-1',
    name: 'SW-L2-CORE',
    type: 'switch',
    ip: '192.168.10.2',
    mac: '00:1A:2B:3C:4D:01',
    port: 'Gigabit 1-24',
    location: 'Ruang Server',
    status: 'online',
    x: 82.5,
    y: 62.0,
    notes: 'Switch core Cisco 24-Port rack utama',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l2-cctv-1',
    name: 'CCTV-L2-SERVER',
    type: 'cctv',
    ip: '192.168.10.25',
    mac: 'BC:5E:CD:11:22:33',
    port: 'Port 5',
    location: 'Ruang Server',
    status: 'online',
    x: 86.0,
    y: 54.5,
    notes: 'Kamera Dome 4K sudut rak server',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l2-ap-1',
    name: 'AP-L2-LAVENDER',
    type: 'access_point',
    ip: '192.168.10.15',
    mac: '70:89:CC:44:55:66',
    port: 'Port 3',
    location: 'R. Lavender',
    status: 'online',
    x: 48.0,
    y: 14.5,
    notes: 'UniFi U6 Pro - Meeting Room',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l2-cctv-2',
    name: 'CCTV-L2-KORIDOR',
    type: 'cctv',
    ip: '192.168.10.21',
    mac: 'BC:5E:CD:99:88:77',
    port: 'Port 6',
    location: 'Area Koridor',
    status: 'online',
    x: 52.0,
    y: 36.5,
    notes: 'Arah tangga & lorong tengah',
    lastSeen: 'Baru saja'
  },
  {
    id: 'l2-ap-2',
    name: 'AP-L2-TEDDY',
    type: 'access_point',
    ip: '192.168.10.16',
    mac: '70:89:CC:77:88:99',
    port: 'Port 4',
    location: 'R. Pak Teddy',
    status: 'warning',
    x: 80.0,
    y: 28.0,
    notes: 'Sinyal fluktuatif - butuh reboot',
    lastSeen: '5 menit lalu'
  },
  {
    id: 'l2-cctv-3',
    name: 'CCTV-L2-INFOR',
    type: 'cctv',
    ip: '192.168.10.23',
    mac: 'BC:5E:CD:33:44:55',
    port: 'Port 7',
    location: 'R. Infor',
    status: 'offline',
    x: 18.0,
    y: 58.0,
    notes: 'Kabel LAN terputus/perangkat mati',
    lastSeen: '2 jam lalu'
  }
];

const ROOM_PRESETS_L1 = [
  'Resepsionis',
  'R. Anggrek',
  'R. Lily',
  'R. Mawar',
  'R. Panel',
  'R. HGA',
  'R. Arsip',
  'Area Kerja PUR/MKT',
  'R. Pantry',
  'Toilet',
  'Area Tangga / Koridor'
];

const ROOM_PRESETS_L2 = [
  'Ruang Server',
  'R. Pak Jono',
  'R. Lavender',
  'R. Pak Hendra',
  'T. Direksi',
  'T. Office',
  'R. Infor',
  'R. Pak Teddy',
  'Area Koridor',
  'Tangga / Pintu Masuk'
];

// IPv4 Regex Validator
const IPV4_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// --- Embedded SVG Icons ---
const IconCCTV: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.7 8A3 3 0 0 0 14 6h-4a3 3 0 0 0-2.7 2L3 13.5A2 2 0 0 0 4.8 16h14.4a2 2 0 0 0 1.8-2.5L16.7 8z" />
    <circle cx="12" cy="11" r="2.5" />
    <path d="M10 16v3a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-3" />
    <path d="M7 21h10" />
  </svg>
);

const IconWifi: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
);

const IconSwitch: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="3" />
    <line x1="10" y1="12" x2="10.01" y2="12" strokeWidth="3" />
    <line x1="14" y1="12" x2="14.01" y2="12" strokeWidth="3" />
    <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="3" />
    <path d="M6 16h12" strokeDasharray="2 2" />
  </svg>
);

interface NetworkTopologyMapProps {
  floorId?: 'l1' | 'l2';
  buildingName?: string;
  onBackToFullMap?: () => void;
  onSwitchFloor?: (floorId: 'l1' | 'l2') => void;
}

export const NetworkTopologyMap: React.FC<NetworkTopologyMapProps> = ({
  floorId = 'l2',
  buildingName = 'Gedung Office',
  onBackToFullMap,
  onSwitchFloor
}) => {
  const currentFloorKey = `devices_office_${floorId}`;
  const initialFloorDevices = floorId === 'l1' ? INITIAL_DEVICES_L1 : INITIAL_DEVICES_L2;
  const currentRoomPresets = floorId === 'l1' ? ROOM_PRESETS_L1 : ROOM_PRESETS_L2;
  const currentSvgPath =
    floorId === 'l1' ? '/Office%20Lantai%201.drawio.svg' : '/Office%20Lantai%202.drawio.svg';
  const currentAspectRatio = floorId === 'l1' ? '627 / 702' : '622 / 593';
  const floorDimensions = floorId === 'l1' ? { width: 680, height: 760 } : { width: 740, height: 704 };

  // --- States ---
  const [devices, setDevices] = useState<DeviceNode[]>(() => {
    try {
      const saved = localStorage.getItem(currentFloorKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      console.warn('Gagal membaca data dari localStorage, menggunakan default.');
    }
    return initialFloorDevices;
  });

  // Re-sync devices whenever floorId changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(currentFloorKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDevices(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setDevices(initialFloorDevices);
    setInspectedDevice(null);
  }, [floorId]);

  const [mode, setMode] = useState<'monitoring' | 'edit'>('monitoring');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<DeviceFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlacementType, setActivePlacementType] = useState<DeviceType | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pin Dragging in Edit Mode
  const [draggingDeviceId, setDraggingDeviceId] = useState<string | null>(null);
  const isDraggingPinRef = useRef<boolean>(false);

  // Selected Pin for Monitoring Card & Tooltip
  const [inspectedDevice, setInspectedDevice] = useState<DeviceNode | null>(null);
  const [hoveredDevice, setHoveredDevice] = useState<DeviceNode | null>(null);

  // Modal State for Editing / Creating
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<Partial<DeviceNode>>({
    name: '',
    type: 'cctv',
    ip: '',
    mac: '',
    port: '',
    location: currentRoomPresets[0],
    status: 'online',
    notes: '',
    x: 50,
    y: 50
  });
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to LocalStorage per floor
  useEffect(() => {
    try {
      localStorage.setItem(currentFloorKey, JSON.stringify(devices));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [devices, currentFloorKey]);

  // Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const total = devices.length;
    const online = devices.filter(d => d.status === 'online').length;
    const offline = devices.filter(d => d.status === 'offline').length;
    const warning = devices.filter(d => d.status === 'warning').length;
    const cctvCount = devices.filter(d => d.type === 'cctv').length;
    const apCount = devices.filter(d => d.type === 'access_point').length;
    const switchCount = devices.filter(d => d.type === 'switch').length;
    return { total, online, offline, warning, cctvCount, apCount, switchCount };
  }, [devices]);

  // --- Filtered Devices ---
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchType = selectedTypeFilter === 'all' || device.type === selectedTypeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        device.name.toLowerCase().includes(q) ||
        device.ip.toLowerCase().includes(q) ||
        device.location.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [devices, selectedTypeFilter, searchQuery]);

  // --- Zoom Controls ---
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(0.6, Number((prev + delta).toFixed(2))), 3.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // --- Mouse Wheel Zoom ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom(prev => Math.min(Math.max(0.6, Number((prev + zoomFactor).toFixed(2))), 3.5));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- Canvas Pan Handlers ---
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (isDraggingPinRef.current || (e.target as HTMLElement).closest('.device-pin')) {
      return;
    }
    if (mode === 'monitoring' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
      return;
    }

    if (draggingDeviceId && mode === 'edit' && floorPlanRef.current) {
      const rect = floorPlanRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / rect.width) * 100;
      const rawY = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Number(Math.max(2, Math.min(98, rawX)).toFixed(2));
      const clampedY = Number(Math.max(2, Math.min(98, rawY)).toFixed(2));

      setDevices(prev =>
        prev.map(d => (d.id === draggingDeviceId ? { ...d, x: clampedX, y: clampedY } : d))
      );
    }
  };

  const handleMouseUpCanvas = () => {
    if (isPanning) setIsPanning(false);
    if (draggingDeviceId) {
      setDraggingDeviceId(null);
      setTimeout(() => {
        isDraggingPinRef.current = false;
      }, 50);
    }
  };

  // --- Click on Floor Plan (Placing new device) ---
  const handleFloorPlanClick = (e: React.MouseEvent) => {
    if (mode !== 'edit' || !activePlacementType || isDraggingPinRef.current) return;
    if (!floorPlanRef.current) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Number(Math.max(2, Math.min(98, clickX)).toFixed(2));
    const clampedY = Number(Math.max(2, Math.min(98, clickY)).toFixed(2));

    const prefix =
      activePlacementType === 'cctv'
        ? `CCTV-${floorId.toUpperCase()}`
        : activePlacementType === 'access_point'
        ? `AP-${floorId.toUpperCase()}`
        : `SW-${floorId.toUpperCase()}`;
    const nextNumber = devices.filter(d => d.type === activePlacementType).length + 1;

    setEditingDeviceId(null);
    setModalForm({
      name: `${prefix}-Unit${nextNumber}`,
      type: activePlacementType,
      ip: `192.168.10.${floorId === 'l1' ? 70 : 50 + devices.length}`,
      mac: '',
      port: '',
      location: currentRoomPresets[0],
      status: 'online',
      notes: '',
      x: clampedX,
      y: clampedY
    });
    setIsModalOpen(true);
    setActivePlacementType(null);
  };

  // --- Drag and Drop from Sidebar Palette ---
  const handlePaletteDragStart = (e: React.DragEvent, type: DeviceType) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleFloorPlanDragOver = (e: React.DragEvent) => {
    if (mode === 'edit') e.preventDefault();
  };

  const handleFloorPlanDrop = (e: React.DragEvent) => {
    if (mode !== 'edit' || !floorPlanRef.current) return;
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as DeviceType;
    if (!type || !['cctv', 'access_point', 'switch'].includes(type)) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const dropX = ((e.clientX - rect.left) / rect.width) * 100;
    const dropY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Number(Math.max(2, Math.min(98, dropX)).toFixed(2));
    const clampedY = Number(Math.max(2, Math.min(98, dropY)).toFixed(2));

    const prefix =
      type === 'cctv'
        ? `CCTV-${floorId.toUpperCase()}`
        : type === 'access_point'
        ? `AP-${floorId.toUpperCase()}`
        : `SW-${floorId.toUpperCase()}`;
    const nextNumber = devices.filter(d => d.type === type).length + 1;

    setEditingDeviceId(null);
    setModalForm({
      name: `${prefix}-Unit${nextNumber}`,
      type,
      ip: `192.168.10.${floorId === 'l1' ? 80 : 60 + devices.length}`,
      mac: '',
      port: '',
      location: currentRoomPresets[0],
      status: 'online',
      notes: '',
      x: clampedX,
      y: clampedY
    });
    setIsModalOpen(true);
  };

  // --- Pin Click / Interaction ---
  const handlePinMouseDown = (e: React.MouseEvent, device: DeviceNode) => {
    e.stopPropagation();
    if (mode === 'edit') {
      isDraggingPinRef.current = true;
      setDraggingDeviceId(device.id);
    }
  };

  const handlePinClick = (e: React.MouseEvent, device: DeviceNode) => {
    e.stopPropagation();
    if (mode === 'edit') {
      setEditingDeviceId(device.id);
      setModalForm({ ...device });
      setIsModalOpen(true);
    } else {
      setInspectedDevice(device);
    }
  };

  // --- Save / Delete Modal Form ---
  const isIpValid = useMemo(() => {
    return IPV4_REGEX.test(modalForm.ip || '');
  }, [modalForm.ip]);

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalForm.ip && !isIpValid) {
      alert('Format IPv4 tidak valid! Contoh format yang benar: 192.168.1.10');
      return;
    }

    const typePrefix =
      (modalForm.type || 'cctv') === 'cctv'
        ? `CCTV-${floorId.toUpperCase()}`
        : (modalForm.type || 'cctv') === 'access_point'
        ? `AP-${floorId.toUpperCase()}`
        : `SW-${floorId.toUpperCase()}`;
    const finalName = modalForm.name?.trim() || `${typePrefix}-Unit${devices.length + 1}`;
    const finalIp = modalForm.ip?.trim() || `192.168.10.${floorId === 'l1' ? 70 : 50 + devices.length}`;

    if (editingDeviceId) {
      setDevices(prev =>
        prev.map(d =>
          d.id === editingDeviceId
            ? ({
                ...d,
                ...(modalForm as DeviceNode),
                name: finalName,
                ip: finalIp,
                lastSeen: modalForm.status === 'offline' ? d.lastSeen : 'Baru saja'
              })
            : d
        )
      );
      showToast(`Perangkat "${finalName}" berhasil diperbarui.`);
    } else {
      const newDev: DeviceNode = {
        id: `dev-${floorId}-${Date.now()}`,
        name: finalName,
        type: modalForm.type || 'cctv',
        ip: finalIp,
        mac: modalForm.mac?.trim(),
        port: modalForm.port?.trim(),
        location: modalForm.location || currentRoomPresets[0],
        status: modalForm.status || 'online',
        notes: modalForm.notes?.trim() || '',
        x: modalForm.x ?? 50,
        y: modalForm.y ?? 50,
        lastSeen: 'Baru saja'
      };
      setDevices(prev => [...prev, newDev]);
      showToast(`Perangkat "${newDev.name}" berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteDevice = (id: string) => {
    const dev = devices.find(d => d.id === id);
    if (window.confirm(`Yakin ingin menghapus perangkat "${dev?.name}" dari denah ${floorId.toUpperCase()}?`)) {
      setDevices(prev => prev.filter(d => d.id !== id));
      if (inspectedDevice?.id === id) setInspectedDevice(null);
      setIsModalOpen(false);
      showToast(`Perangkat berhasil dihapus.`);
    }
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopyFeedback(ip);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // --- Export / Import JSON ---
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(devices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `network-topology-office-${floorId}-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Konfigurasi ${floorId.toUpperCase()} berhasil diexport.`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.every(p => p.id && p.name && p.type && p.ip)) {
          setDevices(parsed);
          showToast(`Berhasil mengimpor ${parsed.length} perangkat ke ${floorId.toUpperCase()}.`);
        } else {
          alert('Format file JSON tidak sesuai dengan spesifikasi DeviceNode.');
        }
      } catch {
        alert('Gagal membaca file JSON. Pastikan file valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getDeviceIcon = (type: DeviceType, className = 'w-4 h-4') => {
    switch (type) {
      case 'cctv':
        return <IconCCTV className={className} />;
      case 'access_point':
        return <IconWifi className={className} />;
      case 'switch':
        return <IconSwitch className={className} />;
    }
  };

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-400',
          ring: 'ring-emerald-400/50',
          text: 'text-emerald-400',
          ping: 'bg-emerald-400',
          label: 'Online'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-400',
          ring: 'ring-amber-400/50',
          text: 'text-amber-400',
          ping: 'bg-amber-400',
          label: 'Warning'
        };
      case 'offline':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-400',
          ring: 'ring-rose-400/50',
          text: 'text-rose-400',
          ping: 'bg-rose-400',
          label: 'Offline'
        };
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5.5rem)] min-h-[700px] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 border border-indigo-500/50 text-indigo-200 text-sm font-medium rounded-lg shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          {toastMessage}
        </div>
      )}

      {/* --- TOP BREADCRUMB & FLOOR SWITCHER BAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-900 border-b border-slate-800 z-30">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          {onBackToFullMap && (
            <button
              type="button"
              onClick={onBackToFullMap}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              ← Kembali ke Full Map
            </button>
          )}

          <span className="text-slate-500">/</span>
          <span className="font-bold text-white">{buildingName}</span>
          <span className="text-slate-500">/</span>

          {/* Lantai 1 / Lantai 2 Switcher Buttons */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => onSwitchFloor?.('l1')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
                floorId === 'l1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lantai 1
            </button>
            <button
              type="button"
              onClick={() => onSwitchFloor?.('l2')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all ${
                floorId === 'l2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lantai 2
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('monitoring');
              setActivePlacementType(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
              mode === 'monitoring'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Monitoring
          </button>

          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
              mode === 'edit'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Edit Tata Letak
          </button>
        </div>
      </div>

      {/* --- STATS PILLS & FILTER BAR --- */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-slate-900/70 border-b border-slate-800/80 backdrop-blur-md z-20 text-xs">
        {/* Statistics Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700/60">
            <span className="text-slate-400">Total {floorId.toUpperCase()}:</span>
            <span className="font-bold text-white text-xs">{stats.total}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-medium">Online:</span>
            <span className="font-bold text-emerald-300">{stats.online}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/50">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-amber-400 font-medium">Warning:</span>
            <span className="font-bold text-amber-300">{stats.warning}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/50">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span className="text-rose-400 font-medium">Offline:</span>
            <span className="font-bold text-rose-300">{stats.offline}</span>
          </div>
        </div>

        {/* Filter & Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari IP, nama, ruangan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-44 pl-7 pr-3 py-1 bg-slate-950/70 border border-slate-700 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <button
            type="button"
            onClick={handleExportJSON}
            title="Export Konfigurasi JSON"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 font-medium hover:text-white transition-colors"
          >
            Export
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import Konfigurasi JSON"
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 font-medium hover:text-white transition-colors"
          >
            Import
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />
        </div>
      </header>

      {/* --- MAIN WORKSPACE (SIDEBAR + CANVAS) --- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-900/80 border-r border-slate-800 flex flex-col z-10">
          {mode === 'edit' ? (
            /* Edit Palette */
            <div className="p-3.5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Palet {floorId.toUpperCase()}
                </h3>
                <span className="text-[10px] text-slate-400">Klik / Drag</span>
              </div>

              <div className="space-y-2">
                {/* CCTV */}
                <div
                  draggable
                  onDragStart={e => handlePaletteDragStart(e, 'cctv')}
                  onClick={() =>
                    setActivePlacementType(prev => (prev === 'cctv' ? null : 'cctv'))
                  }
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                    activePlacementType === 'cctv'
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-900/30'
                      : 'bg-slate-800/80 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="p-1.5 bg-cyan-600/20 text-cyan-400 rounded-md">
                    <IconCCTV className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      CCTV Camera
                    </div>
                    <div className="text-[10px] text-slate-400">Kamera pengawas</div>
                  </div>
                </div>

                {/* Access Point */}
                <div
                  draggable
                  onDragStart={e => handlePaletteDragStart(e, 'access_point')}
                  onClick={() =>
                    setActivePlacementType(prev => (prev === 'access_point' ? null : 'access_point'))
                  }
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                    activePlacementType === 'access_point'
                      ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/30'
                      : 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  <div className="p-1.5 bg-purple-600/20 text-purple-400 rounded-md">
                    <IconWifi className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      Access Point
                    </div>
                    <div className="text-[10px] text-slate-400">Wireless AP / Wi-Fi</div>
                  </div>
                </div>

                {/* Switch */}
                <div
                  draggable
                  onDragStart={e => handlePaletteDragStart(e, 'switch')}
                  onClick={() =>
                    setActivePlacementType(prev => (prev === 'switch' ? null : 'switch'))
                  }
                  className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                    activePlacementType === 'switch'
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/30'
                      : 'bg-slate-800/80 border-slate-700 hover:border-blue-500/50'
                  }`}
                >
                  <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md">
                    <IconSwitch className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      Switch / Hub
                    </div>
                    <div className="text-[10px] text-slate-400">Distribution Switch</div>
                  </div>
                </div>
              </div>

              {activePlacementType && (
                <div className="mt-2.5 p-2 bg-amber-950/50 border border-amber-800/60 rounded text-[11px] text-amber-200 flex items-center justify-between animate-pulse">
                  <span>Klik lokasi pada denah</span>
                  <button
                    type="button"
                    onClick={() => setActivePlacementType(null)}
                    className="text-amber-400 hover:text-white underline text-[10px]"
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Monitoring {floorId.toUpperCase()}
              </h3>
              <p className="text-[11px] text-slate-400">
                Klik atau arahkan pin untuk informasi detail dan tombol Copy IP.
              </p>
            </div>
          )}

          {/* Device Directory List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 flex justify-between">
              <span>Perangkat ({filteredDevices.length})</span>
            </div>

            {filteredDevices.map(device => {
              const colors = getStatusColor(device.status);
              const isSelected = inspectedDevice?.id === device.id;

              return (
                <div
                  key={device.id}
                  onClick={() => {
                    if (mode === 'edit') {
                      setEditingDeviceId(device.id);
                      setModalForm({ ...device });
                      setIsModalOpen(true);
                    } else {
                      setInspectedDevice(device);
                    }
                  }}
                  className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-indigo-500 shadow-sm'
                      : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 bg-slate-800 text-slate-300 rounded border border-slate-700 shrink-0">
                      {getDeviceIcon(device.type, 'w-3.5 h-3.5')}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-200 truncate">
                        {device.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {device.ip} • <span className="text-slate-500">{device.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <span className={`w-2 h-2 rounded-full ${colors.bg}`}></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-500">
            {mode === 'edit' ? '💡 Geser pin untuk ubah posisi' : '💡 Drag denah untuk pan / Scroll zoom'}
          </div>
        </aside>

        {/* Canvas Viewport */}
        <main
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className={`flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center ${
            isPanning ? 'cursor-grabbing' : mode === 'monitoring' ? 'cursor-grab' : 'cursor-default'
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, #334155 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* Zoom floating controls */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => handleZoom(0.2)}
              title="Zoom In"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <span className="text-[11px] font-semibold text-slate-300 px-1.5 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(-0.2)}
              title="Zoom Out"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-0.5"></div>
            <button
              type="button"
              onClick={handleResetView}
              title="Reset View"
              className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-xs transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Active Floor Badge */}
          <div className="absolute top-4 right-4 z-20">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                mode === 'edit'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  mode === 'edit' ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
                }`}
              ></span>
              {buildingName} — {floorId === 'l1' ? 'Lantai 1' : 'Lantai 2'}
            </div>
          </div>

          {/* Transformable Canvas Container */}
          <div
            className="transition-transform duration-75 ease-out select-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Aspect Ratio Box with Floor Plan SVG */}
            <div
              ref={floorPlanRef}
              onClick={handleFloorPlanClick}
              onDragOver={handleFloorPlanDragOver}
              onDrop={handleFloorPlanDrop}
              className={`relative shadow-2xl rounded-lg overflow-hidden border-2 transition-all ${
                mode === 'edit' && activePlacementType
                  ? 'border-dashed border-amber-400/90 cursor-crosshair'
                  : 'border-slate-700/80'
              }`}
              style={{
                width: `${floorDimensions.width}px`,
                height: `${floorDimensions.height}px`,
                backgroundColor: '#ffffff'
              }}
            >
              {/* Floor Plan SVG */}
              <img
                src={currentSvgPath}
                alt={`${buildingName} ${floorId.toUpperCase()}`}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />

              {/* Grid overlay for precision in edit mode */}
              {mode === 'edit' && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)`,
                    backgroundSize: '5% 5%'
                  }}
                />
              )}

              {/* --- DEVICE PINS OVERLAY --- */}
              {filteredDevices.map(device => {
                const colors = getStatusColor(device.status);
                const isHovered = hoveredDevice?.id === device.id;
                const isInspected = inspectedDevice?.id === device.id;
                const isBeingDragged = draggingDeviceId === device.id;

                return (
                  <div
                    key={device.id}
                    onMouseDown={e => handlePinMouseDown(e, device)}
                    onClick={e => handlePinClick(e, device)}
                    onMouseEnter={() => setHoveredDevice(device)}
                    onMouseLeave={() => setHoveredDevice(null)}
                    style={{
                      left: `${device.x}%`,
                      top: `${device.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isBeingDragged || isInspected ? 40 : 25
                    }}
                    className={`device-pin absolute flex flex-col items-center group ${
                      mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                    }`}
                  >
                    {/* Ping Animation for Online Devices */}
                    {device.status === 'online' && mode === 'monitoring' && (
                      <span className="absolute -inset-2 rounded-full bg-emerald-500/25 animate-ping pointer-events-none" />
                    )}

                    {/* Pin Outer Ring & Icon Badge */}
                    <div
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 transition-transform duration-150 ${
                        colors.border
                      } ${
                        device.type === 'cctv'
                          ? 'bg-cyan-950 text-cyan-400'
                          : device.type === 'access_point'
                          ? 'bg-purple-950 text-purple-400'
                          : 'bg-blue-950 text-blue-400'
                      } ${isHovered || isInspected ? 'scale-125 ring-4 ' + colors.ring : 'hover:scale-110'}`}
                    >
                      {getDeviceIcon(device.type, 'w-4 h-4')}
                      <span
                        className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900 ${colors.bg}`}
                      />
                    </div>

                    {/* Label below pin */}
                    <div className="mt-1 px-1.5 py-0.5 bg-slate-900/90 border border-slate-700/80 rounded text-[9px] font-bold text-slate-200 tracking-tight shadow-md whitespace-nowrap pointer-events-none">
                      {device.name}
                    </div>

                    {/* Live Drag Coordinate Tooltip */}
                    {isBeingDragged && (
                      <div className="absolute -bottom-6 px-1.5 py-0.5 bg-amber-600 text-white rounded text-[9px] font-mono shadow font-bold whitespace-nowrap">
                        X: {device.x}% | Y: {device.y}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* === MONITORING INSPECTOR CARD === */}
          {mode === 'monitoring' && inspectedDevice && (
            <div className="absolute bottom-5 right-5 w-80 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md p-4 z-30 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg border ${
                      inspectedDevice.type === 'cctv'
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        : inspectedDevice.type === 'access_point'
                        ? 'bg-purple-950 text-purple-400 border-purple-800'
                        : 'bg-blue-950 text-blue-400 border-blue-800'
                    }`}
                  >
                    {getDeviceIcon(inspectedDevice.type, 'w-5 h-5')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {inspectedDevice.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {inspectedDevice.type.replace('_', ' ')} • {floorId.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedDevice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Status Banner */}
              <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      getStatusColor(inspectedDevice.status).bg
                    } ${inspectedDevice.status === 'online' ? 'animate-pulse' : ''}`}
                  />
                  <span className="font-semibold capitalize text-slate-200">
                    Status: {getStatusColor(inspectedDevice.status).label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{inspectedDevice.lastSeen || 'Online'}</span>
              </div>

              {/* Technical Details */}
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">IP Address:</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-200">
                    <span>{inspectedDevice.ip}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyIp(inspectedDevice.ip)}
                      title="Salin IP Address"
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      {copyFeedback === inspectedDevice.ip ? (
                        <span className="text-emerald-400 text-[10px] font-sans font-bold">Tersalin!</span>
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Lokasi / Ruangan:</span>
                  <span className="text-slate-200 font-medium">{inspectedDevice.location}</span>
                </div>

                {inspectedDevice.mac && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">MAC Address:</span>
                    <span className="font-mono text-slate-300 text-[11px]">{inspectedDevice.mac}</span>
                  </div>
                )}

                {inspectedDevice.port && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Switch Port:</span>
                    <span className="text-slate-200">{inspectedDevice.port}</span>
                  </div>
                )}

                {inspectedDevice.notes && (
                  <div className="pt-1">
                    <span className="text-slate-400 text-[11px]">Catatan:</span>
                    <p className="text-slate-300 text-xs italic bg-slate-950/40 p-1.5 rounded mt-0.5 border border-slate-800">
                      {inspectedDevice.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('edit');
                    setEditingDeviceId(inspectedDevice.id);
                    setModalForm({ ...inspectedDevice });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Ubah Tata Letak
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* === MODAL FORM: DETAIL PENGATURAN PERANGKAT === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
                  {getDeviceIcon((modalForm.type || 'cctv') as DeviceType, 'w-5 h-5')}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingDeviceId ? 'Pengaturan Perangkat' : `Tambah Perangkat (${floorId.toUpperCase()})`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi IP, nama, dan lokasi ruangan {buildingName} - {floorId.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="mt-4 space-y-4">
              {/* Nama Perangkat */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Perangkat <span className="text-slate-500 font-normal">(opsional - otomatis jika kosong)</span>
                </label>
                <input
                  type="text"
                  placeholder={`Contoh: CCTV-${floorId.toUpperCase()}-Koridor`}
                  value={modalForm.name || ''}
                  onChange={e => setModalForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Tipe Perangkat */}
              <div className="grid grid-cols-3 gap-2">
                {(['cctv', 'access_point', 'switch'] as DeviceType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setModalForm(prev => ({ ...prev, type: t }))}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                      modalForm.type === t
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {getDeviceIcon(t, 'w-5 h-5')}
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* IP Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    IP Address (IPv4) <span className="text-rose-400">*</span>
                  </label>
                  {modalForm.ip && (
                    <span
                      className={`text-[11px] font-medium ${
                        isIpValid ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIpValid ? '✓ Format IP valid' : '✗ Format IPv4 tidak valid'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="192.168.10.21"
                  value={modalForm.ip || ''}
                  onChange={e => setModalForm(prev => ({ ...prev, ip: e.target.value.trim() }))}
                  className={`w-full px-3 py-2 bg-slate-950 border rounded-lg text-sm font-mono text-white placeholder-slate-500 focus:outline-none ${
                    modalForm.ip && !isIpValid
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* MAC Address & Port */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MAC Address <span className="text-slate-500 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="BC:5E:CD:11:22:33"
                    value={modalForm.mac || ''}
                    onChange={e => setModalForm(prev => ({ ...prev, mac: e.target.value.trim() }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Switch Port <span className="text-slate-500 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Port 05"
                    value={modalForm.port || ''}
                    onChange={e => setModalForm(prev => ({ ...prev, port: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Lokasi / Ruangan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lokasi / Ruangan ({floorId.toUpperCase()})
                </label>
                <select
                  value={modalForm.location || currentRoomPresets[0]}
                  onChange={e => setModalForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {currentRoomPresets.map(room => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                  <option value="Lainnya">Ruang Lainnya...</option>
                </select>
              </div>

              {/* Status Simulasi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Simulasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['online', 'warning', 'offline'] as DeviceStatus[]).map(st => {
                    const c = getStatusColor(st);
                    const isSelected = modalForm.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setModalForm(prev => ({ ...prev, status: st }))}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                          isSelected
                            ? `${c.bg} text-white border-white/20 shadow-md`
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : c.bg}`} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Koordinat Info */}
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Koordinat Denah {floorId.toUpperCase()}:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  X: {modalForm.x}% | Y: {modalForm.y}%
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                {editingDeviceId ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteDevice(editingDeviceId)}
                    className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/40"
                  >
                    Hapus Perangkat
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={Boolean(modalForm.ip && !isIpValid)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Simpan Perangkat
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopologyMap;
