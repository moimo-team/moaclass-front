// 카카오맵 API 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

declare namespace kakao.maps {
  class LatLng {
    constructor(latitude: number, longitude: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
    getLevel(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    setPosition(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  namespace services {
    class Places {
      constructor();
      keywordSearch(
        keyword: string,
        callback: (result: PlaceResult[], status: Status) => void,
        options?: PlaceSearchOptions
      ): void;
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      category_name: string;
      category_group_code: string;
      category_group_name: string;
      phone: string;
      address_name: string;
      road_address_name: string;
      x: string; // longitude
      y: string; // latitude
      place_url: string;
      distance: string;
    }

    interface PlaceSearchOptions {
      location?: LatLng;
      radius?: number;
      bounds?: LatLngBounds;
      sort?: string;
      page?: number;
      size?: number;
    }

    class LatLngBounds {
      constructor();
      extend(latlng: LatLng): void;
      contain(latlng: LatLng): boolean;
    }

    enum Status {
      OK = 'OK',
      ZERO_RESULT = 'ZERO_RESULT',
      ERROR = 'ERROR'
    }
  }
}

// 애플리케이션에서 사용하는 장소 정보 인터페이스
export interface PlaceInfo {
  placeName: string;
  address: string;
  roadAddress: string;
  lat: number;
  lng: number;
}
