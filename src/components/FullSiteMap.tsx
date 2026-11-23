import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BuildingZone, ZoneCategory, ZoneColor } from '../types/topology';

const STORAGE_ZONES_KEY = 'full_site_building_zones_v2';

// --- Default Initial Building Zones ---
export const DEFAULT_BUILDING_ZONES: BuildingZone[] = [
  {
    id: 'office',
    name: 'Gedung Office',
    code: 'BLD-OFFICE',
    category: 'office',
    color: 'indigo',
    description: 'Pusat Manajemen, Server Core, Ruang Rapat, dan Resepsionis (2 Tingkat)',
    x: 80.5,
    y: 77.0,
    width: 8.5,
    height: 18.0,
    isClickable: true,
    totalDevices: 13,
    onlineDevices: 11,
    floors: [
      {
        id: 'l1',
        name: 'Lantai 1 (Ground Floor)',
        description: 'Resepsionis, R. Anggrek, R. Lily, R. Mawar, R. HGA, R. Arsip, R. Panel',
        svgPath: '/Office%20Lantai%201.drawio.svg',
        aspectRatio: '627 / 702',
        storageKey: 'devices_office_l1'
      },
      {
        id: 'l2',
        name: 'Lantai 2 (Server & Direksi)',
        description: 'Ruang Server Core, R. Pak Jono, R. Lavender, R. Hendra, R. Teddy, R. Infor',
        svgPath: '/Office%20Lantai%202.drawio.svg',
        aspectRatio: '622 / 593',
        storageKey: 'devices_office_l2'
      }
    ]
  },
  {
    id: 'finishing-good',
    name: 'Finishing Good & Training',
    code: 'BLD-FG',
    category: 'warehouse',
    color: 'emerald',
    description: 'Area Penyimpanan Barang Jadi & Ruang Training Karyawan',
    x: 74.5,
    y: 59.0,
    width: 5.5,
    height: 38.0,
    isClickable: false,
    totalDevices: 4,
    onlineDevices: 4
  },
  {
    id: 'packing-delivery',
    name: 'Packing & Delivery',
    code: 'BLD-PACK',
    category: 'warehouse',
    color: 'amber',
    description: 'Area Pengemasan Ekspor/Domestik dan Dermaga Pengiriman',
    x: 65.5,
    y: 60.0,
    width: 7.2,
    height: 38.0,
    isClickable: false,
    totalDevices: 6,
    onlineDevices: 5
  },
  {
    id: 'gedung-8b',
    name: 'Gedung 8B & Hotdip',
    code: 'BLD-8B',
    category: 'production',
    color: 'cyan',
    description: 'Hotdip Galvanizing Line & Area Incoming Material',
    x: 58.5,
    y: 60.0,
    width: 6.0,
    height: 38.0,
    isClickable: false,
    totalDevices: 5,
    onlineDevices: 4
  },
  {
    id: 'gedung-produksi',
    name: 'Gedung Produksi 1 - 6',
    code: 'PLANT-1-MAIN',
    category: 'production',
    color: 'cyan',
    description: 'Lini Utama Mesin Stamping, Pressing, dan Manufaktur',
    x: 23.0,
    y: 40.0,
    width: 34.0,
    height: 58.0,
    isClickable: false,
    totalDevices: 18,
    onlineDevices: 17
  },
  {
    id: 'plant-2',
    name: 'Plant 2',
    code: 'PLANT-2',
    category: 'production',
    color: 'purple',
    description: 'Fasilitas Manufaktur Kedua & Gudang Bahan Baku Sisi Barat',
    x: 0.5,
    y: 32.0,
    width: 17.0,
    height: 65.0,
    isClickable: false,
    totalDevices: 8,
    onlineDevices: 7
  },
  {
    id: 'gedung-lab',
    name: 'Gedung 7 - 10 (QC Lab & Consumable)',
    code: 'BLD-QC-LAB',
    category: 'utility',
    color: 'amber',
    description: 'Laboratorium Pengujian Mutu (QA/QC) & Consumable Warehouse',
    x: 49.0,
    y: 30.0,
    width: 25.0,
    height: 25.0,
    isClickable: false,
    totalDevices: 7,
    onlineDevices: 6
  },
  {
    id: 'security-parkiran',
    name: 'Pos Security & Parkiran Utama',
    code: 'SEC-MAIN',
    category: 'security',
    color: 'rose',
    description: 'Gerbang Utama Masuk Truk/Karyawan, CCTV Perimeter, dan Parkir Motor',
    x: 80.0,
    y: 58.0,
    width: 17.5,
    height: 18.0,
    isClickable: false,
    totalDevices: 5,
    onlineDevices: 5
  }
];

const COLOR_MAP: Record<ZoneColor, { border: string; bg: string; text: string; badge: string; glow: string }> = {
  indigo: {
    border: 'border-indigo-500',
    bg: 'bg-indigo-500/25 hover:bg-indigo-500/40',
    text: 'text-indigo-300',
    badge: 'bg-indigo-600 text-white',
    glow: 'shadow-indigo-500/40'
  },
  cyan: {
    border: 'border-cyan-400',
    bg: 'bg-cyan-500/25 hover:bg-cyan-500/40',
    text: 'text-cyan-300',
    badge: 'bg-cyan-600 text-white',
    glow: 'shadow-cyan-500/40'
  },
  emerald: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/25 hover:bg-emerald-500/40',
    text: 'text-emerald-300',
    badge: 'bg-emerald-600 text-white',
    glow: 'shadow-emerald-500/40'
  },
  amber: {
    border: 'border-amber-500',
    bg: 'bg-amber-500/25 hover:bg-amber-500/40',
    text: 'text-amber-300',
    badge: 'bg-amber-600 text-white',
    glow: 'shadow-amber-500/40'
  },
  rose: {
    border: 'border-rose-500',
    bg: 'bg-rose-500/25 hover:bg-rose-500/40',
    text: 'text-rose-300',
    badge: 'bg-rose-600 text-white',
    glow: 'shadow-rose-500/40'
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-500/25 hover:bg-purple-500/40',
    text: 'text-purple-300',
    badge: 'bg-purple-600 text-white',
    glow: 'shadow-purple-500/40'
  }
};

interface FullSiteMapProps {
  onSelectBuildingFloor: (buildingId: string, floorId: 'l1' | 'l2') => void;
}

export const FullSiteMap: React.FC<FullSiteMapProps> = ({ onSelectBuildingFloor }) => {
  // --- Segments State ---
  const [zones, setZones] = useState<BuildingZone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ZONES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      console.warn('Gagal memuat segmen dari localStorage, memakai default.');
    }
    return DEFAULT_BUILDING_ZONES;
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ZONES_KEY, JSON.stringify(zones));
    } catch (err) {
      console.error('Failed to save zones:', err);
    }
  }, [zones]);

  // Mode: 'navigation' vs 'edit_segments'
  const [mapMode, setMapMode] = useState<'navigation' | 'edit_segments'>('navigation');

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Hover & Selection state
  const [hoveredZone, setHoveredZone] = useState<BuildingZone | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [showOfficeModal, setShowOfficeModal] = useState<boolean>(false);
  const [selectedZoneForInfo, setSelectedZoneForInfo] = useState<BuildingZone | null>(null);

  // Dragging & Resizing State in Edit Mode
  const [isDraggingZone, setIsDraggingZone] = useState<boolean>(false);
  const [isResizingZone, setIsResizingZone] = useState<'se' | 'e' | 's' | null>(null);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number; zone: BuildingZone }>({
    clientX: 0,
    clientY: 0,
    zone: zones[0]
  });

  // Modal Create / Edit Form
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BuildingZone>>({
    name: '',
    code: '',
    category: 'production',
    color: 'cyan',
    description: '',
    x: 40,
    y: 40,
    width: 12,
    height: 18,
    isClickable: false,
    totalDevices: 0,
    onlineDevices: 0
  });
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapImageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Site Aggregate Statistics
  const siteStats = useMemo(() => {
    const totalDevices = zones.reduce((acc, b) => acc + (b.totalDevices || 0), 0);
    const onlineDevices = zones.reduce((acc, b) => acc + (b.onlineDevices || 0), 0);
    const totalZones = zones.length;
    return { totalDevices, onlineDevices, totalZones };
  }, [zones]);

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(0.7, Number((prev + delta).toFixed(2))), 3.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom(prev => Math.min(Math.max(0.7, Number((prev + zoomFactor).toFixed(2))), 3.5));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- Pan / Drag / Resize Handlers on Canvas ---
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.zone-box')) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  // Mouse Down to DRAG Zone position
  const handleZoneMouseDown = (e: React.MouseEvent, zone: BuildingZone) => {
    e.stopPropagation();
    setSelectedZoneId(zone.id);

    if (mapMode === 'edit_segments') {
      setIsDraggingZone(true);
      dragStartPosRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        zone: { ...zone }
      };
    }
  };

  // Mouse Down to RESIZE Zone dimensions
  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    zone: BuildingZone,
    handleType: 'se' | 'e' | 's'
  ) => {
    e.stopPropagation();
    setSelectedZoneId(zone.id);
    setIsResizingZone(handleType);
    dragStartPosRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      zone: { ...zone }
    };
  };

  // Canvas Mouse Move (Pan, Drag Zone, or Resize Zone)
  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
      return;
    }

    if (!mapImageContainerRef.current) return;
    const rect = mapImageContainerRef.current.getBoundingClientRect();

    // 1. Dragging Zone Position (X%, Y%)
    if (isDraggingZone && selectedZoneId) {
      const deltaXPercent = ((e.clientX - dragStartPosRef.current.clientX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStartPosRef.current.clientY) / rect.height) * 100;

      const newX = Number(
        Math.max(0, Math.min(100 - dragStartPosRef.current.zone.width, dragStartPosRef.current.zone.x + deltaXPercent)).toFixed(1)
      );
      const newY = Number(
        Math.max(0, Math.min(100 - dragStartPosRef.current.zone.height, dragStartPosRef.current.zone.y + deltaYPercent)).toFixed(1)
      );

      setZones(prev =>
        prev.map(z => (z.id === selectedZoneId ? { ...z, x: newX, y: newY } : z))
      );
    }

    // 2. Resizing Zone Width & Height (W%, H%)
    if (isResizingZone && selectedZoneId) {
      const deltaWidthPercent = ((e.clientX - dragStartPosRef.current.clientX) / rect.width) * 100;
      const deltaHeightPercent = ((e.clientY - dragStartPosRef.current.clientY) / rect.height) * 100;

      setZones(prev =>
        prev.map(z => {
          if (z.id !== selectedZoneId) return z;
          let newW = z.width;
          let newH = z.height;

          if (isResizingZone === 'se' || isResizingZone === 'e') {
            newW = Number(
              Math.max(2, Math.min(100 - dragStartPosRef.current.zone.x, dragStartPosRef.current.zone.width + deltaWidthPercent)).toFixed(1)
            );
          }
          if (isResizingZone === 'se' || isResizingZone === 's') {
            newH = Number(
              Math.max(2, Math.min(100 - dragStartPosRef.current.zone.y, dragStartPosRef.current.zone.height + deltaHeightPercent)).toFixed(1)
            );
          }
          return { ...z, width: newW, height: newH };
        })
      );
    }
  };

  const handleMouseUpCanvas = () => {
    if (isPanning) setIsPanning(false);
    if (isDraggingZone) setIsDraggingZone(false);
    if (isResizingZone) setIsResizingZone(null);
  };

  // Click on a zone
  const handleZoneClick = (zone: BuildingZone) => {
    setSelectedZoneId(zone.id);

    if (mapMode === 'navigation') {
      if (zone.id === 'office' || (zone.floors && zone.floors.length > 0)) {
        setShowOfficeModal(true);
      } else {
        setSelectedZoneForInfo(zone);
      }
    }
  };

  // --- Add New Segment Action ---
  const handleAddNewSegment = () => {
    const nextNum = zones.length + 1;
    setEditingTargetId(null);
    setFormData({
      name: `Segmen Bangunan ${nextNum}`,
      code: `BLD-${nextNum}`,
      category: 'production',
      color: 'cyan',
      description: 'Fasilitas / area gedung tambahan di kawasan PT Indoseiki',
      x: 45.0,
      y: 45.0,
      width: 10.0,
      height: 15.0,
      isClickable: false,
      totalDevices: 2,
      onlineDevices: 2
    });
    setIsFormModalOpen(true);
  };

  // Open Edit Form Modal for Existing Segment
  const handleEditSegmentDetails = (zone: BuildingZone) => {
    setEditingTargetId(zone.id);
    setFormData({ ...zone });
    setIsFormModalOpen(true);
  };

  // Delete Segment
  const handleDeleteSegment = (id: string) => {
    const z = zones.find(item => item.id === id);
    if (window.confirm(`Yakin ingin menghapus segmen "${z?.name}" dari peta?`)) {
      setZones(prev => prev.filter(item => item.id !== id));
      if (selectedZoneId === id) setSelectedZoneId(null);
      setIsFormModalOpen(false);
      showToast('Segmen berhasil dihapus.');
    }
  };

  // Save Modal Form (Add or Edit)
  const handleSaveFormData = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      formData.name?.trim() ||
      `Segmen Bangunan ${editingTargetId ? '' : zones.length + 1}`.trim() ||
      'Segmen Bangunan';

    if (editingTargetId) {
      setZones(prev =>
        prev.map(z =>
          z.id === editingTargetId
            ? ({
                ...z,
                ...(formData as BuildingZone),
                name: finalName,
                width: Math.max(2, formData.width || 10),
                height: Math.max(2, formData.height || 10)
              })
            : z
        )
      );
      showToast(`Segmen "${finalName}" berhasil disimpan.`);
    } else {
      const newZone: BuildingZone = {
        id: `zone-${Date.now()}`,
        name: finalName,
        code: formData.code?.trim() || `BLD-${zones.length + 1}`,
        category: formData.category || 'production',
        color: formData.color || 'cyan',
        description: formData.description?.trim() || '',
        x: Number((formData.x ?? 45).toFixed(1)),
        y: Number((formData.y ?? 45).toFixed(1)),
        width: Number(Math.max(2, formData.width ?? 10).toFixed(1)),
        height: Number(Math.max(2, formData.height ?? 15).toFixed(1)),
        isClickable: formData.isClickable || false,
        totalDevices: Number(formData.totalDevices) || 0,
        onlineDevices: Number(formData.onlineDevices) || 0
      };
      setZones(prev => [...prev, newZone]);
      setSelectedZoneId(newZone.id);
      showToast(`Segmen baru "${finalName}" berhasil ditambahkan.`);
    }

    setIsFormModalOpen(false);
  };

  // Reset to Defaults
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan semua tata letak segmen ke konfigurasi awal bawaan?')) {
      setZones(DEFAULT_BUILDING_ZONES);
      localStorage.removeItem(STORAGE_ZONES_KEY);
      showToast('Segmen berhasil direset ke bawaan.');
    }
  };

  // Export Segments to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(zones, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `indoseiki-site-segments-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Konfigurasi segmen berhasil diexport.');
  };

  // Import Segments from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed) && parsed.every(p => p.id && p.name && p.width && p.height)) {
          setZones(parsed);
          showToast(`Berhasil mengimpor ${parsed.length} segmen dari file.`);
        } else {
          alert('Format file JSON tidak sesuai struktur BuildingZone.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const selectedZone = useMemo(() => {
    return zones.find(z => z.id === selectedZoneId);
  }, [zones, selectedZoneId]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5.5rem)] min-h-[720px] bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900/95 border border-indigo-500/50 text-indigo-200 text-sm font-medium rounded-lg shadow-xl backdrop-blur-md transition-all">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          {toastMessage}
        </div>
      )}

      {/* --- TOP SITE HEADER & CONTROLS --- */}
      <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Peta Utama Kawasan PT Indoseiki
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                {zones.length} Segmen Aktif
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {mapMode === 'navigation'
                ? 'Klik pada segmen bangunan untuk membuka denah detail lantai & topologi'
                : 'Mode Edit: Geser posisi atau tarik sudut untuk ubah ukuran tinggi/lebar segmen'}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {/* Mode Switcher Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMapMode('navigation');
                setSelectedZoneId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                mapMode === 'navigation'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Mode Navigasi
            </button>

            <button
              type="button"
              onClick={() => setMapMode('edit_segments')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                mapMode === 'edit_segments'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Mode Edit Segmen
            </button>
          </div>

          {/* Edit Mode Specific Action Buttons */}
          {mapMode === 'edit_segments' && (
            <button
              type="button"
              onClick={handleAddNewSegment}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all shadow-md shadow-emerald-600/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              + Tambah Segmen Baru
            </button>
          )}

          {/* Quick Access to Office */}
          <button
            type="button"
            onClick={() => setShowOfficeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors border border-indigo-500/50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Gedung Office (L1 & L2)
          </button>
        </div>
      </div>

      {/* --- SUBBAR FOR JSON EXPORT/IMPORT & RESETS --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2 bg-slate-900/60 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Total Perangkat Kawasan:</span>
          <span className="font-bold text-emerald-400">
            {siteStats.onlineDevices} Online / {siteStats.totalDevices} Unit
          </span>
          {selectedZone && mapMode === 'edit_segments' && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-mono text-[11px]">
              <span>Aktif: {selectedZone.name}</span>
              <span>•</span>
              <span>Posisi: X {selectedZone.x}%, Y {selectedZone.y}%</span>
              <span>•</span>
              <span>Ukuran: W {selectedZone.width}% x H {selectedZone.height}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleExportJSON}
            title="Export Konfigurasi Segmen"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 font-medium hover:text-white transition-colors"
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import Konfigurasi Segmen"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 font-medium hover:text-white transition-colors"
          >
            Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset ke Tata Letak Standar"
            className="px-2 py-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors text-[11px]"
          >
            Reset Bawaan
          </button>
        </div>
      </div>

      {/* --- MAIN WORKSPACE AREA --- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Segments Directory */}
        <aside className="w-80 bg-slate-900/85 border-r border-slate-800 flex flex-col z-10 p-3 overflow-y-auto">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-2 flex items-center justify-between">
            <span>Daftar Segmen ({zones.length})</span>
            {mapMode === 'edit_segments' && (
              <span className="text-amber-400 font-semibold">Mode Edit Aktif</span>
            )}
          </div>

          <div className="space-y-2">
            {zones.map(zone => {
              const isSelected = selectedZoneId === zone.id;
              const colorInfo = COLOR_MAP[zone.color || 'cyan'];

              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? `bg-slate-850 ${colorInfo.border} ring-2 ring-indigo-500/50 shadow-lg`
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {zone.name}
                        {zone.id === 'office' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-600 text-white font-semibold">
                            2 Lantai
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{zone.code}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        {zone.onlineDevices}/{zone.totalDevices} Aktif
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {zone.description}
                  </p>

                  {/* Dimension badge in Edit Mode */}
                  {mapMode === 'edit_segments' && (
                    <div className="mt-2 text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 flex justify-between">
                      <span>W: {zone.width}%</span>
                      <span>H: {zone.height}%</span>
                      <span>X: {zone.x}%</span>
                      <span>Y: {zone.y}%</span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    {mapMode === 'edit_segments' ? (
                      <div className="flex items-center gap-2 w-full justify-between">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleEditSegmentDetails(zone);
                          }}
                          className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded text-[10px] font-semibold border border-indigo-500/30 transition-colors"
                        >
                          Ubah Ukuran / Info
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteSegment(zone.id);
                          }}
                          className="px-2 py-0.5 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded text-[10px] font-semibold transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-indigo-400 font-medium">
                          {zone.id === 'office' ? 'Lihat Denah Lantai 1 & 2 →' : 'Detail Segmen →'}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">{zone.category}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            {mapMode === 'edit_segments' ? (
              <p>💡 Klik segmen di peta untuk geser atau tarik handle pojok kanan-bawah untuk atur lebar & tinggi.</p>
            ) : (
              <p>💡 Klik segmen Gedung Office untuk membuka pilihan denah Lantai 1 atau Lantai 2.</p>
            )}
          </div>
        </aside>

        {/* Canvas Viewport */}
        <main
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className={`flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center ${
            isPanning
              ? 'cursor-grabbing'
              : isDraggingZone
              ? 'cursor-move'
              : isResizingZone
              ? 'cursor-se-resize'
              : 'cursor-grab'
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
              onClick={handleReset}
              title="Reset View"
              className="flex items-center gap-1 px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-xs transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Mode Badge Indicator */}
          <div className="absolute top-4 right-4 z-20">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                mapMode === 'edit_segments'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-600'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  mapMode === 'edit_segments' ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
                }`}
              ></span>
              {mapMode === 'edit_segments'
                ? 'Mode Edit Segmen (Drag & Resize Kotak Aktif)'
                : 'Mode Navigasi Peta'}
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
            {/* SVG Full Map Aspect Ratio Container (7431 x 3689 ≈ 2.01) */}
            <div
              ref={mapImageContainerRef}
              className={`relative shadow-2xl rounded-xl overflow-hidden border-2 bg-white ${
                mapMode === 'edit_segments' ? 'border-amber-500/80' : 'border-slate-700'
              }`}
              style={{
                width: '1100px',
                height: '546px'
              }}
            >
              {/* Full Map SVG Image */}
              <img
                src="/FULL%20MAP%20PT%20indoseiki.drawio.svg"
                alt="Full Map PT Indoseiki"
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
              />

              {/* Grid overlay in edit mode for alignment precision */}
              {mapMode === 'edit_segments' && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage: `linear-gradient(to right, #0284c7 1px, transparent 1px), linear-gradient(to bottom, #0284c7 1px, transparent 1px)`,
                    backgroundSize: '5% 5%'
                  }}
                />
              )}

              {/* --- CUSTOMIZABLE & RESIZABLE BUILDING SEGMENT BOXES --- */}
              {zones.map(zone => {
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZone?.id === zone.id;
                const isOffice = zone.id === 'office';
                const colorInfo = COLOR_MAP[zone.color || (isOffice ? 'indigo' : 'cyan')];

                return (
                  <div
                    key={zone.id}
                    onMouseDown={e => handleZoneMouseDown(e, zone)}
                    onClick={() => handleZoneClick(zone)}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                      zIndex: isSelected ? 35 : isHovered ? 25 : 15
                    }}
                    className={`zone-box absolute rounded-lg transition-all flex flex-col items-center justify-center p-1 ${
                      mapMode === 'edit_segments' ? 'cursor-move' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? `border-2 ${colorInfo.border} ${colorInfo.bg} shadow-xl ${colorInfo.glow} ring-2 ring-white/50`
                        : isHovered
                        ? `border-2 ${colorInfo.border} ${colorInfo.bg} shadow-md`
                        : `border border-dashed ${colorInfo.border}/70 bg-slate-900/20 hover:${colorInfo.border} hover:${colorInfo.bg}`
                    }`}
                  >
                    {/* Glowing beacon for office */}
                    {isOffice && (
                      <span className="absolute -top-2.5 -right-2.5 flex h-5 w-5 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-600 text-white text-[9px] font-bold items-center justify-center shadow">
                          2L
                        </span>
                      </span>
                    )}

                    {/* Zone Title Badge */}
                    <div
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-center leading-tight shadow-md transition-all pointer-events-none ${
                        isSelected || isHovered
                          ? `${colorInfo.badge} scale-105`
                          : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <div className="truncate max-w-[140px]">{zone.name}</div>
                      {isOffice && (
                        <div className="text-[8px] font-normal text-indigo-100">
                          (L1 & L2)
                        </div>
                      )}
                    </div>

                    {/* Dimensions & Quick-Edit Button Overlay when Selected in Edit Mode */}
                    {mapMode === 'edit_segments' && isSelected && (
                      <>
                        <div className="absolute -top-7 px-2 py-0.5 bg-slate-900 border border-amber-500 text-amber-300 rounded text-[9px] font-mono shadow-lg flex items-center gap-1.5 whitespace-nowrap z-40">
                          <span>W: {zone.width}%</span>
                          <span>×</span>
                          <span>H: {zone.height}%</span>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleEditSegmentDetails(zone);
                            }}
                            className="ml-1 px-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[8px] font-sans font-bold"
                          >
                            Edit
                          </button>
                        </div>

                        {/* --- RESIZE HANDLES (Tarik untuk ubah lebar & tinggi) --- */}
                        {/* 1. Bottom-Right Corner Handle (Resize Both) */}
                        <div
                          onMouseDown={e => handleResizeHandleMouseDown(e, zone, 'se')}
                          title="Tarik sudut ini untuk mengubah Lebar dan Tinggi"
                          className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 cursor-se-resize shadow-md hover:scale-125 z-40"
                        />

                        {/* 2. Right Edge Handle (Resize Width only) */}
                        <div
                          onMouseDown={e => handleResizeHandleMouseDown(e, zone, 'e')}
                          title="Tarik sisi kanan untuk mengubah Lebar"
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-6 rounded bg-amber-400/90 border border-slate-950 cursor-e-resize hover:scale-125 z-40"
                        />

                        {/* 3. Bottom Edge Handle (Resize Height only) */}
                        <div
                          onMouseDown={e => handleResizeHandleMouseDown(e, zone, 's')}
                          title="Tarik sisi bawah untuk mengubah Tinggi"
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-6 rounded bg-amber-400/90 border border-slate-950 cursor-s-resize hover:scale-125 z-40"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* === MODAL PILIHAN LANTAI GEDUNG OFFICE === */}
      {showOfficeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Gedung Office PT Indoseiki
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                      2 Tingkat
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Silakan pilih denah lantai yang ingin dipantau atau diatur tata letaknya:
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOfficeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Dua Pilihan Kartu Lantai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {/* Lantai 1 */}
              <div
                onClick={() => {
                  setShowOfficeModal(false);
                  onSelectBuildingFloor('office', 'l1');
                }}
                className="p-4 rounded-xl border border-slate-700 bg-slate-950/70 hover:bg-slate-800/80 hover:border-indigo-500 cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Lantai 1
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">● 7 Perangkat</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Ground Floor & Administrasi
                  </h4>
                  <p className="text-xs text-slate-400 mt-2">
                    Resepsionis, R. Anggrek, R. Lily, R. Mawar, R. HGA, R. Arsip, R. Panel Listrik, dan Toilet.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>Buka Denah Lantai 1</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* Lantai 2 */}
              <div
                onClick={() => {
                  setShowOfficeModal(false);
                  onSelectBuildingFloor('office', 'l2');
                }}
                className="p-4 rounded-xl border-2 border-indigo-500/80 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-indigo-400 cursor-pointer transition-all group flex flex-col justify-between shadow-lg shadow-indigo-950/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white shadow">
                      Lantai 2
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">● 6 Perangkat</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Ruang Server Core & Direksi
                  </h4>
                  <p className="text-xs text-slate-300 mt-2">
                    Rack Server Utama, R. Pak Jono, R. Lavender, R. Pak Hendra, R. Teddy, R. Infor, dan Tangga.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-900/60 flex items-center justify-between text-xs text-indigo-300 font-semibold">
                  <span>Buka Denah Lantai 2</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowOfficeModal(false)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Kembali ke Peta Kawasan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL INFORMASI SEGMEN (MODE NAVIGASI) === */}
      {selectedZoneForInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white">{selectedZoneForInfo.name}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{selectedZoneForInfo.code}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedZoneForInfo(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <p className="text-slate-300">{selectedZoneForInfo.description}</p>
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Status Perangkat Jaringan:</span>
                <span className="font-semibold text-emerald-400">
                  {selectedZoneForInfo.onlineDevices} / {selectedZoneForInfo.totalDevices} Perangkat Online
                </span>
              </div>
              <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg text-slate-400 text-[11px]">
                Kategori: <strong className="text-slate-200 capitalize">{selectedZoneForInfo.category}</strong>
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedZoneForInfo(null);
                  setMapMode('edit_segments');
                  setSelectedZoneId(selectedZoneForInfo.id);
                }}
                className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white rounded-lg text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                Ubah Ukuran Segmen Ini
              </button>
              <button
                type="button"
                onClick={() => setSelectedZoneForInfo(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL FORM: TAMBAH / EDIT SEGMEN KOTAK BANGUNAN === */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingTargetId ? 'Ubah Pengaturan Segmen' : 'Tambah Segmen Bangunan Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Atur nama, dimensi lebar/tinggi, koordinat, dan warna segmen
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveFormData} className="mt-4 space-y-4">
              {/* Nama Segmen */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Bangunan / Segmen <span className="text-slate-500 font-normal">(opsional - otomatis terisi jika kosong)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung 11 (Workshop), Kantin, Gudang Bahan Baku"
                  value={formData.name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Kode & Kategori */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kode Bangunan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BLD-11"
                    value={formData.code || ''}
                    onChange={e => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category || 'production'}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as ZoneCategory }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="office">Office / Kantor</option>
                    <option value="production">Produksi / Pabrik</option>
                    <option value="warehouse">Warehouse / Gudang</option>
                    <option value="utility">Utilitas & QA/QC</option>
                    <option value="security">Keamanan & Parkir</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>

              {/* Warna Segmen */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Warna Tema Kotak Segmen
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(['cyan', 'indigo', 'emerald', 'amber', 'rose', 'purple'] as ZoneColor[]).map(c => {
                    const info = COLOR_MAP[c];
                    const isSelected = (formData.color || 'cyan') === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: c }))}
                        className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold capitalize transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? `${info.badge} border-white shadow-md ring-2 ring-white/40`
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : info.border.replace('border-', 'bg-')}`} />
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pengaturan Dimensi: LEBAR & TINGGI (%) */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Dimensi Kotak Segmen (Persentase Peta)
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Lebar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Lebar (Width):</span>
                      <span className="font-mono font-bold text-white">{formData.width || 10}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      step="0.5"
                      value={formData.width || 10}
                      onChange={e => setFormData(prev => ({ ...prev, width: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Tinggi */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Tinggi (Height):</span>
                      <span className="font-mono font-bold text-white">{formData.height || 15}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="70"
                      step="0.5"
                      value={formData.height || 15}
                      onChange={e => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-800/80">
                  {/* Posisi X */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Posisi X:</span>
                      <span className="font-mono text-slate-200">{formData.x || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="0.5"
                      value={formData.x || 0}
                      onChange={e => setFormData(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Posisi Y */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Posisi Y:</span>
                      <span className="font-mono text-slate-200">{formData.y || 0}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="0.5"
                      value={formData.y || 0}
                      onChange={e => setFormData(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi / Fungsi Bangunan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan fungsi gedung, lini produksi, dsb."
                  value={formData.description || ''}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Estimasi Jumlah Perangkat */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Perangkat Jaringan/CCTV
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.totalDevices ?? 0}
                    onChange={e => setFormData(prev => ({ ...prev, totalDevices: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Perangkat Online (Aktif)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.onlineDevices ?? 0}
                    onChange={e => setFormData(prev => ({ ...prev, onlineDevices: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                {editingTargetId && editingTargetId !== 'office' ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSegment(editingTargetId)}
                    className="px-3 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-rose-500/40"
                  >
                    Hapus Segmen
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Simpan Segmen
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

export default FullSiteMap;
