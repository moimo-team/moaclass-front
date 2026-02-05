import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isKakaoMapLoaded } from "@/hooks/useKakaoMap";
import type { PlaceInfo } from "@/models/kakao-maps.model";


interface KakaoMapSearchProps {
  onPlaceSelect: (place: PlaceInfo) => void;
  defaultValue?: string;
  className?: string;
}

function KakaoMapSearch({ onPlaceSelect, defaultValue = "", className }: KakaoMapSearchProps) {
  const [keyword, setKeyword] = useState(defaultValue);
  const [searchResults, setSearchResults] = useState<PlaceInfo[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!keyword.trim()) {
      toast.error("검색어를 입력해주세요");
      return;
    }

    if (!isKakaoMapLoaded()) {
      toast.error("카카오맵 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요");
      return;
    }

    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: any[], status: any) => {
      setIsSearching(false);

      if (status === window.kakao.maps.services.Status.OK) {
        const places: PlaceInfo[] = data.map((place) => ({
          placeName: place.place_name,
          address: place.address_name,
          roadAddress: place.road_address_name || place.address_name,
          lat: parseFloat(place.y),
          lng: parseFloat(place.x),
        }));
        setSearchResults(places);
        setShowResults(true);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        toast.warning("검색 결과가 없습니다");
        setSearchResults([]);
      } else {
        toast.error("검색 중 오류가 발생했습니다");
        setSearchResults([]);
      }
    });
  };

  const handleSelectPlace = (place: PlaceInfo) => {
    setSelectedPlace(place);
    setKeyword(place.placeName);
    setShowResults(false);
    onPlaceSelect(place);
  };

  const handleClearSelection = () => {
    setSelectedPlace(null);
    setKeyword("");
    setSearchResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="도로명 주소를 검색해주세요 (예: 서울시 강남구 테헤란로)"
            className="h-12 pr-10"
            disabled={isSearching}
          />
          {selectedPlace && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="h-12 px-6"
        >
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "검색 중..." : "검색"}
        </Button>
      </div>

      {/* 선택된 장소 정보 */}
      {selectedPlace && (
        <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{selectedPlace.placeName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedPlace.roadAddress || selectedPlace.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 목록 */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {searchResults.map((place, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectPlace(place)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{place.placeName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {place.roadAddress || place.address}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default KakaoMapSearch;
