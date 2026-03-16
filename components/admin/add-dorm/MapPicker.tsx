"use client";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "1rem",
};

// 🟢 ตั้งค่าเริ่มต้น (ผมตั้งไว้แถว ม.เกษตร บางเขน ท่านประธานเปลี่ยนได้ครับ)
const defaultCenter = { lat: 13.84786, lng: 100.56965 };

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  // โหลดสคริปต์แผนที่จาก Google
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // เมื่อผู้ใช้ลากหมุดเสร็จ ให้ดึงค่า Lat/Lng ใหม่ส่งกลับไป
  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange(e.latLng.lat(), e.latLng.lng());
    }
  };

  // เมื่อผู้ใช้คลิกบนแผนที่ ให้ย้ายหมุดมาตรงที่คลิก
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange(e.latLng.lat(), e.latLng.lng());
    }
  };

  if (!isLoaded) return <div className="h-87.5 w-full bg-gray-100 rounded-2xl flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

  const currentPosition = lat && lng ? { lat, lng } : defaultCenter;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-inner">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
        options={{
          streetViewControl: false, // ปิดโหมดสตรีทวิวไปก่อนให้ UI คลีนๆ
          mapTypeControl: false,
        }}
      >
        <Marker
          position={currentPosition}
          draggable={true} // 🟢 ทำให้ลากหมุดได้!
          onDragEnd={onMarkerDragEnd}
          animation={google.maps.Animation.DROP}
        />
      </GoogleMap>
      <div className="bg-gray-50 p-3 text-xs text-gray-500 flex justify-between border-t border-gray-200">
        <span>💡 คลิกบนแผนที่ หรือลากหมุดเพื่อระบุตำแหน่งหอพัก</span>
        <span className="font-mono text-emerald-600">
          Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
        </span>
      </div>
    </div>
  );
}