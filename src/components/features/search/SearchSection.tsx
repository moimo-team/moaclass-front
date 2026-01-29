import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

function SearchSection() {
  const navigate = useNavigate();
  const [searchTopic, setSearchTopic] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchTopic.trim()) return;
    navigate(`/meetings/search?keyword=${searchTopic}`);
  };

  return (
    <div
      className="py-24 text-center w-full -mx-4 md:-mx-8 px-4 md:px-8"
      style={{ backgroundColor: "var(--medium)" }}
    >
      <div className="mb-12">
        <div className="text-3xl font-medium">
          당신의 관심사로 시작하는 새로운 만남, <p className="pt-4 text-4xl font-bold">MoiMo</p>
        </div>
      </div>
      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-lg mx-auto "
      >
        <div className=" flex gap-3">
          <Input
            type="text"
            placeholder="관심있는 모임 제목을 검색해 보세요"
            className="pl-8 h-12 flex-1 bg-card"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
          />
          <Button type="submit" className="h-12 px-6">
            찾기
          </Button>
        </div>
      </form>
    </div >
  );
}

export default SearchSection;
