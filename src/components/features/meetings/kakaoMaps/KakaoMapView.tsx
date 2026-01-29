import { useEffect, useRef } from "react";
import { isKakaoMapLoaded } from "@/hooks/useKakaoMap";

interface KakaoMapViewProps {
  lat: number;
  lng: number;
  placeName?: string;
  className?: string;
  level?: number; // 지도 확대 레벨 (1-14, 작을수록 확대)
}

function KakaoMapView({ lat, lng, placeName, className = "", level = 3 }: KakaoMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // 카카오맵 API 로드 확인
    if (!isKakaoMapLoaded()) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      return;
    }

    // 지도 초기화
    const mapOption = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: level,
    };

    const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
    mapInstance.current = map;

    // 마커 생성
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);
    markerInstance.current = marker;

    // 인포윈도우 생성 (장소명이 있는 경우)
    if (placeName) {
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px 10px;font-size:12px;white-space:nowrap;">${placeName}</div>`,
      });
      infowindow.open(map, marker);
    }

    // 초기화
    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
    };
  }, [lat, lng, placeName, level]);

  // 좌표가 변경되면 지도 중심과 마커 위치 업데이트
  useEffect(() => {
    if (!mapInstance.current || !markerInstance.current) return;

    const newPosition = new window.kakao.maps.LatLng(lat, lng);
    mapInstance.current.setCenter(newPosition);
    markerInstance.current.setPosition(newPosition);
  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: "300px" }}
    />
  );
}

export default KakaoMapView;
