import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Added Link import
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function Banner() {
  const negativeMarginClasses = "-mx-4 md:-mx-32";
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  // TODO: 배너 데이터 API로 대체
  const bannerItems = [
    {
      id: 1,
      content: (
        <div className="w-full h-full bg-accent flex items-center justify-center relative">
          <div className="absolute bottom-16 flex flex-col items-center gap-4">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                새해 맞이 원데이 클래스
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                10% 할인 쿠폰 증정
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              쿠폰 받기
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="w-full h-full bg-green-100 flex items-center justify-center relative">
          <div className="absolute bottom-16 flex flex-col items-center gap-4">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-green-800">
                일일 모임 구경하기
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                다양한 주제의 모임으로 일상을 특별하게!
              </p>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              asChild
            >
              <Link to="/">구경하기</Link>
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="w-full h-full bg-yellow-100 flex items-center justify-center relative">
          <div className="absolute bottom-16 flex flex-col items-center gap-4">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-carrot">
                모아클 회원가입 이벤트
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-carrot">
                지금 가입하고 특별한 혜택을 누리세요!
              </p>
            </div>
            <Button
              className="bg-carrot hover:bg-carrot-hover text-white"
              asChild
            >
              <Link to="/login">회원가입</Link>
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={`relative w-screen ${negativeMarginClasses}`}>
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {bannerItems.map((item) => (
              <CarouselItem key={item.id}>
                <Card className="border-none">
                  <CardContent className="flex h-80 items-center justify-center p-0">
                    {item.content}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full ${
                current === index ? "bg-gray-800" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* TODO: 하드코딩된 데이터 제거 */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿠폰 발급 성공</AlertDialogTitle>
            <AlertDialogDescription>
              '새해 맞이 원데이 클래스 10% 할인 쿠폰'이 발급되었습니다.
              마이페이지에서 확인해보세요!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Banner;
